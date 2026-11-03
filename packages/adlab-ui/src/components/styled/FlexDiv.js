/**
 * This file contains all the global styled-components that can be used across the application.
 * @module globalStyledComponents
 * @author [24]7.ai developer team
 */
import styled from '@emotion/styled';

/**
 * FlexDiv is a styled-component that can be used to create a flex container.
 * @type {*}
 */
const FlexDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: ${({ justifyCenter }) => (justifyCenter ? 'center' : 'initial')};
  flex-direction: ${({ column }) => (column ? 'column' : 'initial')};
  ${({ gap }) => gap && { gap: gap }};
  ${({ styles }) => ({ ...styles })}
`;

export default FlexDiv;
