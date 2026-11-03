import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Dismiss24Regular } from '@tfs/icons';
import { Input, makeStyles, Tag, tokens } from '@tfs/ui-components-next';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
  },
  tagsList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: tokens.spacingHorizontalXS,
    marginTop: tokens.spacingVerticalS,
  },
});

const TagInput = ({ onTagsUpdate, initialTags = [] }) => {
  const styles = useStyles();
  const [tags, setTags] = useState(initialTags);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    onTagsUpdate(tags);
  }, [tags, onTagsUpdate]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      if (!tags.includes(inputValue.trim())) {
        const newTags = [...tags, inputValue.trim()];
        setTags(newTags);
        setInputValue('');
      }
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      const newTags = tags.slice(0, -1);
      setTags(newTags);
    }
  };

  const handleTagDismiss = (tagToRemove) => {
    const newTags = tags.filter((tag) => tag !== tagToRemove);
    setTags(newTags);
  };

  return (
    <div className={styles.root}>
      <Input
        placeholder="Type and press Enter to add tags"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
      />
      <div className={styles.tagsList}>
        {tags.map((tag) => (
          <Tag key={tag} dismissIcon={<Dismiss24Regular />} dismissible onClick={() => handleTagDismiss(tag)}>
            {tag}
          </Tag>
        ))}
      </div>
    </div>
  );
};

TagInput.propTypes = {
  onTagsUpdate: PropTypes.func.isRequired,
  initialTags: PropTypes.arrayOf(PropTypes.string),
};

TagInput.defaultProps = {
  initialTags: [],
};

export default TagInput;
