import React from 'react';
import { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { Dismiss24Regular } from '@tfs/icons';
import { Combobox, makeStyles, Option, Tag, tokens } from '@tfs/ui-components-next';

import { formatName } from '../../../commons/utils';
import { useGetLanguageTypesQuery } from '../../../features/api/campaignApi';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
  },
  combobox: {
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

const LanguageSelector = ({ onChange, initialValue = [] }) => {
  const styles = useStyles();
  const [selectedLanguages, setSelectedLanguages] = useState(initialValue);
  const { data: languageOptions = [], isLoading } = useGetLanguageTypesQuery();

  const handleLanguageSelect = useCallback(
    (_, data) => {
      const selectedLanguage = data.optionValue;
      if (!selectedLanguages.includes(selectedLanguage)) {
        const newLanguages = [...selectedLanguages, selectedLanguage];
        setSelectedLanguages(newLanguages);
        onChange(newLanguages);
      }
    },
    [selectedLanguages, onChange],
  );

  const handleLanguageRemove = useCallback(
    (language) => {
      const newLanguages = selectedLanguages.filter((lang) => lang !== language);
      setSelectedLanguages(newLanguages);
      onChange(newLanguages);
    },
    [selectedLanguages, onChange],
  );

  const getLanguageName = useCallback(
    (value) => {
      const language = languageOptions.find((lang) => lang.value === value);
      return language ? formatName(language.name) : value;
    },
    [languageOptions],
  );

  return (
    <div className={styles.root}>
      <Combobox
        className={styles.combobox}
        placeholder="Select languages..."
        onOptionSelect={handleLanguageSelect}
        loading={isLoading}
      >
        {languageOptions.map((language) => (
          <Option key={language.value} value={language.value}>
            {formatName(language.name)}
          </Option>
        ))}
      </Combobox>

      <div className={styles.selectedTags}>
        {selectedLanguages.map((language) => (
          <Tag
            key={language}
            className={styles.tag}
            dismissIcon={<Dismiss24Regular />}
            dismissible
            onDismiss={() => handleLanguageRemove(language)}
          >
            {getLanguageName(language)}
          </Tag>
        ))}
      </div>
    </div>
  );
};

LanguageSelector.propTypes = {
  onChange: PropTypes.func.isRequired,
  initialValue: PropTypes.arrayOf(PropTypes.string),
};

export default LanguageSelector;
