# Arquitectura Del Repositorio

## Qué hay acá

El repo mezcla tres capas:

- sitio estático público servido desde la raíz
- servicio auxiliar Flask para contacto
- artefactos de operación y despliegue

## Estructura actual

```text
/
  *.html                  # document root actual del sitio
  *.md                    # resúmenes/artefactos para agentes y documentación puntual
  docs/
    api.md
    architecture.md
  services/
    notify/
      app.py
      email_service.py
      requirements.txt
  infra/
    nginx/
      nginx.conf
    systemd/
      diegodella-notify.service
```

## Qué hace `services/notify`

- expone `/api/contact` para el modal de contacto del sitio
- publica `/api/status`

## Evaluación rápida de necesidad

La parte imprescindible hoy es `POST /api/contact`, porque el frontend la llama directamente desde [index.html](/home/diego/Documents/diegodella/index.html:1700) y [global.js](/home/diego/Documents/diegodella/global.js:378).

`GET /api/status` queda como healthcheck mínimo y señal de capacidad.

## Próximo paso recomendado

Si querés sacar la API, conviene hacerlo en dos fases:

1. reemplazar `POST /api/contact` por un proveedor externo o un endpoint serverless mínimo
2. borrar `services/notify`, limpiar `openapi.json`, `.well-known/api-catalog`, `docs/api.md` y las referencias del frontend
