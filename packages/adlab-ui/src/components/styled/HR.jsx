import styled from '@emotion/styled';
import { tfsuiTheme } from '@tfs/ui-components-next';
import { capitalize } from 'lodash';

/**
 * Horizontal ruler. Takes one of (thin|thick|thicker|thickest).
 * Default thick - 2px;
 * @type {*}
 */
const HR = styled.div`
  height: ${({ thin, thick, thicker, thickest }) =>
    tfsuiTheme[
      `strokeWidth${capitalize(
        (thin && 'thin') || (thick && 'thick') || (thicker && 'thicker') || (thickest && 'thickest') || 'thick',
      )}`
    ]};
  width: 100%;
  margin: ${tfsuiTheme.spacingVerticalXS} ${tfsuiTheme.spacingHorizontalXS};
  background-color: ${tfsuiTheme.colorNeutralBackground2Pressed};
  ${({ styles }) => ({ ...styles })}
`;

export default HR;
