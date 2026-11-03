import React from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import { tfsuiTheme } from '@tfs/ui-components-next';

import { FlexDiv, Text } from './styled';

const SectionalHeader = ({ sectionTitle }) => (
  <FlexDiv
    styles={css`
      width: 100%;
      justify-content: space-between;
    `}
  >
    <Text
      subtitle1
      styles={css`
        align-self: flex-start;
        margin: 0 ${tfsuiTheme.spacingHorizontalMNudge};
      `}
    >
      {sectionTitle}
    </Text>
  </FlexDiv>
);

SectionalHeader.propTypes = {
  sectionTitle: PropTypes.string.isRequired,
};

export default SectionalHeader;
