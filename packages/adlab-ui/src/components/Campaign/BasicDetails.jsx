import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbButton,
  BreadcrumbDivider,
  BreadcrumbItem,
  Button,
  DatePicker,
  Input,
  makeStyles,
  Text,
  Textarea,
  tokens,
} from '@tfs/ui-components-next';
import _ from 'lodash';

import SampleInputs from '../../commons/SampleInputs';
import { useGetCampaignFormatsQuery, useGetCampaignTypesQuery } from '../../features/api/campaignApi';
import i18n from '../../helpers/i18n';
import { PLACEHOLDERS, VALIDATION } from '../../lib/constants';
import { resetCampaignForm, updateBasicDetails } from '../../store/slices/campaignSlice';
import { deserializeDate, serializeDate } from '../../utils/dateUtils';
import { normalizeToArray } from '../../utils/generic';
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
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
    width: '50%',
    maxWidth: '600px',
    overflowY: 'auto',
    height: '100%',
  },
  datePickerGroup: {
    display: 'flex',
    gap: tokens.spacingHorizontalM,
  },
  chipGroupContainer: {
    display: 'flex',  
    flexDirection: 'column',
    gap: tokens.spacingVerticalL, 
  },
  chipGroup: {
    display: 'flex',
    gap: tokens.spacingHorizontalXS,
    flexWrap: 'wrap',
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusLarge,
    padding: tokens.spacingVerticalM,
    height: '100%',
    backgroundColor: tokens.colorNeutralBackground2,
  },
  sampleInputs: {
    width: '35%',
  },
});

const BasicDetails = () => {
  const styles = useStyles();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Initialize with default values since the state might not exist yet
  const defaultBasicDetails = {
    campaignName: '',
    description: '',
    startDate: null,
    endDate: null,
    currency: '',
    budget: '',
    campaignType: 'Programmatic',
    campaignFormat: 'Display',
  };

  // Safely access the state with fallback to default values
  const basicDetails = useSelector((state) => state.campaign?.formData?.basicDetails || defaultBasicDetails);

  const [startDate, setStartDate] = React.useState(deserializeDate(basicDetails.startDate));
  const [endDate, setEndDate] = React.useState(deserializeDate(basicDetails.endDate));
  const [campaignType, setCampaignType] = React.useState(basicDetails.campaignType);
  const [campaignFormat, setCampaignFormat] = React.useState(basicDetails.campaignFormat);
  const [focusedField, setFocusedField] = React.useState(null);

  // Use queries to fetch campaign types and formats
  const { data: campaignTypesData, isLoading: isTypesLoading } = useGetCampaignTypesQuery();
  const { data: campaignFormatsData, isLoading: isFormatsLoading } = useGetCampaignFormatsQuery();

  useEffect(() => {
    dispatch(
      updateBasicDetails({
        startDate: serializeDate(startDate),
        endDate: serializeDate(endDate),
      }),
    );
  }, [dispatch, startDate, endDate]);

  const handleCampaignTypeSelect = (type) => {
    setCampaignType(type);
    dispatch(updateBasicDetails({ campaignType: type }));
  };

  const handleCampaignFormatSelect = (format) => {
    setCampaignFormat(format);
    dispatch(updateBasicDetails({ campaignFormat: format }));
  };

  const handleFocus = (field) => {
    setFocusedField(field);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  return (
    <div>
      <div style={{ padding: '12px 12px 0px 12px' }}>
        <Breadcrumb aria-label="Breadcrumb navigation">
          <BreadcrumbItem>
            <BreadcrumbButton href="/adlab">Home</BreadcrumbButton>
          </BreadcrumbItem>
          <BreadcrumbDivider />
          <BreadcrumbItem>
            <BreadcrumbButton href="/adlab/campaigns">Campaigns</BreadcrumbButton>
          </BreadcrumbItem>
          <BreadcrumbDivider />
          <BreadcrumbItem>
            <BreadcrumbButton href="/adlab/campaign/basic" current>
              Basic
            </BreadcrumbButton>
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
      <div className={styles.root}>
        {/* Header */}
        <div className={`${styles.header} container-bg`}>
          <Text size={400} weight="semibold">
            {i18n.t(i18n.keys.basic_details_header)}
          </Text>
          <div className={styles.buttonGroup}>
            <Button
              appearance="secondary"
              onClick={() => {
                dispatch(resetCampaignForm());
                navigate('/adlab/campaigns');
              }}
            >
              Cancel
            </Button>
            <Button appearance="primary" onClick={() => navigate('/adlab/campaign/objectives')}>
              Next
            </Button>
          </div>
        </div>

        {/* Main Content Area */}
          <div className={styles.mainContent}>
            <div className={styles.form}>
              {/* Campaign Name */}
            <Input
              label="Campaign name"
              value={basicDetails.campaignName}
              onChange={(e) => dispatch(updateBasicDetails({ campaignName: e.target.value }))}
              onFocus={() => handleFocus('campaignName')}
              onBlur={handleBlur}
              minLength={VALIDATION.CAMPAIGN_NAME.MIN_LENGTH}
              maxLength={VALIDATION.CAMPAIGN_NAME.MAX_LENGTH}
              placeholder={`Campaign name (${VALIDATION.CAMPAIGN_NAME.MIN_LENGTH}-${VALIDATION.CAMPAIGN_NAME.MAX_LENGTH} characters)`}
              size="medium"
            />
            {/* Description */}
            <Textarea
              label="Description"
              value={basicDetails.description}
              onChange={(e) => dispatch(updateBasicDetails({ description: e.target.value }))}
              onFocus={() => handleFocus('description')}
              onBlur={handleBlur}
              minLength={VALIDATION.DESCRIPTION.MIN_LENGTH}
              maxLength={VALIDATION.DESCRIPTION.MAX_LENGTH}
              placeholder={PLACEHOLDERS.DESCRIPTION}
              resize="vertical"
              rows={4}
              size="medium"
            />
            {/* Date Pickers */}
            <div className={styles.datePickerGroup}>
              <DatePicker
                label="Start date"
                value={startDate}
                onSelectDate={(date) => setStartDate(date)}
                placeholder="Start date"
                onFocus={() => handleFocus('startDate')}
                onBlur={handleBlur}
              />
              <DatePicker
                label="End date"
                value={endDate}
                onSelectDate={(date) => setEndDate(date)}
                placeholder="End date"
                onFocus={() => handleFocus('endDate')}
                onBlur={handleBlur}
              />
            </div>
            {/* Campaign Type and Format */}
            <div className={styles.chipGroupContainer}>
              {/* Campaign Type */}
              <div className={styles.card}>
                <Text weight="semibold">Campaign Type</Text>
                <div className={styles.chipGroup}>
                  {isTypesLoading ? (
                    <Text>{i18n.t(i18n.keys.loading)}</Text>
                  ) : (
                    (() => {
                      const typesArray = normalizeToArray(campaignTypesData);
                      return typesArray.length > 0 ? (
                        typesArray.map((type, index) => (
                          <Button
                            key={type.value || type.name || `type-${index}`}
                            appearance={campaignType === type.value ? 'primary' : 'secondary'}
                            onClick={() => handleCampaignTypeSelect(type.value)}
                            size="small"
                          >
                            {type.value || type.name || i18n.t(i18n.keys.unknown)}
                          </Button>
                        ))
                      ) : (
                        <Text>{i18n.t(i18n.keys.no_campaign_types_available)}</Text>
                      );
                    })()
                  )}
                </div>
              </div>

              {/* Campaign Format */}
              <div className={styles.card}>
                <Text weight="semibold">Campaign Format</Text>
                <div className={styles.chipGroup}>
                  {isFormatsLoading ? (
                    <Text>{i18n.t(i18n.keys.loading)}</Text>
                  ) : (
                    (() => {
                      const formatsArray = normalizeToArray(campaignFormatsData);
                      return formatsArray.length > 0 ? (
                        formatsArray.map((format, index) => (
                          <Button
                            key={format.value || format.name || `format-${index}`}
                            appearance={campaignFormat === format.value ? 'primary' : 'secondary'}
                            onClick={() => handleCampaignFormatSelect(format.value)}
                            size="small"
                          >
                            {format.value || format.name || i18n.t(i18n.keys.unknown)}
                          </Button>
                        ))
                      ) : (
                        <Text>{i18n.t(i18n.keys.no_campaign_formats_available)}</Text>
                      );
                    })()
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sample Inputs */}
          <div className={styles.sampleInputs}>
            <SampleInputs focusedField={focusedField} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicDetails;
