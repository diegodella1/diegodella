# Escribir y mantener contenido en Astro

## Un artículo nuevo

Crear `src/content/writing/nombre-del-articulo.mdx`. El nombre del archivo define `/nombre-del-articulo.html`; conservarlo después de publicar para mantener enlaces.

```mdx
---
title: "Título del artículo"
description: "Descripción breve y concreta del argumento."
datePublished: "2026-09-14"
dateModified: "2026-09-14"
tags: ["AI", "Media"]
---

## Primera sección

El texto se escribe en Markdown. Admite **énfasis**, listas y [enlaces](thesis.html).

## Otra sección

Separá los argumentos en párrafos. Usá una cita o una tabla cuando aporte evidencia.
```

Guardar y ejecutar `npm run build`. Se generan la página, su fecha visible, metadatos, JSON-LD, RSS, sitemap y catálogo `site-data.json`. El índice Writing incorpora la nueva entrada en “Automation, scarcity, and agency” por defecto.

Para elegir su grupo, orden, etiqueta y filtros, agregar:

```yaml
listing:
  group: 1
  order: 10
  topics: "ai-trust distribution"
  label: "Essay"
```

Grupos: `0` product clarity; `1` AI, filters and trust; `2` automation, scarcity and agency; `3` fragments. Los filtros aceptan `product-clarity`, `ai-trust`, `distribution` y `operating-systems`. Si un listado requiere un título abreviado o descripción distinta, `listing.title` y `listing.description` se editan en el mismo archivo. Omitirlos reutiliza el título y descripción principales.

No copiar `presentation` de un artículo existente para crear uno nuevo: ese campo identifica una composición histórica completa. Los nuevos artículos reciben el layout compartido automáticamente.

## Editar un artículo existente

Cada MDX conserva su composición visual: párrafos, llamadas, notas laterales, enlaces y secciones con IDs. Cambiar el texto en ese archivo; actualizar `dateModified` cuando corresponda. Mantener `datePublished` y los IDs de secciones ya enlazadas.

Los componentes importados en `src/components/diagrams/` conservan SVGs y tablas especiales. El nombre comienza con el slug del artículo. Para cambiar uno de esos gráficos o tablas, editar el componente referenciado. Los textos que son prosa ordinaria permanecen en el MDX.

No editar títulos o descripciones en `dist/`, RSS ni `site-data.json`: son salidas. Las variantes de head usan referencias `{{article.title}}`, `{{article.description}}` y `{{article.url}}`, o referencias estructuradas, para mantener los metadatos enlazados al artículo.

## Nuggets y biografías

Agregar o editar un objeto de `src/data/nuggets.json`. `source` debe coincidir con una categoría de `src/data/nugget-filters.json`; `href` debe apuntar a la fuente pública. Los campos `tag`, `title`, `insight` y `detail` admiten HTML editorial de confianza para mantener énfasis. No insertar contenido externo sin revisar.

Los recuentos visibles, filtros y JSON-LD se calculan automáticamente. Las biografías están en `src/data/site.json` y se reutilizan en About, Media Kit y Markdown público.

## Markdown público y documentos técnicos

Las representaciones existentes se mantienen en `src/content/markdown/` como resúmenes específicos. Usan referencias como `{{article.thesis.title}}`, `{{article.thesis.description}}` y `{{bio.full}}`; no duplicar los valores canónicos. No todos los artículos tenían una URL Markdown: esta migración conserva las que existían.

Los contratos de API y archivos `.well-known` se editan en `public/`. Los documentos internos pertenecen a `docs/` o `content/`; Astro no los distribuye.

## Antes de publicar

Ejecutar `npm run check`, `npm run build`, `npm run validate` y `npm test`. Verificar la página con `npm run preview`. Para cambios de componentes o scripts, ejecutar `npm run test:browser` y `npm run audit:theme`. Preparar una release con `bash scripts/deploy_release.sh --workspace --prepare` para revisar el artefacto sin activar producción.
