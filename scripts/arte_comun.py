"""Lectura del catálogo de arte: arte/estilo.json y un archivo por lote en arte/lotes/."""
import json
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
ARTE = RAIZ / 'arte'
LOTES = ARTE / 'lotes'
ENTREGA = ARTE / 'entrega'


def estilo():
    return json.loads((ARTE / 'estilo.json').read_text(encoding='utf8'))


def lotes():
    """Devuelve [(ruta, datos)] en orden de nombre de archivo."""
    return [(ruta, json.loads(ruta.read_text(encoding='utf8'))) for ruta in sorted(LOTES.glob('*.json'))]


def imagenes(datos):
    return {clave: valor for clave, valor in datos.items() if not clave.startswith('_')}


def guardar(ruta, datos):
    ruta.write_text(json.dumps(datos, ensure_ascii=False, indent=1) + '\n', encoding='utf8')
