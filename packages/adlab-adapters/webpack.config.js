import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import webpack from 'webpack';

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
    resolve: {
      fallback: {
        crypto: 'crypto-browserify',
        stream: 'stream-browserify',
        util: 'util',
        process: 'process/browser',
        path: 'path-browserify',
        buffer: 'buffer',
        fs: 'browserify-fs',
        querystring: 'querystring-es3',
      },
    },
    module: {
      rules: [
        {
          test: /\.m?js/,
          resolve: {
            fullySpecified: false,
          },
        },
      ],
    },
    plugins: [
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
        process: 'process/browser',
      }),
    ],
  },
];
