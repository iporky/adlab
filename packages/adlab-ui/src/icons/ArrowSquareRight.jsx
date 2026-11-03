import React from 'react';
import PropTypes from 'prop-types';

const ArrowSquareRight = ({ width = '100px', height = '100px', color = '#00000' }) => {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <path
        d="m13 15 3-3m0 0-3-3m3 3H8m-.8 8h9.6c1.12 0 1.68 0 2.108-.218a2 2 0 0 0 .874-.874C20 18.48 20 17.92 20 16.8V7.2c0-1.12 0-1.68-.218-2.108a2 2 0 0 0-.874-.874C18.48 4 17.92 4 16.8 4H7.2c-1.12 0-1.68 0-2.108.218a2 2 0 0 0-.874.874C4 5.52 4 6.08 4 7.2v9.6c0 1.12 0 1.68.218 2.108a2 2 0 0 0 .874.874C5.52 20 6.08 20 7.2 20z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
ArrowSquareRight.propTypes = {
  width: PropTypes.string,
  height: PropTypes.string,
  color: PropTypes.string,
};

export default ArrowSquareRight;
