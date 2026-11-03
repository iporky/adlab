import styled from '@emotion/styled';
import { tfsuiTheme } from '@tfs/ui-components-next';

const Divider = styled.div`
  border-right: 2px solid ${tfsuiTheme.colorBrandBackground};
  height: 30px;
  margin: 0 ${tfsuiTheme.spacingHorizontalS};
  ${({ styles }) => ({ ...styles })}
`;

export default Divider;
