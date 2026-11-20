# Dirección artística y arquitectura de ampliación

Estado: especificación propuesta; no implementada.

## Una identidad visual reconocible

Aventura gráfica 2D de colegio, ilustrada con contorno limpio, formas legibles y proporciones ligeramente estilizadas. Debe resultar atractiva para 5.º–6.º sin parecer una aplicación de infantil. Material deportivo reconocible, luz natural cálida, madera, paredes claras y acentos azul petróleo, verde y naranja. El color no será la única forma de distinguir destinos o estados.

La cámara mantiene una vista frontal en tres cuartos, horizonte y escala constantes. La puerta del almacén ocupa la misma posición en el gimnasio y su contraplano resulta coherente. El rincón de ritmo se reconoce por el equipo de sonido y el espacio disponible; las reglas se consultan en una pizarra físicamente situada en la escena.

La interfaz principal es el escenario. En pantalla quedan una banda discreta de misión, acceso a mochila, ayuda y ajustes. Al seleccionar un objeto aparecen acciones pertinentes: mirar, coger, usar o hablar. La explicación extensa se abre cuando se necesita. Los rótulos y diálogos se dibujan como texto de interfaz, nunca incrustados en las ilustraciones.

## Capas y continuidad

Cada escena separa fondo arquitectónico, mobiliario fijo, objetos manipulables, personajes, primer plano y zonas de interacción. Almacén ordenado y desordenado comparten **el mismo fondo**: cambian las posiciones de objetos. Generar dos ilustraciones independientes desplazaría estanterías y haría incoherente la interacción.

Las coordenadas de interacción se expresan respecto al tamaño lógico de la escena. Se conserva el encuadre completo o se ofrece un recorrido explícito; el diseño adaptable nunca recorta un objeto imprescindible. Una lista accesible de objetos y destinos ofrece las mismas acciones que la escena visual.

La animación del profe comienza con reposo, parpadeo, hablar y señalar. Caminar puede incorporarse después; no se obliga a esperar un recorrido para cada clic. Se puede reducir movimiento y avanzar diálogos. La voz es opcional y los sonidos informativos tienen equivalente visual.

El profe será un avatar ficticio que represente al docente, con indumentaria y rasgos acordados mediante descripción. Hasta disponer de ella se utiliza una silueta de prueba, sin inventar un parecido. La ficha definitiva fija frente, perfil, tres cuartos, paleta, altura relativa y expresiones antes de producir animaciones.

## Primer lote de arte

| Recurso | Variantes y requisitos |
| --- | --- |
| Gimnasio | Un fondo sin personas ni material móvil; puerta de almacén, pizarra, banco y zona libre |
| Almacén | Un fondo con zonas de guardado claras; pasillo y puerta visibles; estantes coherentes con material seguro |
| Materiales | Diez tipos de objeto separados, con transparencia; duplicados por instancia, sin redibujar cada unidad |
| Profe | Ficha de modelo y cuatro estados iniciales; mismo personaje y ropa en todas las escenas |
| Interfaz | Cursor contextual, selección, mochila y bocadillo legibles; estados de foco y texto fuera del arte |
| Feedback | Cambio de posición, gesto y señal breve; sin destellos obligatorios ni partículas que tapen instrucciones |

Brief del gimnasio: «Interior de gimnasio escolar español, ilustración 2D de aventura gráfica, vista frontal en tres cuartos, suelo de pista de madera, paredes claras, espalderas y bancos, puerta lateral al almacén, pizarra y equipo de sonido discretos, luz de mañana, espacio central despejado; sin personas, letras ni objetos móviles. Mantener cámara y paleta de la ficha de estilo».

Brief del almacén: «Misma escuela, cámara y tratamiento de línea que el gimnasio de referencia; cuarto de material con rack de balones, recipientes para material pequeño, soporte de aros y raquetas, espacio bajo para colchonetas y recorrido libre hasta la puerta. Fondo de mobiliario fijo sin material móvil, sin personas ni texto. Destinos grandes y distinguibles».

Estas descripciones son puntos de partida: una imagen de referencia aprobada y un plano son los anclajes de continuidad. El proceso será generar una prueba, revisar legibilidad y perspectiva, fijar la referencia y después producir el lote. Registrar modelo o herramienta, prompt, referencias, licencia y archivo final permite revisar procedencia y coherencia.

## Estructura técnica propuesta

Conservar la app y Mate existentes. Añadir la aventura en una ruta independiente durante su desarrollo; el cambio de entrada general se hace cuando la primera misión esté validada. GitHub Pages sirve recursos estáticos y módulos JavaScript con rutas relativas. No se necesita un backend para explorar y practicar individualmente.

Separar:

- **Escenas:** fondo, capas, salidas, objetos y zonas accesibles.
- **Misiones:** estados, condiciones, acciones admitidas, ayudas y consecuencias.
- **Contenido:** glosario, instrucciones, variantes, objetivos y relación curricular.
- **Presentación:** interfaz visual y lista accesible con las mismas acciones.
- **Progreso:** almacenamiento local mínimo, borrado explícito y sin nombres reales.

Los eventos de dominio —objeto seleccionado, destino elegido, pedido comprobado— actualizan el estado; las animaciones lo representan. Completar una animación no será condición para registrar una respuesta. El contenido se mantiene separado de la lógica para añadir misiones sin duplicar todo el juego.

Los paquetes de misiones deberán indicar identificador, versión, curso recomendado, objetivos de EF, función comunicativa, textos por idioma, recursos, estados, reglas de validación, pistas y evidencia. Las reglas deportivas llevan identificador y versión: una situación del mate no puede evaluarse con una regla distinta de la mostrada al alumnado.

## Uso docente y evaluación

Primero, selector de misión, apoyos y modo de uso. Después, editor de paquetes genéricos mediante campos guiados e importación/exportación. Un paquete contiene actividades, nunca listas o resultados de alumnos. La programación puede vincular varias misiones con una situación de aprendizaje sin cambiar las imágenes.

Práctica y comprobación tienen propósitos distintos: la primera permite pistas y revisión; la segunda propone situaciones nuevas y muestra al docente qué se ha hecho y con qué apoyos. Los ajustes de accesibilidad no se penalizan automáticamente. Separar comprensión de EF, comprensión lingüística y capacidad de manejar el dispositivo.

Los resultados locales no son pruebas inviolables. Si se requiere un examen conectado con identificación, se diseña un servicio privado, autenticación y autorización reales, control de envíos, conservación y borrado. Un panel oculto dentro de la web pública no protege información. No reutilizar el relevo público de Mate para datos académicos.

## Comprobación de la primera entrega

Debe completarse una misión con ratón, toque y teclado; conservar progreso tras recarga si se permite almacenamiento; poder reiniciarlo; explicar errores; ofrecer texto de las instrucciones sonoras; evitar bloqueos al cambiar de tamaño; y mantener objetos y destinos alineados. Se verifican transiciones y soluciones alternativas, no sólo capturas bonitas.

El pilotaje docente comprobará si los alumnos comprenden qué hacer, si usan el inglés necesario y si transfieren una decisión de seguridad al contexto real. La validación visual ocurre antes de producir muchas escenas. La cooperación online y el editor completo dependen de que esta primera experiencia funcione.
