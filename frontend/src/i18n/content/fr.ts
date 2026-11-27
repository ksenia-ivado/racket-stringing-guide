import type { ContentOverlay } from '../types'

export const fr: ContentOverlay = {
  steps: {
    'gather-tools': {
      title: 'Rassemblez vos outils',
      summary: 'Ayez tout à portée de main avant de couper la moindre corde.',
      instructions: [
        'Une machine à corder avec ses supports de fixation et deux pinces (fixes ou volantes).',
        'Un jeu de cordes : environ {{12 m|40 ft}} pour un cordage en deux parties, ou un jeu hybride avec des montants et des travers séparés.',
        'Une pince coupante bien affûtée, ou une pince coupante affleurante.',
        'Une pince de départ, pour commencer les travers et serrer les nœuds.',
        'Une alène, pour dégager les œillets bouchés.',
        'Une pince à bec fin, pour serrer les nœuds.',
        'Un mètre ruban, et le plan de cordage de votre raquette (fourni par le fabricant ou une base de données de cordage).',
      ],
      tips: [
        'Notez le plan de cordage de la raquette, sa plage de tension et ses trous de nœud avant de commencer. Vous en aurez besoin en cours de route.',
        'Faites glisser la corde entre vos mains pour repérer d’éventuels défauts avant de commencer, surtout avec du boyau naturel. En découvrir un à mi-chemin, c’est tout le cordage de perdu.',
      ],
    },
    'remove-old-strings': {
      title: 'Coupez l’ancien cordage',
      summary: 'Relâchez la tension de façon uniforme pour que le cadre ne se déforme pas.',
      instructions: [
        'Commencez au centre du tamis et coupez vers l’extérieur en suivant un mouvement circulaire.',
        'Coupez un montant et un travers ensemble, à leur croisement, en progressant vers le cadre.',
        'Une fois la tension relâchée, retirez des œillets les morceaux de corde restants.',
      ],
      warnings: [
        'Ne coupez jamais seulement les montants ou seulement les travers. Un relâchement inégal soumet le cadre à des contraintes inégales et peut le déformer ou le fissurer.',
      ],
    },
    'inspect-frame': {
      title: 'Inspectez le cadre et les œillets',
      summary: 'Repérez les dégâts maintenant, tant qu’aucune corde ne gêne.',
      instructions: [
        'Examinez le cadre à la recherche de fissures, surtout autour du cœur et aux positions 10 h et 2 h.',
        'Vérifiez chaque œillet. Des œillets fendus, écrasés ou manquants couperont les cordes neuves.',
        'Remplacez une bande d’œillets abîmée avant de continuer.',
      ],
      warnings: [
        'Ne cordez pas un cadre fissuré. La tension aggravera la fissure et la raquette risque de casser pendant le cordage.',
      ],
    },
    'mount-racket': {
      title: 'Fixez la raquette',
      summary: 'Ferme sur les côtés, juste en contact à la tête et au cœur.',
      instructions: [
        'Placez d’abord le cœur. Il est alors plus facile de trouver le centre de la raquette.',
        'Fermez les supports du cœur, puis les supports de tête, pour qu’ils touchent juste le cadre.',
        'Serrez fermement les supports latéraux à 3 h et 9 h.',
        'Vérifiez que la raquette ne bouge pas quand vous appuyez dessus.',
      ],
      tips: [
        'Pourquoi des côtés fermes et des extrémités légères : corder les montants comprime le cadre, et les travers lui rendent sa forme. Les supports doivent laisser faire cela sans le déformer.',
        'Si votre machine a un réglage de vitesse, choisissez une traction plus lente pour le boyau naturel afin de le protéger, et plus rapide pour les cordes monofilaments comme le polyester.',
        'Si vos supports ont un patin de contact, centrez-le sur le cadre pour qu’il n’appuie pas sur un œillet.',
      ],
    },
    'measure-string': {
      title: 'Mesurez et coupez la corde',
      summary: 'Partagez le jeu en une longueur pour les montants et une pour les travers.',
      instructions: [
        'Pour un plan 16x19, mesurez environ {{6 m|20 ft}} pour les montants.',
        'Coupez le reste du jeu (environ {{6 m|20 ft}}) pour les travers.',
        'Coupez chaque extrémité en biseau marqué. Une extrémité pointue passe beaucoup plus facilement dans les œillets.',
      ],
      tips: [
        'Les plans plus denses comme le 18x20 demandent environ {{0.5 m|2 ft}} de plus pour chaque morceau. Vérifiez la recommandation du fabricant.',
      ],
    },
    'install-center-mains': {
      title: 'Installez les montants centraux',
      summary: 'Répartissez la corde des montants à parts égales dans les deux trous centraux.',
      instructions: [
        'Depuis le cœur, passez les deux extrémités de la corde des montants dans les deux trous centraux des montants, jusqu’à la tête.',
        'Tenez les deux extrémités ensemble pour vérifier qu’elles ont la même longueur.',
        'Placez un montant central dans la tête de tension et tirez la tension.',
        'Pincez-le près du cadre, puis relâchez la tête de tension.',
        'Recommencez pour l’autre montant central.',
      ],
      tips: [
        'Vérifiez le réglage de tension de la machine avant la première traction. La plupart des raquettes indiquent une plage comme {{23–27 kg|50–60 lb}} à l’intérieur du cœur.',
        'Réglez chaque pince sur la jauge de la corde pour qu’elle la tienne sans l’écraser.',
        'Avec le boyau naturel, laissez la corde tourner dans le sens qu’elle veut et suivez-la, plutôt que de la forcer.',
      ],
    },
    'string-mains': {
      title: 'Cordez les autres montants',
      summary: 'Trois de chaque côté pour rattraper, puis un à la fois, en alternant.',
      instructions: [
        'Passez une extrémité dans le trou de montant suivant de son côté, en passant par la tête ou le cœur.',
        'Tirez le mou, mettez en tension, pincez, puis relâchez la pince précédente.',
        'Cordez trois montants d’un côté, puis trois de l’autre, pour rattraper.',
        'Ensuite, avancez un montant à la fois en alternant les côtés, pour que le cadre se déforme le plus uniformément possible.',
        'Suivez votre plan pour les trous sautés à la tête et au cœur. Certains plans terminent les montants sur des trous différents de chaque côté.',
      ],
      tips: [
        'Maintenez la bande d’œillets contre le cadre au fur et à mesure. Cela protège la raquette et la corde, et devient vite une habitude.',
        'Gardez le cadre droit pour que chaque corde soit la plus courte possible. La tête de tension agit alors plus tôt, et le tamis est plus rigide.',
        'Tirez le mou à la main avant la mise en tension. La tête de tension doit seulement ajouter de la tension, pas entraîner la corde.',
      ],
      warnings: [
        'Ne laissez jamais une corde tendue sans pince. Relâcher la tête de tension avant que la pince soit en place fait perdre la tension et peut abîmer le cadre.',
      ],
    },
    'tie-off-mains': {
      title: 'Nouez les montants',
      summary: 'Fixez chaque extrémité par un nœud au trou de nœud prévu.',
      instructions: [
        'Faites sortir la dernière extrémité de montant par le trou de nœud indiqué dans votre plan.',
        'Verrouillez le plateau tournant pour que la raquette ne puisse pas bouger.',
        'Mettez le dernier montant en tension et pincez-le.',
        'Faites un nœud Parnell (ou une double demi-clé) autour de la corde d’ancrage, à côté de l’œillet.',
        'Serrez bien le nœud. Une pince de départ sur le brin remet de la tension, pour que la corde soit tendue aussi à l’extérieur du cadre ; une pince à bec fin convient aussi.',
        'Relâchez d’abord la base de pince, puis la pince.',
        'Recommencez de l’autre côté, puis coupez les brins à ras, à environ {{6 mm|¼ po}}.',
      ],
      tips: [
        'Ajoutez une tension supplémentaire au dernier montant avant de nouer, pour compenser ce que perd le nœud. Les conseils vont d’environ 10 % aux 20 % recommandés par HEAD.',
        'Avec le polyester et les autres monofilaments, aplatissez l’extrémité coupée avec le dos de la pince coupante pour qu’elle n’accroche pas un doigt. Le boyau naturel n’en a pas besoin.',
        'Laissez le bout du brin bien droit le long de la corde sur laquelle il est noué. Certains joueurs du circuit renvoient une raquette si les nœuds ne sont pas bien faits.',
      ],
    },
    'start-crosses': {
      title: 'Commencez les travers',
      summary: 'Commencez à la tête et tressez le premier travers.',
      instructions: [
        'Choisissez la tension des travers : la même que celle des montants, ou celle que votre raquette recommande pour les travers.',
        'Repérez le premier trou de travers près de la tête (vérifiez votre plan).',
        'Tenez le début de la corde avec une pince de départ à l’extérieur du cadre, ou faites un nœud de départ.',
        'Tressez la corde dans les montants : par-dessus l’un, par-dessous le suivant, sur toute la largeur.',
        'Tirez le mou et mettez le premier travers en tension.',
      ],
      tips: [
        'La pince de départ est le choix des professionnels : les deux extrémités des travers peuvent alors être finies par des nœuds Parnell, plus nets et plus doux pour la corde. Placez une protection entre la pince et le cadre pour ne pas le marquer.',
        'Certains cordeurs commencent au troisième travers en partant du haut et remontent d’abord jusqu’en haut, ce qui ménage un peu la corde.',
        'Si un nœud de départ repasse dans l’œillet, faites une boucle de plus pour l’épaissir.',
      ],
    },
    'string-crosses': {
      title: 'Tressez et tendez les travers',
      summary: 'Avancez de la tête vers le cœur, en alternant le tressage à chaque rangée.',
      instructions: [
        'Tressez le travers suivant dans le sens inverse : par-dessous là où le précédent passait par-dessus.',
        'Tirez le mou, mettez en tension, pincez, puis relâchez la pince précédente.',
        'Tressez un travers d’avance sur celui que vous mettez en tension, pour que les montants restent droits.',
        'Continuez jusqu’au dernier trou de travers au cœur. Les derniers travers sont les plus difficiles à tresser.',
      ],
      tips: [
        'Tenez chaque travers en U large sur le tamis pendant que vous tirez le mou. Le traîner tout droit sur les montants provoque une brûlure par friction, qui y creuse des encoches.',
        'Gardez chaque corde aussi droite que possible. Vous aurez moins à ajuster à la fin, et un tamis plus rigide et plus régulier.',
        'Il n’y a pas une seule bonne façon de tresser. Cela vaut la peine d’apprendre deux méthodes, car chaque corde et chaque raquette conviennent mieux à l’une ou à l’autre.',
        'Vérifiez le tressage après chaque rangée. Un seul dessus ou dessous oublié oblige à retresser tout ce qui suit.',
      ],
    },
    'tie-off-crosses': {
      title: 'Nouez les travers',
      summary: 'Terminez le dernier travers avec le même nœud que pour les montants.',
      instructions: [
        'Mettez le dernier travers en tension et pincez-le.',
        'Faites un nœud Parnell (ou une double demi-clé) autour du montant d’ancrage au trou de nœud, et serrez-le bien.',
        'Si vous avez commencé les travers avec une pince de départ, nouez aussi l’extrémité de départ, à la tête, avec un nœud Parnell, puis mettez-la en tension.',
        'Relâchez d’abord la base de pince, puis la pince, et coupez les brins à ras.',
      ],
    },
    finish: {
      title: 'Relâchez et terminez',
      summary: 'Retirez la raquette de la machine et vérifiez votre travail.',
      instructions: [
        'Relâchez les pinces, puis desserrez les supports latéraux, de tête et du cœur.',
        'Retirez la raquette de la machine. Elle doit sortir aussi facilement qu’elle est entrée : cela veut dire que le cadre a gardé sa forme.',
        'Redressez les montants et les travers avec les doigts pour que le tamis soit bien d’équerre.',
        'Vérifiez que chaque œillet tient la corde proprement et qu’aucun nœud n’est desserré.',
        'Notez quelque part la date, la corde et la tension (une étiquette dans le cœur fait l’affaire) pour savoir quand recorder.',
      ],
      tips: ['Les cordes neuves perdent 10 à 15 % de leur tension dans les 24 premières heures. C’est normal.'],
    },
  },

  techniques: {
    'double-half-hitch': {
      title: 'Double demi-clé',
      summary: 'Le nœud de finition le plus courant : deux demi-clés autour de la corde d’ancrage.',
      instructions: [
        'Faites sortir la corde par le trou de nœud, en laissant environ {{20 cm|8 po}} de brin.',
        'Repérez l’ancrage : la corde qui longe déjà l’extérieur du cadre à côté du trou.',
        'Passez le brin sous l’ancrage puis par-dessus, et ensuite dans la boucle que vous venez de former. Voilà une demi-clé.',
        'Faites une seconde demi-clé de la même façon, sur le même ancrage, juste à côté de la première.',
        'Serrez le nœud contre le cadre avec une pince à bec fin, puis coupez le brin à environ {{6 mm|¼ po}}.',
      ],
      tips: ['Gardez la corde en tension pendant que vous nouez. Un nœud lâche laisse la dernière corde se détendre.'],
      aliases: ['double demi-clé', 'doubles demi-clés'],
    },
    'parnell-knot': {
      title: 'Nœud Parnell',
      summary:
        'Un nœud de finition compact, mis au point par le maître cordeur Richard Parnell, qui protège la corde d’ancrage.',
      instructions: [
        'Verrouillez le plateau tournant pour que la raquette ne puisse pas bouger.',
        'Faites sortir la corde par le trou de nœud et passez-la autour de la corde d’ancrage.',
        'Faites une demi-clé autour de l’ancrage, mais laissez une petite boucle au lieu de la serrer.',
        'Faites une seconde demi-clé dans cette boucle : de nouveau autour de l’ancrage, puis remontez dans la boucle par en dessous.',
        'Serrez-le avec une pince de départ sur le brin, pour que la corde soit tendue aussi à l’extérieur du cadre. Relâchez d’abord la base de pince, puis la pince.',
        'Coupez le brin à ras. Avec le polyester, aplatissez l’extrémité avec le dos de la pince coupante ; le boyau naturel n’en a pas besoin.',
      ],
      tips: [
        'L’essentiel est que l’extrémité finisse dans la première boucle que vous avez faite. Si c’est le cas, le nœud tient.',
        'Laissez le bout du brin bien droit le long de la corde sur laquelle il est noué, pour que tous les nœuds se ressemblent.',
        'HEAD le présente comme l’un des deux nœuds les plus utilisés dans le cordage professionnel, et l’un des deux nœuds officiels à Wimbledon. Pour les gestes exacts, regardez Richard Parnell le faire lui-même.',
      ],
      aliases: ['nœud parnell', 'nœuds parnell'],
    },
    'starting-knot': {
      title: 'Nœud de départ',
      summary: 'Un nœud épais au début des travers, qui ne peut pas repasser dans l’œillet.',
      instructions: [
        'Faites sortir le début de la corde des travers par le premier trou de travers, en laissant environ {{20 cm|8 po}} de brin.',
        'Enroulez l’extrémité deux fois autour du montant voisin, en gardant les boucles ouvertes avec un doigt.',
        'Repassez l’extrémité dans la double boucle.',
        'Serrez des deux côtés pour que le nœud soit aussi compact et épais que possible. La mise en tension du premier travers le serre encore plus.',
        'Coupez le brin à environ {{6 mm|¼ po}}.',
      ],
      tips: [
        'Avec des cordes glissantes ou de grands trous d’œillet, faites une boucle de plus pour l’épaissir.',
        'Ou passez-vous du nœud : tenez le premier travers avec une pince de départ, tendez quelques travers, puis faites un nœud de finition normal au départ. HEAD le recommande, pour que chaque nœud puisse être un nœud Parnell.',
      ],
      aliases: ['nœud de départ', 'nœuds de départ'],
    },
    'weave-one-ahead': {
      title: 'Tresser un travers d’avance',
      summary: 'Tressez le travers suivant avant de tendre le travers en cours.',
      instructions: [
        'Tressez le travers suivant dans le sens inverse du précédent, en laissant une boucle assez longue pour la mise en tension.',
        'Ensuite seulement, tendez le travers précédent, pincez-le et relâchez la pince d’avant.',
        'Recommencez : il y a toujours un travers tressé mais pas encore tendu devant celui que vous tirez.',
      ],
      tips: ['Cela réduit la friction entre les cordes et rend les travers plus faciles à tresser.'],
      aliases: ['tresser un travers d’avance', 'un travers d’avance'],
    },
    'pull-slack': {
      title: 'Tirer le mou en U large',
      summary: 'Tirez chaque travers sans le traîner sur les montants.',
      instructions: [
        'Après avoir tressé un travers, poussez-le en un U large sur le tamis avec votre autre main.',
        'Maintenez-le ainsi pendant que vous tirez le mou.',
        'Ensuite seulement, placez-le dans la tête de tension, qui doit ajouter de la tension, pas entraîner la corde.',
      ],
      tips: [
        'Traîner un travers tout droit sur les montants provoque une brûlure par friction : elle creuse des encoches dans les montants et raccourcit la durée de vie du cordage.',
        'Avec un polyester rigide, un morceau de ruban adhésif sur le bout du doigt qui tient le U protège votre peau.',
      ],
      aliases: ['u large'],
    },
    'tie-off-tension': {
      title: 'Tension supplémentaire au nœud',
      summary: 'Ajoutez un peu de tension à la dernière corde avant de la nouer.',
      instructions: [
        'Quand vous arrivez au dernier montant ou au dernier travers, augmentez la tension. Environ 10 % est courant : à {{25 kg|55 lb}}, cela fait environ {{27.5 kg|60 lb}}.',
        'Tendez et pincez la corde comme d’habitude.',
        'Nouez-la avec un nœud Parnell ou une double demi-clé, en utilisant une pince de départ pour serrer le nœud.',
      ],
      tips: [
        'Les nœuds perdent un peu de tension en se mettant en place, et ce supplément compense cette perte. Les avis varient : HEAD recommande 20 %, pour que les dernières cordes soient aussi tendues que possible.',
      ],
      aliases: ['tension supplémentaire'],
    },
  },

  tools: {
    'stringing-machine': {
      name: 'Machine à corder',
      aliases: ['machine à corder', 'machines à corder', 'machine', 'machines'],
      summary: 'Maintient la raquette immobile et tire chaque corde à une tension précise.',
      details: [
        'Toute machine a trois parties : des supports de fixation qui tiennent le cadre, des pinces qui maintiennent les cordes en tension, et une tête de tension qui tire.',
        'Les machines diffèrent surtout par leur façon de tirer. Une machine à poids utilise une barre lestée que vous mettez à niveau à la main. Une machine à manivelle (à blocage) tire avec un ressort et se bloque une fois la tension atteinte. Une machine électronique à traction constante continue de tirer pendant que la corde s’étire, ce qui est le plus régulier.',
        'La raquette repose sur un plateau tournant, que vous faites pivoter pour atteindre chaque corde. Verrouillez le plateau tournant pendant que vous faites les nœuds.',
        'Beaucoup de machines permettent de régler la vitesse de traction : plus lente pour le boyau naturel, afin de le protéger, et plus rapide pour les monofilaments comme le polyester.',
      ],
      tips: ['Vérifiez le réglage de tension avant chaque cordage. C’est l’erreur la plus facile à faire.'],
    },
    'tension-head': {
      name: 'Tête de tension',
      aliases: ['tête de tension', 'têtes de tension'],
      summary: 'La partie de la machine qui saisit une corde et la tire à la tension voulue.',
      details: [
        'Vous placez la corde dans son mors, vous tirez la tension, vous pincez la corde, puis vous relâchez la tête de tension.',
        'Elle doit seulement ajouter de la tension. Tirez d’abord le mou à la main, pour que la tête de tension n’entraîne pas la corde sur les montants.',
      ],
    },
    'mounting-supports': {
      name: 'Supports de fixation',
      aliases: [
        'supports de fixation',
        'support de fixation',
        'supports',
        'supports latéraux',
        'supports de tête',
        'supports du cœur',
      ],
      summary: 'Tiennent le cadre à la tête, au cœur et sur les côtés pour qu’il garde sa forme sous tension.',
      details: [
        'Les systèmes à deux points tiennent la tête et le cœur ; les systèmes à six points ajoutent des supports sur les côtés. Plus il y a de points, plus la charge est répartie uniformément sur le cadre.',
        'Fixez d’abord le cœur, puis la tête. Les supports de tête et du cœur doivent juste toucher le cadre ; les supports latéraux doivent être fermes.',
        'Corder les montants comprime le cadre et les travers lui rendent sa forme : les supports doivent donc le tenir sans le déformer.',
      ],
      tips: ['À la fin, la raquette doit sortir aussi facilement qu’elle est entrée. Si c’est le cas, le cadre a gardé sa forme.'],
    },
    clamps: {
      name: 'Pinces',
      aliases: ['pinces', 'pince', 'pinces fixes', 'pince fixe', 'pinces volantes', 'pince volante'],
      summary: 'Maintiennent une corde en tension une fois que la tête de tension l’a lâchée.',
      details: [
        'Les pinces fixes sont montées sur la machine et se serrent sur une seule corde. Les pinces volantes ne sont fixées à rien et tiennent ensemble deux cordes voisines.',
        'Pincez près du cadre. Plus la pince est loin du cadre, plus la perte de tension est grande quand elle relâche.',
        'Réglez la pince sur la jauge de la corde pour qu’elle la tienne sans l’écraser.',
      ],
      tips: [
        'Ne relâchez jamais la tête de tension avant que la pince soit en place.',
        'Au moment de lâcher, relâchez d’abord la base de pince, puis la pince.',
      ],
    },
    'starting-clamp': {
      name: 'Pince de départ',
      aliases: ['pince de départ', 'pinces de départ'],
      summary: 'Une petite pince indépendante qui tient une corde à l’extérieur du cadre.',
      details: [
        'Elle sert à commencer les travers sans nœud de départ, à doubler une pince qui glisse, et à tenir la dernière corde pendant que vous la nouez.',
        'Elle sert aussi à serrer un nœud : fixez-la sur le brin et remettez de la tension, pour que la corde soit tendue aussi à l’extérieur du cadre.',
      ],
      tips: [
        'Placez une protection entre la pince et le cadre, surtout sur une raquette neuve, pour que le métal ne le marque pas.',
      ],
    },
    awl: {
      name: 'Alène',
      aliases: ['alène', 'alènes'],
      summary: 'Un outil pointu pour dégager les œillets bouchés et faire de la place à une corde.',
      details: [
        'Enfoncez-la doucement dans un trou d’œillet qui contient déjà une corde, pour faire de la place à la seconde.',
        'Pratique aussi pour soulever un montant quand un travers serré est difficile à tresser.',
      ],
      tips: ['Allez-y doucement. Forcer avec une alène peut fendre un œillet ou entailler une corde.'],
    },
    cutters: {
      name: 'Pince coupante',
      aliases: ['pince coupante', 'pinces coupantes', 'pince coupante affleurante', 'pinces coupantes affleurantes'],
      summary: 'Une pince bien affûtée pour couper la corde à longueur et rogner les nœuds.',
      details: [
        'Coupez chaque extrémité en biseau marqué pour qu’elle passe dans les œillets.',
        'Une pince coupante affleurante coupe les brins des nœuds à ras et proprement.',
        'Avec le polyester et les autres monofilaments, aplatissez l’extrémité coupée avec le dos de la pince coupante pour qu’elle n’accroche pas un doigt.',
      ],
    },
    pliers: {
      name: 'Pince à bec fin',
      aliases: ['pince à bec fin', 'pinces à bec fin'],
      summary: 'Pour serrer les nœuds et saisir la corde dans les endroits étroits.',
      details: ['Saisissez le brin du nœud, pas la corde que vous gardez, pour ne pas l’écraser.'],
    },
    'tape-measure': {
      name: 'Mètre ruban',
      aliases: ['mètre ruban'],
      summary: 'Pour mesurer les montants et les travers avant de couper.',
      details: ['Mesurez deux fois. Un morceau trop court ne se rattrape pas.'],
    },
    'string-set': {
      name: 'Jeux de cordes et bobines',
      aliases: ['jeu de cordes', 'jeux de cordes', 'bobine', 'bobines'],
      summary: 'Les cordes se vendent en jeu individuel pour une raquette, ou en bobine pour plusieurs.',
      details: [
        'Un jeu fait environ {{12 m|40 ft}}, de quoi corder une raquette. Les bobines (souvent {{200 m|660 ft}}) reviennent moins cher par cordage si vous cordez souvent.',
        'Un jeu hybride comporte une corde différente pour les montants et pour les travers.',
      ],
    },
  },

  glossary: {
    /* ---------- Raquette ---------- */
    frame: {
      term: 'Cadre',
      aliases: ['cadre', 'cadres'],
      definition: 'La raquette elle-même, sans cordes : tête, cœur et manche.',
    },
    head: {
      term: 'Tête',
      aliases: ['tête', 'têtes'],
      definition: 'La partie ovale du cadre qui porte les cordes. Son extrémité supérieure s’appelle aussi la tête.',
    },
    throat: {
      term: 'Cœur',
      aliases: ['cœur'],
      definition: 'L’endroit où la tête rejoint le manche ; l’extrémité inférieure du tamis.',
    },
    grommets: {
      term: 'Œillets',
      aliases: ['œillets', 'œillet', 'bande d’œillets', 'bandes d’œillets', 'trous d’œillet', 'trou d’œillet'],
      definition: 'Manchons en plastique placés dans les trous du cadre, qui protègent les cordes des arêtes du cadre.',
      details:
        'Des œillets fendus, écrasés ou manquants coupent les cordes neuves : remplacez une bande d’œillets usée avant de corder.',
    },
    'tie-off-hole': {
      term: 'Trou de nœud',
      aliases: ['trou de nœud', 'trous de nœud'],
      definition: 'Un trou prévu par le fabricant pour terminer une corde par un nœud.',
      details:
        'Les trous de nœud sont en général assez grands pour accueillir un nœud et une seconde corde. Consultez les instructions de cordage de la raquette.',
    },

    /* ---------- Cordes ---------- */
    mains: {
      term: 'Montants',
      aliases: ['montants', 'montant'],
      definition: 'Les cordes qui suivent la longueur de la raquette, de la tête au cœur. On les corde en premier.',
    },
    crosses: {
      term: 'Travers',
      aliases: ['travers'],
      definition: 'Les cordes qui traversent la raquette, tressées par-dessus et par-dessous les montants.',
    },
    'string-bed': {
      term: 'Tamis',
      aliases: ['tamis'],
      definition: 'L’ensemble des cordes : la surface de frappe.',
    },
    'string-pattern': {
      term: 'Plan de cordage',
      aliases: ['plan de cordage', 'plans de cordage', '16x19', '18x20'],
      definition: 'Le nombre de montants et de travers. 16x19 signifie 16 montants et 19 travers.',
      details:
        'Les plans ouverts (moins de cordes, comme 16x19) donnent plus d’effet et de toucher ; les plans denses (comme 18x20) donnent plus de contrôle et font durer les cordes plus longtemps. Les plans plus denses demandent aussi un peu plus de corde.',
    },
    anchor: {
      term: 'Corde d’ancrage',
      aliases: ['corde d’ancrage', 'montant d’ancrage', 'ancrage'],
      definition:
        'La corde qui longe déjà l’extérieur du cadre à côté d’un trou de nœud ; on fait les nœuds autour d’elle.',
    },
    gauge: {
      term: 'Jauge',
      aliases: ['jauge'],
      definition:
        'L’épaisseur de la corde. Plus le numéro est élevé, plus la corde est fine : une corde de jauge 17 (environ 1,25 mm) est plus fine qu’une 16 (environ 1,30 mm).',
      details: 'Les cordes plus fines donnent plus de toucher et d’effet, mais cassent plus vite.',
    },
    tension: {
      term: 'Tension',
      aliases: ['tension'],
      definition: 'La force avec laquelle chaque corde est tirée, réglée sur la machine en livres ou en kilogrammes.',
      details:
        'Une tension plus basse donne plus de puissance et un toucher plus souple ; une tension plus élevée donne plus de contrôle. La plupart des raquettes indiquent une plage recommandée à l’intérieur du cœur, par exemple {{23–27 kg|50–60 lb}}.',
    },
    'tension-loss': {
      term: 'Perte de tension',
      aliases: ['perte de tension', 'pertes de tension', 'perd de la tension', 'perdent de la tension', 'perdre de la tension'],
      definition:
        'Les cordes se relâchent après le cordage, si bien que le tamis est toujours un peu moins tendu que le réglage de la machine.',
      details: 'L’essentiel de la perte se produit le premier jour. Les nœuds et un pinçage trop lent en font perdre un peu plus.',
    },
    polyester: {
      term: 'Polyester',
      aliases: ['polyester', 'poly'],
      definition:
        'Une corde rigide et durable, appréciée pour l’effet. Elle perd de la tension plus vite et sollicite davantage le bras.',
    },
    multifilament: {
      term: 'Multifilament',
      aliases: ['multifilament', 'multifilaments'],
      definition:
        'Une corde souple faite de nombreuses fibres fines, plus proche du boyau naturel au toucher et plus douce pour le bras.',
    },
    'synthetic-gut': {
      term: 'Boyau synthétique',
      aliases: ['boyau synthétique'],
      definition: 'Une corde en nylon polyvalente et bon marché. Malgré son nom, elle ne contient pas de boyau.',
    },
    'natural-gut': {
      term: 'Boyau naturel',
      aliases: ['boyau naturel'],
      definition:
        'La corde d’origine, faite d’intestin animal. La plus élastique et celle qui tient le mieux la tension, mais chère et sensible à l’humidité.',
      details:
        'Vérifiez qu’elle n’a pas de défauts avant de commencer, cordez-la à vitesse réduite et laissez-la tourner dans le sens qu’elle veut.',
    },
    hybrid: {
      term: 'Hybride',
      aliases: ['hybride', 'hybrides', 'jeu hybride'],
      definition:
        'Des cordes différentes dans les montants et les travers, par exemple des montants en polyester avec des travers en boyau naturel.',
      details: 'Un hybride se corde toujours en deux parties.',
    },
    monofilament: {
      term: 'Monofilament',
      aliases: ['monofilament', 'monofilaments'],
      definition:
        'Une corde à âme unique et pleine, comme le polyester. Ses extrémités coupées peuvent être tranchantes : aplatissez-les après la coupe.',
    },
    'string-bed-stiffness': {
      term: 'Rigidité du tamis',
      aliases: ['rigidité du tamis', 'plus rigide'],
      definition:
        'La fermeté ressentie de la raquette cordée. Des cordes droites et des longueurs tirées courtes la maintiennent élevée, ce qui donne plus de contrôle.',
    },

    /* ---------- Cordage ---------- */
    turntable: {
      term: 'Plateau tournant',
      aliases: ['plateau tournant'],
      definition:
        'La partie de la machine sur laquelle la raquette est fixée. Il pivote pour vous permettre d’atteindre chaque corde ; verrouillez-le pendant que vous faites les nœuds.',
    },
    'clamp-base': {
      term: 'Base de pince',
      aliases: ['base de pince', 'bases de pince'],
      definition:
        'Ce qui maintient une pince fixe en place sur la machine. Pour lâcher une corde, relâchez d’abord la base, puis la pince.',
    },
    'two-piece': {
      term: 'Cordage en deux parties',
      aliases: ['en deux parties'],
      definition:
        'Les montants et les travers sont cordés avec deux longueurs de corde séparées, avec quatre nœuds au total. C’est la méthode de ce guide.',
    },
    'one-piece': {
      term: 'Cordage en une partie',
      aliases: ['en une partie', 'around the world', 'ATW'],
      definition:
        'Montants et travers cordés avec une seule longueur de corde. « Around the world » (ATW) est une méthode en une partie très répandue.',
    },
    weave: {
      term: 'Tressage',
      aliases: ['tressage', 'tresser', 'tressez', 'tressé', 'tressée', 'tressés', 'tressées'],
      definition:
        'Faire passer un travers par-dessus un montant et par-dessous le suivant, en alternant, chaque travers étant l’inverse du précédent.',
      details: 'Un seul dessus ou dessous oublié oblige à retresser tout ce qui suit : vérifiez chaque rangée.',
    },
    'skipped-holes': {
      term: 'Trous sautés',
      aliases: ['trous sautés', 'trou sauté'],
      definition: 'Des trous de la tête ou du cœur que les montants ne prennent pas, selon le plan de cordage.',
    },
    'tie-off': {
      term: 'Nouer',
      aliases: ['nouer', 'nouez', 'noué', 'nouée', 'nœud de finition', 'nœuds de finition'],
      definition: 'Terminer une corde par un nœud autour de la corde d’ancrage, à un trou de nœud.',
    },
    'half-hitch': {
      term: 'Demi-clé',
      aliases: ['demi-clé', 'demi-clés'],
      definition: 'La boucle de base de la plupart des nœuds de finition : autour de l’ancrage, puis dans elle-même.',
    },
    'friction-burn': {
      term: 'Brûlure par friction',
      aliases: ['brûlure par friction', 'brûlures par friction', 'brûlure de corde'],
      definition: 'Dégâts dus à la chaleur et encoches sur les montants, causés par un travers traîné trop vite dessus.',
    },
    notching: {
      term: 'Encoches',
      aliases: ['encoches', 'encoche'],
      definition:
        'Des sillons creusés dans les montants là où les travers frottent, à cause du jeu ou d’une brûlure par friction.',
    },
    'constant-pull': {
      term: 'Traction constante',
      aliases: ['traction constante', 'blocage'],
      definition:
        'Une tête de tension qui continue de tirer pendant que la corde s’étire, contrairement à une tête à blocage, qui s’arrête une fois la tension atteinte.',
    },
    'drop-weight': {
      term: 'À poids',
      aliases: ['à poids'],
      definition:
        'Un mécanisme de tension basique : un poids sur une barre, que vous mettez à niveau à la main pour régler la tension.',
    },

    /* ---------- Matchs ---------- */
    singles: {
      term: 'Simple',
      aliases: ['simple', 'simples'],
      definition:
        'Un joueur de chaque côté. La page de tennis en direct n’affiche que le simple messieurs et le simple dames.',
    },
    atp: {
      term: 'ATP',
      aliases: ['ATP'],
      definition: 'Le circuit professionnel masculin (Association of Tennis Professionals).',
    },
    wta: {
      term: 'WTA',
      aliases: ['WTA'],
      definition: 'Le circuit professionnel féminin (Women’s Tennis Association).',
    },
    'grand-slam': {
      term: 'Grand Chelem',
      aliases: ['tournois du grand chelem', 'grands chelems', 'grand chelem'],
      definition: 'Les quatre plus grands tournois : l’Australian Open, Roland Garros, Wimbledon et l’US Open.',
      details:
        'Les hommes y jouent au meilleur des cinq sets. Ce sont des tournois mixtes, avec les tableaux masculin et féminin en même temps.',
    },
    draw: {
      term: 'Tableau',
      aliases: ['tableau principal', 'tableaux', 'tableau'],
      definition:
        'La grille qui indique qui joue contre qui. Le tableau principal est le tournoi proprement dit ; les qualifications ont lieu avant.',
    },
    seed: {
      term: 'Tête de série',
      aliases: ['tête de série', 'têtes de série'],
      definition:
        'Un joueur bien classé, placé dans le tableau de façon à ne pas croiser trop tôt les autres têtes de série. Indiqué par un numéro entre parenthèses, comme (1).',
    },
    qualifying: {
      term: 'Qualifications',
      aliases: ['qualifications', 'qualifiés', 'qualifié'],
      definition:
        'Un court tournoi avant le tableau principal ; les vainqueurs (les qualifiés) prennent les dernières places de celui-ci.',
    },
    'group-stage': {
      term: 'Phase de groupes',
      aliases: ['phase de groupes', 'round robin'],
      definition:
        'Aux Finales ATP et WTA de fin de saison, les joueurs affrontent d’abord tous les autres membres d’un groupe de quatre ; les deux meilleurs de chaque groupe accèdent aux demi-finales.',
    },
    tiebreak: {
      term: 'Jeu décisif',
      aliases: ['jeu décisif', 'jeux décisifs', 'tie-break', 'tie-breaks'],
      definition: 'Départage un set à 6 jeux partout (6–6) : le premier à 7 points l’emporte, avec 2 points d’écart.',
      details:
        'Les scores affichent en petit les points du perdant au jeu décisif : 7–6⁴ signifie que le jeu décisif s’est terminé 7–4.',
    },
    retirement: {
      term: 'Abandon',
      aliases: ['abandon', 'abandons', 'abandonne', 'abandonné'],
      definition:
        'Un joueur s’arrête en cours de match, généralement sur blessure, et son adversaire l’emporte. Indiqué par « ret » ou « Retired ».',
    },
    walkover: {
      term: 'Forfait',
      aliases: ['forfait', 'forfaits'],
      definition: 'Un joueur se retire avant le début du match, et son adversaire passe au tour suivant sans jouer.',
    },
  },
}
