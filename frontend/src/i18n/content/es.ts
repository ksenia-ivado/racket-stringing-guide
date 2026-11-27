import type { ContentOverlay } from '../types'

/** Spanish (neutral international). Measurements keep the {{metric|imperial}} form. */
export const es: ContentOverlay = {
  steps: {
    'gather-tools': {
      title: 'Reúne tus herramientas',
      summary: 'Ten todo a mano antes de cortar una sola cuerda.',
      instructions: [
        'Máquina de encordar con soportes de montaje y dos pinzas (fijas o volantes).',
        'Un juego de cuerdas: unos {{12 m|40 ft}} para un encordado en dos piezas, o un juego híbrido con cuerdas distintas para las verticales y las horizontales.',
        'Alicates de corte afilados o alicates de corte a ras.',
        'Una pinza de inicio, para empezar las horizontales y apretar bien los nudos.',
        'Un punzón, para abrir ojales obstruidos.',
        'Alicates de punta, para apretar bien los nudos.',
        'Una cinta métrica y el patrón de encordado de tu raqueta (del fabricante o de una base de datos de encordado).',
      ],
      tips: [
        'Anota el patrón de encordado, el rango de tensión y los agujeros de anudado de la raqueta antes de empezar. Los necesitarás a mitad del trabajo.',
        'Pasa la cuerda entre las manos para detectar defectos antes de empezar, sobre todo con tripa natural. Si encuentras uno a mitad de camino, se pierde todo el trabajo.',
      ],
    },
    'remove-old-strings': {
      title: 'Corta las cuerdas viejas',
      summary: 'Libera la tensión de forma uniforme para que el marco no se deforme.',
      instructions: [
        'Empieza en el centro del plano de cuerdas y corta hacia fuera, en círculos.',
        'Corta a la vez una vertical y una horizontal donde se cruzan, avanzando hacia el marco.',
        'Cuando ya no quede tensión, saca de los ojales los trozos de cuerda que quedan.',
      ],
      warnings: [
        'Nunca cortes solo las verticales o solo las horizontales. Una liberación desigual somete el marco a esfuerzos desiguales y puede deformarlo o agrietarlo.',
      ],
    },
    'inspect-frame': {
      title: 'Revisa el marco y los ojales',
      summary: 'Detecta los daños ahora, mientras no hay cuerdas que estorben.',
      instructions: [
        'Revisa el marco en busca de grietas, sobre todo alrededor de la garganta y en las posiciones de las 10 y las 2 en punto.',
        'Revisa cada ojal. Los ojales partidos, aplastados o que faltan cortarán las cuerdas nuevas.',
        'Cambia la tira de ojales si está dañada antes de continuar.',
      ],
      warnings: [
        'No encuerdes un marco agrietado. La tensión empeorará la grieta y la raqueta podría romperse durante el encordado.',
      ],
    },
    'mount-racket': {
      title: 'Monta la raqueta',
      summary: 'Firme en los lados, apenas en contacto en la cabeza y la garganta.',
      instructions: [
        'Coloca primero la garganta. Así es más fácil encontrar el centro de la raqueta.',
        'Cierra los soportes de la garganta y luego los de la cabeza, de modo que apenas toquen el marco.',
        'Ajusta con firmeza los soportes laterales a las 3 y a las 9 en punto.',
        'Comprueba que la raqueta no se mueva cuando la empujas.',
      ],
      tips: [
        'Por qué lados firmes y extremos suaves: encordar las verticales comprime el marco, y las horizontales le devuelven su forma. Los soportes deben permitirlo sin deformarlo.',
        'Si tu máquina tiene ajuste de velocidad, usa una tracción más lenta para la tripa natural, para protegerla, y una más rápida para cuerdas de monofilamento como el poliéster.',
        'Si tus soportes tienen una almohadilla de contacto, céntrala en el marco para que no presione un ojal.',
      ],
    },
    'measure-string': {
      title: 'Mide y corta la cuerda',
      summary: 'Divide el juego en un tramo para las verticales y otro para las horizontales.',
      instructions: [
        'Para un patrón 16x19, mide unos {{6 m|20 ft}} para las verticales.',
        'Corta el resto del juego (unos {{6 m|20 ft}}) para las horizontales.',
        'Corta cada extremo en ángulo agudo. Una punta afilada pasa por los ojales con mucha más facilidad.',
      ],
      tips: [
        'Los patrones más densos, como 18x20, necesitan unos {{0.5 m|2 ft}} más en cada trozo. Consulta la recomendación del fabricante.',
      ],
    },
    'install-center-mains': {
      title: 'Coloca las verticales centrales',
      summary: 'Reparte la cuerda de las verticales por igual entre los dos agujeros centrales.',
      instructions: [
        'Desde la garganta, pasa los dos extremos de la cuerda de las verticales por los dos agujeros centrales de las verticales y sácalos por la cabeza.',
        'Junta los dos extremos para comprobar que tienen la misma longitud.',
        'Coloca una de las verticales centrales en el cabezal de tensión y tensa.',
        'Fíjala con la pinza cerca del marco y luego suelta el cabezal de tensión.',
        'Repite con la otra vertical central.',
      ],
      tips: [
        'Comprueba el ajuste de tensión de la máquina antes del primer tirón. La mayoría de las raquetas indican un rango como {{23–27 kg|50–60 lb}} en el interior de la garganta.',
        'Ajusta cada pinza al calibre de la cuerda para que la sujete sin aplastarla.',
        'Con tripa natural, deja que la cuerda gire hacia donde quiera y síguela, en lugar de forzarla.',
      ],
    },
    'string-mains': {
      title: 'Encuerda el resto de las verticales',
      summary: 'Tres de cada lado para igualar, y luego de una en una, alternando.',
      instructions: [
        'Pasa un extremo por el siguiente agujero de vertical de su lado, cruzando por la cabeza o la garganta.',
        'Recoge la holgura, tensa, fija con la pinza y suelta la pinza anterior.',
        'Encuerda tres verticales de un lado y luego tres del otro, para igualar.',
        'A partir de ahí, ve de una vertical en una, alternando los lados, para que el marco se deforme de la forma más uniforme posible.',
        'Sigue tu patrón en los agujeros saltados de la cabeza y la garganta. Algunos patrones terminan las verticales en agujeros distintos a cada lado.',
      ],
      tips: [
        'Mantén la tira de ojales pegada al marco mientras avanzas. Protege la raqueta y la cuerda, y pronto se vuelve un hábito.',
        'Mantén el marco recto para que cada cuerda recorra la menor distancia posible. Así el cabezal de tensión agarra antes y el plano de cuerdas queda más rígido.',
        'Recoge la holgura a mano antes de tensar. El cabezal de tensión solo debe añadir tensión, no arrastrar la cuerda.',
      ],
      warnings: [
        'Nunca dejes una cuerda tensada sin pinza. Soltar el cabezal de tensión antes de fijar la pinza hace perder la tensión y puede dañar el marco.',
      ],
    },
    'tie-off-mains': {
      title: 'Anuda las verticales',
      summary: 'Asegura cada extremo con un nudo en el agujero de anudado indicado.',
      instructions: [
        'Saca el extremo de la última vertical por el agujero de anudado de tu patrón.',
        'Bloquea el plato giratorio para que la raqueta no se mueva.',
        'Tensa la última vertical y fíjala con la pinza.',
        'Haz un nudo Parnell (o un doble medio nudo) alrededor de la cuerda de anclaje, junto al ojal.',
        'Aprieta bien el nudo. Una pinza de inicio en la cola tira de la cuerda para que la parte que queda fuera del marco también quede tensa; unos alicates de punta también sirven.',
        'Suelta primero la base de la pinza y luego la pinza.',
        'Repite en el otro lado y después recorta las colas a unos {{6 mm|¼ pulg.}}.',
      ],
      tips: [
        'Añade tensión extra a la última vertical antes de anudar, para compensar lo que pierde el nudo. Los consejos van desde un 10 % hasta el 20 % que recomienda HEAD.',
        'Con poliéster y otros monofilamentos, aplasta el extremo cortado con el dorso de los alicates de corte para que no se enganche en un dedo. La tripa natural no lo necesita.',
        'Deja la punta sobrante recta a lo largo de la cuerda a la que está atada. Algunos jugadores del circuito devuelven una raqueta si los nudos no están bien hechos.',
      ],
    },
    'start-crosses': {
      title: 'Empieza las horizontales',
      summary: 'Comienza en la cabeza y entrelaza la primera horizontal.',
      instructions: [
        'Decide la tensión de las horizontales: la misma que en las verticales o la que recomiende tu raqueta para las horizontales.',
        'Busca el primer agujero de horizontal cerca de la cabeza (consulta tu patrón).',
        'Sujeta el inicio de la cuerda con una pinza de inicio fuera del marco o haz un nudo de inicio.',
        'Entrelaza la cuerda a través de las verticales: por encima de una, por debajo de la siguiente, de lado a lado.',
        'Recoge la holgura y tensa la primera horizontal.',
      ],
      tips: [
        'La pinza de inicio es la opción profesional: así los dos extremos de las horizontales se pueden terminar con nudos Parnell, que quedan más limpios y tratan mejor la cuerda. Pon una almohadilla entre la pinza y el marco para que no lo marque.',
        'Algunos encordadores empiezan por la tercera horizontal desde arriba y suben primero hasta la superior, lo que es un poco más suave para la cuerda.',
        'Si el nudo de inicio se escapa por el ojal, dale una vuelta más para que abulte más.',
      ],
    },
    'string-crosses': {
      title: 'Entrelaza y tensa las horizontales',
      summary: 'Avanza de la cabeza a la garganta, alternando el entrelazado en cada fila.',
      instructions: [
        'Entrelaza la siguiente horizontal al revés que la anterior: por debajo donde la última pasó por encima.',
        'Recoge la holgura, tensa, fija con la pinza y suelta la pinza anterior.',
        'Entrelaza siempre una horizontal por delante de la que estás tensando, para que las verticales se mantengan rectas.',
        'Sigue hasta llegar al último agujero de horizontal en la garganta. Las últimas horizontales son las más difíciles de entrelazar.',
      ],
      tips: [
        'Sujeta cada horizontal formando una U amplia sobre el plano de cuerdas mientras recoges la holgura. Arrastrarla en línea recta sobre las verticales provoca quemaduras por fricción, que les hacen muescas.',
        'Mantén cada cuerda lo más recta posible. Tendrás menos que ajustar al final y un plano de cuerdas más rígido y uniforme.',
        'No hay una única forma ideal de entrelazar. Vale la pena aprender dos métodos, porque cada cuerda y cada raqueta se adaptan mejor a uno u otro.',
        'Revisa el entrelazado después de cada fila. Un solo cruce mal hecho, por encima o por debajo, obliga a volver a entrelazar todo lo que viene después.',
      ],
    },
    'tie-off-crosses': {
      title: 'Anuda las horizontales',
      summary: 'Termina la última horizontal con el mismo nudo que usaste en las verticales.',
      instructions: [
        'Tensa la última horizontal y fíjala con la pinza.',
        'Haz un nudo Parnell (o un doble medio nudo) alrededor de la vertical de anclaje en el agujero de anudado, y asiéntalo con firmeza.',
        'Si empezaste las horizontales con una pinza de inicio, anuda también el extremo inicial en la cabeza con un nudo Parnell y luego ténsalo.',
        'Suelta primero la base de la pinza y luego la pinza, y recorta las colas.',
      ],
    },
    finish: {
      title: 'Suelta y termina',
      summary: 'Saca la raqueta de la máquina y revisa tu trabajo.',
      instructions: [
        'Suelta las pinzas y después afloja los soportes laterales, de la cabeza y de la garganta.',
        'Saca la raqueta de la máquina. Debería salir con la misma facilidad con que entró: eso significa que el marco ha conservado su forma.',
        'Endereza las verticales y las horizontales con los dedos para que el plano de cuerdas quede cuadrado.',
        'Comprueba que cada ojal sujeta la cuerda limpiamente y que ningún nudo está flojo.',
        'Anota la fecha, la cuerda y la tensión en algún sitio (sirve una etiqueta en la garganta) para saber cuándo volver a encordar.',
      ],
      tips: ['Las cuerdas nuevas pierden un 10–15 % de su tensión en las primeras 24 horas. Es normal.'],
    },
  },

  techniques: {
    'double-half-hitch': {
      title: 'Doble medio nudo',
      summary: 'El nudo final más común: dos medios nudos alrededor de la cuerda de anclaje.',
      instructions: [
        'Saca la cuerda por el agujero de anudado, dejando unos {{20 cm|8 pulg.}} de cola.',
        'Localiza el anclaje: la cuerda que ya recorre el exterior del marco junto al agujero.',
        'Pasa la cola por debajo del anclaje y de vuelta por encima, y luego por el lazo que acabas de formar. Eso es un medio nudo.',
        'Haz un segundo medio nudo de la misma forma, sobre el mismo anclaje, justo al lado del primero.',
        'Aprieta el nudo contra el marco con unos alicates de punta y recorta la cola a unos {{6 mm|¼ pulg.}}.',
      ],
      tips: ['Mantén la cuerda tensa mientras anudas. Un nudo flojo deja floja la última cuerda.'],
      aliases: ['doble medio nudo', 'dobles medios nudos'],
    },
    'parnell-knot': {
      title: 'Nudo Parnell',
      summary:
        'Un nudo final compacto, ideado por el maestro encordador Richard Parnell, que protege la cuerda de anclaje.',
      instructions: [
        'Bloquea el plato giratorio para que la raqueta no se mueva.',
        'Saca la cuerda por el agujero de anudado y pásala alrededor de la cuerda de anclaje.',
        'Haz un medio nudo alrededor del anclaje, pero deja un pequeño lazo en vez de apretarlo.',
        'Haz un segundo medio nudo a través de ese lazo: otra vez alrededor del anclaje y hacia arriba por el lazo, desde abajo.',
        'Apriétalo con una pinza de inicio en la cola, para que la cuerda fuera del marco también quede tensa. Suelta primero la base de la pinza y luego la pinza.',
        'Recorta la cola bien corta. Con poliéster, aplasta el extremo con el dorso de los alicates de corte; la tripa natural no lo necesita.',
      ],
      tips: [
        'Lo importante es que el extremo termine pasando por el primer lazo que hiciste. Si es así, el nudo aguanta.',
        'Deja la punta sobrante recta a lo largo de la cuerda a la que está atada, para que todos los nudos se vean iguales.',
        'HEAD lo considera uno de los dos nudos más usados en el encordado profesional y uno de los dos nudos oficiales de Wimbledon. Para ver los movimientos exactos de las manos, mira cómo lo hace el propio Richard Parnell.',
      ],
      aliases: ['nudo parnell', 'nudos parnell'],
    },
    'starting-knot': {
      title: 'Nudo de inicio',
      summary: 'Un nudo voluminoso al comienzo de las horizontales que no se escapa de vuelta por el ojal.',
      instructions: [
        'Saca el inicio de la cuerda de las horizontales por el primer agujero de horizontal, dejando unos {{20 cm|8 pulg.}} de cola.',
        'Da dos vueltas con el extremo alrededor de la vertical contigua, manteniendo los lazos abiertos con un dedo.',
        'Pasa el extremo de vuelta por el doble lazo.',
        'Apriétalo desde ambos lados para que el nudo quede lo más compacto y voluminoso posible. Al tensar la primera horizontal se aprieta aún más.',
        'Recorta la cola a unos {{6 mm|¼ pulg.}}.',
      ],
      tips: [
        'Con cuerdas resbaladizas o agujeros de ojal grandes, dale una vuelta más para que abulte más.',
        'O sáltate el nudo: sujeta la primera horizontal con una pinza de inicio, tensa unas cuantas horizontales y luego haz un nudo final normal en el inicio. HEAD lo recomienda, porque así todos los nudos pueden ser nudos Parnell.',
      ],
      aliases: ['nudo de inicio', 'nudos de inicio'],
    },
    'weave-one-ahead': {
      title: 'Entrelazar una por delante',
      summary: 'Entrelaza la siguiente horizontal antes de tensar la actual.',
      instructions: [
        'Entrelaza la siguiente horizontal al revés que la anterior, dejando un lazo lo bastante largo para poder tensarlo.',
        'Solo entonces tensa la horizontal anterior, fíjala con la pinza y suelta la pinza previa.',
        'Repite: siempre hay una horizontal entrelazada pero sin tensar por delante de la que tensas.',
      ],
      tips: ['Reduce la fricción entre las cuerdas y hace que las horizontales sean más fáciles de entrelazar.'],
      aliases: ['entrelazar una por delante', 'una por delante', 'una horizontal por delante'],
    },
    'pull-slack': {
      title: 'Recoger la holgura en una U amplia',
      summary: 'Pasa cada horizontal sin arrastrarla sobre las verticales.',
      instructions: [
        'Después de entrelazar una horizontal, empújala con la otra mano para formar una U amplia sobre el plano de cuerdas.',
        'Mantenla así mientras recoges la holgura.',
        'Solo entonces colócala en el cabezal de tensión, que debe añadir tensión, no arrastrar la cuerda.',
      ],
      tips: [
        'Arrastrar una horizontal en línea recta sobre las verticales provoca quemaduras por fricción: hace muescas en las verticales y acorta la vida del encordado.',
        'Con poliéster rígido, un trozo de cinta adhesiva en la yema del dedo que sujeta la U te protege la piel.',
      ],
      aliases: ['u amplia'],
    },
    'tie-off-tension': {
      title: 'Tensión extra al anudar',
      summary: 'Añade algo de tensión a la última cuerda antes de anudarla.',
      instructions: [
        'Cuando llegues a la última vertical o a la última horizontal, sube la tensión. Lo habitual es un 10 %: a {{25 kg|55 lb}}, eso son unos {{27.5 kg|60 lb}}.',
        'Tensa la cuerda y fíjala con la pinza como siempre.',
        'Anúdala con un nudo Parnell o un doble medio nudo, usando una pinza de inicio para apretar el nudo.',
      ],
      tips: [
        'Los nudos pierden algo de tensión al asentarse, y el extra lo compensa. Los consejos varían: HEAD recomienda un 20 %, para que las últimas cuerdas queden lo más tensas posible.',
      ],
      aliases: ['tensión extra'],
    },
  },

  tools: {
    'stringing-machine': {
      name: 'Máquina de encordar',
      aliases: ['máquina de encordar', 'máquinas de encordar', 'máquina', 'máquinas'],
      summary: 'Sujeta la raqueta sin que se mueva y tira de cada cuerda hasta una tensión exacta.',
      details: [
        'Toda máquina tiene tres partes: soportes de montaje que sujetan el marco, pinzas que mantienen las cuerdas tensas y un cabezal de tensión que hace la tracción.',
        'Las máquinas se diferencian sobre todo en cómo tiran. Una máquina de contrapeso usa una barra con un peso que nivelas a mano. Una máquina de manivela (con bloqueo) tira con un muelle y se bloquea al alcanzar la tensión. Una máquina electrónica de tracción constante sigue tirando mientras la cuerda se estira, y es la más regular.',
        'La raqueta va sobre un plato giratorio, que puedes girar para llegar a cada cuerda. Bloquea el plato giratorio mientras haces los nudos.',
        'Muchas máquinas permiten ajustar la velocidad de tracción: más lenta para la tripa natural, para protegerla, y más rápida para monofilamentos como el poliéster.',
      ],
      tips: ['Comprueba el ajuste de tensión antes de cada trabajo. Es el error más fácil de cometer.'],
    },
    'tension-head': {
      name: 'Cabezal de tensión',
      aliases: ['cabezal de tensión', 'cabezal'],
      summary: 'La parte de la máquina que agarra la cuerda y tira de ella hasta la tensión.',
      details: [
        'Metes la cuerda en su mordaza, tensas, fijas la cuerda con la pinza y luego sueltas el cabezal.',
        'Solo debe añadir tensión. Recoge antes la holgura a mano, para que el cabezal no arrastre la cuerda sobre las verticales.',
      ],
    },
    'mounting-supports': {
      name: 'Soportes de montaje',
      aliases: [
        'soportes de montaje',
        'soporte de montaje',
        'soportes',
        'soportes laterales',
        'soportes de la cabeza',
        'soporte de la cabeza',
        'soportes de la garganta',
        'soporte de la garganta',
      ],
      summary: 'Sujetan el marco por la cabeza, la garganta y los lados para que conserve su forma bajo tensión.',
      details: [
        'Los sistemas de dos puntos sujetan la cabeza y la garganta; los de seis puntos añaden soportes en los lados. Con más puntos, la carga se reparte de forma más uniforme sobre el marco.',
        'Monta primero la garganta y luego la cabeza. Los soportes de la cabeza y de la garganta solo deben apoyarse en el marco; los soportes laterales deben estar firmes.',
        'Encordar las verticales comprime el marco y las horizontales le devuelven su forma, así que los soportes deben sujetarlo sin deformarlo.',
      ],
      tips: [
        'Al terminar, la raqueta debería salir con la misma facilidad con que entró. Si es así, el marco ha conservado su forma.',
      ],
    },
    clamps: {
      name: 'Pinzas',
      aliases: ['pinzas', 'pinza', 'pinzas fijas', 'pinza fija', 'pinzas volantes', 'pinza volante'],
      summary: 'Mantienen la cuerda tensa después de que el cabezal de tensión la suelte.',
      details: [
        'Las pinzas fijas van montadas en la máquina y se cierran sobre una sola cuerda. Las pinzas volantes no van sujetas a nada y sujetan juntas dos cuerdas vecinas.',
        'Coloca la pinza cerca del marco. Cuanto más lejos del marco esté la pinza, más tensión se pierde al soltarla.',
        'Ajusta la pinza al calibre de la cuerda para que la sujete sin aplastarla.',
      ],
      tips: [
        'Nunca sueltes el cabezal de tensión antes de fijar la pinza.',
        'Al soltar, suelta primero la base de la pinza y luego la pinza.',
      ],
    },
    'starting-clamp': {
      name: 'Pinza de inicio',
      aliases: ['pinza de inicio', 'pinzas de inicio'],
      summary: 'Una pequeña pinza independiente que sujeta la cuerda por fuera del marco.',
      details: [
        'Sirve para empezar las horizontales sin nudo de inicio, para reforzar una pinza que resbala y para sujetar la última cuerda mientras la anudas.',
        'También sirve para apretar un nudo: colócala en la cola y tira para tensar, de modo que la cuerda fuera del marco también quede tensa.',
      ],
      tips: [
        'Pon una almohadilla protectora entre la pinza y el marco, sobre todo en una raqueta nueva, para que el metal no lo marque.',
      ],
    },
    awl: {
      name: 'Punzón',
      aliases: ['punzón'],
      summary: 'Una herramienta puntiaguda para abrir ojales obstruidos y hacer sitio a una cuerda.',
      details: [
        'Introdúcelo con cuidado en un agujero de ojal que ya tiene una cuerda, para hacer sitio a la segunda.',
        'También es útil para levantar una vertical cuando cuesta entrelazar una horizontal muy tensa.',
      ],
      tips: ['Ve con cuidado. Forzar un punzón puede partir un ojal o dañar una cuerda.'],
    },
    cutters: {
      name: 'Alicates de corte',
      aliases: ['alicates de corte', 'alicates de corte a ras'],
      summary: 'Herramienta afilada para cortar la cuerda a medida y recortar los nudos.',
      details: [
        'Corta cada extremo en ángulo agudo para que pase por los ojales.',
        'Los alicates de corte a ras recortan las colas de los nudos de forma pegada y limpia.',
        'Con poliéster y otros monofilamentos, aplasta el extremo cortado con el dorso de los alicates de corte para que no se enganche en un dedo.',
      ],
    },
    pliers: {
      name: 'Alicates de punta',
      aliases: ['alicates de punta'],
      summary: 'Para apretar los nudos y sujetar la cuerda en espacios reducidos.',
      details: ['Sujeta la cola del nudo, no la cuerda que se queda, para no aplastarla.'],
    },
    'tape-measure': {
      name: 'Cinta métrica',
      aliases: ['cinta métrica'],
      summary: 'Para medir las verticales y las horizontales antes de cortar.',
      details: ['Mide dos veces. Un trozo demasiado corto no tiene arreglo.'],
    },
    'string-set': {
      name: 'Juegos de cuerdas y bobinas',
      aliases: ['juego de cuerdas', 'juegos de cuerdas', 'bobina', 'bobinas'],
      summary: 'Se venden en juegos sueltos para una raqueta o en bobinas para muchas.',
      details: [
        'Un juego tiene unos {{12 m|40 ft}}, suficiente para una raqueta. Las bobinas (a menudo de {{200 m|660 ft}}) salen más baratas por trabajo si encuerdas a menudo.',
        'Un juego híbrido tiene una cuerda distinta para las verticales y para las horizontales.',
      ],
    },
  },

  glossary: {
    frame: {
      term: 'Marco',
      aliases: ['marco', 'marcos'],
      definition: 'La raqueta en sí, sin cuerdas: cabeza, garganta y mango.',
    },
    head: {
      term: 'Cabeza',
      aliases: ['cabeza'],
      definition: 'La parte ovalada del marco que sujeta las cuerdas. Su extremo superior también se llama cabeza.',
    },
    throat: {
      term: 'Garganta',
      aliases: ['garganta'],
      definition: 'Donde la cabeza se une al mango; el extremo inferior del plano de cuerdas.',
    },
    grommets: {
      term: 'Ojales',
      aliases: ['ojales', 'ojal', 'tira de ojales', 'tiras de ojales', 'agujeros de ojal', 'agujero de ojal'],
      definition: 'Fundas de plástico en los agujeros del marco que protegen las cuerdas de los bordes del marco.',
      details:
        'Los ojales partidos, aplastados o que faltan cortan las cuerdas nuevas, así que cambia la tira de ojales gastada antes de encordar.',
    },
    'tie-off-hole': {
      term: 'Agujero de anudado',
      aliases: ['agujero de anudado', 'agujeros de anudado'],
      definition: 'Un agujero que el fabricante indica para terminar una cuerda con un nudo.',
      details:
        'Los agujeros de anudado suelen ser lo bastante grandes para admitir un nudo y una segunda cuerda. Consulta las instrucciones de encordado de la raqueta.',
    },
    mains: {
      term: 'Verticales',
      aliases: ['cuerdas verticales', 'cuerda vertical', 'verticales', 'vertical'],
      definition:
        'Las cuerdas que recorren la raqueta a lo largo, de la cabeza a la garganta. Se encuerdan primero.',
    },
    crosses: {
      term: 'Horizontales',
      aliases: ['cuerdas horizontales', 'cuerda horizontal', 'horizontales', 'horizontal'],
      definition: 'Las cuerdas que cruzan la raqueta a lo ancho, entrelazadas por encima y por debajo de las verticales.',
    },
    'string-bed': {
      term: 'Plano de cuerdas',
      aliases: ['plano de cuerdas'],
      definition: 'Todas las cuerdas juntas: la superficie de golpeo.',
    },
    'string-pattern': {
      term: 'Patrón de encordado',
      aliases: ['patrón de encordado', 'patrones de encordado', '16x19', '18x20'],
      definition: 'El número de verticales y horizontales. 16x19 significa 16 verticales y 19 horizontales.',
      details:
        'Los patrones abiertos (menos cuerdas, como 16x19) dan más efecto y más sensación; los densos (como 18x20) dan más control y hacen que las cuerdas duren más. Los patrones densos también necesitan un poco más de cuerda.',
    },
    anchor: {
      term: 'Cuerda de anclaje',
      aliases: ['cuerda de anclaje', 'vertical de anclaje', 'anclaje'],
      definition:
        'La cuerda que ya recorre el exterior del marco junto a un agujero de anudado; los nudos se hacen alrededor de ella.',
    },
    gauge: {
      term: 'Calibre',
      aliases: ['calibre', 'calibres'],
      definition:
        'El grosor de la cuerda. Los números más altos son más finos: una cuerda de calibre 17 (unos 1,25 mm) es más fina que una de 16 (unos 1,30 mm).',
      details: 'Las cuerdas más finas dan más sensación y efecto, pero se rompen antes.',
    },
    tension: {
      term: 'Tensión',
      aliases: ['tensión'],
      definition: 'Lo tensa que está cada cuerda, ajustada en la máquina en libras o kilogramos.',
      details:
        'Una tensión más baja da más potencia y un tacto más suave; una más alta da más control. La mayoría de las raquetas indican un rango recomendado en el interior de la garganta, como {{23–27 kg|50–60 lb}}.',
    },
    'tension-loss': {
      term: 'Pérdida de tensión',
      aliases: ['pérdida de tensión', 'pierden tensión', 'pierde tensión'],
      definition:
        'Las cuerdas se relajan después del encordado, así que el plano de cuerdas siempre queda algo más flojo que el ajuste de la máquina.',
      details: 'La mayor parte de la pérdida se produce el primer día. Los nudos y fijar la pinza con lentitud restan un poco más.',
    },
    polyester: {
      term: 'Poliéster',
      aliases: ['poliéster'],
      definition:
        'Una cuerda rígida y duradera, popular por el efecto que permite. Pierde tensión más rápido y es más dura para el brazo.',
    },
    multifilament: {
      term: 'Multifilamento',
      aliases: ['multifilamento', 'multifilamentos'],
      definition:
        'Una cuerda suave hecha de muchas fibras finas, de tacto más parecido a la tripa natural y más amable con el brazo.',
    },
    'synthetic-gut': {
      term: 'Tripa sintética',
      aliases: ['tripa sintética'],
      definition: 'Una cuerda de nailon económica y polivalente. A pesar del nombre, no contiene tripa.',
    },
    'natural-gut': {
      term: 'Tripa natural',
      aliases: ['tripa natural'],
      definition:
        'La cuerda original, hecha de intestino animal. Es la más elástica y la que mejor mantiene la tensión, pero es cara y sensible a la humedad.',
      details:
        'Revísala en busca de defectos antes de empezar, encuérdala a una velocidad de máquina más lenta y deja que gire hacia donde quiera.',
    },
    hybrid: {
      term: 'Híbrido',
      aliases: ['híbrido', 'híbrida', 'juego híbrido', 'encordado híbrido'],
      definition:
        'Cuerdas distintas en las verticales y en las horizontales, por ejemplo verticales de poliéster con horizontales de tripa natural.',
      details: 'Un híbrido siempre se encuerda en dos piezas.',
    },
    monofilament: {
      term: 'Monofilamento',
      aliases: ['monofilamento', 'monofilamentos'],
      definition:
        'Una cuerda con un único núcleo macizo, como el poliéster. Sus extremos cortados pueden quedar afilados, así que aplánalos después de recortarlos.',
    },
    'string-bed-stiffness': {
      term: 'Rigidez del plano de cuerdas',
      aliases: ['rigidez del plano de cuerdas', 'más rígido'],
      definition:
        'Lo firme que se siente la raqueta encordada. Las cuerdas rectas y los tramos cortos de tracción la mantienen alta, lo que da más control.',
    },
    turntable: {
      term: 'Plato giratorio',
      aliases: ['plato giratorio'],
      definition:
        'La parte de la máquina sobre la que se monta la raqueta. Gira para que llegues a cada cuerda; bloquéalo mientras haces los nudos.',
    },
    'clamp-base': {
      term: 'Base de la pinza',
      aliases: ['base de la pinza', 'bases de las pinzas'],
      definition:
        'Lo que sujeta una pinza fija en su sitio sobre la máquina. Al soltar una cuerda, suelta primero la base y luego la pinza.',
    },
    'two-piece': {
      term: 'Encordado en dos piezas',
      aliases: ['encordado en dos piezas', 'en dos piezas', 'dos piezas'],
      definition:
        'Las verticales y las horizontales se encuerdan con tramos de cuerda separados, con cuatro nudos en total. Esta guía lo utiliza.',
    },
    'one-piece': {
      term: 'Encordado en una pieza',
      aliases: ['encordado en una pieza', 'en una pieza', 'una pieza', 'around the world', 'ATW'],
      definition:
        'Verticales y horizontales encordadas con un solo tramo de cuerda. "Around the world" (ATW) es un método en una pieza muy popular.',
    },
    weave: {
      term: 'Entrelazado',
      aliases: [
        'entrelazado',
        'entrelazada',
        'entrelazados',
        'entrelazadas',
        'entrelazar',
        'entrelaza',
        'entrelazas',
      ],
      definition:
        'Pasar una horizontal por encima de una vertical y por debajo de la siguiente, alternando, con cada horizontal al revés que la anterior.',
      details:
        'Un solo cruce mal hecho, por encima o por debajo, obliga a volver a entrelazar todo lo que viene después, así que revisa cada fila.',
    },
    'skipped-holes': {
      term: 'Agujeros saltados',
      aliases: ['agujeros saltados', 'agujero saltado'],
      definition:
        'Agujeros de la cabeza o la garganta por los que no pasan las verticales, según indica el patrón de encordado.',
    },
    'tie-off': {
      term: 'Anudar',
      aliases: [
        'anudar',
        'anuda',
        'anudas',
        'anudarla',
        'anúdala',
        'anudado',
        'anudados',
        'nudo final',
        'nudos finales',
      ],
      definition: 'Terminar una cuerda con un nudo alrededor de la cuerda de anclaje en un agujero de anudado.',
    },
    'half-hitch': {
      term: 'Medio nudo',
      aliases: ['medio nudo', 'medios nudos'],
      definition:
        'El lazo básico de la mayoría de los nudos finales: alrededor del anclaje y de vuelta a través de sí mismo.',
    },
    'friction-burn': {
      term: 'Quemadura por fricción',
      aliases: ['quemadura por fricción', 'quemaduras por fricción'],
      definition:
        'Daño por calor y muescas en las verticales por arrastrar una horizontal sobre ellas demasiado rápido.',
    },
    notching: {
      term: 'Muescas',
      aliases: ['muescas', 'muesca'],
      definition:
        'Surcos que se forman en las verticales donde rozan las horizontales, por el juego o por quemaduras por fricción.',
    },
    'constant-pull': {
      term: 'Tracción constante',
      aliases: ['tracción constante', 'con bloqueo'],
      definition:
        'Un cabezal de tensión que sigue tirando mientras la cuerda se estira, a diferencia de un cabezal con bloqueo, que se detiene al alcanzar la tensión.',
    },
    'drop-weight': {
      term: 'Contrapeso',
      aliases: ['contrapeso', 'de contrapeso'],
      definition:
        'Un mecanismo de tensión sencillo: un peso sobre una barra que nivelas a mano para fijar la tensión.',
    },
    singles: {
      term: 'Individuales',
      aliases: ['individuales'],
      definition:
        'Un jugador a cada lado. La página de tenis en directo solo muestra individuales masculinos y femeninos.',
    },
    atp: {
      term: 'ATP',
      aliases: ['ATP'],
      definition: 'El circuito profesional masculino (Association of Tennis Professionals).',
    },
    wta: {
      term: 'WTA',
      aliases: ['WTA'],
      definition: 'El circuito profesional femenino (Women’s Tennis Association).',
    },
    'grand-slam': {
      term: 'Grand Slam',
      aliases: ['grand slams', 'grand slam'],
      definition:
        'Los cuatro torneos más importantes: el Australian Open, Roland Garros, Wimbledon y el US Open.',
      details:
        'Allí los hombres juegan al mejor de cinco sets. Son torneos combinados, con cuadros masculino y femenino al mismo tiempo.',
    },
    draw: {
      term: 'Cuadro',
      aliases: ['cuadro principal', 'cuadros', 'cuadro'],
      definition:
        'El esquema de quién juega contra quién. El cuadro principal es el torneo propiamente dicho; la fase previa se juega antes.',
    },
    seed: {
      term: 'Cabeza de serie',
      aliases: ['cabeza de serie', 'cabezas de serie'],
      definition:
        'Un jugador de ranking alto colocado en el cuadro de forma que los mejores no puedan enfrentarse pronto entre sí. Se muestra como un número entre paréntesis, por ejemplo (1).',
    },
    qualifying: {
      term: 'Fase previa',
      aliases: ['fase previa', 'clasificados', 'clasificado'],
      definition:
        'Un pequeño torneo antes del cuadro principal; los ganadores (clasificados) ocupan las últimas plazas en él.',
    },
    'group-stage': {
      term: 'Fase de grupos',
      aliases: ['fase de grupos', 'round robin'],
      definition:
        'En las ATP Finals y WTA Finals de final de temporada, los jugadores primero se enfrentan a todos los de su grupo de cuatro; los dos mejores de cada grupo pasan a semifinales.',
    },
    tiebreak: {
      term: 'Tie-break',
      aliases: ['tie-breaks', 'tie-break'],
      definition: 'Decide un set con 6–6 en juegos: gana el primero que llega a 7 puntos con 2 de ventaja.',
      details:
        'Los marcadores muestran en letra pequeña los puntos del perdedor en el tie-break, así que 7–6⁴ significa que el tie-break terminó 7–4.',
    },
    retirement: {
      term: 'Retirada',
      aliases: ['retiradas', 'retirada', 'abandono', 'abandona'],
      definition:
        'Un jugador abandona durante un partido, normalmente por lesión, y gana su rival. Se muestra como "ret" o "Retired".',
    },
    walkover: {
      term: 'Walkover',
      aliases: ['walkovers', 'walkover', 'w.o.'],
      definition: 'Un jugador renuncia antes de que empiece el partido, y su rival pasa sin jugar.',
    },
  },
}
