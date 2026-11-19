# design-demo-acreditaciones

Demo navegable del módulo de **Acreditaciones** de Sports (suite-web-v2), montada en el marco de
`design-layouts-demos` (el mismo de la web de Metodólogos): ventana de escritorio 16:9, selector de tamaño,
**Vista plana** y un selector de vista del Resumen («Con los datos de hoy» / «Con todos los datos»).
Corre sin backend; los datos son ficticios.

## Correr

```bash
npm run dev          # http://localhost:8770  (otro puerto: PORT=8771 npm run dev)
```

Abre http://localhost:8770/web/?app=acreditaciones (la raíz redirige ahí). Entra directo al **Resumen**
del evento «Juegos Intercolegiados 2026»: la demo trabaja con un solo evento y no tiene selector.

## Qué muestra

- **Resumen de acreditaciones**, con las dos vistas del artefacto de Jorge:
  - **Con los datos de hoy** (Vista A): generadas, por subsanar y entregadas por deporte, rol y delegación.
  - **Con todos los datos** (Vista B): del inscrito al carnet entregado, con cupos, impresas y alertas. Cifras ilustrativas.
  - Filtros de fase (Nacionales, Regional Conjunto, Regional Atletismo), delegación y rol (con deporte / sin deporte), descarga del informe en CSV.
- El resto de pantallas del módulo (permisos, tipos de acreditados, gestión de acreditables, lista de acreditados,
  lotes, historial, validar acceso y lista de accesos) son el módulo React real compilado.

## Cómo está armado

- `web/index.html`: el marco (cabecera, tamaño de pantalla, Vista plana y el selector de vistas). No sabe nada de Acreditaciones.
- `mobile/apps/acreditaciones/`: la demo (`app.json` y la app). `app.json` declara `"vistas"` y `"casos": false` (sin recorrido guiado por ahora).
- `mobile/apps/index.js`: lo genera `npm run registrar`; no se edita.
- `RULES.md`: reglas del marco. `mobile/` (marco del teléfono) viene del marco original y no se usa aquí.

### La app (`mobile/apps/acreditaciones/`)

| Archivo | Qué hace |
|---|---|
| `index.html` | La app. Calcula su base también dentro del marco, fija el evento y entra al Resumen. |
| `assets/app.js` | El módulo compilado con un gateway simulado en el navegador (sin servicios). |
| `assets/shell.*` | Menú lateral, encabezado y pie (diseño de Incentivos, con tokens del SDK). |
| `assets/resumen.*` | Resumen de acreditaciones en JS plano; la vista la elige el marco con `window.ResumenVista.set(id)`. |

### Código fuente del bundle (`src/`)

- `src/gateway.mjs`: contrato del gateway copiado de `suite-mf-accreditations/e2e/lib/gateway.mjs`. Si el contrato cambia allá, se vuelve a copiar.
- `src/gateway-browser.ts`: lo conecta a `XMLHttpRequest` (el transporte del SDK).
- `src/shell.ts`: bandera de demo y markup del sidebar compilado (queda oculto: lo reemplaza `assets/shell.*`).

## Cambios respecto del marco original

- `scripts/dev.mjs`: una URL profunda de una app sin hash (p. ej. `/delivery/summary`) sirve el `index.html` de esa app.
- `web/index.html`: `app.json` puede declarar `"vistas"` (selector segmentado) y `"casos": false` (oculta Casos).

## Recompilar

```bash
# en suite-mf-accreditations: NPM_TOKEN=$(gh auth token) npm install
SUITE_MF_ACCREDITATIONS=~/Naowee/suite-mf-accreditations node scripts/build.mjs
```

Ojo: recompilar sobrescribe `mobile/apps/acreditaciones/assets/app.js`. El evento «Juegos Intercolegiados 2026» viene de `src/gateway.mjs`, pero lo demás (`shell.*`, `resumen.*`) es JS plano y no se toca.

## Pendiente

- Estados de la plataforma (cargando, error, sin conexión, vacío): en el marco original los implementa cada app.
- Recorrido guiado (Casos): se quitó por ahora; el marco ya soporta `casos.js` + `web-casos.js`.
