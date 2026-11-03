import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, Spinner, Tag, Text, tokens } from '@tfs/ui-components-next';

import { useGetAgeTypesQuery } from '../../../features/api/campaignApi';
import { createToggleHandler, getTagStyles } from '../../../utils/generic';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
  },
  chipGroup: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: tokens.spacingHorizontalXS,
  },
  spinnerContainer: {
    display: 'flex',
    justifyContent: 'center',
    padding: tokens.spacingVerticalL,
  },
});

const AgeSelector = ({ onChange, initialValue = [] }) => {
  const styles = useStyles();
  const [selectedAges, setSelectedAges] = useState(initialValue);
  const { data: ageTypes = {}, isLoading } = useGetAgeTypesQuery();

  const handleAgeSelect = createToggleHandler(selectedAges, setSelectedAges, onChange);

  // Flatten all ages into a single array for tag selection
  const allAges = Object.entries(ageTypes).map(([key, value]) => ({ key, value }));

  if (isLoading) {
    return (
      <div className={styles.spinnerContainer}>
        <Spinner size="medium" />
      </div>
    );
  }

  return (
    <div className={styles.root}>
      <div className={styles.chipGroup}>
        {allAges.map(({ key, value }) => (
          <Tag
            key={key}
            appearance={selectedAges.includes(key) ? 'filled' : 'outline'}
            onClick={() => handleAgeSelect(key)}
            style={getTagStyles(selectedAges.includes(key), tokens)}
          >
            {value}
          </Tag>
        ))}
      </div>
    </div>
  );
};

AgeSelector.propTypes = {
  onChange: PropTypes.func.isRequired,
  initialValue: PropTypes.arrayOf(PropTypes.string),
};

export default AgeSelector;
