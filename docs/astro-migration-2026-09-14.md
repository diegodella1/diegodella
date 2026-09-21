# Migración a Astro — 14 de septiembre de 2026

## Resultado

42 páginas HTML conservadas, 23 artículos en MDX y 86 Nuggets en datos estructurados. Se mantienen el inglés editorial, los textos revisados, las URLs `.html`, los IDs, las fechas originales y las composiciones visuales. No se publicó en producción.

Astro 7.3.2 y MDX 8.0.1 generan el sitio estático con Node 22.22.0. No se incorporaron React, CMS ni base de datos. Las dependencias están fijadas en `package-lock.json`.

Navegación, pie, biografías, fechas, listados y Nuggets tienen componentes compartidos. Los artículos nuevos generan su ruta e incorporación al índice, RSS, sitemap y catálogo. Los 13 resúmenes Markdown públicos conservan sus URLs y referencias a los metadatos canónicos.

Los recursos distribuibles viven en `public/`; solo `dist/` llega a una release. Auditorías, fuentes, briefs y documentos internos quedan fuera. Los HTML y assets originales fueron archivados en `.migration/before-astro/` y `.migration/retired/`.

## Verificaciones

- `npm run check`: 204 archivos, cero errores, advertencias o hints.
- `npm run build`: 42 páginas HTML, endpoints estáticos y assets.
- `npm run validate`: rutas, anchors, semántica, metadatos, JSON-LD, recursos y contratos existentes.
- `npm run test:migration`: 44 pruebas; conserva texto normalizado, enlaces, IDs, fechas y metadatos de las 42 páginas.
- `npm test`: colección, publicación, catálogo, filtros, JSON-LD y exclusión de fuentes privadas.
- `npm run test:authoring`: alta de un MDX en una copia temporal y edición de título/fecha; propagación a página, índice, RSS, catálogo, sitemap y Markdown existente.
- `npm run test:browser`: menú móvil; Nuggets con clic, teclado, filtro y selección aleatoria; filtro Writing; modal de contacto, validación, error, reintento y cierre. Los envíos se interceptan y simulan.
- Auditoría Chromium: 42 páginas en móvil de 360 px, tablet de 768 px y escritorio de 1440 px, además de estados interactivos. Los servicios externos se bloquean; se comprueba la tipografía de fallback disponible localmente.
- Smoke HTTP con Nginx local y API de prueba: 324 comprobaciones, 12 páginas, 20 archivos de descubrimiento, 8 user agents, redirects, MIME, negociación Markdown, 404 y contratos API.
- Backend Flask: 14 tests, incluido el fallo simulado de entrega.
- Comparación adicional: `site-data.json` conserva exactamente su estructura y valores; los 13 Markdown, RSS, sitemap y `llms.txt` coinciden con la referencia previa.
- Comprobación visual del artículo `paper-01` a 390 px: misma altura de página y dimensiones de título y hero antes y después; título y secciones visibles al completar las animaciones.

## Release preparada

Se ejecutó `bash scripts/deploy_release.sh --workspace --prepare`. La instalación limpia, chequeo de tipos, build, validación y tests terminaron correctamente. Artefacto:

`.releases/releases/workspace-20260914T150806Z-875/`

El enlace activo permaneció en `releases/workspace-20260907T122926Z`. La preparación no activó producción. El script conserva releases inmutables, manifiestos SHA-256, activación atómica y rollback verificado.

## Uso siguiente

`npm run dev` abre la vista local en `http://127.0.0.1:4321`. Las instrucciones de edición están en `docs/astro-authoring.md` y las de validación y releases en `README.md`.

El trabajo de SEO, posicionamiento y descubrimiento orgánico corresponde a la siguiente etapa. Esta migración conserva sus contratos actuales; no evalúa rankings ni resultados orgánicos.

## Publicación en producción

Publicación solicitada y autorizada por Diego después de revisar la migración. Se activó la release `workspace-20260914T150806Z-875` mediante verificación SHA-256 y cambio atómico del enlace. La anterior, `workspace-20260907T122926Z`, permanece disponible para rollback.

El servidor de producción pasó las 324 comprobaciones. En el dominio público, las comprobaciones de páginas, recursos, negociación y API pasaron; seis user agents de rastreadores de IA recibieron HTTP 403 desde Cloudflare (12 aserciones fallidas). Esta restricción del borde queda registrada para la etapa de descubrimiento; no se cambiaron reglas de Cloudflare. La protección de correos de Cloudflare también transforma los enlaces `mailto` en el HTML público.

Registro UTC: 2026-09-14T15:29:37.933222+00:00.

## Ubicación posterior de los respaldos

La limpieza posterior trasladó `.migration/` al paquete `migration-history.tar.gz` de `.archive/cleanup-2026-09-14/`. Las capturas editoriales anteriores están en `editorial-captures.tar.gz`. El inventario y los SHA-256 se encuentran en el `manifest.json` de ese directorio; el procedimiento está en `docs/cleanup-and-archives.md`. Los resultados históricos de este informe no cambian.
