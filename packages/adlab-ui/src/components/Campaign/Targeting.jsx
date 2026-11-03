import React, { useEffect,useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft24Regular } from '@tfs/icons';
import { Button, makeStyles, Tab, TabList, Text, tokens } from '@tfs/ui-components-next';

import SampleInputs from '../../commons/SampleInputs';
import { TARGETING_MENU_ITEMS, TARGETING_SECTIONS } from '../../lib/constants';
import { updateDemographics } from '../../store/slices/campaignSlice';

import AgeSelector from './components/AgeSelector';
import DemographicSelector from './components/DemographicSelector';
import DeviceSelector from './components/DeviceSelector';
import InterestSelector from './components/InterestSelector';
import LanguageSelector from './components/LanguageSelector';
import LocationSelector from './components/LocationSelector';

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
  tabList: {
    marginBottom: tokens.spacingVerticalL,
  },
  content: {
    display: 'flex',
    gap: tokens.spacingHorizontalL,
    flex: 1,
    height: '100%',
  },
  mainContent: {
    flex: 1,
    overflowY: 'auto',
    height: '100%',
  },
  sampleSection: {
    width: '35%',
  },
});

const Targeting = () => {
  const styles = useStyles();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const formData = useSelector((state) => state.campaign.formData);
  const [selectedMenu, setSelectedMenu] = useState(formData.demographics?.selectedMenu || TARGETING_SECTIONS.demographics);
  const [activeSection, setActiveSection] = useState({
    device: TARGETING_SECTIONS.device,
    interest: '',
    demographics: '',
    age: TARGETING_SECTIONS.age,
    location: TARGETING_SECTIONS.location,
    language: TARGETING_SECTIONS.language,
    });

  const handleSectionChange = (section, value) => {
    setActiveSection((prev) => ({
      ...prev,
      [section]: value,
    }));
  };

  const handleTabSelect = (event, data) => {
    setSelectedMenu(data.value);
    dispatch(updateDemographics({ selectedMenu: data.value }));
  };

  const handleAgeChange = (newAge) => {
    dispatch(updateDemographics({ age: newAge }));
  };

  const handleLocationChange = (locations) => {
    dispatch(updateDemographics({ location: locations }));
  };

  const handleInterestChange = (interests) => {
    dispatch(updateDemographics({ interest: interests }));
  };

  const handleDeviceChange = (deviceSettings) => {
    dispatch(updateDemographics({ device: deviceSettings }));
  };
  const handleNext = () => {
    navigate('/adlab/campaign/tags');
  };

  const handleDemographicChange = (demographics) => {
    dispatch(updateDemographics({ demographics }));
  };

  const renderContent = () => {
    switch (selectedMenu) {
      case TARGETING_SECTIONS.demographics:
        return (
          <DemographicSelector
            onChange={handleDemographicChange}
            initialValue={formData.demographics.demographics}
            onAccordionChange={(value) => handleSectionChange(TARGETING_SECTIONS.demographics, value)}
          />
        );
      case TARGETING_SECTIONS.age:
        return <AgeSelector onChange={handleAgeChange} initialValue={formData.demographics.age} />;
      case TARGETING_SECTIONS.location:
        return <LocationSelector onChange={handleLocationChange} initialValue={formData.demographics.location || []} />;
      case TARGETING_SECTIONS.interest:
        return (
          <InterestSelector
            onChange={handleInterestChange}
            initialValue={formData.demographics.interest || {}}
            onAccordionChange={(value) => handleSectionChange(TARGETING_SECTIONS.interest, value)}
          />
        );
      case TARGETING_SECTIONS.device:
        return (
          <DeviceSelector
            onChange={handleDeviceChange}
            initialValue={formData.demographics.device}
            onAccordionChange={(value) => handleSectionChange(TARGETING_SECTIONS.device, value)}
          />
        );
      case TARGETING_SECTIONS.language:
        return (
          <LanguageSelector
            onChange={(selectedLanguages) => dispatch(updateDemographics({ language: selectedLanguages }))}
            initialValue={formData.demographics.language || []}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="campaign-bg">
      <div className={styles.root}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <Button
            appearance="subtle"
            icon={<ArrowLeft24Regular />}
            onClick={() => navigate(-1)}
            className={styles.backButton}
          />
          <Text size={400} weight="semibold">
            Define your target audience
          </Text>
        </div>
        <Button appearance="primary" onClick={handleNext}>
          Next
        </Button>
      </div>

      <TabList selectedValue={selectedMenu} onTabSelect={handleTabSelect} className={styles.tabList}>
        {TARGETING_MENU_ITEMS.map((item) => (
          <Tab key={item.id} value={item.id}>
            {item.label}
          </Tab>
        ))}
      </TabList>

      <div className={styles.content}>
        <div className={styles.mainContent}>{renderContent()}</div>

        <div className={styles.sampleSection}>
          <SampleInputs
            focusedField={
              selectedMenu === 'device'
                ? activeSection.device
                : selectedMenu === 'interest' && activeSection.interest
                  ? `category_${activeSection.interest}`
                  : selectedMenu === 'demographics'
                    ? activeSection.demographics || selectedMenu
                    : selectedMenu
            }
          />
        </div>
      </div>
    </div>
    </div>
  );
};

export default Targeting;