# MatchGame: evitar reentrada de Object.watch

Los callbacks originales `onItemChange` y `onSlideChange` escriben sobre la misma propiedad observada. Con Ruffle 0.6.0 se reproduce una llamada recursiva a `onItemChange` hasta agotar el tiempo de ejecución, incluso durante la inicialización. Esto dejaba vacíos los 23 juegos de parejas.

`match-watch.as` envuelve `watch` solamente en la instancia MatchGame. Cada propiedad tiene su propia protección de reentrada; las escrituras interiores actualizan el valor sin ejecutar otra vez su callback. Se preservan el receptor, los argumentos y el valor de retorno. Después se ejecuta la inicialización original.

`match-watch.json` contiene ese pequeño script compilado como AVM1 con JPEXS FFDec 26.2.1 (SWF 6), el payload original de inicialización y el SHA-256 del archivo de esta edición. No contiene el resto del programa descompilado.

`node scripts/patch-flash.mjs` reemplaza únicamente el segundo DoAction del segundo frame. Verifica la versión de entrada y comprueba que todos los demás tags permanecen idénticos. Es idempotente y no requiere Java ni FFDec al importar, desarrollar o compilar. Los archivos de la ISO en `local-content` permanecen originales.

Para recompilar el payload durante mantenimiento, colocar `match-watch.as` como `scripts/frame_2/DoAction_2.as` en una carpeta temporal y usar `ffdec -importScript original.swf patched.swf carpeta/scripts`. `flash-swf.mjs` permite extraer el DoAction resultante para actualizar el JSON. Verificar selección, aciertos, error, reinicio y cambio de nivel en el navegador antes de aceptar una nueva compilación.

## Imágenes de opciones BGA

También se desactiva solamente el registro `onLoad` de `mchoiceAnswerSymbol` en `bga_standard.swf` (la constante se renombra a `unused`). Su callback asignaba ancho y alto desde propiedades del clip que se reemplaza con `loadMovie`, dejando las imágenes sin tamaño en Ruffle. La imagen principal de la pregunta usa otro componente y no fallaba así.

Se comprobó que las 120 imágenes de opciones tienen exactamente el tamaño declarado en sus XML (ancho máximo 153 px). Mantener su tamaño nativo conserva el diseño de esta edición. El parche valida SHA-256 y modifica un único DoInitAction; todos los otros tags permanecen iguales. La pregunta 1195, cuyos cuatro peces se veían en blanco, muestra ahora las cuatro imágenes y permite responder. El ensayo de cambiar `questionpath` a `questionPath` se descartó.
