# Correcciones comprobadas, 11 de septiembre de 2026

- **Barra de búsqueda:** eliminado el mosaico de un separador de 7 px que dejaba el hueco blanco. El campo usa su fondo original completo, continúa desde la curva de Buscar hasta la flecha y se ajusta al logotipo sin solapamientos. Comprobado visualmente en `/encarta/`.
- **Banco de preguntas:** `urlRewriteRules` vuelve a incluir `dswmedia/quiz/`. En Windows una referencia como `T047673A.jpg` podía cargar; en la exportación exacta devolvía 404. Se comprueban seis solicitudes reales contra los nombres exactos del manifiesto.
- **Opciones con imágenes:** se desactiva el callback de redimensionamiento de `mchoiceAnswerSymbol` que hacía desaparecer los JPEG tras `loadMovie`. Se verificaron los tamaños de las 120 imágenes de opciones: todos coinciden con sus XML. El resto de la skin BGA se conserva.
- **Parejas:** las trazas mostraron llamadas recursivas continuas a `onItemChange`, hasta que Ruffle detenía toda la película. El parche protege cada observador de MatchGame contra reentrada. Afecta a sus 23 actividades; no implica que se hayan jugado completas. Se retiró el ensayo de modificación de TextBox, que no resolvía el bloqueo.
- **Arranque de la web:** se aborta la primera carga de catálogo al desmontar el componente; evita que una respuesta obsoleta de StrictMode reinicie una actividad ya abierta. La preparación ya no reescribe Ruffle o el catálogo cuando no cambiaron, evitando recargas de Vite al compilar. No se atribuye todavía a estos factores todo el parpadeo reportado.

## Evidencia interactiva

- Cuerpo humano, nivel 1: pregunta de agua, respuesta correcta, explicación, Continuar y puntuación 1. Siguiente pregunta con imagen de esqueleto visible, respuesta 206 y explicación con la misma imagen.
- El reloj: relojes y textos visibles; seleccionar las siete y media y su texto da 1 acierto en 1 intento. Nivel 2 carga relojes digitales. También se comprobó el arranque con el parche binario reproducible, sin recompilar el resto del SWF.
- Personajes de Colombia: las ocho fotografías y opciones cargan y permiten seleccionar una pareja.
- Personajes de Colombia: un error cuenta 1 intento y permite otra selección; Nuevo intento restaura el contador y mezcla las piezas.
- El reloj, exportación final en `/encarta/`: pareja correcta de las siete y media, 1 acierto / 1 intento.
- Animales, pregunta 1195: antes aparecían cuatro recuadros vacíos. Después del parche aparecen los cuatro peces, seleccionar el pez ángel muestra su imagen y explicación. Se usó temporalmente una lista de preguntas fija para repetir el caso; el IAX original se restauró antes de exportar.

Las pruebas iniciales de parejas fueron en Vite; las de cuestionarios e interfaz en el servidor exacto de Pages. La salida final se vuelve a comprobar en ese servidor. El audio no se verificó por escucha. No se certifica la colección completa ni se da por resuelto un parpadeo que no se haya reproducido.
