# Estado del port

Inspección local de la ISO suministrada; sesión iniciada el 11 de septiembre de 2026.

## Datos comprobados

- ISO: 2 239 125 504 bytes, Encarta Premium 2009 en español, con `EE/KIDS`.
- EIT: firma `ITOLITLS`; 7-Zip los reconoce como Hxs y permite extraer sus recursos.
- Catálogo: 228 definiciones IAX recuperadas; 74 juegos. No se afirma que todas hayan sido probadas.
- Tipos: 148 SlideShowControl, 46 DragDrop, 23 MatchGame, 5 BGAControl, 5 CrossFadeControl y 1 ZFLControl.
- Se recuperaron los reproductores originales, skins, imágenes y bancos de preguntas de los paquetes de Kids.
- AKC: firma ` CKA`, cabecera, etiqueta XML UTF-16 y datos binarios que no se han descodificado. No se han extraído los artículos completos.

## Adaptación realizada

- React y Vite producen un sitio estático con `base: './'`.
- Ruffle 0.6.0 se sirve localmente, sin depender de un CDN.
- El SWF `base.swf` y su ActionScript permanecen originales. Se pasa `filePath` con la codificación `/` → `@`, `:` → `~` que usa la plantilla de Encarta.
- Las IAX se sitúan junto a sus medios para conservar la resolución relativa del runtime.
- Se normalizan las rutas a minúsculas y se generan reglas de URL para conservar la semántica de las rutas de Windows en un servidor sensible a mayúsculas.
- El reproductor usa dimensiones nativas y escalado CSS; no se ejecutan ActiveX ni archivos EXE.
- El lector presenta textos e imágenes de las IAX. No reproduce todas las animaciones ni sustituye a los artículos AKC.

## Pruebas en navegador

En Brave, con la vista local:

| Prueba | Resultado observado |
|---|---|
| `001025be`, Partes del encéfalo | Imagen original y etiquetas visibles; pulsar Cerebro cambia la explicación. |
| `001245c2`, rompecabezas de Norteamérica | Tablero y piezas originales; arrastrar piezas modifica intentos, aciertos y mapa. |
| `00174d64`, preguntas sobre el cuerpo humano | Nivel 1 y casilla abren pregunta original; responder muestra la confirmación verde. |
| Buscar `ecosistema` | Un resultado: Ecosistema. |
| Lector de Ecosistema | Imagen y texto originales; cambiar a Biocenosis actualiza la ficha. |
| Ecosistema original, CrossFadeControl | Imagen, texto y controles originales cargan desde `/encarta/`. |
| Tipos de oraciones, ZFLControl | Diagrama original y controles de zoom visibles desde `/encarta/`; interacción no comprobada. |
| El reloj, MatchGame | Corregido: piezas visibles, pareja de las siete y media da 1 acierto / 1 intento; nivel 2 carga relojes digitales. |

La salida compilada se comprobó en un servidor local que exige coincidencia de mayúsculas y sirve bajo `/encarta/`, para simular las rutas de un repositorio en Pages. Una revisión posterior encontró imágenes de cuestionarios solicitadas con mayúsculas que devolvían 404: las reglas omitían el árbol `dswmedia/quiz`. Se corrigió y se añadieron comprobaciones con seis solicitudes que fallaban. La salida ocupa aproximadamente 248 MiB y el exportador valida que ningún archivo alcance 100 MiB. `npm run check` y la compilación finalizaron correctamente.

Estas son pruebas representativas, no una certificación de las 228 actividades. El audio no se ha verificado por escucha. Tampoco se han probado Safari/iOS ni todas las actividades de panoramas, recompensas y juegos de parejas.

## Pendiente para un port completo

1. Descodificar los archivos AKC y sus asociaciones para recuperar artículos y categorías originales.
2. Completar las asociaciones originales de la navegación temática. La portada, sus diez botones, fondos de categorías y barra verde ya se reconstruyeron con recursos de la ISO.
3. Comprobar exhaustivamente las familias de actividades y los panoramas.
4. Adaptar el contenido Director/Shockwave y convertir vídeos WMV si se incorporan.
5. Publicar y comprobar en una URL real de GitHub Pages.

No se ha instalado Encarta en Windows ni se ha publicado la ISO.

## Fidelidad visual de la interfaz

- Fondo principal `baggage/0015aed2.jpg`; fondos de selección `0015afa4` a `0015afb4` y `001607f0`.
- Botones GSM/GMO originales de 220 × 90, en las posiciones del XSL: columnas x=0 y x=576, filas y=9+90*n. Se conservan los estados de mouse.
- Iconos originales de 44 × 42 y recursos de la barra 15051–15072. Algunos BMP exportados por 7-Zip contenían un desplazamiento `bfOffBits` incorrecto: se restablece a 54 para estos DIB BI_RGB de cabecera 40, evitando el intercambio aparente de canales de color.
- La composición se escala uniformemente desde una superficie de 1024 × 690; los recursos visuales no se redibujan.
- Se implementaron búsqueda, navegación atrás/adelante, menús, favoritos locales, sonidos de categorías y acceso directo a las actividades.
- Las categorías principales y sus gráficos son originales. Los nombres y asociaciones de subtemas se reconstruyeron para el contenido disponible; no se afirma una reproducción completa de la lógica AKC.
- Comparación visual adicional: [captura de la interfaz original](https://www.maspormas.com/ciudad/software-descontinuados/), solo como referencia; la web utiliza gráficos de la ISO, no esa captura.
- Se comprobó en navegador la portada, el panel Los seres vivos y el listado El cuerpo humano.
- Prueba final: Buscar ecosistema devuelve un resultado; abrirlo carga la ilustración, texto y controles originales dentro del marco clásico. La exportación actual incluye 694 recursos de interfaz y ocupa 248,3 MiB.
