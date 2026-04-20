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
