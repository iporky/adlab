import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { localeSelector } from '../features/home/homeSlice';

const withLocaleContext = (WrappedComponent) => {
  const WrappedComponentWithLocaleContext = (props) => {
    const locale = useSelector(localeSelector);

    return <WrappedComponent {...props} locale={locale} />;
  };

  WrappedComponentWithLocaleContext.displayName = `withLocaleContext(${WrappedComponent.displayName})`;

  return WrappedComponentWithLocaleContext;
};

withLocaleContext.propTypes = {
  WrappedComponent: PropTypes.func.isRequired,
};

export default withLocaleContext;
