# Arquitectura

Astro genera el sitio estático en `dist/`, con HTML plano y las URLs existentes. No hay React, base de datos, CMS ni router de cliente.

## Fuentes y salidas

`src/content/writing/` contiene artículos MDX validados con el esquema de `src/content.config.ts`. Los metadatos alimentan las páginas, el índice Writing, el RSS, el sitemap y el catálogo público. Los artículos históricos conservan sus composiciones y diagramas como componentes Astro; los nuevos usan `ArticleFrame`.

`src/data/site.json` contiene perfil, biografías, proyectos y fechas institucionales. `src/data/nuggets.json` alimenta tarjetas, filtros y JSON-LD. `src/data/presentation.json` conserva variantes del head y orden de recursos; las referencias a datos canónicos se resuelven durante el renderizado.

`src/pages/` contiene hubs, rutas dinámicas y endpoints estáticos. `src/layouts/SiteLayout.astro` genera el documento. Navegación y pie se renderizan en servidor mediante componentes; el JavaScript no vuelve a escribirlos.

`public/` es una lista explícita de assets distribuibles. Astro copia su contenido a `dist/`. Los documentos internos, fuentes, auditorías y credenciales permanecen fuera de ese directorio.

## Navegador

`public/global.js` mantiene menú, contexto de lectura, modal de contacto y descubrimiento del navegador. `public/page-scripts/` conserva interacciones específicas. Las hojas en `public/styles/` y `public/page-styles/` mantienen la cascada y los diseños existentes. Cada navegación carga un documento completo.

## Contacto y servidor

El servicio Flask en `services/notify/` conserva la API v1 y sus alias de compatibilidad. Astro no necesita secretos de correo para compilar.

Nginx sirve `.releases/current`, negocia HTML/Markdown, mantiene redirects y MIME y proxifica `/api/` al servicio auxiliar. El script de release construye una copia aislada, valida el resultado y distribuye exclusivamente `dist/`. La activación y el rollback cambian un enlace simbólico de forma atómica; `--prepare` no lo cambia.

Las guías de ejecución y autoría están en `README.md` y `docs/astro-authoring.md`. El respaldo local de la migración vive comprimido en `.archive/cleanup-2026-09-14/`, con manifiesto de restauración, y no forma parte del sitio público.
