import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft24Regular } from '@tfs/icons';
import { 
  Breadcrumb,
  BreadcrumbButton,
  BreadcrumbDivider,
  BreadcrumbItem,
  Button, 
  makeStyles, 
  Text, 
  tokens,
} from '@tfs/ui-components-next';

import SampleInputs from '../../commons/SampleInputs';
import TagInput from '../../commons/TagInput';
import i18n from '../../helpers/i18n';
import { updateTags } from '../../store/slices/campaignSlice';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    padding: tokens.spacingVerticalM,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: tokens.spacingVerticalM,
  },
  buttonGroup: {
    display: 'flex',
    gap: tokens.spacingHorizontalM,
  },
  mainContent: {
    display: 'flex',
    flexDirection: 'row',
    gap: tokens.spacingHorizontalM,
    justifyContent: 'space-between',
    flex: 1,
    height: '100%',
  },
  form: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '600px',
  },
  formSection: {
    marginBottom: tokens.spacingVerticalL,
  },
  label: {
    display: 'block',
    marginBottom: tokens.spacingVerticalS,
    fontWeight: tokens.fontWeightSemibold,
  },
  description: {
    marginBottom: tokens.spacingVerticalL,
    color: tokens.colorNeutralForeground2,
    fontSize: tokens.fontSizeBase300,
    lineHeight: tokens.lineHeightBase300,
  },
  sampleSection: {
    width: '300px',
    position: 'sticky',
    top: tokens.spacingVerticalL,
    height: 'fit-content',
  },
  tagInputContainer: {
    padding: tokens.spacingVerticalL,
    borderRadius: tokens.borderRadiusLarge,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    backgroundColor: tokens.colorNeutralBackground1,
  },
});

const Tags = () => {
  const styles = useStyles();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const formData = useSelector((state) => state.campaign?.formData || {});
  const [tags, setTags] = useState(formData.tags || []);
  const [focusedField, setFocusedField] = useState('tags');

  useEffect(() => {
    dispatch(updateTags(tags));
  }, [dispatch, tags]);

  const handleNext = () => {
    navigate('/adlab/campaign/template');
  };

  const handleTagsUpdate = (newTags) => {
    setTags(newTags);
  };

  const handleFocus = () => {
    setFocusedField('tags');
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacingHorizontalS }}>
          <Button
            appearance="subtle"
            icon={<ArrowLeft24Regular />}
            onClick={() => navigate(-1)}
            style={{ padding: 0, minWidth: 0 }}
          />
          <Breadcrumb>
            <BreadcrumbItem>
              <BreadcrumbButton onClick={() => navigate('/adlab')}>
                {i18n.t(i18n.keys.home)}
              </BreadcrumbButton>
            </BreadcrumbItem>
            <BreadcrumbDivider />
            <BreadcrumbItem>
              <BreadcrumbButton onClick={() => navigate('/adlab/campaigns')}>
                {i18n.t(i18n.keys.Campaigns)}
              </BreadcrumbButton>
            </BreadcrumbItem>
            <BreadcrumbDivider />
            <BreadcrumbItem>
            	<BreadcrumbButton current>
            		{i18n.t(i18n.keys.tags)}
            	</BreadcrumbButton>
            </BreadcrumbItem>
          </Breadcrumb>
        </div>
        <div className={styles.buttonGroup}>
          <Button
            appearance="secondary"
            onClick={() => {
              navigate('/adlab/campaigns');
            }}
          >
            {i18n.t(i18n.keys.cancel)}
          </Button>
          <Button appearance="primary" onClick={handleNext}>
            {i18n.t(i18n.keys.next)}
          </Button>
        </div>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.form}>
          <Text as="h1" size={400} weight="semibold" style={{ marginBottom: tokens.spacingVerticalS }}>
            {i18n.t(i18n.keys.tags_header)}
          </Text>
          <div className={styles.formSection}>
            <div 
              className={styles.tagInputContainer}
              onFocus={handleFocus}
              onBlur={handleBlur}
            >
              <TagInput 
                onTagsUpdate={handleTagsUpdate} 
                initialTags={tags}
              />
            </div>
          </div>
        </div>

        <div className={styles.sampleSection}>
          <SampleInputs focusedField={focusedField} />
        </div>
      </div>
    </div>
  );
};

export default Tags;
