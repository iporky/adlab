import React from 'react';
import PropTypes from 'prop-types';

const TikTokIcon = ({ height = '32px', width = '32px' }) => (
  <svg width={width} height={height} viewBox="0 0 24 24">
    <path d="M21 2H3a1 1 0 00-1 1v18a1 1 0 001 1h18a1 1 0 001-1V3a1 1 0 00-1-1zm-3.281 8.725a3.602 3.602 0 01-.328.017A3.571 3.571 0 0114.4 9.129v5.493a4.061 4.061 0 11-4.06-4.06c.085 0 .167.008.251.013v2a2.067 2.067 0 10-.251 4.119 2.123 2.123 0 002.16-2.045l.02-9.331h1.914A3.564 3.564 0 0017.719 8.5z"></path>
  </svg>
);

TikTokIcon.propTypes = {
  height: PropTypes.string,
  width: PropTypes.string,
};

export default TikTokIcon;
