import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { ChevronDown24Regular, ChevronRight24Regular } from '@tfs/icons';
import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  makeStyles,
  Spinner,
  Tag,
  Text,
  tokens,
} from '@tfs/ui-components-next';
import _ from 'lodash';

import { useGetAudienceTypesQuery } from '../../../features/api/campaignApi';
import { createCategoryToggleHandler,getTagSelectionStyles, getTagStyles, normalizeCategorizedData } from '../../../utils/generic';

const useStyles = makeStyles(() => getTagSelectionStyles(tokens));

const formatName = (name) => name.charAt(0) + name.slice(1).toLowerCase();

const InterestSelector = ({ onChange, initialValue = {}, onAccordionChange }) => {
  const styles = useStyles();
  const { data: audienceTypes = {}, isLoading, error } = useGetAudienceTypesQuery();
  const interestTypes = audienceTypes.interests || {};
  const [selectedValues, setSelectedValues] = useState(initialValue);
  const [activeCategory, setActiveCategory] = useState('');

  const handleToggle = useCallback(
    createCategoryToggleHandler(selectedValues, setSelectedValues, onChange),
    [selectedValues, onChange],
  );

  const handleAccordionChange = useCallback(
    (_, data) => {
      const newValue = data.value;
      setActiveCategory(newValue);
      onAccordionChange?.(newValue);
    },
    [onAccordionChange],
  );

  const getSelectedCount = useCallback(
    (category) => {
      return selectedValues[category]?.length || 0;
    },
    [selectedValues],
  );

  // Ensure interestTypes[category] is always an array of { name, value }
  const normalizedInterestTypes = normalizeCategorizedData(interestTypes);

  if (isLoading) {
    return (
      <div className={styles.spinnerContainer}>
        <Spinner size="medium" />
      </div>
    );
  }

  if (error) {
    return <Text className={styles.error}>Error loading interest types</Text>;
  }

  return (
    <div className={styles.root}>
      <Accordion value={activeCategory} onValueChange={handleAccordionChange} multiple={false}>
        {Object.entries(normalizedInterestTypes).map(([category, interests]) => (
          <AccordionItem key={category} value={category}>
            <AccordionHeader
              className={styles.header}
              expandIcon={activeCategory === category ? <ChevronDown24Regular /> : <ChevronRight24Regular />}
            >
              <Text>
                {formatName(category)} ({getSelectedCount(category)} selected)
              </Text>
            </AccordionHeader>
            <AccordionPanel>
              <div className={styles.tagGroup}>
                {interests.map((interest) => (
                  <Tag
                    key={interest.value}
                    appearance={selectedValues[category]?.includes(interest.value) ? 'filled' : 'outline'}
                    onClick={() => handleToggle(category, interest.value)}
                    style={getTagStyles(selectedValues[category]?.includes(interest.value), tokens)}
                  >
                    {formatName(interest.name)}
                  </Tag>
                ))}
              </div>
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

InterestSelector.propTypes = {
  onChange: PropTypes.func,
  onAccordionChange: PropTypes.func,
  initialValue: PropTypes.object,
};

export default InterestSelector;
