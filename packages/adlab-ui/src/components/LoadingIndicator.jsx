import React from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import { Spinner, tfsuiTheme } from '@tfs/ui-components-next';

import { FlexDiv } from './styled';

const LoadingIndicator = ({ label = 'Loading...', labelPosition = 'below', styles }) => (
  <FlexDiv
    column
    styles={css`
      align-items: center;
      justify-content: center;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      height: 140px;
      width: 140px;
      background-color: ${tfsuiTheme.colorSubtleBackgroundHover};
      border-radius: 5px;
      ${styles && { ...styles }}
    `}
  >
    <Spinner label={label} labelPosition={labelPosition} />
  </FlexDiv>
);

LoadingIndicator.propTypes = {
  label: PropTypes.string,
  labelPosition: PropTypes.oneOf(['before', 'after', 'above', 'below']),
  styles: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
};

export default LoadingIndicator;
