# Plan de entregas y decisiones

## Entrega 0 — investigación y prototipo (esta entrega)

- Investigación trazable y comparación de recursos reales.
- Concepto y reglas de seis juegos, tres motores iniciales.
- 24 retos originales con objetivo, criterio y variante sentada.
- Misión: seis hitos y temporizador con pausa.
- Pulso: edición de cuatro cartas, ocho pulsos y fases de trabajo.
- Liga: 2–6 equipos, seis rondas, criterios 0–2 y registro sin duplicados.
- Biblioteca, guía y documentación curricular inicial.
- Workflow manual para Pages y pruebas de datos y reglas.

Límite declarado: la app funciona en una pantalla, no existe sala online ni votación remota. El registro manual no verifica automáticamente la ejecución física.

## Entrega 1 — pilotar una sesión real

Usar Misión o Pulso con proyector, entre 20 y 50 minutos. Recoger observaciones de la guía, cambiar consignas confusas y comprobar legibilidad desde el fondo. Medir esperas y participación. Validar las variantes con el grupo concreto y contrastar programación autonómica.

Aceptación: el docente prepara sesión en menos de dos minutos tras conocer la herramienta; todos tienen una forma de participar; ningún alumno espera una ronda completa sin tarea; se completa el cierre en el tiempo acordado. Son metas a comprobar, no resultados ya obtenidos.

## Entrega 2 — una sala online pequeña

Elegir proveedor y configurar un proyecto de backend. Implementar únicamente Liga conectada: acceso temporal, equipos, reloj autoritativo, validación docente y reconexión. Completar pruebas de permisos, duplicados y aislamiento antes de ampliar juegos.

Aceptación: escenarios del documento de arquitectura y prueba en wifi del centro. Si no pasa, se mantiene la Liga de pantalla común como opción usable.

## Entrega 3 — festival de baile con votos

Añadir muestras, rúbrica docente, papeletas por equipo, bloqueo de autovoto, cierre de votación y agregación normalizada. Un único flujo primero; después parejas de equipos en paralelo. Compartir empates y dar reconocimientos por distintos criterios, sin historial público individual.

Aceptación: todos observan una muestra antes de votar; sólo una papeleta por equipo y muestra; no hay resultados parciales; se identifica claramente qué parte del resultado viene de docente y de pares.

## Entrega 4 — ampliar contenido y autonomía

Construir Código Cuerpo y Director Invisible. Incorporar editor docente y exportación/importación de cartas revisadas. Ampliar a 60 retos tras la revisión didáctica. Preparar instalación offline si las condiciones del centro lo necesitan; el prototipo actual no incluye service worker ni garantiza recarga sin conexión.

## Entrega 5 — packs por unidades y otros cursos

Elegir deporte o unidad con el docente y desarrollar Decisión en Juego con viñetas originales. Después adaptar a 3.º–4.º con patrones más cortos y a 1.º–2.º con guía oral y menos lectura. No basta con cambiar el número de repeticiones: cambian autonomía, reglas y feedback.

## Prioridades

| Ahora | Después del piloto | Más adelante |
| --- | --- | --- |
| Claridad, movimiento, proyector, variantes, tres experiencias | Salas, reconexión, votos y editor | Packs deportivos, otros cursos y biblioteca comunitaria |

Fuera del alcance inicial: análisis por cámara, rankings entre centros, chat libre, perfiles públicos, economía de premios y catálogo musical comercial. Añaden mucho trabajo y no resuelven la primera sesión de lluvia.

## Decisiones abiertas con supuestos operativos

| Decisión | Supuesto para avanzar | Qué cambia al confirmarla |
| --- | --- | --- |
| Comunidad autónoma | Base estatal de tercer ciclo | Correspondencia con currículo local |
| Grupo y dispositivos | 24 alumnos, seis equipos; también sólo proyector | Tamaño de sala, roles y distribución |
| Duración | Plantillas de 20, 35 y 50 min | Cantidad de rondas y fases |
| Espacio | Mesas colocadas, sin desplazamiento amplio | Retos habilitados |
| Nombre | Patio Interior, provisional | Identidad visual y textos |
| Hosting | Pages como destino pedido; repo privado | Plan compatible o decisión de visibilidad |
| Backend | Supabase como candidato | Proveedor, cuotas, configuración y mantenimiento |

No se estiman fechas cerradas sin pilotar ni conocer disponibilidad de infraestructura. El orden permite obtener utilidad antes de asumir la complejidad de las salas simultáneas.
