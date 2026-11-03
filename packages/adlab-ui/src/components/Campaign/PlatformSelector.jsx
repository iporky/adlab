import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { ArrowLeft24Regular } from '@tfs/icons';
import { Button, Checkbox, Dropdown, Input, makeStyles, Option, OptionGroup, Spinner, Text, tokens } from '@tfs/ui-components-next';
import _ from 'lodash';

import SampleInputs from '../../commons/SampleInputs';
import { useCreateCampaignMutation, useGetCurrenciesQuery, useUpdateCampaignMutation } from '../../features/api/campaignApi';
import { selectAppConfig,selectUser } from '../../features/session/sessionSlice';
import i18n from '../../helpers/i18n';
import { PLATFORM_OPTIONS, VALIDATION } from '../../lib/constants';
import { setCampaignId,updateBasicDetails, updateCurrencyOptions, updatePlatformCampaigns } from '../../store/slices/campaignSlice';
import { transformCurrencyOptions } from '../../utils/generic';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    padding: tokens.spacingHorizontalL,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: tokens.spacingVerticalXL,
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
  },
  backButton: {
    padding: 0,
    minWidth: 0,
  },
  content: {
    display: 'flex',
    gap: tokens.spacingHorizontalL,
    flex: 1,
    height: '100%',
  },
  leftContent: {
    flex: 1,
    borderRadius: tokens.borderRadiusMedium,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    padding: tokens.spacingVerticalL,
    height: '55vh',
    overflowY: 'auto',
  },
  headerInfo: {
    display: 'flex',
    position: 'sticky',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: tokens.spacingVerticalL,
  },
  totalInfo: {
    textAlign: 'right',
  },
  platformList: {
    marginTop: tokens.spacingVerticalM,
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
  },
  platformItem: {
    padding: tokens.spacingVerticalM,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusMedium,
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: tokens.colorNeutralBackground2,
    },
  },
  platformItemContent: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    gap: tokens.spacingHorizontalM,
  },
  imageContainer: {
    width: '80px',
    height: '40px',
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusMedium,
    padding: tokens.spacingVerticalS,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: tokens.colorNeutralBackground1,
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    opacity: 0,
    transition: 'opacity 0.3s',
    position: 'relative',
    zIndex: 1,
  },
  percentageInput: {
    width: '100px',
  },
  percentageBox: {
    textAlign: 'right',
  },
  sampleSection: {
    width: '35%',
  },
  currencyBudgetGroup: {
    display: 'flex',
    gap: tokens.spacingHorizontalL,
    marginBottom: tokens.spacingVerticalXL,
  },
});

const PlatformImage = ({ platform }) => {
  const styles = useStyles();
  const [isLoading, setIsLoading] = useState(true);
  return (
    <div className={styles.imageContainer}>
      <img
        src={platform.image}
        alt={platform.name}
        className={styles.image}
        onLoad={(e) => {
          e.target.style.opacity = 1;
          e.target.parentElement.style.backgroundColor = '#FFFFFF';
          setIsLoading(false);
        }}
      />
      {isLoading && <Spinner style={{ position: 'absolute' }} />}
    </div>
  );
};

const PlatformSelector = () => {
  const styles = useStyles();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const platformCampaigns = useSelector((state) => state.campaign.formData.platformCampaigns || []);
  const basicDetails = useSelector((state) => state.campaign?.formData?.basicDetails || {});
  const objectives = useSelector((state) => state.campaign?.formData?.objectives || {});
  const tags = useSelector((state) => state.campaign?.formData?.tags || []);
  const campaignId = useSelector((state) => state.campaign?.campaignId);
  const user = useSelector(selectUser);
  const appConfig = useSelector(selectAppConfig);
  const { data: currencyData = {}, isLoading } = useGetCurrenciesQuery();
  const [createCampaign, { isLoading: isCreating }] = useCreateCampaignMutation();
  const [updateCampaign, { isLoading: isUpdating }] = useUpdateCampaignMutation();
  const currencyOptions = useSelector((state) => state.campaign?.currencyOptions);
  const [currency, setCurrency] = React.useState(basicDetails.currency);
  const [budget, setBudget] = React.useState(basicDetails.budget);
  const [focusedField, setFocusedField] = React.useState('platform');
  
  const isSaving = isCreating || isUpdating;
  const isEditMode = !!campaignId;

  const totalAllocation = useMemo(() => 
    platformCampaigns.reduce((sum, campaign) => sum + (Number(campaign.percentage) || 0), 0), 
    [platformCampaigns]
  );

  useEffect(() => {
    if (platformCampaigns.length === 0) {
      const initialPlatform = PLATFORM_OPTIONS[0];
      dispatch(
        updatePlatformCampaigns([
          {
            platform: initialPlatform.id,
            percentage: initialPlatform.defaultPercentage.toString(),
          },
        ]),
      );
    }
  }, [dispatch, platformCampaigns.length]);

  useEffect(() => {
    if (currencyData && Object.keys(currencyData).length > 0) {
      dispatch(updateCurrencyOptions(transformCurrencyOptions(currencyData)));
    }
  }, [currencyData, dispatch]);

  // Sync local currency state with basicDetails
  useEffect(() => {
    if (basicDetails.currency) {
      setCurrency(basicDetails.currency);
    }
  }, [basicDetails.currency]);

  useEffect(() => {
    dispatch(
      updateBasicDetails({
        budget,
        currency,
      }),
    );
  }, [dispatch, budget, currency]);

  const handleNext = useCallback(async () => {
    try {
      // Prepare campaign data based on the current form state
      const campaignData = {
        campaignName: basicDetails.campaignName,
        description: basicDetails.description,
        status: "DRAFT",
        objective: objectives.selectedObjective,
        startDate: basicDetails.startDate,
        endDate: basicDetails.endDate,
        budget: {
          budgetType: "DAILY",
          amount: Number(budget),
          currency: currency,
          pacing: "STANDARD"
        },
        tags: tags || [],
        goals: objectives.selectedGoal ? [objectives.selectedGoal] : [""],
        createdBy: user?.email,
        campaignType: basicDetails.campaignType,
        campaignFormat: basicDetails.campaignFormat,
        clientId: appConfig?.selectedClientId,
        accountId: appConfig?.selectedAccountId,
        targetingIds: [], // Assuming targeting IDs are handled separately
      };

      let result;
      if (isEditMode) {
        // Update existing campaign
        result = await updateCampaign({
          campaignId,
          ...campaignData
        });
      } else {
        // Create new campaign
        result = await createCampaign(campaignData);
      }
      
      if (result.data) {
        console.log('Campaign saved successfully:', result.data);
        const savedCampaignId = campaignId || result.data._id;
        if (savedCampaignId) {
          // Store the campaign ID for edit mode
          dispatch(setCampaignId(savedCampaignId));
          // Navigate to targeting page
          navigate('/adlab/campaign/targeting');
        } else {
          // Fallback to regular targeting page
          navigate('/adlab/campaign/targeting');
        }
      } else if (result.error) {
        console.error('Error saving campaign:', result.error);
        // You can add toast notification here
      }
    } catch (error) {
      console.error('Error saving campaign:', error);
    }
  }, [basicDetails, objectives, budget, currency, user, appConfig, isEditMode, campaignId, updateCampaign, createCampaign, dispatch, navigate]);

  const handleFocus = (field) => {
    setFocusedField(field);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  const isPlatformSelected = useCallback(
    (platformId) => platformCampaigns.some((campaign) => campaign.platform === platformId),
    [platformCampaigns]
  );

  const getPlatformPercentage = useCallback(
    (platformId) => {
      const campaign = platformCampaigns.find((campaign) => campaign.platform === platformId);
      return campaign ? campaign.percentage : '';
    },
    [platformCampaigns]
  );

  const handlePlatformChange = useCallback(
    (platformId, platformObj) => {
      const isSelected = isPlatformSelected(platformId);
      let newPlatformCampaigns;

      if (isSelected) {
        // Remove platform
        newPlatformCampaigns = platformCampaigns.filter((campaign) => campaign.platform !== platformId);
      } else {
        // Add platform
        newPlatformCampaigns = [
          ...platformCampaigns,
          {
            platform: platformId,
            percentage: platformObj.defaultPercentage.toString(),
          },
        ];
      }

      dispatch(updatePlatformCampaigns(newPlatformCampaigns));
    },
    [dispatch, platformCampaigns, isPlatformSelected],
  );

  const handlePercentageChange = useCallback(
    (platformId, value) => {
      const newValue = Math.min(100, Math.max(0, Number(value)));
      const newPlatformCampaigns = platformCampaigns.map((campaign) =>
        campaign.platform === platformId
          ? { ...campaign, percentage: newValue.toString() }
          : campaign
      );

      dispatch(updatePlatformCampaigns(newPlatformCampaigns));
    },
    [dispatch, platformCampaigns],
  );

  const calculateBudgetAllocation = useCallback((percentage) => ((percentage || 0) * budget) / 100, [budget]);

  return (
    <div className={`${styles.root} campaign-bg`}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <Button
            appearance="subtle"
            icon={<ArrowLeft24Regular />}
            onClick={() => navigate(-1)}
            className={styles.backButton}
          />
          <Text size={400} weight="semibold">
            {i18n.t(i18n.keys.platform_header)}
          </Text>
        </div>
        <Button appearance="primary" onClick={handleNext} disabled={isSaving}>
          {isSaving ? i18n.t(i18n.keys.saving) : (isEditMode ? i18n.t(i18n.keys.update_and_next) : i18n.t(i18n.keys.save_and_next))}
        </Button>
      </div>

      {/* Budget Section */}
      <div style={{ marginBottom: tokens.spacingVerticalL }}>
        <div style={{
          color: tokens.colorBrandForeground,
          fontWeight: 400,
          fontSize: 16,
          marginBottom: 4,
          display: 'inline-block',
        }}>Budget</div>
        <div
          className="container-bg"
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 32,
            padding: 10,
            marginTop: 4,
          }}
        >
          <Dropdown
            label="Currency"
            value={basicDetails.currency}
            selectedOptions={[basicDetails.currency]}
            placeholder={isLoading ? 'Loading currencies...' : 'Select Currency'}
            disabled={isLoading}
            onFocus={() => handleFocus('currency')}
            onOptionSelect={(e, data) => {
              if (data.optionValue) {
                setCurrency(data.optionValue);
                dispatch(updateBasicDetails({ currency: data.optionValue }));
              }
            }}
          >
            {!isLoading &&
              currencyOptions &&
              Object.entries(currencyOptions).map(([groupName, items]) => (
                <OptionGroup key={groupName} label={groupName}>
                  {items.map((item) => (
                    <Option key={item.value} value={item.value} text={`${item.value} - ${item.name}`}>
                      {item.value} - {item.name}
                    </Option>
                  ))}
                </OptionGroup>
              ))}
          </Dropdown>
          <Input
            type="number"
            label="Overall budget"
            value={budget}
            onFocus={() => handleFocus('budget')}
            onChange={(e) => {
              setBudget(e.target.value);
              dispatch(updateBasicDetails({ budget: e.target.value }));
            }}
            min={VALIDATION.BUDGET.MIN}
            placeholder={`Overall budget (min: ${VALIDATION.BUDGET.MIN})`}
            size="medium"
          />
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.leftContent}>
          <div className={styles.headerInfo}>
            <Text>{i18n.t(i18n.keys.platform_subheader)}</Text>
            <div className={styles.totalInfo}>
              <Text size={200} color={tokens.colorNeutralForeground2}>
                Total Allocation: {totalAllocation}%
              </Text>
              <Text size={200} color={tokens.colorNeutralForeground2}>
                Total Budget: {currency} {budget}
              </Text>
            </div>
          </div>

          <div className={styles.platformList}>
            {PLATFORM_OPTIONS.map((platformObj) => {
              const isSelected = isPlatformSelected(platformObj.id);
              const percentage = getPlatformPercentage(platformObj.id);
              
              return (
                <div
                  key={platformObj.id}
                  className={styles.platformItem}
                  onClick={() => handlePlatformChange(platformObj.id, platformObj)}
                  style={{
                    borderColor: isSelected ? tokens.colorBrandStroke1 : tokens.colorNeutralStroke1,
                    backgroundColor: isSelected ? tokens.colorBrandBackground2 : undefined,
                  }}
                >
                  <div className={styles.platformItemContent}>
                    <Checkbox
                      checked={isSelected}
                      onChange={(e) => {
                        e.stopPropagation();
                        handlePlatformChange(platformObj.id, platformObj);
                      }}
                    />
                    <PlatformImage platform={platformObj} />
                    <Text size={400}>{platformObj.name}</Text>
                    {isSelected && (
                      <div className={styles.percentageBox}>
                        <Input
                          type="number"
                          value={percentage || 0}
                          onChange={(e) => handlePercentageChange(platformObj.id, e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          contentAfter="%"
                          className={styles.percentageInput}
                        />
                        <Text
                          size={200}
                          color={tokens.colorNeutralForeground2}
                          style={{ marginTop: tokens.spacingVerticalXS }}
                        >
                          {currency} {calculateBudgetAllocation(Number(percentage)).toFixed(2)}
                        </Text>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className={styles.sampleSection}>
          <SampleInputs focusedField={focusedField} />
        </div>
      </div>
    </div>
  );
};

PlatformImage.propTypes = {
  platform: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    defaultPercentage: PropTypes.number.isRequired,
  }).isRequired,
};

export default PlatformSelector;