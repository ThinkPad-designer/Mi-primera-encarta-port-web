// Original artwork and category order. Topic-to-activity associations are
// reconstructed for the recovered IAX collection, not decoded AKC associations.
export type Topic = {
  title: string;
  icon: string;
  terms: string;
  games?: boolean;
};
export type Theme = {
  title: string;
  button: string;
  background: string;
  topics: Topic[];
};
const topic = (
  title: string,
  icon: string,
  terms: string,
  games = false,
): Topic => ({ title, icon, terms, games });
export const themes: Theme[] = [
  {
    title: 'Paisajes y regiones',
    button: '0015af80',
    background: '0015afa4',
    topics: [
      topic(
        'El mundo',
        '00127047',
        'map|pais|region|world|geogra|contin|america|europa|asia|africa',
      ),
      topic(
        'Paisajes',
        '0015af14',
        'desierto|montana|alpes|rio|lago|costa|paisaje|canon|bosque|tierra',
      ),
      topic(
        'Lugares del mundo',
        '00127033',
        'plaza|ciudad|pueblo|palacio|monasterio|museo|puerto|coliseo|tulum|machu|lugar|tour|panorama',
      ),
      topic(
        'El tiempo y el clima',
        '0015af18',
        'clima|monzon|nube|precipita|orograf|invernadero|agua',
      ),
      topic(
        'El rincón del juego',
        '0015a8ce',
        'map|puzzle|rompecabezas|geogra|contin|globo',
        true,
      ),
    ],
  },
  {
    title: 'Los seres vivos',
    button: '0015af84',
    background: '0015afa6',
    topics: [
      topic('La vida', '00127007', 'celula|vida|reprodu|germina'),
      topic(
        'El cuerpo humano',
        '0012704b',
        'cuerpo|body|encefalo|corazon|cardi|musculo|digest|embarazo',
      ),
      topic('Microorganismos', '0015af20', 'virus|micro|bacter|celula'),
      topic(
        'Plantas',
        '00127053',
        'planta|flor|helecho|musgo|germina|alcorno|fruta',
      ),
      topic(
        'Animales',
        '00127003',
        'animal|ave|mamifero|reptil|anfibio|peces|insect|arana|serpiente|mariposa|esponja|equinodermo|pinguino|hormiga',
      ),
      topic('Antiguos seres vivos', '00127011', 'dinosaur|hielo|geologic'),
      topic(
        'Naturaleza en acción',
        '00126ffd',
        'ecosistema|biotopo|suelo|naturaleza|germin|red|hormig',
      ),
      topic(
        'El rincón del juego',
        '0015a8ce',
        'animal|body|cuerpo|dinosaur|alimento|digest|flor|fruta',
        true,
      ),
    ],
  },
  {
    title: 'Ciencia y técnica',
    button: '0015af88',
    background: '0015afa8',
    topics: [
      topic(
        'El universo',
        '00127051',
        'universo|solar|planeta|satelite|eclipse|orbita',
      ),
      topic(
        'La materia y la energía',
        '00127045',
        'energia|luz|color|materia|roca',
      ),
      topic(
        'Máquinas e inventos',
        '00127049',
        'maquina|palanca|polea|camara|invento|impresion|herramienta',
      ),
      topic('Los transportes', '0015af28', 'transporte|tren|barco|avion'),
      topic(
        'El rincón del juego',
        '0015a8ce',
        'energia|solar|herramienta|roca|recicl|transporte',
        true,
      ),
    ],
  },
  {
    title: 'Matemáticas',
    button: '0015af8c',
    background: '0015afaa',
    topics: [
      topic(
        'Números y operaciones',
        '0015af34',
        'suma|resta|multiplica|division|numero',
      ),
      topic(
        'Geometría',
        '0015af38',
        'poligono|poliedro|prisma|piramide|geometr',
      ),
      topic('Medidas', '0015af40', 'reloj|medida'),
      topic(
        'El rincón del juego',
        '0015a8ce',
        'suma|resta|multiplica|division|poligono|reloj',
        true,
      ),
    ],
  },
  {
    title: 'Deportes',
    button: '0015af90',
    background: '0015afac',
    topics: [
      topic('El mundo del deporte', '0012705b', 'deport|maraton|sport|estadio'),
      topic('El rincón del juego', '0015a8ce', 'deport|sport', true),
    ],
  },
  {
    title: 'Historia',
    button: '0015af94',
    background: '0015afae',
    topics: [
      topic(
        'La Antigüedad',
        '00127013',
        'maya|azteca|inca|romana|romano|piramide|magno|grecia|grieg|antigua',
      ),
      topic(
        'La Edad Media',
        '0015af48',
        'medieval|monasterio|romanica|visigodo|muralla',
      ),
      topic('Tiempos modernos', '0015af44', 'colon|industrial|luis|moderna'),
      topic('Personajes de la historia', '0015af5c', 'personaje|magno|colon'),
      topic('El rincón del juego', '0015a8ce', 'historia|personaje', true),
    ],
  },
  {
    title: 'Nuestra sociedad',
    button: '0015af98',
    background: '0015afb0',
    topics: [
      topic(
        'La vida en sociedad',
        '0015af50',
        'sociedad|ropa|moda|recicl|alimento|transporte',
      ),
      topic(
        'Pueblos y culturas',
        '0012702f',
        'masai|pueblo|idioma|cultura|lengua',
      ),
      topic('Las religiones', '00127021', 'bautismo|jesus|dios|santa|vaticano'),
      topic(
        'El rincón del juego',
        '0015a8ce',
        'ropa|moda|recicl|alimento|transporte|idioma',
        true,
      ),
    ],
  },
  {
    title: 'Lengua y literatura',
    button: '0015af9c',
    background: '0015afb2',
    topics: [
      topic(
        'El lenguaje',
        '00127041',
        'lengua|idioma|espanol|alfabeto|escritura',
      ),
      topic(
        'Gramática',
        '0015af6c',
        'oracion|sintagma|verbo|pronombre|adverbio|sustantivo|superlativo|perifrasis|demostrativo',
      ),
      topic(
        'Leer y escribir',
        '0015af70',
        'escribir|carta|dictado|puntuacion|acent|descripcion|homofon|antonimo',
      ),
      topic('La literatura', '0015af74', 'escritor|literatura'),
      topic(
        'El rincón del juego',
        '0015a8ce',
        'palabra|verbo|pronombre|dictado|puntuacion|carta|escritor|sustantivo|adverbio',
        true,
      ),
    ],
  },
  {
    title: 'Las artes',
    button: '0015afa0',
    background: '0015afb4',
    topics: [
      topic(
        'Pintura y escultura',
        '0012705f',
        'pintura|pintando|paris|escultura|moais',
      ),
      topic(
        'Arquitectura',
        '0012705d',
        'arquitectura|edificio|rascacielos|catedral|palacio',
      ),
      topic('La música', '0015af7c', 'musica|compositor|orquesta'),
      topic('El cine y el teatro', '001602b6', 'monstruo|cine|teatro'),
      topic(
        'El rincón del juego',
        '0015a8ce',
        'pintura|compositor|musica|arquitectura|edificio',
        true,
      ),
    ],
  },
  {
    title: 'Juega y aprende',
    button: '001607f2',
    background: '001607f0',
    topics: [
      topic(
        'Juegos con arte',
        '0012705f',
        'pintura|musica|compositor|arquitectura|edificio',
        true,
      ),
      topic(
        'Juega con las ciencias',
        '00127045',
        'animal|body|cuerpo|dinosaur|energia|solar|flor|fruta|roca',
        true,
      ),
      topic(
        'Juega con la Geografía',
        '00127047',
        'rompecabezas|puzzle|contin|geogra|globo|africa',
        true,
      ),
      topic(
        'Juega con las matemáticas',
        '0015af34',
        'suma|resta|division|multiplica|reloj|poligono',
        true,
      ),
      topic(
        'Juega con las palabras',
        '0015af70',
        'palabra|verbo|pronombre|dictado|escritor|puntuacion|sustantivo|oracion|adverbio|carta',
        true,
      ),
      topic('Todos los juegos', '0015a8e2', '.', true),
    ],
  },
];
export const normalize = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
