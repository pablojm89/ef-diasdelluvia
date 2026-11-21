# Instrucciones para agentes (ChatGPT, Codex, Gemini…)

Repo de **El Pabellón**, el hub de Educación Física de Pablo (maestro de Primaria en Andalucía). Idioma de trabajo: español.
Las reglas generales están en `CLAUDE.md`. El desarrollo lo lleva Claude: **no modifiques código ni datos del juego** salvo que Pablo lo pida expresamente.

## Si vienes a hacer las ilustraciones

1. Lee **`arte/ENCARGO.md`**: estilo, reglas, la lista de imágenes pendientes por lotes y el nombre exacto de cada archivo.
2. Genera las imágenes por lotes, en el orden en que aparecen. Mira antes las imágenes aprobadas que cita el encargo: todo debe parecer el mismo colegio.
3. Entrégalas en **`arte/entrega/`** con el nombre exacto, en una rama tuya `gpt/<lote>` (nunca en `main` ni en la rama de Claude), con un archivo `arte/entrega/MANIFIESTO` de SHA-256 (una línea por imagen: huella, dos espacios, nombre). Toca sólo `arte/entrega/`.
4. No conviertas ni coloques nada: `python3 scripts/integrar_arte.py` recorta, convierte a WebP, lo lleva a su sitio y marca el pedido como entregado. Puedes ejecutar `python3 scripts/integrar_arte.py --comprobar` para ver si tus archivos se reconocen; no escribe nada.
5. Personajes y objetos con el fondo **totalmente transparente**, sin halo ni brillo alrededor. Si no puedes escribir en el repo, dáselas a Pablo con esos nombres y él las sube.
6. Dudas o propuestas: díselas a Pablo. `arte/ENCARGO.md` se regenera y pierde lo que se escriba a mano.

Nunca subas al repo ni a GitHub nada con datos de alumnado: nombres, listas, notas, fotos o voces. El repo es público. Ver `PRIVACY.md`.
