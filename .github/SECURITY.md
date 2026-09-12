# Seguridad

Para reportar una vulnerabilidad, utiliza [Report a vulnerability](https://github.com/Mothicc/mi-primer-encarta/security/advisories/new). Evita publicar credenciales o detalles de explotación en issues públicos.

El proyecto sirve archivos estáticos desde GitHub Pages, con HTTPS obligatorio. No necesita tokens, contraseñas, un backend ni acceso al equipo del mantenedor. Los favoritos se guardan en el navegador. Ruffle se distribuye junto al sitio; el reproductor configura `allowScriptAccess: false` y `openUrlMode: deny`.

Las credenciales, claves privadas, la ISO y las herramientas locales no deben añadirse a Git. `.gitignore` reduce subidas accidentales, pero no borra archivos ya publicados y puede omitirse con `git add -f`. Revisa siempre el diff antes de publicar.

El repositorio utiliza detección de secretos, protección de pushes, alertas de dependencias y propuestas de correcciones de Dependabot. Las propuestas requieren revisión; no se fusionan automáticamente. Ninguna de estas medidas garantiza ausencia de vulnerabilidades.

El mantenimiento se concentra en la versión actual de `main`. Las actividades originales y su emulación tienen limitaciones documentadas en [el estado del port](../research/PORT-STATUS.md).
