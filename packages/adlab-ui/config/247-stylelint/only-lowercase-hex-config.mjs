import _ from 'lodash';
import stylelint from 'stylelint';

const { createPlugin, utils } = stylelint;

const ruleName = '247-styles/color-only-valid-lowercase-hex';

const messages = utils.ruleMessages(ruleName, {
  rejected: (color) => `Unexpected hex color "${color}". Only lowercase hex colors`,
});

const cssColorProperties = [
  'color',
  'background-color',
  'border',
  'border-color',
  'outline-color',
  'text-decoration-color',
  'background',
  'fill',
  'stroke',
  'box-shadow',
];
/** @type {import('stylelint').Rule} */
const ruleFunction = () => {
  return (root, result) => {
    root.walkDecls((decl) => {
      if (!_.isString(decl.value)) return;

      // Check if the property is a color-related property
      if (!cssColorProperties.includes(decl.prop)) return;

      const cssValuesParts = decl.value.split(' ');

      cssValuesParts.forEach((part) => {
        if (part[0] === '#' && !/^#([a-f0-9]{3}|[a-f0-9]{6}|[a-f0-9]{8})$/.test(part)) {
          utils.report({
            message: messages.rejected(part),
            node: decl,
            result,
            ruleName,
          });
        }
      });
    });
  };
};
ruleFunction.ruleName = ruleName;
ruleFunction.messages = messages;

export default createPlugin(ruleName, ruleFunction);
