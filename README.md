# design-demo-acreditaciones

Demo navegable del módulo de **Acreditaciones** de Sports (suite-web-v2). Corre sin backend: es el
módulo React real (`suite-mf-accreditations`) compilado con el SDK de Naowee, con el sidebar de Sports
y un gateway simulado dentro del navegador. Datos ficticios.

## Verlo

```bash
python3 -m http.server 4400   # o cualquier servidor estático
# abrir http://localhost:4400/
```

Bajo un subdirectorio (GitHub Pages) funciona igual: la base se deduce de la URL y `404.html` es la
misma `index.html` para que las rutas profundas recarguen bien. Con `http.server` no se puede recargar
en una ruta profunda; entra siempre por la raíz.

## Qué incluye

- Entrada (elegir evento), Permisos de acceso, Tipos de acreditados.
- Gestión de acreditables, Lista de acreditados, Acreditados del evento, Lotes de carnets, Historial.
- Validar acceso y Lista de accesos.
- Las pantallas que en el producto solo existen en modo demo se activan por ruta (`src/shell.ts`).

No incluye la barra superior de Sports ni los Certificados de participación (no hay ruta en el micro).

## Cómo está hecho

- `src/gateway.mjs`: contrato del gateway copiado de `suite-mf-accreditations/e2e/lib/gateway.mjs`.
  Si el contrato cambia allá, se vuelve a copiar.
- `src/gateway-browser.ts`: lo conecta a `XMLHttpRequest` (el transporte del SDK).
- `src/shell.ts`: sidebar con el markup de `ns-sidebar` y la bandera de demo.
- `assets/`: CSS y fuentes de `sdk-frontend-foundations` y el bundle compilado (`app.js`, `app.css`).

## Recompilar

```bash
# en suite-mf-accreditations: NPM_TOKEN=$(gh auth token) npm install
SUITE_MF_ACCREDITATIONS=~/Naowee/suite-mf-accreditations node scripts/build.mjs
```
