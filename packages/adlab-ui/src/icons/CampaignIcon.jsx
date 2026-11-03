import React from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { tfsuiTheme } from '@tfs/ui-components-next';

import { FlexDiv } from '../components/styled';

const BlareIcon = ({ color }) => (
  <svg width="26" height="19" fill="none" viewBox="0 0 26 19">
    <path
      fill={color}
      fillRule="evenodd"
      d="M16.264 1.5v12a.5.5 0 01-1 0v-12a.5.5 0 111 0zm-5.242 1.893l3.242-1.18v10.51l-2.905-1.32a10.072 10.072 0 00-4.095-.903V4h.312c1.175 0 2.341-.205 3.446-.607zM6.264 4v6.5h-2.13a3.135 3.135 0 01-2.658-4.796l.08-.126A3.357 3.357 0 014.401 4h1.862zm0-1h1.312c1.059 0 2.11-.185 3.104-.547l3.63-1.32a1.5 1.5 0 012.954.367v3a2.5 2.5 0 010 5v4a1.5 1.5 0 01-2.961.34l-3.358-1.527a9.098 9.098 0 00-.792-.316 3.63 3.63 0 01-1.519 1.986c-.354.227-.72.38-1.055.463a2.75 2.75 0 01-.315.06V17a2 2 0 11-4 0v-5.593A4.135 4.135 0 01.628 5.174l.08-.126A4.357 4.357 0 014.401 3h1.862zm1 10.493c.023-.005.048-.01.073-.017.228-.057.494-.166.757-.334.452-.29.88-.75 1.097-1.419a9.07 9.07 0 00-1.927-.223v1.993zm10-4.993a1.5 1.5 0 000-3v3zm-13 3.5v5a1 1 0 102 0v-5h-2zm15.879-7.515c1.072.268 2.176.276 3.164-.077.999-.356 1.848-1.071 2.405-2.184l-.895-.448c-.443.887-1.094 1.422-1.846 1.69-.762.273-1.658.28-2.585.049l-.243.97zM20.764 8h4.5V7h-4.5v1zm-.418 3.493c.378-.063 1.281.032 2.234.41.944.373 1.815.976 2.237 1.82l.895-.447c-.578-1.155-1.708-1.885-2.764-2.303-1.047-.415-2.143-.57-2.766-.466l.165.986zM5.264 10h-2V9h2v1zm-2-2h2V7h-2v1zm2-2h-2V5h2v1z"
      clipRule="evenodd"
    ></path>
  </svg>
);
BlareIcon.propTypes = {
  color: PropTypes.string,
};

const BaseCircle = styled(FlexDiv)`
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: 2px solid ${tfsuiTheme.colorBrandForeground1};
  box-shadow: 0 4px 4px 0 #4f3ed733;
  ${({ styles }) => ({ ...styles })}
`;

const CampaignIcon = ({ selected = false }) => {
  return (
    <BaseCircle
      styles={css`
        background: ${selected ? tfsuiTheme.colorBrandForeground1 : 'transparent'};
      `}
    >
      <BlareIcon color={selected ? '#fff' : tfsuiTheme.colorBrandForeground1} />
    </BaseCircle>
  );
};

CampaignIcon.propTypes = {
  selected: PropTypes.bool,
};

export default CampaignIcon;
