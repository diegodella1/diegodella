# diegodella

Repositorio del sitio `diegodella.ar`, su contenido editorial y el servicio auxiliar de contacto.

## Estructura

- `services/notify/`: backend Flask mínimo para contacto.
- `infra/nginx/`: configuración de Nginx.
- `infra/systemd/`: unidad systemd del servicio auxiliar.
- `docs/api.md`: documentación pública de la API.
- `docs/architecture.md`: mapa del repo y decisiones de estructura.
- raíz del repo: document root actual del sitio estático.

## Compatibilidad

Se dejaron enlaces simbólicos en la raíz para no romper rutas o scripts existentes:

- `notify -> services/notify`
- `nginx.conf -> infra/nginx/nginx.conf`
- `diegodella-notify.service -> infra/systemd/diegodella-notify.service`

## API actual

La API quedó reducida a dos capacidades:

- `POST /api/contact`: recibe el formulario del sitio y envía un email a Diego.
- `GET /api/status`: healthcheck mínimo.

Si se elimina, el sitio sigue renderizando, pero deja de funcionar el formulario de contacto.

## Validación local

```bash
node scripts/validate-site.mjs
node scripts/audit-theme.mjs
python3 -m unittest services/notify/test_app.py
```

El primer comando revisa las 33 páginas, navegación compartida, landmarks, rutas, hashes y assets locales. El segundo abre Chromium y verifica contraste WCAG AA, overflow, solapamientos, foco, modal, filtros y menú móvil en light/dark sobre cinco viewports. El tercero cubre validación, compatibilidad y escape del formulario de contacto.

## CSS

`global.css` conserva el entrypoint público y carga una cascada estratificada. La arquitectura, orden de capas y excepción temporal de Tailwind en home están documentados en `styles/README.md`.
