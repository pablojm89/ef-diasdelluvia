#!/usr/bin/env python3
"""Integra en el juego las imágenes entregadas en arte/entrega/.

Uso:  python3 scripts/integrar_arte.py [--comprobar] [--borrar]

- Reconoce cada PNG, JPG o WebP cuyo nombre sea el de un pedido de arte/lotes/*.json.
- Lo lleva al tamaño del pedido (los fondos se recortan centrados; las figuras con
  transparencia se ajustan sin deformar) y lo guarda como WebP en su destino.
- En las hojas de varios dibujos (pedidos con "celdas" y "suelo") deja el suelo de
  todos los recuadros a la misma altura y borra lo que haya quedado por debajo.
  Si el pedido tiene "mini", guarda además el último dibujo encuadrado en pequeño,
  para las listas: así no hay que descargar la hoja entera para ver una miniatura.
- Marca el pedido como listo, actualiza los índices de lote, ejecuta el paso posterior
  que indique el pedido y regenera arte/ENCARGO.md.
- Si existe arte/entrega/MANIFIESTO, comprueba el SHA-256 de cada archivo.
- Con --comprobar no escribe nada. Con --borrar elimina los originales ya integrados.
Lo que no encaja se explica y se deja sin tocar. Requiere Pillow.
"""
import hashlib
import subprocess
import sys
from pathlib import Path

from PIL import Image

from arte_comun import RAIZ, ENTREGA, lotes, imagenes, guardar

comprobar, borrar = '--comprobar' in sys.argv, '--borrar' in sys.argv


def huellas():
    manifiesto = ENTREGA / 'MANIFIESTO'
    if not manifiesto.exists():
        return None
    return {partes[-1]: partes[0].lower() for partes in (linea.split() for linea in manifiesto.read_text(encoding='utf8').splitlines()) if len(partes) >= 2}


def asentar(imagen, pedido):
    """Hoja de dibujos en rejilla: el borde inferior de lo pintado queda en `suelo` en todos los recuadros.

    Si la hoja llegó con el suelo más bajo (figura más grande), cada recuadro se reduce desde arriba y centrado;
    si llegó más alto, se baja. Así la esterilla no salta al pasar de una postura a otra.
    """
    columnas, filas = pedido['celdas']
    suelo = pedido['suelo']
    ancho, alto = imagen.width // columnas, imagen.height // filas
    celdas = [imagen.crop((c * ancho, f * alto, (c + 1) * ancho, (f + 1) * alto)) for f in range(filas) for c in range(columnas)]

    def fondo(celda):
        caja = celda.getchannel('A').point(lambda valor: 255 if valor > 40 else 0).getbbox()
        return caja[3] if caja else None

    fondos = sorted(valor for valor in map(fondo, celdas) if valor)
    if not fondos:
        return imagen
    base = fondos[len(fondos) // 2]
    salida = Image.new('RGBA', imagen.size)
    for numero, celda in enumerate(celdas):
        if (fondo(celda) or 0) > base + 10:  # restos sueltos bajo la esterilla, venidos del recuadro de abajo
            celda.paste((0, 0, 0, 0), (0, base + 3, ancho, alto))
        if base - suelo > 6:
            escala = suelo / base
            menor = celda.resize((round(ancho * escala), round(alto * escala)), Image.LANCZOS)
            celda = Image.new('RGBA', (ancho, alto))
            celda.paste(menor, ((ancho - menor.width) // 2, 0))
        elif suelo - base > 6:
            bajada = Image.new('RGBA', (ancho, alto))
            bajada.paste(celda, (0, suelo - base))
            celda = bajada
        salida.paste(celda, (numero % columnas * ancho, numero // columnas * alto))
    return salida


MINI = (288, 282)  # la proporción de .thumb en tatami.css


def miniatura(hoja, pedido):
    """El último dibujo de la hoja, encuadrado entero sobre su esterilla."""
    columnas, filas = pedido['celdas']
    ancho, alto = hoja.width // columnas, hoja.height // filas
    celda = hoja.crop(((columnas - 1) * ancho, (filas - 1) * alto, columnas * ancho, filas * alto))
    izquierda, arriba, derecha, abajo = celda.getchannel('A').point(lambda valor: 255 if valor > 40 else 0).getbbox()
    proporcion = MINI[0] / MINI[1]
    lado = max(abajo - arriba + 24, (derecha - izquierda + 24) / proporcion) / .978  # un poco de suelo bajo la esterilla
    centro, base = (izquierda + derecha) / 2, abajo + .022 * lado
    ventana = (round(centro - lado * proporcion / 2), round(base - lado), round(centro + lado * proporcion / 2), round(base))
    return celda.crop(ventana).resize(MINI, Image.LANCZOS)


def preparar(imagen, pedido):
    ancho, alto = pedido['ancho'], pedido['alto']
    filtro = Image.NEAREST if pedido.get('pixel') else Image.LANCZOS
    if not pedido.get('transparente'):
        imagen = imagen.convert('RGB')
        escala = max(ancho / imagen.width, alto / imagen.height)
        imagen = imagen.resize((max(ancho, round(imagen.width * escala)), max(alto, round(imagen.height * escala))), filtro)
        izquierda, arriba = (imagen.width - ancho) // 2, (imagen.height - alto) // 2
        return imagen.crop((izquierda, arriba, izquierda + ancho, arriba + alto)), None
    imagen = imagen.convert('RGBA')
    alfa = imagen.getchannel('A')
    esquinas = [alfa.getpixel(punto) for punto in ((0, 0), (imagen.width - 1, 0), (0, imagen.height - 1), (imagen.width - 1, imagen.height - 1))]
    if min(alfa.getextrema()) > 0 or max(esquinas) > 8:
        return None, 'el fondo no es transparente'
    if pedido.get('exacto'):
        if abs(imagen.width / imagen.height - ancho / alto) > .02:
            return None, f'la proporción debe ser {ancho}:{alto}'
        imagen = imagen.resize((ancho, alto), filtro)
        return (asentar(imagen, pedido) if pedido.get('celdas') else imagen), None
    escala = min(ancho / imagen.width, alto / imagen.height)
    return imagen.resize((max(1, round(imagen.width * escala)), max(1, round(imagen.height * escala))), filtro), None


def main():
    if not ENTREGA.exists():
        print('No existe arte/entrega/.')
        return
    catalogo = lotes()
    donde = {clave: (ruta, datos) for ruta, datos in catalogo for clave in imagenes(datos)}
    firmas = huellas()
    hechas, pasos, tocados = [], [], set()
    for archivo in sorted(ENTREGA.iterdir()):
        if archivo.suffix.lower() not in ('.png', '.jpg', '.jpeg', '.webp'):
            continue
        if archivo.stem not in donde:
            print(f'  ? {archivo.name}: no corresponde a ningún pedido')
            continue
        if firmas is not None and firmas.get(archivo.name) != hashlib.sha256(archivo.read_bytes()).hexdigest():
            print(f'  ✗ {archivo.name}: no coincide con el MANIFIESTO')
            continue
        ruta, datos = donde[archivo.stem]
        pedido = datos[archivo.stem]
        try:
            resultado, problema = preparar(Image.open(archivo), pedido)
        except OSError as error:
            resultado, problema = None, f'no se puede leer ({error})'
        if problema:
            print(f'  ✗ {archivo.name}: {problema}')
            continue
        destino = RAIZ / pedido['destino']
        print(f'  ✓ {archivo.name} → {pedido["destino"]} ({resultado.width} × {resultado.height})')
        if comprobar:
            continue
        destino.parent.mkdir(parents=True, exist_ok=True)
        if pedido.get('pixel'):
            resultado.save(destino, lossless=True, method=6)
        else:
            resultado.save(destino, quality=88, method=6)
        if pedido.get('mini'):
            miniatura(resultado, pedido).save(RAIZ / pedido['mini'], quality=84, method=6)
        pedido['listo'] = True
        tocados.add(ruta)
        hechas.append(archivo)
        if pedido.get('despues') and pedido['despues'] not in pasos:
            pasos.append(pedido['despues'])
    if comprobar:
        return
    for ruta, datos in catalogo:
        if ruta in tocados:
            guardar(ruta, datos)
        indice = datos.get('_indice')
        if indice:
            listos = sorted(imagen.get('clave', clave) for clave, imagen in imagenes(datos).items() if imagen.get('listo'))
            texto = ('// Generado por scripts/integrar_arte.py: qué imágenes de este lote ya están pintadas.\n'
                     f'export const {indice["nombre"]} = {listos!r};\n')
            (RAIZ / indice['archivo']).write_text(texto, encoding='utf8')
    for paso in pasos:
        print(f'  … {paso}')
        subprocess.run(paso.split(), cwd=RAIZ, check=True)
    subprocess.run([sys.executable, str(Path(__file__).with_name('encargo_arte.py'))], check=True)
    if borrar:
        for archivo in hechas:
            archivo.unlink()
    print(f'Integradas: {len(hechas)}')


if __name__ == '__main__':
    main()
