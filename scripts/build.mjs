// Compila el módulo REAL de acreditaciones (suite-mf-accreditations) junto con este shell.
// Uso: SUITE_MF_ACCREDITATIONS=~/Naowee/suite-mf-accreditations node scripts/build.mjs
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import path from 'path';

const MF = process.env.SUITE_MF_ACCREDITATIONS;
if (!MF) throw new Error('Define SUITE_MF_ACCREDITATIONS con la ruta del repo suite-mf-accreditations (con npm install hecho).');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const req = createRequire(path.join(MF, 'package.json'));
const esbuild = req('esbuild');
const { sassPlugin } = req('esbuild-sass-plugin');

await esbuild.build({
  entryPoints: [path.join(root, 'src/main.tsx')],
  bundle: true, format: 'esm', jsx: 'automatic', minify: true,
  outfile: path.join(root, 'assets/app.js'),
  nodePaths: [path.join(MF, 'node_modules')],
  tsconfig: path.join(MF, 'tsconfig.app.json'),
  loader: { '.svg': 'dataurl', '.png': 'dataurl', '.woff2': 'dataurl', '.woff': 'dataurl', '.ttf': 'dataurl' },
  plugins: [sassPlugin({ loadPaths: [path.join(MF, 'node_modules')] })],
  define: { 'process.env.NODE_ENV': '"production"' },
  alias: {
    '@mf-accreditations': path.join(MF, 'src/commons'),
    '@acreditaciones/app': path.join(MF, 'src/accreditations/presentation/AccreditationsApp')
  },
  logLevel: 'warning'
});
console.log('Listo: assets/app.js y assets/app.css');
