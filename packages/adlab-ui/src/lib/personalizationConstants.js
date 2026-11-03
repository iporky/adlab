/**
 * Default personalization fields for campaign combination builder
 */

export const DEFAULT_PERSONALIZATION_FIELDS = [
  {
    name: 'dayofweek',
    label: 'Day of Week',
    type: 'select',
    values: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  },
  {
    name: 'timeofday',
    label: 'Time of Day',
    type: 'select',
    values: ['Morning', 'Afternoon', 'Evening', 'Night'],
  },
  {
    name: 'weather',
    label: 'Weather',
    type: 'select',
    values: ['Sunny', 'Cloudy', 'Rainy', 'Snowy', 'Stormy', 'Windy'],
  },
  {
    name: 'season',
    label: 'Season',
    type: 'select',
    values: ['Spring', 'Summer', 'Fall', 'Winter'],
  },
  {
    name: 'location',
    label: 'Location',
    type: 'select',
    values: ['Urban', 'Suburban', 'Rural', 'Coastal', 'Mountain'],
  },
  {
    name: 'segment',
    label: 'Segment',
    type: 'select',
    values: ['Premium', 'Standard', 'Budget', 'VIP', 'New Customer', 'Returning Customer'],
  },
  {
    name: 'device',
    label: 'Device',
    type: 'select',
    values: ['Mobile', 'Desktop', 'Tablet', 'Smart TV', 'Wearable'],
  },
  {
    name: 'geo',
    label: 'Geography',
    type: 'select',
    values: ['North America', 'Europe', 'Asia Pacific', 'Latin America', 'Middle East', 'Africa'],
  },
];

export const PERSONALIZATION_FIELD_TYPES = {
  STRING: 'string',
  URL: 'url',
  NUMBER: 'number',
  SELECT: 'select',
  BOOLEAN: 'boolean',
};
