#!/usr/bin/env python3
"""Genera arte/ENCARGO.md, el encargo de imágenes para la IA ilustradora, a partir de los lotes.

Uso:  python3 scripts/encargo_arte.py
"""
from arte_comun import ARTE, estilo, lotes, imagenes


def main():
    comun = estilo()
    todos = lotes()
    falta = lambda imagen: not imagen.get('listo') or imagen.get('corregir')
    faltan = sum(1 for _, datos in todos for imagen in imagenes(datos).values() if falta(imagen))
    texto = ['# Encargo de imágenes · El Pabellón', '',
             '> Archivo generado por `scripts/encargo_arte.py` a partir de `arte/estilo.json` y `arte/lotes/*.json`. No lo edites a mano: cambia el lote y vuelve a generarlo.', '',
             '## Para la IA de imágenes (ChatGPT / Gemini)', '',
             'Eres el ilustrador de **El Pabellón**, el hub de Educación Física de un colegio de Primaria de Andalucía. Cada actividad vive en un lugar del pabellón del cole, y todo debe parecer el mismo colegio.', '',
             '### Estilo (igual en todas las imágenes)', '', comun['estilo'], '',
             '**Excepción.** ' + comun['estilo_pixel'] + ' Los pedidos que lo usan lo dicen.', '',
             '### Reglas', '']
    texto += [f'{numero}. {regla}' for numero, regla in enumerate(comun['reglas'], 1)]
    texto += ['', '### Entrega', '',
              'Sube cada imagen a `arte/entrega/` con el nombre exacto que indica su pedido, en PNG (también se aceptan JPG y WebP), en una rama tuya `gpt/<lote>`; nunca en `main` ni en la rama de Claude. Añade un archivo `arte/entrega/MANIFIESTO` con una línea por imagen: su SHA-256, dos espacios y el nombre. Toca sólo `arte/entrega/`: la conversión, el recorte y la colocación en el juego los hace `scripts/integrar_arte.py`. Si no puedes escribir en el repositorio, dáselas a Pablo con esos nombres y él las sube.', '',
              '### Ya aprobadas: úsalas de referencia', '',
              'Mantén su estilo, luz y acabado: ' + ', '.join(f'`{ruta}`' for ruta in comun['aprobadas']) + '.', '',
              f'## Pendientes: {faltan}', '']
    for ruta, datos in todos:
        pendientes = {clave: imagen for clave, imagen in imagenes(datos).items() if falta(imagen)}
        hechas = len(imagenes(datos)) - len(pendientes)
        texto += [f'### Lote `{ruta.stem}` · {datos["_titulo"]}', '', datos.get('_nota', ''), '']
        if hechas:
            texto += [f'Ya integradas: {hechas}.', '']
        if not pendientes:
            texto += ['Lote completo.', '']
            continue
        texto += ['| Archivo que entregar | Qué es | Tamaño | Fondo | Qué debe verse |', '|---|---|---|---|---|']
        for clave, imagen in pendientes.items():
            fondo = 'transparente' if imagen.get('transparente') else 'opaco'
            pixel = ' Pixel art.' if imagen.get('pixel') else ''
            # A correction: the picture is already in the game and one thing has to be redrawn.
            arreglo = f'**Corrección** de `{imagen["destino"]}`, que ya está en el juego: {imagen["corregir"]} Todo lo demás, igual que en esa imagen. Pedido original: ' if imagen.get('corregir') else ''
            texto.append(f'| `{clave}.png` | {imagen["nombre"]} | {imagen["ancho"]} × {imagen["alto"]} | {fondo} | {arreglo}{imagen["prompt"]}{pixel} |')
        texto.append('')
    texto += ['## Notas del ilustrador', '', '_Si tienes dudas o propuestas, apúntalas aquí o díselas a Pablo._', '']
    (ARTE / 'ENCARGO.md').write_text('\n'.join(texto), encoding='utf8')
    print(f'arte/ENCARGO.md: {faltan} imágenes pendientes en {len(todos)} lotes')


if __name__ == '__main__':
    main()
