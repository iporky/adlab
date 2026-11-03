import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default [
  {
    entry: './src/index.js',
    output: {
      filename: 'main.esm.js',
      path: path.resolve(__dirname, 'dist'),
      libraryTarget: 'module',
      globalObject: 'this',
    },
    mode: 'production',
    experiments: {
      outputModule: true,
    },
  },
];
