# Resultado de limpieza — 14 de septiembre de 2026

La limpieza conserva las URLs `.html`, los textos, IDs, enlaces y metadatos públicos. Astro sigue generando 42 páginas. La release `workspace-20260914T192802Z-23522` se preparó sin activar y luego se publicó el 14 de septiembre de 2026 por autorización del usuario. La anterior, `workspace-20260914T150806Z-875`, permanece disponible para rollback.

## Código

- Diagramas: de 162 componentes a 94, retirando 68 copias idénticas y actualizando sus importaciones.
- CSS: seis copias consolidadas en dos fuentes compartidas. Las seis URLs anteriores conservan archivos de compatibilidad mediante `@import` directo.
- Retirado `NuggetDescription.astro`, sin consumidores. Eliminada la carga del `components.css` vacío en las páginas nuevas; su URL pública permanece disponible.
- La validación editorial se ejecuta por separado con `npm run validate:editorial`. La preparación desde el workspace copia únicamente las fuentes necesarias, sin históricos, briefs, documentación interna, archivos de entorno ni el entorno virtual de Python.

El inventario de las 75 acciones sobre código, con nombres, reemplazos y hashes originales, está en [code-changes.json](../.archive/cleanup-2026-09-14/code-changes.json).

## Archivos conservados

| Paquete | Archivos verificados |
| --- | ---: |
| Historial de migración | 251 |
| Capturas editoriales y capturador antiguo | 21 |
| Exportación de diseño | 1 |
| 14 releases antiguas | 1200 |
| Respaldo del código anterior a la limpieza | 252 |

Cada paquete se extrajo y se comparó archivo por archivo mediante SHA-256 antes de retirar los originales. Se conservaron también siete videos, sin conversión, en `media/` dentro del archivo local.

Los paquetes pasan de 100.847.864 a 73.998.119 bytes: compresión de 26.849.745 bytes (25,61 MiB). Esta cifra incluye el respaldo previo del código; no representa la reducción neta de todo el repositorio. Los videos conservan sus 226.488.539 bytes: moverlos despeja la raíz, sin ahorrar espacio.

Permanecen disponibles la release activa, las anteriores `workspace-20260907T122926Z` y `workspace-20260827T165755Z`, y la candidata preparada. Los artículos, briefs, guía de tono y reportes editoriales siguen en sus carpetas de trabajo.

El [manifiesto](../.archive/cleanup-2026-09-14/manifest.json) contiene el inventario y los hashes. El archivo es local, está ignorado por Git y no se publica. La [guía de recuperación](cleanup-and-archives.md) explica cómo restaurarlo.

## Verificación

- Astro check: 135 archivos, cero errores, advertencias o hints.
- Build y validación pública: 42 páginas correctas.
- Pruebas de contenido y limpieza: 6/6.
- Paridad de migración: 44/44; textos, enlaces, IDs, fechas y metadatos preservados.
- Autoría MDX: alta de artículo y propagación de título/fecha correctas.
- Validación editorial: correcta.
- Navegador: menú móvil, Nuggets, teclado, filtros y formulario correctos; envíos simulados.
- Auditoría visual: 42 páginas × 3 tamaños (móvil de 360 px, tablet de 768 px y escritorio de 1440 px), tema oscuro y estados interactivos; sin fallos de contraste, superposición de controles ni desbordamiento horizontal. Comprobación local con fuentes de respaldo, sin depender de servicios externos.
- Backend: 14/14 pruebas durante la preparación aislada de la release.
- Restauración: extracción verificada y rechazo de destino ocupado comprobados.
- Manifiestos SHA-256 de la release activa y de la candidata: correctos.
- Sintaxis del script de despliegue y `git diff --check`: correctos.

La preparación no cambió el enlace de producción. No se modificaron reglas de Cloudflare ni se enviaron correos reales.

## Publicación posterior

Se verificó el manifiesto SHA-256 y se activó `workspace-20260914T192802Z-23522` mediante el cambio atómico del enlace. La verificación del origen pasó sus 324 aserciones. En el dominio público se comprobaron las 42 páginas, sus títulos, la retirada del enlace vacío y dos URLs representativas de CSS de compatibilidad contra el artefacto publicado.

El smoke público conserva los 12 fallos conocidos asociados a respuestas 403 para seis user-agents simulados de bots de IA en Cloudflare. Los demás controles públicos pasaron. Es una restricción preexistente del borde; no se cambiaron sus reglas durante este despliegue.
