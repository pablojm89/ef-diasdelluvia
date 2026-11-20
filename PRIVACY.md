# Datos de alumnos y repositorio público

Este repositorio publica código, actividades genéricas, personajes ficticios y recursos gráficos del juego. **No se deben incorporar datos identificables de alumnos**, tampoco en el historial, issues, comentarios de PR, capturas, grabaciones, documentación o registros de pruebas.

Quedan fuera: nombres y apellidos reales, correos de alumnos, identificadores escolares, listados de clase, calificaciones, informes, fotografías, voces, vídeos o cualquier combinación que permita identificar a un menor. No se deben copiar conversaciones de clase o exportaciones reales para depurar errores. Las pruebas utilizan datos sintéticos.

## Comportamiento actual

- Mate Arena sólo acepta el número de un personaje prefijado. El anfitrión genera su nombre ficticio; los campos adicionales del perfil se descartan.
- No hay cuentas de alumnos, nombres libres, chat, subida de archivos, captura de cámara ni micrófono en la aplicación.
- La aplicación no tiene un mecanismo para escribir partidas o resultados en GitHub. El repositorio y las partidas son sistemas separados.
- El navegador guarda preferencias y progreso local. Las credenciales temporales de recuperación de Mate se guardan en `sessionStorage`; no se incluyen en el código ni en la lista pública de jugadores.
- El online transmite identificadores de sesión, personajes, controles y estado de la partida. Los proveedores de conexión reciben tráfico y metadatos de red. El relevo público no constituye un canal privado ni es un lugar donde transmitir información de alumnos. Véase [la descripción del servicio online](docs/07-mate-arena.md).

## Antes de publicar cambios

Revisar manualmente textos e imágenes. Utilizar únicamente personajes ficticios en capturas. Mantener fuera del proyecto cualquier archivo real de alumnos; las rutas y formatos de datos habituales también se excluyen mediante `.gitignore`.

`node scripts/check-public-content.mjs` bloquea rutas privadas, hojas de cálculo, bases de datos, correos no autorizados y determinados patrones de credenciales en los archivos versionados. El workflow ejecuta la comprobación antes de desplegar. No puede reconocer todos los nombres reales, la información visible dentro de una imagen ni todos los secretos posibles: **no sustituye la revisión manual**.

Si se detecta una publicación accidental, retirar el acceso al contenido y revisar también el historial y las copias públicas. Borrar sólo el archivo del último commit no elimina lo publicado anteriormente. No subir el dato otra vez al describir la incidencia.

## Revisión del 20 de noviembre de 2026

Se revisaron los archivos versionados y los 63 blobs distintos alcanzables en el historial existente. No se encontraron datos identificables de alumnos ni patrones de claves privadas en esa revisión. El único correo dentro de los textos era el contacto público de soporte incluido en PeerJS. Los siete blobs binarios correspondían a ilustraciones generadas y capturas de pruebas del juego; no a imágenes de alumnos.
