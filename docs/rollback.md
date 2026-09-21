# Releases y rollback

Producción sirve una release inmutable mediante `.releases/current`. Editar el workspace no cambia el sitio publicado.

## Preparar, verificar y activar

```bash
bash scripts/deploy_release.sh --workspace --prepare
bash scripts/deploy_release.sh --activate RELEASE_ID
```

El primer comando instala las dependencias fijadas, verifica tipos, genera Astro y ejecuta validaciones y tests en una copia temporal. No copia documentos históricos, credenciales ni el entorno Python local. Solo `dist/` llega a la release con su manifiesto SHA-256. El segundo comando verifica ese manifiesto y cambia el enlace de manera atómica.

También se puede construir y activar desde un commit, rama o tag con `bash scripts/deploy_release.sh REF`. No se crean commits ni se publica automáticamente al preparar un artefacto.

## Volver a una versión anterior

```bash
bash scripts/deploy_release.sh --rollback RELEASE_ID
```

El script rechaza releases inexistentes o con un manifiesto inválido. No necesita reinstalar dependencias para activar una release ya preparada. Registrar la versión anterior y el motivo antes de activar, y comprobar páginas, assets y API después.

Se conservan la release activa y dos anteriores para recuperación inmediata. Las más antiguas están en el archivo local verificado; consultar [cleanup-and-archives.md](cleanup-and-archives.md) antes de restaurarlas. Una candidata sin publicar se conserva aparte de esa retención.

## Validación HTTP

```bash
SITE_BASE_URL=http://127.0.0.1:3080 npm run smoke:discovery
SITE_BASE_URL=https://diegodella.ar npm run smoke:discovery
```

El dominio público puede aplicar reglas de Cloudflare que no existen en el origen. Distinguir fallos del sitio de restricciones del borde; no cambiar esas reglas como parte de un rollback sin evaluar su causa.
