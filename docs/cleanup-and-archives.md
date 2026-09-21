# Limpieza y recuperación de archivos

Las URLs `.html` siguen siendo el contrato público del sitio. Astro genera esos documentos desde MDX y componentes; la extensión no indica que se haya vuelto al sistema anterior.

## Archivo local

`.archive/cleanup-2026-09-14/` está ignorado por Git y fuera de `public/`. Contiene:

- `manifest.json`: bundles, archivos originales, tamaños, hashes SHA-256 y resultado de la extracción de verificación.
- `code-changes.json`: componentes retirados, consolidaciones y sus reemplazos.
- `migration-history.tar.gz`: referencias y copias previas a Astro.
- `editorial-captures.tar.gz`: capturas históricas y su antiguo capturador.
- `design-export.tar.gz`: exportación ZIP histórica de diseño.
- `old-releases.tar.gz`: releases anteriores con sus manifiestos intactos.
- `code-before.tar.gz`: copia del código antes de esta limpieza.
- `media/`: siete videos personales, conservados sin conversión ni pérdida.

Los artículos, briefs, guía de tono y resultados editoriales siguen en sus carpetas de trabajo. No se eliminaron entornos del servicio, secretos, configuraciones de agentes ni submódulos.

## Restaurar un bundle

Extraer siempre en una carpeta nueva o vacía. El comando verifica el archivo comprimido, rechaza enlaces y rutas inseguras, extrae los archivos y vuelve a comprobar cada hash. No sobrescribe archivos existentes.

```bash
python3 scripts/restore-archive.py .archive/cleanup-2026-09-14/manifest.json --bundle migration-history --output /tmp/diegodella-restored-migration
```

Las categorías disponibles son `migration-history`, `editorial-captures`, `design-export`, `old-releases` y `code-before`. El contenido restaurado conserva sus rutas relativas originales. Revisar antes de devolver cualquier archivo al workspace; restaurar un respaldo no debe pisar trabajo posterior.

Los videos no se comprimieron. Para recuperar uno, comprobar su SHA-256 contra `manifest.json` y copiarlo desde `media/` al destino elegido. Los originales de video ocupan el mismo espacio total: moverlos solo despeja la raíz.

## Releases y rollback

Se conservaron la release activa y dos anteriores listas para uso inmediato. Las 14 más antiguas se comprimieron. Una release preparada posteriormente se conserva adicionalmente como candidata, sin cambiar cuál está activa.

Para una release disponible:

```bash
bash scripts/deploy_release.sh --rollback RELEASE_ID
```

Para recuperar una archivada, extraer primero `old-releases` en una carpeta vacía y verificar el `RELEASE_MANIFEST.sha256` de la release elegida. Copiar únicamente esa carpeta a `.releases/releases/` si no existe ya; luego usar `--rollback`. El script verifica de nuevo el manifiesto antes de cambiar el enlace.

La retención no se ejecuta automáticamente al publicar. Antes de futuras limpiezas, proteger siempre la release activa, dos anteriores y cualquier candidata pendiente de revisión. Determinar el orden por la fecha del manifiesto, nunca por el nombre de un hash Git.

## Código y compatibilidad

Los diagramas idénticos comparten un único componente. Las dos familias de CSS idénticas tienen una fuente canónica; seis URLs antiguas siguen funcionando mediante pequeños `@import`. El `components.css` público se conserva como compatibilidad, pero los HTML nuevos no lo cargan. No eliminar estos archivos por no aparecer en las páginas nuevas: pueden usarlos documentos anteriores en caché.

Las hojas `legacy.css` y `legacy-components.css` siguen cargándose desde `global.css`. Su nombre no justifica eliminarlas. Tampoco eliminar clases solo por no encontrarlas en MDX: el navegador genera parte de la navegación y de los estados interactivos.

## Comprobaciones

Ejecutar `npm run check`, `npm run build`, `npm run validate`, `npm test` y `npm run test:migration`. Para cambios de componentes, ejecutar también `npm run test:authoring`, `npm run test:browser` y la auditoría visual. `npm run validate:editorial` comprueba por separado documentos y briefs internos.

Preparar sin publicar: `bash scripts/deploy_release.sh --workspace --prepare`. Solo `dist/` llega a la release; los archivos históricos y entornos locales no se copian a la fuente temporal de compilación.
