import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, Text, tokens } from '@tfs/ui-components-next';

import { fieldInsights } from '../lib/constants';

/**
 * @typedef {Object} StyleClasses
 * @property {string} root - Root container styles
 * @property {string} title - Title text styles
 * @property {string} content - Content text styles
 */

/**
 * Creates styles for the SampleInputs component using TFS design tokens
 * @returns {StyleClasses} The style classes object
 */

const useStyles = makeStyles({
  root: {
    width: '30vw',
    height: '45vh',
    maxHeight: 'calc(100vh - 100px)',
    padding: tokens.spacingVerticalL,
    justifySelf: 'end',
    right: 0,
    borderRadius: tokens.borderRadiusLarge,
    boxShadow: tokens.shadow4,
    overflowY: 'auto',
  },
  title: {
    marginBottom: tokens.spacingVerticalM,
  },
  content: {
    fontWeight: 400,
    fontStyle: 'normal',
    fontSize: '16px',
    lineHeight: '22px',
    letterSpacing: '0',
    color: '#222AE5',
  },
});

/**
 * SampleInputs component displays contextual help and examples for form fields
 * when they are focused. It shows the insights with a typing animation effect.
 *
 * @component
 * @param {Object} props - Component props
 * @param {string|null} props.focusedField - The key of the currently focused form field.
 *                                          Used to lookup relevant insights from fieldInsights.
 * @returns {JSX.Element} A card displaying insights for the focused field with animated typing effect
 *
 * @example
 * ```jsx
 * <SampleInputs focusedField="campaignName" />
 * ```
 */
const SampleInputs = ({ focusedField }) => {
  /** @type {StyleClasses} Styles generated using TFS design tokens */
  const styles = useStyles();

  /** @type {[string, Function]} State to hold the currently displayed insight text */
  const [insightText, setInsightText] = useState('');

  /** @type {React.MutableRefObject<number|null>} Reference to the typing animation timer */
  const timerRef = useRef(null);

  /**
   * Effect to handle the typing animation of the insight text.
   * When focusedField changes:
   * 1. Gets the full text for the field from fieldInsights
   * 2. Resets current displayed text
   * 3. Starts a typing animation that adds one character at a time
   * 4. Cleans up timer when component unmounts or field changes
   */
  useEffect(() => {
    const fullText = fieldInsights[focusedField] || 'Select a field to see relevant insights and examples.';

    setInsightText(''); // Reset text
    let index = 0;

    /**
     * Handles the typing animation logic:
     * - Gradually reveals the insight text one character at a time
     * - Updates state with each new character
     * - Stops the animation when full text is displayed
     * @function
     */
    const typeText = () => {
      if (index < fullText.length) {
        setInsightText(fullText.substring(0, index + 1));
        index++;
      } else {
        clearInterval(timerRef.current);
      }
    };

    timerRef.current = setInterval(typeText, 15);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [focusedField]);

  /**
   * Renders the insight card with title and animated content.
   * Uses TFS Text component with design tokens for consistent styling.
   */
  return (
    <div className={`${styles.root} container-bg`}>
      <div className="container-bg">
      <Text size={400} weight="semibold" className={styles.title}>
        Insight: &nbsp;
      </Text>
        <Text size={300} className={styles.content}>
          {insightText}
        </Text>
      </div>  
    </div>
  );
};

SampleInputs.propTypes = {
  focusedField: PropTypes.string,
};

SampleInputs.defaultProps = {
  focusedField: null,
};

export default SampleInputs;
