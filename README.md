# diegodella

Sitio de Diego Dell'Agostino en Astro 7, TypeScript y MDX. Genera HTML estático con las mismas URLs `.html`. El servicio Flask de contacto sigue separado.

## Desarrollo

Node 22.22.0 (ver `.nvmrc`), npm 9.6.5 o posterior.

```bash
npm ci
npm run dev
```

Abrir `http://127.0.0.1:4321`. Las rutas existentes, incluidas `paper-01.html`, funcionan en desarrollo. Astro no usa un router de cliente: cada enlace carga una página completa.

```bash
npm run build
npm run preview
```

El único directorio distribuible es `dist/`. No editarlo: se regenera en cada build.

## Dónde editar

- `src/content/writing/*.mdx`: los 23 artículos, sus metadatos y variantes editoriales de las tarjetas.
- `src/data/nuggets.json`: las 86 ideas; alimenta tarjetas, filtros, contadores y JSON-LD.
- `src/data/site.json`: perfil, biografías, proyectos y fechas de páginas institucionales.
- `src/pages/*.astro`: páginas institucionales e índices.
- `src/components/`: navegación, pie, fechas, biografías, listados y diagramas.
- `src/data/presentation.json`: variantes de head, CSS y scripts existentes. Las referencias a artículos se resuelven desde MDX.
- `src/content/markdown/`: representaciones Markdown públicas con referencias a los metadatos canónicos.
- `public/`: assets y documentos que deben publicarse literalmente, incluidos `styles/`, `.well-known/` y `docs/`.
- `services/notify/`: API Flask. `infra/`: Nginx y systemd.
- `content/briefs/`, `docs/`, `.editorial/`: trabajo interno; no se publica.

Guía de escritura: [docs/astro-authoring.md](docs/astro-authoring.md). Cascada CSS: [docs/styles.md](docs/styles.md).

## Verificación

```bash
npm run check
npm run build
npm run validate
npm run validate:editorial
npm test
npm run test:authoring
npm run test:browser
AUDIT_VIEWPORTS=phone-360,tablet,desktop npm run audit:theme
python3 -m unittest discover -s services/notify -p 'test_*.py'
```

`test:authoring` usa una copia temporal y comprueba altas y cambios sin tocar artículos reales. `test:browser` requiere Chromium y simula todos los envíos de correo. La auditoría visual usa archivos de `dist/`; también acepta `AUDIT_BASE_URL` para una vista HTTP.

`npm run test:migration` compara la migración con la referencia editorial del 14/09/2026. Es una prueba histórica: no bloquea futuras ediciones de contenido ni el despliegue.

Para comprobar negociación Markdown, redirects, MIME y API contra una instancia de Nginx:

```bash
SITE_BASE_URL=http://127.0.0.1:3080 npm run smoke:discovery
```

## Releases

Preparar y validar una release del workspace sin activarla:

```bash
bash scripts/deploy_release.sh --workspace --prepare
```

El script copia las fuentes a un directorio temporal, instala las versiones del lockfile, verifica tipos, genera Astro, valida contenido y ejecuta los tests. Luego copia **solo `dist/`** a una release inmutable con manifiesto SHA-256. `--prepare` deja intacto `.releases/current`.

La activación sigue siendo explícita:

```bash
bash scripts/deploy_release.sh --activate RELEASE_ID
bash scripts/deploy_release.sh --workspace
bash scripts/deploy_release.sh COMMIT_O_TAG
bash scripts/deploy_release.sh --rollback RELEASE_ID
```

Nginx sigue sirviendo `.releases/current`; conserva los alias, los `.html`, la negociación `Accept: text/markdown`, `.well-known` y el proxy de API. El rollback verifica el manifiesto y cambia el enlace de forma atómica. No se requiere Node en el servidor que sirve los archivos.

## Contacto

La API pública conserva `/api/v1/status` y `/api/v1/contact`, con compatibilidad para `/api/status` y `/api/contact`. La documentación distribuida vive en [public/docs/api.md](public/docs/api.md). El build de Astro no necesita credenciales de correo.

Los HTML originales y las capturas históricas están archivados, con hashes verificados, en `.archive/cleanup-2026-09-14/`, fuera de Git y de la publicación. SEO y descubrimiento orgánico quedan para la siguiente etapa; esta migración conserva los contratos actuales.

## Limpieza y archivos históricos

La guía de recuperación está en [docs/cleanup-and-archives.md](docs/cleanup-and-archives.md). Los archivos locales comprimidos incluyen manifiestos SHA-256 y se verificaron mediante extracción antes de retirar los originales. La voz editorial, los briefs y los informes permanecen accesibles.

El [resultado de la limpieza](docs/cleanup-results-2026-09-14.md) detalla consolidaciones, archivos preservados, verificaciones y la release preparada.

La [revisión de estados e interacción](docs/ui-states-2026-09-14.md) documenta las correcciones de contacto, Nuggets, diagramas, colores y teclado, con pruebas reproducibles y capturas locales.

`npm run validate` comprueba el artefacto publicable y sus contratos. `npm run validate:editorial` comprueba documentos internos y briefs por separado; no es un requisito del despliegue. La copia temporal de publicación no incluye archivos históricos, credenciales ni entornos Python locales.
