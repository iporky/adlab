import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { tfsuiTheme, typographyStyles } from '@tfs/ui-components-next';
import { capitalize } from 'lodash';

/**
 * Global Typography. Uses fluentUI Typography.
 * Refer https://react.fluentui.dev/?path=/docs/theme-typography--page for all styles.
 * Extend functionality and use it for a consistent typography system.
 */
const StyledTemplate = styled.div`
  /* Base style is body2 */
  ${typographyStyles.body2} /* Override any of the typographies exposed by fluentui */ ${(props) =>
    Object.keys(typographyStyles).reduce((styles, type) => {
      if (Object.keys(props).includes(type)) {
        return { ...styles, ...typographyStyles[type] };
      }
      return styles;
    }, {})};

  /* Common overrides */
  ${({ bd }) => bd && { fontWeight: tfsuiTheme.fontWeightSemibold }};
  ${({ it }) => it && { fontStyle: 'italic' }};
  ${({ ul }) => ul && { textDecoration: 'underline' }};
  ${({ inline }) => inline && { display: 'inline' }};
  ${({ block }) => block && { display: 'block' }};
  ${({ clickable }) => clickable && { cursor: 'pointer' }};
  ${({ link }) =>
    link && {
      cursor: 'pointer',
      color: tfsuiTheme.colorPaletteCornflowerBorderActive,
    }};

  &:hover {
    ${({ link }) => link && { color: tfsuiTheme.colorPaletteNavyBorderActive }};
  }

  /* disabled styling */
  ${({ disabled }) =>
    disabled && {
      color: tfsuiTheme.colorNeutralForegroundDisabled,
      cursor: 'not-allowed',
    }};

  /* Manual overrides of any style */
  ${({ styles }) => ({ ...styles })}
`;

const StyledComponent = ({ ...rest }) => <StyledTemplate {...rest} />;

const TextAsTag = ({ as, ...rest }) => {
  const TagComponent = StyledTemplate.withComponent(as);
  return <TagComponent {...rest} />;
};

const Text = ({ as, ...rest }) => {
  if (as) {
    TextAsTag.displayName = `TextAs${capitalize(as)}`;
    return <TextAsTag as={as} {...rest} />;
  }

  StyledComponent.displayName = 'Text';
  return <StyledComponent {...rest} />;
};

const typographyTags = [
  /* Block level elements */
  'div',
  'p',
  'blockquote',
  'pre',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  /* Inline elements */
  'a',
  'span',
  'strong',
  'em',
  'b',
  'i',
  'mark',
  'small',
  'del',
];
TextAsTag.propTypes = {
  as: PropTypes.oneOf(typographyTags),
};
Text.propTypes = {
  as: PropTypes.oneOf(typographyTags),
  display: PropTypes.bool,
  largeTitle: PropTypes.bool,
  title1: PropTypes.bool,
  title2: PropTypes.bool,
  title3: PropTypes.bool,
  subtitle1: PropTypes.bool,
  subtitle2: PropTypes.bool,
  body2: PropTypes.bool,
  body1: PropTypes.bool,
  caption1: PropTypes.bool,
  caption2: PropTypes.bool,
  bd: PropTypes.bool,
  it: PropTypes.bool,
  ul: PropTypes.bool,
  inline: PropTypes.bool,
  block: PropTypes.bool,
  clickable: PropTypes.bool,
  disabled: PropTypes.bool,
  link: PropTypes.bool,
  styles: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
};
export default Text;
