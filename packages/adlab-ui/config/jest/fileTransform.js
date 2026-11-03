import camelcase from 'camelcase';
import path from 'path';

const fileTransform = {
  process(src, filename) {
    const assetFilename = JSON.stringify(path.basename(filename));

    let output = '';
    if (filename.match(/\.svg$/)) {
      const pascalCaseFilename = camelcase(path.parse(filename).name, {
        pascalCase: true,
      });
      const componentName = `Svg${pascalCaseFilename}`;
      output = `import React from 'react';
        export default {
          __esModule: true,
          default: ${assetFilename},
          ReactComponent: React.forwardRef(function ${componentName}(props, ref) {
            return {
              $$typeof: Symbol.for('react.element'),
              type: 'svg',
              ref: ref,
              key: null,
              props: Object.assign({}, props, {
                children: ${assetFilename}
              })
            };
          }),
        };`;
    } else {
      output = `export default ${assetFilename};`;
    }

    return {
      code: output,
    };
  },
};

export default fileTransform;
