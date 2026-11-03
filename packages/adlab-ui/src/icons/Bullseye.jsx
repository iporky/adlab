import React from 'react';
import PropTypes from 'prop-types';

const Bullseye = ({ height = 38, width = 38 }) => (
  <svg width={width} height={height} fill="none">
    <g clipPath="url(#a)">
      <path d="M17.5 35C27.165 35 35 27.165 35 17.5S27.165 0 17.5 0 0 7.835 0 17.5 7.835 35 17.5 35z" fill="url(#b)" />
      <path
        d="M28.05 28.015c-4.108 0-7.438-4.96-7.438-11.073 0-6.112 3.33-11.072 7.437-11.072 1.402 0 2.711.578 3.828 1.578-1.751-2.919-4.3-4.757-7.143-4.757-5.29 0-9.575 6.382-9.575 14.256 0 7.875 4.29 14.256 9.575 14.256 2.838 0 5.387-1.838 7.143-4.757-1.117 1-2.426 1.579-3.828 1.579v-.01z"
        fill="url(#c)"
      />
      <path
        d="M28.598 21.748c1.811 0 3.28-2.152 3.28-4.807 0-2.656-1.469-4.808-3.28-4.808-1.811 0-3.28 2.152-3.28 4.808 0 2.655 1.469 4.807 3.28 4.807z"
        fill="#fff"
      />
    </g>
    <defs>
      <radialGradient
        id="b"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="matrix(28.00004 -6.5 7.74796 33.37588 7 21.5)"
      >
        <stop offset=".661" stopColor="#171618" />
        <stop offset="1" stopColor="#7B7680" />
      </radialGradient>
      <radialGradient
        id="c"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="rotate(112.834 3.704 13.409) scale(9.49399 5.5669)"
      >
        <stop stopColor="#4F3ED7" />
        <stop offset="1" stopColor="#222AE5" />
      </radialGradient>
      <clipPath id="a">
        <path fill="#fff" d="M0 0h35v35H0z" />
      </clipPath>
    </defs>
  </svg>
);

Bullseye.propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
};

export default Bullseye;
