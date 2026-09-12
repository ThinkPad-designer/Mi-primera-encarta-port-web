<p align="center">
  <img src=".github/assets/frutiger-aero.svg" width="100%" alt="Mi primera Encarta. Un mundo de curiosidad. Porteado por Astra." />
</p>

<div align="center">

### El mundo era enorme. La curiosidad, todavía más.

Una pequeña cápsula de 2009, abierta de nuevo en tu navegador.<br />
Actividades originales, sonidos familiares y muchas cosas por descubrir.

**[🌎 Entrar a Mi primera Encarta](https://mothicc.github.io/mi-primer-encarta/)**

[Qué incluye](#-un-mundo-por-descubrir) · [Créditos](#-hecho-con-curiosidad) · [Cómo ejecutarlo](#-detrás-del-cristal) · [Seguridad](.github/SECURITY.md)

| 🫧 228 actividades | 🍃 74 juegos | 🌐 En español |
| :---: | :---: | :---: |
| Explora a tu ritmo | Aprende jugando | Directo en el navegador |

</div>

<img src=".github/assets/aero-divider.svg" width="100%" alt="" />

## 🌱 Un mundo por descubrir

Este port recupera las **actividades originales de Mi primera Encarta 2009**, incluidas en Microsoft Student con Encarta Premium 2009, y las reproduce con **Ruffle**. La portada conserva el fondo naranja, los diez botones, los menús azules y la barra verde de la edición original.

| Explora | Encuentra | Vuelve a jugar |
| :--- | :--- | :--- |
| Categorías, subtemas y fichas de lectura | Buscador y favoritos guardados en tu navegador | Cuestionarios, juegos de parejas y otras actividades recuperadas |

Es una **adaptación experimental de las actividades**, todavía no una recuperación completa de Encarta. Los artículos AKC, Director/Shockwave y los vídeos WMV siguen pendientes; las asociaciones de subtemas se han reconstruido mediante filtros. El catálogo cuenta con 228 actividades, pero no todas se han probado jugando de principio a fin.

<img src=".github/assets/aero-divider.svg" width="100%" alt="" />

## 🫧 Hecho con curiosidad

### Porteado por Astra

**Astra**, asistente de IA, realizó la adaptación web, la recuperación de la interfaz, los ajustes de compatibilidad y las pruebas documentadas, con la dirección y las revisiones de **[Mothicc](https://github.com/Mothicc)**.

| Crédito | Aportación |
| :--- | :--- |
| **Microsoft y los autores originales de Encarta** | Programa original, contenido educativo, ilustraciones, sonidos, animaciones y actividades. |
| **Astra** | Port web, integración, correcciones de compatibilidad y diseño de este README. |
| **Mothicc** | Edición original aportada, idea del proyecto, dirección visual, pruebas y publicación. |
| **[Ruffle y sus colaboradores](https://ruffle.rs/)** | Emulación de Flash en navegadores modernos. Runtime distribuido con sus licencias [MIT](docs/ruffle/LICENSE_MIT) y [Apache 2.0](docs/ruffle/LICENSE_APACHE). |
| **[React](https://react.dev/) · [Vite](https://vite.dev/) · [TypeScript](https://www.typescriptlang.org/)** | Interfaz web y herramientas de desarrollo. |
| **[7-Zip](https://www.7-zip.org/) · [JPEXS Free Flash Decompiler](https://github.com/jindrapetrik/jpexs-decompiler)** | Extracción y análisis de los recursos originales y preparación de los parches. |
| **[GitHub Pages](https://pages.github.com/)** | Alojamiento de la versión web. |

**Del primer archivo a la publicación: aproximadamente 2 h 37 min.**<br />
Primera versión realizada el **11 de septiembre de 2026**. Estimación del tiempo transcurrido entre la creación de los primeros archivos de la interfaz (19:29) y el commit que documenta la publicación (22:06), hora del centro de México. Incluye esperas y pruebas; no es una medición de trabajo activo ni incluye el mantenimiento posterior.

Este es un proyecto independiente, sin afiliación ni respaldo de Microsoft. Encarta y los recursos originales pertenecen a sus respectivos titulares; este port no los convierte en contenido libre ni les asigna una nueva licencia.

<img src=".github/assets/aero-divider.svg" width="100%" alt="" />

## 💎 Detrás del cristal

La web publicada funciona como un sitio estático. No requiere iniciar sesión ni instalar el Flash Player antiguo. Los gráficos de este README son SVG locales, sin scripts, fuentes remotas ni servicios de imágenes externos.

<details>
<summary><strong>🛠️ Desarrollo, importación y publicación</strong></summary>

### Abrir en tu equipo

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

### Preparar GitHub Pages

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

### Comprobaciones

```powershell
npm run check
npm run build
```

`check` valida TypeScript, identificadores, rutas y la presencia de archivos y reproductores. No equivale a jugar las 228 actividades. Las pruebas realizadas y las limitaciones están en [research/PORT-STATUS.md](research/PORT-STATUS.md).

Se corrigió la recursión que bloqueaba los juegos de parejas: **El reloj** ya carga sus piezas, cuenta aciertos y cambia de nivel. El parche se aplica automáticamente al importar o preparar la web. También se corrigieron las rutas de imágenes del banco de preguntas para servidores sensibles a mayúsculas y el ensamblaje de la barra de búsqueda.

### Estructura

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

### Referencias técnicas

- [Ruffle: paquete web](https://ruffle.rs/downloads).
- [Ruffle: opciones de carga y reescritura de URL](https://ruffle.rs/js-docs/master/interfaces/Config.BaseLoadOptions.html).
- [7-Zip: descargas oficiales](https://www.7-zip.org/download.html).
- [GitHub Pages: límites](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits).


</details>

<details>
<summary><strong>🔒 Seguridad y mantenimiento</strong></summary>

La revisión del 11 de septiembre de 2026 no detectó patrones de tokens conocidos, claves privadas o rutas personales del mantenedor en los 8,949 archivos históricos únicos analizados. GitHub no mostraba alertas de secretos. Estas comprobaciones tienen alcance limitado y no son una garantía de ausencia de secretos o fallos.

Se retiraron dependencias de servidor sin uso, se actualizó Vite y se corrigió una dependencia transitiva: la auditoría pasó de 11 avisos a **0 vulnerabilidades conocidas** en ese momento. Los archivos publicados en <code>docs/</code> se conservaron sin cambios.

El repositorio tiene HTTPS obligatorio para Pages, detección de secretos, protección de pushes y alertas de dependencias. Los workflows tienen permisos de lectura por defecto y no pueden aprobar pull requests. Dependabot puede proponer correcciones; su fusión no es automática.

Consulta la [política de seguridad](.github/SECURITY.md) o [reporta una vulnerabilidad de forma privada](https://github.com/Mothicc/mi-primer-encarta/security/advisories/new).

</details>

<img src=".github/assets/aero-divider.svg" width="100%" alt="" />

<div align="center">

**Cielos azules. Ideas verdes. Curiosidad sin fecha de caducidad.**<br />
<sub>Mi primera Encarta · 2009 → web · Porteado por Astra</sub>

</div>
