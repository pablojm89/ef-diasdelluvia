// El Neceser: what goes in the wash bag after PE, what goes in the backpack and what stays at home.
// Pure data, shared by the game, the class screen and the album (every object that belongs is a sticker).
// Design: docs/12-descubrimiento.md, section 5.1.

// donde: 'neceser' (wash bag), 'mochila' (backpack) or 'fuera' (it does not come).
// base: always needed. dias: the days of level 2 on which it is needed. intruso: never comes.
// por: what Robles says when it is put in the wrong place; si: what he says when it is put right.
export const OBJETOS = [
 {id: 'toalla', es: 'Toalla', en: 'towel', donde: 'neceser', base: true, si: 'Para secarte después de lavarte.', por: 'Sin toalla no te puedes secar: va en el neceser.'},
 {id: 'jabon', es: 'Jabón', en: 'soap', donde: 'neceser', base: true, si: 'El agua sola no quita el sudor: hace falta jabón.', por: 'El jabón es lo primero del neceser: sin él, el sudor no se va.'},
 {id: 'desodorante', es: 'Desodorante de bola', en: 'roll-on deodorant', donde: 'neceser', base: true, si: 'De bola: no llena el vestuario de nube.', por: 'El desodorante de bola va en el neceser, después de lavarte.'},
 {id: 'camiseta', es: 'Camiseta limpia', en: 'clean T-shirt', donde: 'neceser', base: true, si: 'Te cambias la sudada por una seca.', por: 'Con la camiseta sudada puesta coges frío y huele: la limpia va en el neceser.'},
 {id: 'peine', es: 'Peine', en: 'comb', donde: 'neceser', base: true, si: 'Para peinarte al terminar.', por: 'El peine es tuyo y va en tu neceser.'},
 {id: 'bolsa-ropa', es: 'Bolsa para la ropa sudada', en: 'bag for sweaty clothes', donde: 'neceser', base: true, si: 'Así la ropa sudada no moja lo demás.', por: 'Sin bolsa, la camiseta sudada moja y ensucia lo limpio: va en el neceser.'},
 {id: 'coletero', es: 'Coletero', en: 'hair tie', donde: 'neceser', nivel2: true, si: 'Con el pelo recogido ves mejor y juegas cómodo.', por: 'Si llevas el pelo largo, el coletero va en el neceser para recogerlo.'},
 {id: 'crema-solar', es: 'Crema solar', en: 'sun cream', donde: 'neceser', dias: ['sol'], si: 'Con sol, en la piel antes de salir.', por: 'Con sol en el patio, la crema va en el neceser.', hoyNo: 'Hoy estamos bajo techo: la crema solar se queda en casa.'},
 {id: 'gorra', es: 'Gorra', en: 'cap', donde: 'mochila', dias: ['sol'], si: 'La gorra no es de aseo: va en la mochila.', por: 'La gorra no es de aseo: va en la mochila, a mano para salir al sol.', hoyNo: 'Hoy no da el sol: la gorra se queda en casa.'},
 {id: 'botella', es: 'Botella de agua', en: 'water bottle', donde: 'mochila', dias: ['sol', 'lluvia', 'comedor', 'ducha'], si: 'Cada uno con su botella, cerrada y en la mochila.', por: 'La botella va en la mochila, bien cerrada, nunca dentro del neceser con la toalla.'},
 {id: 'calcetines', es: 'Calcetines de repuesto', en: 'spare socks', donde: 'neceser', dias: ['lluvia'], si: 'Si se te mojan los pies en el patio, te cambias.', por: 'Un día de lluvia, los calcetines secos van en el neceser.', hoyNo: 'Hoy no llueve: no hacen falta calcetines de repuesto.'},
 {id: 'panuelos', es: 'Pañuelos de papel', en: 'tissues', donde: 'neceser', dias: ['lluvia'], si: 'Con frío y lluvia, para sonarte.', por: 'Los pañuelos de papel van en el neceser.', hoyNo: 'Hoy no hacen falta pañuelos de más.'},
 {id: 'cepillo-dientes', es: 'Cepillo de dientes con funda', en: 'toothbrush', donde: 'neceser', dias: ['comedor'], si: 'Después de comer, dientes limpios. Con funda, que no se ensucie.', por: 'Si te quedas al comedor, el cepillo con su funda va en el neceser.', hoyNo: 'Hoy no te quedas al comedor: el cepillo se queda en casa.'},
 {id: 'chanclas', es: 'Chanclas', en: 'flip-flops', donde: 'neceser', dias: ['ducha'], si: 'Para no pisar descalzo el suelo mojado de la ducha.', por: 'Si te duchas, las chanclas van en el neceser: no se pisa descalzo el suelo mojado.', hoyNo: 'Hoy no hay ducha: las chanclas se quedan en casa.'},
 // Intruders. The first four are obvious (level 1); the other four need a reason (level 2).
 {id: 'no-consola', es: 'Consola', en: 'games console', donde: 'fuera', intruso: 1, por: 'La consola no es de aseo ni de Educación Física: se queda en casa.'},
 {id: 'no-chuches', es: 'Chucherías', en: 'sweets', donde: 'fuera', intruso: 1, por: 'Las chucherías no son de aseo: después de moverte, mejor agua.'},
 {id: 'no-movil', es: 'Teléfono móvil', en: 'mobile phone', donde: 'fuera', intruso: 1, por: 'El móvil no hace falta en Educación Física y en el vestuario se moja o se pierde.'},
 {id: 'no-refresco', es: 'Lata de refresco', en: 'fizzy drink', donde: 'fuera', intruso: 1, por: 'Después de moverte se bebe agua, no refresco.'},
 {id: 'no-colonia', es: 'Colonia en frasco de cristal', en: 'glass bottle of cologne', donde: 'fuera', intruso: 2, por: 'Es de cristal: en un vestuario se cae, se rompe y corta.'},
 {id: 'no-spray', es: 'Desodorante en espray', en: 'spray deodorant', donde: 'fuera', intruso: 2, por: 'En un vestuario cerrado, el espray llena el aire y molesta a quien tienes al lado. Mejor de bola.'},
 {id: 'no-colgante', es: 'Colgante y pulseras', en: 'necklace and bracelets', donde: 'fuera', intruso: 2, por: 'En Educación Física no se llevan colgantes ni pulseras: se enganchan y hacen daño.'},
 {id: 'no-toalla-mojada', es: 'La toalla mojada de la semana pasada', en: 'last week’s wet towel', donde: 'fuera', intruso: 2, por: 'Una toalla mojada guardada huele mal y cría bichitos: se lava en casa y se trae limpia.'},
];
export const objeto = id => OBJETOS.find(o => o.id === id);
// Every object that belongs somewhere is a sticker of the album page «El neceser».
export const CON_CROMO = OBJETOS.filter(o => o.donde !== 'fuera');

// Level 2: a note on the cork board says what kind of day it is.
export const DIAS = [
 {id: 'sol', es: 'Hoy hay clase en la pista del patio, con mucho sol.', en: 'Outdoor PE today. It’s sunny!'},
 {id: 'lluvia', es: 'Hoy llueve: venimos del patio y la clase es en el pabellón.', en: 'It’s raining. PE is indoors today.'},
 {id: 'comedor', es: 'Hoy, después de Educación Física, te quedas al comedor.', en: 'You stay for school lunch today.'},
 {id: 'ducha', es: 'Hoy, después de clase, hay tiempo para ducharse.', en: 'There’s time for a shower after PE today.'},
];

// Level 3: after the class, in order. `antes` is what Robles says if this step is picked too early.
export const RUTINA = [
 {id: 'quitar', es: 'Quitarse la camiseta sudada', en: 'Take off your sweaty T-shirt', antes: 'Primero fuera la camiseta sudada: si no, no te puedes lavar.'},
 {id: 'lavar', es: 'Lavarse con agua y jabón: cara, cuello y axilas', en: 'Wash with soap and water', antes: 'Antes de secarte o ponerte nada, hay que lavarse con agua y jabón.'},
 {id: 'secar', es: 'Secarse bien con la toalla', en: 'Dry yourself with your towel', antes: 'Primero se seca uno bien: sobre la piel mojada no se pone nada.'},
 {id: 'desodorante', es: 'Ponerse desodorante', en: 'Put on some deodorant', antes: 'El desodorante va sobre la piel limpia y seca, no en lugar de lavarse.'},
 {id: 'camiseta', es: 'Ponerse la camiseta limpia', en: 'Put on a clean T-shirt', antes: 'La camiseta limpia va sobre la piel limpia, seca y con desodorante.'},
 {id: 'guardar', es: 'Guardar la ropa sudada en su bolsa', en: 'Put your sweaty clothes in the bag', antes: 'Primero te vistes con lo limpio; luego guardas lo sudado en su bolsa.'},
 {id: 'beber', es: 'Peinarse y beber agua', en: 'Comb your hair and drink some water', antes: 'Esto es lo último: cuando ya está todo recogido.'},
];

// The three posters before the first level.
export const CARTELES = [
 {titulo: 'El sudor', en: 'Sweat', texto: 'Al moverte sudas, y está bien: así se refresca el cuerpo. El sudor no huele, pero si se queda en la piel y en la ropa, sí.'},
 {titulo: 'Cuidarte y cuidar', en: 'Look after yourself', texto: 'Lavarte y cambiarte de camiseta es cuidarte a ti y a quien se sienta a tu lado en clase.'},
 {titulo: 'Lo tuyo es tuyo', en: 'Don’t share', texto: 'La toalla, el peine y la botella no se comparten. Cada uno, lo suyo.'},
];

// Questions: two after each level. `bien` is the index of the right option.
export const PREGUNTAS = [
 {p: '¿El desodorante sustituye a lavarse?', o: ['Sí, si echas mucho', 'No: primero agua y jabón, luego desodorante', 'Sólo en invierno'], bien: 1, por: 'El desodorante tapa el olor un rato, pero no limpia.'},
 {p: '¿Qué haces con la camiseta sudada al terminar?', o: ['Me la dejo puesta hasta casa', 'La guardo en su bolsa y me pongo una limpia', 'La dejo en el banco del vestuario'], bien: 1, por: 'Sudada se enfría, huele y moja lo demás.'},
 {p: '¿Por qué mejor desodorante de bola que de espray en el vestuario?', o: ['Porque el espray llena el aire y molesta a los demás', 'Porque la bola huele más', 'Da igual'], bien: 0, por: 'En un sitio cerrado, la nube del espray la respiran todos.'},
 {p: '¿Se puede compartir la toalla con un amigo?', o: ['Sí, si es tu mejor amigo', 'No: la toalla es de cada uno', 'Sólo si está seca'], bien: 1, por: 'La toalla, el peine y la botella son de cada uno.'},
 {p: '¿Cuándo te lavas las manos?', o: ['Después de Educación Física y antes de comer', 'Sólo si se ven sucias', 'Una vez a la semana'], bien: 0, por: 'Las manos tocan balones, suelo y barandillas: después de clase y antes de comer.'},
 {p: '¿Por qué no se trae un frasco de colonia de cristal?', o: ['Porque huele demasiado', 'Porque se puede romper y cortar', 'Porque pesa mucho'], bien: 1, por: 'En el vestuario hay prisas y el suelo es duro: el cristal se rompe.'},
 {p: 'Un día de sol en el patio, ¿qué te pones antes de salir?', o: ['Crema solar y gorra', 'Colonia', 'Nada, el sol es bueno'], bien: 0, por: 'El sol de Andalucía quema: crema en la piel y gorra en la cabeza.'},
 {p: '¿Dónde va la botella de agua?', o: ['Dentro del neceser, con la toalla', 'En la mochila, bien cerrada', 'Abierta en el suelo de la pista'], bien: 1, por: 'Cerrada y en la mochila: si se abre, no moja la toalla ni el suelo.'},
 {p: 'Has sudado mucho. ¿Qué es lo primero al llegar al vestuario?', o: ['Echarse desodorante', 'Quitarse la camiseta sudada para lavarse', 'Peinarse'], bien: 1, por: 'Primero fuera lo sudado y a lavarse; lo demás, después.'},
 {p: '¿Por qué se cambia uno de camiseta después de clase?', o: ['Para ir a la moda', 'Porque la sudada se enfría y huele', 'No hace falta'], bien: 1, por: 'Con la ropa mojada de sudor se coge frío.'},
 {p: 'La toalla de la semana pasada sigue mojada en el neceser. ¿Qué haces?', o: ['La uso otra vez', 'La llevo a casa a lavar y traigo una limpia', 'La dejo ahí, ya se secará'], bien: 1, por: 'Una toalla mojada guardada huele y cría bichitos.'},
 {p: '¿Por qué no se llevan colgantes ni pulseras en Educación Física?', o: ['Porque se pueden enganchar y hacer daño', 'Porque se pierden los botones', 'Porque pesan'], bien: 0, por: 'Al correr y jugar se enganchan: a ti o a un compañero.'},
 {p: 'Después de moverte, ¿qué se bebe?', o: ['Refresco', 'Agua', 'Nada hasta la cena'], bien: 1, por: 'El cuerpo ha perdido agua al sudar: se recupera bebiendo agua.'},
 {p: 'Un día de lluvia se te mojan los calcetines en el patio. ¿Qué te ayuda?', o: ['Unos calcetines de repuesto', 'Seguir con ellos mojados', 'Quitártelos y jugar descalzo'], bien: 0, por: 'Con los pies mojados se coge frío y salen rozaduras.'},
 {p: '¿Por qué se usan chanclas en la ducha?', o: ['Para no resbalar ni pisar descalzo el suelo mojado', 'Porque son bonitas', 'Para correr más'], bien: 0, por: 'El suelo mojado resbala y lo pisan muchos pies.'},
 {p: '¿Para qué sirve la bolsa de la ropa sudada?', o: ['Para que lo sudado no moje lo limpio', 'Para guardar chucherías', 'Para nada'], bien: 0, por: 'Lo sudado va aparte hasta la lavadora.'},
];
