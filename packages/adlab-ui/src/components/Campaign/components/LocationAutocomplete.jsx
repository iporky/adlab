import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Dismiss24Regular } from '@tfs/icons';
import { Combobox, makeStyles, Option, Tag, tokens } from '@tfs/ui-components-next';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
    width: '100%',
  },
  selectedTags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: tokens.spacingHorizontalXS,
    marginTop: tokens.spacingVerticalS,
  },
  tag: {
    backgroundColor: tokens.colorBrandBackground,
    borderColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralForegroundInverted,
  },
});

const formatLocationType = (type) => type.charAt(0).toUpperCase() + type.slice(1);

const formatLocationDisplay = (name, type) => `${name} [${formatLocationType(type)}]`;

const LocationAutocomplete = ({ value = [], onChange, inputValue, onInputChange, options, loading }) => {
  const styles = useStyles();

  const handleSelect = useCallback(
    (_, data) => {
      const location = options.find((opt) => opt.id === data.optionValue);
      if (location && !value.find((v) => v.id === location.id)) {
        const newLocations = [...value, location];
        onChange(undefined, newLocations);
        onInputChange('');
      }
    },
    [onChange, onInputChange, options, value],
  );

  const handleRemove = useCallback(
    (locationToRemove) => {
      const newLocations = value.filter((loc) => loc.id !== locationToRemove.id);
      onChange(undefined, newLocations);
    },
    [onChange, value],
  );

  return (
    <div className={styles.root}>
      <Combobox
        placeholder="Search locations..."
        onOptionSelect={handleSelect}
        input={{
          value: inputValue,
          onChange: (e) => onInputChange(e.target.value),
        }}
        loading={loading}
      >
        {options.map((option) => (
          <Option key={option.id} value={option.id}>
            {formatLocationDisplay(option.name, option.type)}
          </Option>
        ))}
      </Combobox>

      {value.length > 0 && (
        <div className={styles.selectedTags}>
          {value.map((location) => (
            <Tag
              key={location.id}
              className={styles.tag}
              dismissIcon={<Dismiss24Regular />}
              dismissible
              onDismiss={() => handleRemove(location)}
            >
              {formatLocationDisplay(location.name, location.type)}
            </Tag>
          ))}
        </div>
      )}
    </div>
  );
};

LocationAutocomplete.propTypes = {
  value: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
    }),
  ),
  onChange: PropTypes.func.isRequired,
  inputValue: PropTypes.string.isRequired,
  onInputChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
  loading: PropTypes.bool,
};

export default LocationAutocomplete;
