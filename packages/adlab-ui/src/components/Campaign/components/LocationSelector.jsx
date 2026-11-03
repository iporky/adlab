import React from 'react';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, makeStyles, Text, tokens } from '@tfs/ui-components-next';

import { useSearchLocationsQuery } from '../../../features/api/campaignApi';
import { LOCATION_TYPES } from '../../../lib/constants';

import LocationAutocomplete from './LocationAutocomplete';

const useStyles = makeStyles({
  root: {
    borderRadius: tokens.borderRadiusMedium,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    padding: tokens.spacingVerticalL,
  },
  locationTypes: {
    marginBottom: tokens.spacingVerticalL,
  },
  toggleGroup: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: tokens.spacingHorizontalS,
    width: '100%',
    maxWidth: '600px',
    marginBottom: tokens.spacingVerticalM,
  },
  toggleButton: {
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: `${tokens.borderRadiusMedium} !important`,
    transition: 'all 0.2s ease-in-out',
    backgroundColor: tokens.colorNeutralBackground1,
    '&:hover': {
      borderColor: tokens.colorBrandBackground,
      backgroundColor: tokens.colorNeutralBackground2,
    },
    '&[data-selected=true]': {
      backgroundColor: tokens.colorBrandBackground,
      color: tokens.colorNeutralBackground1,
      '&:hover': {
        backgroundColor: tokens.colorBrandBackgroundHover,
      },
    },
  },
  autocompleteSection: {
    marginTop: tokens.spacingVerticalM,
  },
});

const LocationSelector = ({ onChange, initialValue = [] }) => {
  const styles = useStyles();
  const [value, setValue] = useState(initialValue);
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState(['city', 'region', 'country', 'zip', 'subcity', 'neighborhood']);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const skipQuery = inputValue === '';

  const { data } = useSearchLocationsQuery({ query: inputValue, locationTypes: selectedTypes }, { skip: skipQuery });

  useEffect(() => {
    let active = true;
    setLoading(true);

    if (!inputValue) {
      setOptions([]);
      setLoading(false);
      return;
    }

    const timer = setTimeout(() => {
      if (data?.data) {
        const locations = data.data.map((location) => {
          let displayName = location.name;

          switch (location.type) {
            case 'neighborhood':
            case 'subcity':
            case 'zip':
              if (location.primary_city) {
                displayName += `, ${location.primary_city}`;
              }
              if (location.region) {
                displayName += `, ${location.region}`;
              }
              if (location.country_name) {
                displayName += `, ${location.country_name}`;
              }
              break;

            case 'city':
              if (location.region) {
                displayName += `, ${location.region}`;
              }
              if (location.country_name) {
                displayName += `, ${location.country_name}`;
              }
              break;

            case 'region':
              if (location.country_name) {
                displayName += `, ${location.country_name}`;
              }
              break;

            default:
              break;
          }

          return {
            id: location.key,
            name: displayName,
            type: location.type.toLowerCase(),
            reach: location.audience_size || 0,
            raw: {
              ...location,
              country_name: location.country_name || '',
              region: location.region || '',
              primary_city: location.primary_city || '',
            },
          };
        });

        const sortedLocations = locations.sort((a, b) => {
          const order = {
            country: 0,
            region: 1,
            city: 2,
            subcity: 3,
            neighborhood: 4,
            zip: 5,
          };
          const typeOrder = (order[a.type] || 999) - (order[b.type] || 999);
          if (typeOrder !== 0) return typeOrder;

          if (a.type === b.type) {
            if (a.type === 'city' && a.raw.primary_city !== b.raw.primary_city) {
              return a.raw.primary_city ? -1 : 1;
            }

            const aComplete = (a.raw.country_name ? 2 : 0) + (a.raw.region ? 1 : 0);
            const bComplete = (b.raw.country_name ? 2 : 0) + (b.raw.region ? 1 : 0);
            if (aComplete !== bComplete) return bComplete - aComplete;

            return a.name.localeCompare(b.name);
          }

          return 0;
        });

        if (active) {
          setOptions(sortedLocations);
        }
      } else {
        setOptions([]);
      }
      if (active) {
        setLoading(false);
      }
    }, 300);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [inputValue, selectedTypes, data]);

  const handleLocationTypeChange = (type) => {
    // Only update if we'll still have at least one type selected
    const newTypes = selectedTypes.includes(type) ? selectedTypes.filter((t) => t !== type) : [...selectedTypes, type];

    if (newTypes.length > 0) {
      setSelectedTypes(newTypes);
    }
  };

  return (
    <div className={styles.root}>
      <Text size={400} weight="semibold">
        Locations
      </Text>

      <div className={styles.locationTypes}>
        <Text size={300} weight="semibold">
          Location Types
        </Text>
        <div className={styles.toggleGroup}>
          {LOCATION_TYPES.map((type) => (
            <Button
              key={type.value}
              appearance={selectedTypes.includes(type.value) ? 'primary' : 'outline'}
              onClick={() => handleLocationTypeChange(type.value)}
              className={styles.toggleButton}
              data-selected={selectedTypes.includes(type.value)}
            >
              {type.label}
            </Button>
          ))}
        </div>
      </div>

      <div className={styles.autocompleteSection}>
        <LocationAutocomplete
          value={Array.isArray(value) ? value : []}
          onChange={(_, newValue) => {
            setValue(newValue);
            onChange(newValue);
          }}
          inputValue={inputValue}
          onInputChange={setInputValue}
          options={options}
          loading={loading}
        />
      </div>
    </div>
  );
};

LocationSelector.propTypes = {
  onChange: PropTypes.func.isRequired,
  initialValue: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      reach: PropTypes.number.isRequired,
      raw: PropTypes.shape({
        country_name: PropTypes.string,
        region: PropTypes.string,
        primary_city: PropTypes.string,
        type: PropTypes.string,
        audience_size: PropTypes.number,
      }),
    }),
  ),
};

export default LocationSelector;
