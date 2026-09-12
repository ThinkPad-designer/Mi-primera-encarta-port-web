# Mi primera Encarta 2009 · Port web experimental

**Web:** https://mothicc.github.io/mi-primer-encarta/  
**Repositorio:** https://github.com/Mothicc/mi-primer-encarta

Adaptación de las **actividades originales** de la ISO `Microsoft Student con Encarta Premium 2009 [ESP].iso`. Utiliza los archivos de `EE/KIDS` y el reproductor Flash original con Ruffle 0.6.0.

La portada reproduce el diseño original: fondo naranja y logotipo de la ISO, los diez botones con sus estados de mouse, menús azules y barra verde. Los controles gráficos y sonidos se extraen de `ENCARTAR.DLL`; las posiciones de la portada siguen `mainhome_kids.xsl`.

**No es todavía un port completo de Encarta.** Incluye 228 actividades catalogadas (74 juegos), búsqueda y fichas de lectura. Los artículos en AKC, Director/Shockwave y los vídeos WMV no están portados. Las asociaciones de subtemas a actividades se reconstruyen mediante filtros; no son todavía las asociaciones completas del programa original.

## Abrir en tu equipo

Desde la carpeta principal:

```powershell
npm run dev
```

Abre la dirección que indique Vite, normalmente `http://127.0.0.1:5173/`. Selecciona una categoría, un subtema y una actividad, o utiliza **Buscar**. La actividad se abre directamente. En los cuestionarios, elige un nivel y pulsa una casilla del tablero. **Ver → Todas las actividades** permite consultar todo lo recuperado.

La importación ya está preparada en este equipo. En otra copia del proyecto, instala las dependencias e importa tu ISO:

```powershell
npm --prefix web ci
powershell -ExecutionPolicy Bypass -File scripts/import-content.ps1 -Iso "C:\ruta\encarta.iso" -SevenZip "C:\Program Files\7-Zip\7z.exe"
npm run dev
```

Se necesita Node.js 22.13 o posterior, PowerShell, `tar` (incluido en Windows moderno) y 7-Zip. Los instaladores de Encarta no se ejecutan. El importador extrae los paquetes EIT con 7-Zip y convierte las definiciones XML en un catálogo. La ISO y las extracciones quedan excluidas de Git.

## Preparar GitHub Pages

```powershell
npm run export
```

Esto verifica el contenido, compila y genera **`docs/`**, con HTML, JavaScript, CSS, Ruffle y los recursos importados. La carpeta es un sitio estático: no necesita Windows, Node ni un servidor de aplicación para funcionar en Pages. Usa rutas relativas y navegación por fragmentos, compatibles con `https://usuario.github.io/repositorio/`.

El paquete actual ocupa unos 248 MiB. Para probar exactamente esa salida en una subcarpeta y con rutas sensibles a mayúsculas, ejecuta `npm run preview` y abre `http://127.0.0.1:4173/encarta/`.

GitHub Pages está configurado para publicar desde **`main` → `/docs`**. Para actualizarlo después de hacer cambios:

1. Ejecuta `npm run export`.
2. Añade el código modificado y la salida generada: `git add -f docs`.
3. Haz commit y `git push origin main`. GitHub publicará la actualización automáticamente.

`docs/` está incorporada al repositorio. La regla de exclusión se conserva para que los nuevos recursos se añadan explícitamente al exportar. No subas la ISO, `local-source/`, `local-content/` ni `tools/`.

La publicación contiene recursos de tu edición de Microsoft; la adaptación no cambia su titularidad ni los convierte en contenido libre. El código y el contenido extraído se mantienen separados.

## Comprobaciones

```powershell
npm run check
npm run build
```

`check` valida TypeScript, identificadores, rutas y la presencia de archivos y reproductores. No equivale a jugar las 228 actividades. Las pruebas realizadas y las limitaciones están en [research/PORT-STATUS.md](research/PORT-STATUS.md).

Se corrigió la recursión que bloqueaba los juegos de parejas: **El reloj** ya carga sus piezas, cuenta aciertos y cambia de nivel. El parche se aplica automáticamente al importar o preparar la web. También se corrigieron las rutas de imágenes del banco de preguntas para servidores sensibles a mayúsculas y el ensamblaje de la barra de búsqueda.

## Estructura

- `web/app/`: catálogo, buscador, lector y adaptación del reproductor.
- `scripts/import-content.ps1`: extracción reproducible desde la ISO.
- `scripts/catalog-content.ps1`: generación de catálogo y rutas.
- `scripts/import-interface.ps1`: recuperación de los gráficos y sonidos originales; corrige el desplazamiento de píxeles en las cabeceras BMP extraídas antes de convertirlas a PNG.
- `scripts/patch-flash.mjs`: parche idempotente de la inicialización de MatchGame; conserva todos los demás recursos del SWF. Detalles en `scripts/flash/README.md`.
- `web/app/themes.ts`: categorías, iconos y asociaciones reconstruidas con las actividades disponibles.
- `scripts/titles-es.json`: traducciones de nombres técnicos de actividad; conserva el nombre interno original en los datos.
- `web/public/content/`: contenido original importado, ignorado por Git.
- `web/public/ruffle/`: runtime copiado desde la dependencia fijada.
- `docs/`: salida preparada para GitHub Pages.

## Referencias técnicas

- [Ruffle: paquete web](https://ruffle.rs/downloads).
- [Ruffle: opciones de carga y reescritura de URL](https://ruffle.rs/js-docs/master/interfaces/Config.BaseLoadOptions.html).
- [7-Zip: descargas oficiales](https://www.7-zip.org/download.html).
- [GitHub Pages: límites](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits).
