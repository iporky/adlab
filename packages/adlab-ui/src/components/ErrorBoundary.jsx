import React from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import { Accordion, AccordionHeader, AccordionItem, AccordionPanel, tfsuiTheme } from '@tfs/ui-components-next';

import i18n from '../helpers/i18n';
import useI18NManualInitialization from '../hooks/useI18NManualInitialization';
import constants from '../lib/constants';

import { FlexDiv, Text } from './styled';

export const ErrorType = PropTypes.shape({
  message: PropTypes.string.isRequired,
  stack: PropTypes.string.isRequired,
});

const ErrorBoundaryUI = ({ error }) => {
  const [showErrorMsg] = useI18NManualInitialization();

  return (
    showErrorMsg && (
      <FlexDiv
        column
        styles={css`
          position: absolute;
          top: 30%;
          left: 50%;
          transform: translateX(-50%);
          width: 500px;
        `}
      >
        <Text
          subtitle1
          styles={css`
            color: ${tfsuiTheme.colorPaletteRedForeground1};
          `}
        >
          {i18n.t(i18n.keys.error_boundary_msg)}
        </Text>
        <Text>{i18n.t(i18n.keys.call_assistance_msg)}</Text>
        {}
        {process.env.NODE_ENV !== constants.PRODUCTION_ENV && (
          <FlexDiv
            styles={css`
              align-self: flex-start;
            `}
          >
            <Accordion collapsible>
              <AccordionItem value="error-msg">
                <AccordionHeader>
                  <Text link>Error message</Text>
                </AccordionHeader>
                <AccordionPanel>
                  <Text caption1>{error.stack}</Text>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </FlexDiv>
        )}
      </FlexDiv>
    )
  );
};

ErrorBoundaryUI.propTypes = {
  error: ErrorType.isRequired,
};

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: !!props.error || false,
      error: props.error || undefined,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  // eslint-disable-next-line no-unused-vars
  componentDidCatch(error, info) {
    /* TODO: Wire to Analytics - MixPanel maybe */
  }

  render() {
    if (this.state.hasError) {
      return <ErrorBoundaryUI error={this.state.error} />;
    }
    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node,
  hasError: PropTypes.bool,
  error: ErrorType,
};
export default ErrorBoundary;
