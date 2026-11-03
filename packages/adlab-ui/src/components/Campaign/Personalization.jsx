import React, { useEffect,useState, useMemo } from 'react';
import { useDispatch,useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft24Regular, ChevronDown24Regular, ChevronRight24Regular, Delete24Regular, WarningRegular } from '@tfs/icons';
import { 
  Badge,
  Breadcrumb, 
  BreadcrumbButton, 
  BreadcrumbDivider, 
  BreadcrumbItem, 
  Button, 
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  makeStyles, 
  Tab,
  TabList,
  Tag, 
  Text, 
  Toast, 
  Toaster, 
  ToastTitle, 
  tokens, 
  useToastController 
} from '@tfs/ui-components-next';

import i18n from '../../helpers/i18n';
import { DEFAULT_PERSONALIZATION_FIELDS } from '../../lib/personalizationConstants';
import { addCombination,updatePersonalization, deleteCombination, setPersonalizationFromAPI } from '../../store/slices/campaignSlice';
import { isImageUrl, calculateCombinationMetrics, isCombinationDuplicate } from '../../utils/generic';
import constants from '../../lib/constants';
import { useGetPersonaConfigQuery, useCreatePersonaConfigMutation } from '../../features/api/personalizationApi';

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
    marginBottom: tokens.spacingVerticalM,
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
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
    flex: 1,
    height: 'calc(80vh - 150px)',
  },
  macroBar: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
    marginBottom: tokens.spacingVerticalS,
  },
  macroChipsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: tokens.spacingHorizontalS,
    padding: tokens.spacingVerticalM,
    minHeight: '60px',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  macroChipsSection: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: tokens.spacingHorizontalS,
    flex: 1,
  },
  combinationBuilder: {
    display: 'flex',
    gap: tokens.spacingHorizontalS,
    flex: 1,
    height: 'calc(100vh - 220px)',
  },
  sectionTitle: {
    position: 'sticky',
    top: 0,
    zIndex: 3,
    background: tokens.colorNeutralBackground2,
    padding: `${tokens.spacingVerticalM} ${tokens.spacingHorizontalM}`,
    marginBottom: tokens.spacingVerticalXS,
    minHeight: '48px',
    boxShadow: '0 2px 8px 0 rgba(0,0,0,0.04)',
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  chipContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
    padding: tokens.spacingVerticalS,
    minHeight: '80px',
    maxHeight: '300px',
    overflowY: 'auto',
    alignItems: 'stretch',
  },
  imageContainer: {
    width: '80px',
    height: '80px',
    border: `2px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusSmall,
    overflow: 'hidden',
    cursor: 'pointer',
    position: 'relative',
    transition: 'border-color 0.2s ease',
    '&:hover': {
      borderColor: tokens.colorBrandStroke1,
    },
  },
  selectedImageContainer: {
    borderColor: tokens.colorBrandBackground,
    borderWidth: '3px',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(79, 62, 215, 0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '20px',
    fontWeight: 'bold',
  },
  leftContainer: {
    width: '25%',
    minWidth: '250px',
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
    height: '55vh',
    overflowY: 'auto',
    overflowX: 'hidden',
  },
  middleContainer: {
    width: '38%',
    minWidth: '250px',
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
    height: '55vh',
    overflowY: 'auto',
    overflowX: 'hidden',
  },
  rightContainer: {
    width: '37%',
    minWidth: '250px',
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
    height: '55vh',
    overflowY: 'auto',
    overflowX: 'hidden',
  },
  macroGroup: {
    marginBottom: tokens.spacingVerticalS,
  },
  emptyState: {
    textAlign: 'center',
    color: tokens.colorNeutralForeground3,
    fontStyle: 'italic',
    padding: tokens.spacingVerticalM,
  },
  tabList: {
    marginBottom: tokens.spacingVerticalM,
  },
  // Combinations viewer styles
  metricsBar: {
    display: 'flex',
    gap: tokens.spacingHorizontalS,
    padding: tokens.spacingVerticalS,
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: tokens.borderRadiusLarge,
    border: `2px solid ${tokens.colorBrandStroke1}`,
    boxShadow: tokens.shadow4,
    height: 'fit-content',
    flexShrink: 0,
    marginBottom: tokens.spacingVerticalM,
  },
  metricCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: tokens.spacingVerticalXS,
    padding: tokens.spacingVerticalS,
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: tokens.borderRadiusMedium,
    minWidth: '100px',
    flex: 1,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    boxShadow: tokens.shadow2,
    height: 'fit-content',
    flexShrink: 0,
  },
  combinationsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
    maxHeight: '50vh',
    overflowY: 'auto',
  },
  accordionItem: {
    border: `2px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusLarge,
    backgroundColor: tokens.colorNeutralBackground1,
    boxShadow: tokens.shadow2,
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      boxShadow: tokens.shadow4,
      borderColor: tokens.colorBrandStroke1,
    },
  },
  duplicateAccordionItem: {
    borderColor: tokens.colorPaletteRedBorder2,
    backgroundColor: tokens.colorPaletteRedBackground1,
    '&:hover': {
      borderColor: tokens.colorPaletteRedBorder2,
    },
  },
  accordionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: tokens.spacingVerticalL,
    cursor: 'pointer',
    position: 'relative',
    borderRadius: `${tokens.borderRadiusLarge} ${tokens.borderRadiusLarge} 0 0`,
    transition: 'background-color 0.2s ease-in-out',
    '&:hover': {
      backgroundColor: tokens.colorNeutralBackground2,
    },
  },
  accordionHeaderContent: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM,
    flex: 1,
    minWidth: 0,
  },
  accordionControls: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    flexShrink: 0,
  },
  accordionBody: {
    padding: `0 ${tokens.spacingVerticalL} ${tokens.spacingVerticalL} ${tokens.spacingVerticalL}`,
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: `0 0 ${tokens.borderRadiusLarge} ${tokens.borderRadiusLarge}`,
    animation: 'slideDown 0.2s ease-out',
  },
  section: {
    marginBottom: tokens.spacingVerticalL,
    padding: tokens.spacingVerticalM,
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: tokens.borderRadiusMedium,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  sectionTitle: {
    marginBottom: tokens.spacingVerticalM,
    color: tokens.colorBrandForeground1,
    fontWeight: tokens.fontWeightSemibold,
    fontSize: tokens.fontSizeBase300,
    borderBottom: `2px solid ${tokens.colorBrandStroke1}`,
    paddingBottom: tokens.spacingVerticalXS,
  },
  mappingGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
  },
  mappingRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXS,
    padding: tokens.spacingVerticalS,
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: tokens.borderRadiusSmall,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  keyText: {
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
    fontSize: tokens.fontSizeBase200,
  },
  valueContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: tokens.spacingHorizontalXS,
    marginTop: tokens.spacingVerticalXS,
  },
  combinationsEmptyState: {
    textAlign: 'center',
    padding: tokens.spacingVerticalXXL,
    color: tokens.colorNeutralForeground3,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: tokens.spacingVerticalL,
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: tokens.borderRadiusLarge,
    border: `2px dashed ${tokens.colorNeutralStroke2}`,
  },
  
  // Tab-related styles
  tabList: {
    marginLeft: tokens.spacingHorizontalM,
  },
  
  // Combinations viewer styles
  combinationsEmptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: tokens.spacingVerticalXXL,
    gap: tokens.spacingVerticalM,
    height: '300px',
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: tokens.borderRadiusLarge,
    border: `2px dashed ${tokens.colorNeutralStroke2}`,
  },
  
  metricsBar: {
    display: 'flex',
    gap: tokens.spacingHorizontalM,
    marginBottom: tokens.spacingVerticalM,
    flexWrap: 'wrap',
  },
  
  metricCard: {
    display: 'flex',
    flexDirection: 'column',
    padding: tokens.spacingVerticalM,
    backgroundColor: '#FFFFFF80',
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusMedium,
    minWidth: '120px',
    alignItems: 'center',
    gap: tokens.spacingVerticalXS,
  },
  
  combinationsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
    maxHeight: '60vh',
    overflowY: 'auto',
    overflowX: 'hidden',
    paddingRight: tokens.spacingHorizontalXS, // Add space for scrollbar
  },
  
  accordionItem: {
    backgroundColor: '#FFFFFF80',
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusMedium,
    overflow: 'hidden',
  },
  
  duplicateAccordionItem: {
    border: `2px solid ${tokens.colorPaletteRedBorder2}`,
    backgroundColor: '#FFF5F5',
  },
  
  accordionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: tokens.spacingVerticalM,
    cursor: 'pointer',
    backgroundColor: 'transparent',
    transition: 'background-color 0.2s ease',
    '&:hover': {
      backgroundColor: tokens.colorNeutralBackground2,
    },
  },
  
  accordionHeaderContent: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
  },
  
  accordionControls: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
  },
  
  accordionBody: {
    padding: tokens.spacingVerticalM,
    backgroundColor: tokens.colorNeutralBackground1,
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  
  section: {
    marginBottom: tokens.spacingVerticalL,
    '&:last-child': {
      marginBottom: 0,
    },
  },
  
  sectionTitle: {
    fontWeight: tokens.fontWeightSemibold,
    marginBottom: tokens.spacingVerticalS,
    color: tokens.colorBrandForeground1,
  },
  
  mappingGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: tokens.spacingVerticalS,
  },
  
  mappingItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXXS,
  },
  
  mappingKey: {
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground2,
  },
  
  mappingValue: {
    fontSize: tokens.fontSizeBase300,
    color: tokens.colorNeutralForeground1,
  },
});

const Personalization = () => {
  const styles = useStyles();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { dispatchToast } = useToastController();
  
  const appConfig = useSelector((state) => state.session.appConfig);
  const formData = useSelector((state) => state.campaign.formData);
  const storeCampaignId = useSelector((state) => state.campaign.campaignId); // Get campaign ID from store
  const templateMacros = formData.template?.macros || [];
  const personalizationData = formData.personalization || {};
  const combinations = formData.personalization?.combinations || [];

  // API hooks - Use campaign ID from store or form data
  const currentCampaignId = storeCampaignId || formData.id;
  
  // Debug campaign ID resolution
  useEffect(() => {
    console.log('=== CAMPAIGN ID RESOLUTION ===');
    console.log('Store Campaign ID:', storeCampaignId);
    console.log('Form Data ID:', formData.id);
    console.log('Final Campaign ID:', currentCampaignId);
    console.log('================================');
  }, [storeCampaignId, formData.id, currentCampaignId]);
  
  // Only make API call if we have a valid campaign ID
  const { data: personaConfigData, error: personaConfigError, isLoading: isLoadingPersonaConfig } = useGetPersonaConfigQuery({
    campaignId: currentCampaignId,
    includeCombinations: true
  }, {
    skip: !currentCampaignId // Skip the query if no campaign ID is available
  });
  const [createPersonaConfig] = useCreatePersonaConfigMutation();
  
  const [selectedMacro, setSelectedMacro] = useState(personalizationData.selectedMacro || null);
  const [selectedPersonaField, setSelectedPersonaField] = useState(null);
  const [selectedValues, setSelectedValues] = useState({});
  const [selectedTab, setSelectedTab] = useState('combo-builder');
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [combinationToDelete, setCombinationToDelete] = useState(null);
  const [hasShownErrorToast, setHasShownErrorToast] = useState(false); // Flag to prevent multiple toasts

  useEffect(() => {
    dispatch(updatePersonalization({
      selectedMacro,
      selectedValues,
    }));
  }, [dispatch, selectedMacro, selectedValues]);

  // Effect to populate store when persona config data is loaded
  useEffect(() => {
    if (personaConfigData && !personaConfigError) {
      dispatch(setPersonalizationFromAPI(personaConfigData));
    }
  }, [personaConfigData, personaConfigError, dispatch]);

  // Effect to show toast alert when no personalization config is found and redirect to template page
  useEffect(() => {
    if (personaConfigError && currentCampaignId && !isLoadingPersonaConfig && !hasShownErrorToast) {
      // Check if it's a 404 error or similar indicating no config found
      const errorMessage = personaConfigError?.data?.message || personaConfigError?.message || '';
      if (errorMessage.includes('404') || errorMessage.includes('not found') || personaConfigError?.status === 404) {
        // Show single toast for no config found
        dispatchToast(
          <Toast>
            <ToastTitle>{i18n.t(i18n.keys.no_personalization_config_found, { campaignId: currentCampaignId })}</ToastTitle>
          </Toast>,
          { intent: 'warning' }
        );
        
        // Set flag to prevent multiple toasts
        setHasShownErrorToast(true);
        
        // Automatic navigation disabled - user can manually navigate back if needed
        // setTimeout(() => {
        //   navigate(`/adlab/campaign/template`); // Navigate to template page specifically
        // }, 2000);
      } else {
        // For other errors, show error toast
        dispatchToast(
          <Toast>
            <ToastTitle>{i18n.t(i18n.keys.error_loading_personalization_data, { errorMessage })}</ToastTitle>
          </Toast>,
          { intent: 'error' }
        );
        
        // Set flag to prevent multiple toasts
        setHasShownErrorToast(true);
      }
    }
  }, [personaConfigError, currentCampaignId, isLoadingPersonaConfig, hasShownErrorToast, dispatchToast, navigate]);

  const handleMacroSelect = (macroName) => {
    setSelectedMacro(macroName);
    setSelectedValues(prev => ({
      ...prev,
      [macroName]: [] // Reset selected macro's values when switching
    }));
  };

  const getMacroType = (macroName) => {
    const macro = templateMacros.find(m => m.name === macroName);
    return macro?.type || 'string';
  };

  const handleValueSelect = (macroName, value) => {
    setSelectedValues(prev => {
      const currentValues = prev[macroName] || [];
      const isSelected = currentValues.includes(value);
      
      return {
        ...prev,
        [macroName]: isSelected
          ? currentValues.filter(v => v !== value)
          : [...currentValues, value]
      };
    });
  };

  const handlePersonalizationFieldSelect = (fieldName, value) => {
    setSelectedValues(prev => {
      const currentValues = prev[fieldName] || [];
      const isSelected = currentValues.includes(value);
      
      return {
        ...prev,
        [fieldName]: isSelected
          ? currentValues.filter(v => v !== value)
          : [...currentValues, value]
      };
    });
  };

  const handlePersonaFieldClick = (fieldName) => {
    setSelectedPersonaField(selectedPersonaField === fieldName ? null : fieldName);
  };

  // Combinations viewer functions
  const handleToggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const handleDeleteClick = (index, event) => {
    event.stopPropagation();
    setCombinationToDelete(index);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (combinationToDelete !== null) {
      dispatch(deleteCombination(combinationToDelete));
      dispatchToast(
        <Toast>
          <ToastTitle>{i18n.t(i18n.keys.delete_combination_success)}</ToastTitle>
        </Toast>,
        { intent: 'success' }
      );
    }
    setDeleteDialogOpen(false);
    setCombinationToDelete(null);
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setCombinationToDelete(null);
  };

  // Calculate metrics using pure utility function
  const metrics = useMemo(() => {
    return calculateCombinationMetrics(combinations);
  }, [combinations]);

  const renderValue = (value) => {
    if (Array.isArray(value)) {
      return value.map((item, index) => (
        <Tag key={index} size="small" appearance="outline">
          {item}
        </Tag>
      ));
    }
    return (
      <Tag size="small" appearance="filled">
        {value}
      </Tag>
    );
  };

  const renderMapping = (mapping) => {
    return Object.entries(mapping).map(([key, value]) => (
      <div key={key} className={styles.mappingRow}>
        <Text className={styles.keyText} size={300}>
          {key}
        </Text>
        <div className={styles.valueContainer}>
          {renderValue(value)}
        </div>
      </div>
    ));
  };

  const renderPersona = (persona) => {
    if (!persona || persona.length === 0) {
      return (
        <div className={styles.mappingRow}>
          <Text size={200} style={{ color: tokens.colorNeutralForeground3, textAlign: 'center' }}>
            No persona data
          </Text>
        </div>
      );
    }

    return persona.map((personaItem, index) => (
      <div key={index}>
        {Object.entries(personaItem).map(([key, value]) => (
          <div key={key} className={styles.mappingRow}>
            <Text className={styles.keyText} size={300}>
              {key}
            </Text>
            <div className={styles.valueContainer}>
              {renderValue(value)}
            </div>
          </div>
        ))}
      </div>
    ));
  };

  const renderMacroChip = (macro) => (
    <Tag
      key={macro.name}
      appearance={selectedMacro === macro.name ? 'filled' : 'outline'}
      onClick={() => handleMacroSelect(macro.name)}
      style={{
        cursor: 'pointer',
        backgroundColor: '#FFFFFF80',
        border: '1px solid #FFFFFF',
        marginRight: tokens.spacingHorizontalS,
        ...(selectedMacro === macro.name && {
          backgroundColor: '#4F3ED71A',
          border: '1px solid #222AE5',
          color: '#202224',
        }),
      }}
    >
      {macro.name}
    </Tag>
  );

const renderValueChip = (value, macroName = selectedMacro) => {
  const isSelected = selectedValues[macroName]?.includes(value);
  const macroType = getMacroType(macroName);
  
  // For image type values
  if (macroType === 'image' && value) {
    return (
      <div
        key={value}
        className={`${styles.imageContainer} ${isSelected ? styles.selectedImageContainer : ''}`}
        onClick={() => handleValueSelect(macroName, value)}
      >
        <img
          src={value}
          alt="Product"
          className={styles.image}
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
        <div className={styles.imageOverlay} style={{ display: 'none' }}>
          🖼️
        </div>
        {isSelected && (
          <div className={styles.imageOverlay}>
            ✓
          </div>
        )}
      </div>
    );
  }
  
  // For text type values - vertical layout
  return (
    <Tag
      key={value}
      appearance={isSelected ? 'filled' : 'outline'}
      onClick={() => handleValueSelect(macroName, value)}
      style={{
        cursor: 'pointer',
        width: '100%',
        justifyContent: 'flex-start',
        marginBottom: tokens.spacingVerticalXS,
        backgroundColor: '#FFFFFF80',
        border: '1px solid #FFFFFF',
        ...(isSelected && {
          backgroundColor: '#4F3ED71A',
          border: '1px solid #222AE5',
          color: '#202224',
        }),
      }}
    >
      {value}
    </Tag>
  );
};  const renderPersonalizationFieldChip = (value, fieldName) => {
    const isSelected = selectedValues[fieldName]?.includes(value);
    return (
      <Tag
        key={value}
        appearance={isSelected ? 'filled' : 'outline'}
        onClick={() => handlePersonalizationFieldSelect(fieldName, value)}
        style={{
          cursor: 'pointer',
          width: '100%',
          justifyContent: 'flex-start',
          marginBottom: tokens.spacingVerticalXS,
          backgroundColor: '#FFFFFF80',
          border: '1px solid #FFFFFF',
          ...(isSelected && {
            backgroundColor: '#4F3ED71A',
            border: '1px solid #222AE5',
            color: '#202224',
          }),
        }}
      >
        {value}
      </Tag>
    );
  };

  const getOtherMacros = () => {
    return templateMacros.filter(macro => macro.name !== selectedMacro);
  };

  const handleNext = async () => {
    // Console log the final store object
    console.log('=== FINAL CAMPAIGN STORE OBJECT ===');
    console.log('Complete formData:', formData);
    console.log('Template Macros:', templateMacros);
    console.log('Personalization Data:', personalizationData);
    console.log('All Combinations:', combinations);
    console.log('Selected Values:', selectedValues);
    console.log('Selected Macro:', selectedMacro);
    console.log('===================================');
    
    try {
      // Check if we have a valid campaign ID
      if (!currentCampaignId) {
        console.error('No campaign ID available for saving persona config');
        dispatchToast(
          <Toast>
            <ToastTitle>{i18n.t(i18n.keys.no_campaign_id_for_saving)}</ToastTitle>
          </Toast>,
          { intent: 'error' }
        );
        return;
      }

      // Build API payload
      const apiPayload = {
        status: "DRAFT",
        template: {
          id: formData.template?.id || `template${Date.now()}`,
          html: formData.template?.html || formData.template?.url,
          width: formData.template?.width?.toString() || "300",
          height: formData.template?.height?.toString() || "250",
          macros: templateMacros.map(macro => ({
            name: macro.name,
            type: macro.type,
            ...(macro.type === 'image' && {
              url: macro.url || (macro.values && macro.values[0]),
              width: macro.width?.toString() || "120",
              height: macro.height?.toString() || "80"
            })
          }))
        },
        combinations: combinations.map((combination, index) => ({
          id: combination.id || `comb${index + 1}`,
          key: combination.key,
          mapping: combination.mapping,
          persona: combination.persona.length > 0 ? combination.persona[0] : {}
        }))
      };

      console.log('=== API PAYLOAD ===');
      console.log('Payload to be sent:', JSON.stringify(apiPayload, null, 2));
      console.log('==================');

      // Make API call using RTK Query mutation
      const result = await createPersonaConfig({
        campaignId: currentCampaignId,
        ...apiPayload
      }).unwrap();
      
      console.log('API Response:', result);
      
      // Show success toast
      dispatchToast(
        <Toast>
          <ToastTitle>{i18n.t(i18n.keys.persona_config_saved)}</ToastTitle>
        </Toast>,
        { intent: 'success' }
      );
      
      // Navigate to next step (if needed)
      // navigate('/adlab/campaign/next-step');
      
    } catch (error) {
      console.error('Error saving persona config:', error);
      
      // Show error toast
      dispatchToast(
        <Toast>
          <ToastTitle>{i18n.t(i18n.keys.error_saving_persona_config)}</ToastTitle>
        </Toast>,
        { intent: 'error' }
      );
    }
  };

  const handleTriggerRules = () => {
    const selectedMacroValues = selectedValues[selectedMacro] || [];
    // Build mapping object - now using arrays
    const mapping = {
      [selectedMacro]: selectedMacroValues, // Array of values from left container
    };

    // Add other macro values from middle container
    const otherMacros = templateMacros.filter(macro => macro.name !== selectedMacro);
    otherMacros.forEach(macro => {
      const macroValues = selectedValues[macro.name] || [];
      if (macroValues.length > 0) {
        mapping[macro.name] = macroValues; // Multiple values from middle container
      }
    });

    // Build persona object from right container (default personalization fields)
    const persona = {};
    DEFAULT_PERSONALIZATION_FIELDS.forEach(field => {
      const fieldValues = selectedValues[field.name] || [];
      if (fieldValues.length > 0) {
        persona[field.name] = fieldValues;
      }
    });

    // Create combination object
    const combination = {
      key: selectedMacro,
      mapping,
      persona: Object.keys(persona).length > 0 ? [persona] : []
    };

    // Add to combinations array
    dispatch(addCombination(combination));

    // Show toast notification
    dispatchToast(
      <Toast style={{ minWidth: 320 }}>
        <ToastTitle>{i18n.t(i18n.keys.combination_added_success)}</ToastTitle>
      </Toast>,
      { position: 'top', alignment: 'center', intent: 'success' }
    );

    // Reset form
    setSelectedMacro(null);
    setSelectedValues({});

    // Switch to Rules Added tab to show the new combination
    setSelectedTab('rules-added');

    console.log('Combination added:', combination);
  };

  return (
    <div>
      {/* Show message when no campaign ID is available */}
      {!currentCampaignId && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '200px',
          color: tokens.colorPaletteRedForeground2,
          fontSize: tokens.fontSizeBase400
        }}>
          {i18n.t(i18n.keys.no_campaign_id_found)}
        </div>
      )}

      {/* Show loading state while fetching persona config */}
      {currentCampaignId && isLoadingPersonaConfig && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '200px',
          fontSize: tokens.fontSizeBase400
        }}>
          {i18n.t(i18n.keys.loading_personalization_data)} {currentCampaignId}...
        </div>
      )}

      {/* Main content - only show when we have campaign ID and not loading */}
      {currentCampaignId && !isLoadingPersonaConfig && (
        <>
          {/* Breadcrumbs at the very top */}
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
                <BreadcrumbButton current>Personalization</BreadcrumbButton>
              </BreadcrumbItem>
            </Breadcrumb>
          </div>
      {/* Header with back navigation and tabs */}
      <div className="campaign-bg">
        <div className={styles.root}>
          <div className={styles.header}>
            <div className={styles.headerLeft}>
              <Button
                appearance="subtle"
                icon={<ArrowLeft24Regular />}
                onClick={() => navigate('/adlab/campaign/tag-selector')}
                className={styles.backButton}
              />
              {/* Tab Navigation */}
              <TabList 
                selectedValue={selectedTab} 
                onTabSelect={(event, data) => setSelectedTab(data.value)}
                className={styles.tabList}
              >
                <Tab value="combo-builder">{i18n.t(i18n.keys.combo_builder)}</Tab>
                <Tab value="rules-added">{i18n.t(i18n.keys.rules_added)} ({combinations.length})</Tab>
              </TabList>
            </div>
            <Button appearance="primary" onClick={handleNext}>
              {i18n.t(i18n.keys.save_and_next)}
            </Button>
          </div>
          {/* Content */}
          <div className={styles.content}>

            {selectedTab === 'combo-builder' ? (
              <>
                {/* Macro Bar at Top */}
                <div className={styles.macroBar}>
                  <div className={`${styles.macroChipsContainer} container-bg`}>
                    <div className={styles.macroChipsSection}>
                      {templateMacros.length > 0 ? (
                        templateMacros.map(renderMacroChip)
                      ) : (
                        <div className={styles.emptyState}>
                          {i18n.t(i18n.keys.no_template_macros)}
                        </div>
                      )}
                    </div>
                    <Button 
                      appearance="secondary" 
                      onClick={handleTriggerRules}
                      disabled={!selectedMacro || !selectedValues[selectedMacro]?.length}
                    >
                      {i18n.t(i18n.keys.add_combinations)}
                    </Button>
                  </div>
                </div>

                {/* Three Column Layout */}
                <div className={styles.combinationBuilder}>
                  {/* Left Container - Selected Macro Values (Multi Select) */}
                  <div className={`container-bg ${styles.leftContainer}`}>
                    <div style={{ padding: tokens.spacingHorizontalS }}>
                      <div className={styles.chipContainer}>
                        {selectedMacro ? (
                          (() => {
                            const macro = templateMacros.find(m => m.name === selectedMacro);
                            return macro?.values?.length > 0 ? (
                              macro.values.map(value => renderValueChip(value))
                            ) : (
                              <div className={styles.emptyState}>{i18n.t(i18n.keys.no_values_available)}</div>
                            );
                          })()
                        ) : (
                          <div className={styles.emptyState}>{i18n.t(i18n.keys.select_macro_to_see_values)}</div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Middle Container - Other Macros (Multi Select) */}
                  <div className={`container-bg ${styles.middleContainer}`}>
                    <div style={{ padding: tokens.spacingHorizontalS }}>
                      {getOtherMacros().length > 0 ? (
                        getOtherMacros().map(macro => (
                          <div key={macro.name} className={styles.macroGroup}>
                            <Text size={200} weight="semibold" style={{ marginBottom: tokens.spacingVerticalS, padding: tokens.spacingVerticalS }}>
                              {macro.name} ({macro.type})
                            </Text>
                            <div className={styles.chipContainer}>
                              {macro.values?.length > 0 ? (
                                macro.values.map(value => renderValueChip(value, macro.name))
                              ) : (
                                <div className={styles.emptyState}>{i18n.t(i18n.keys.no_values_available)}</div>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className={styles.emptyState}>
                          {selectedMacro ? i18n.t(i18n.keys.no_other_macros) : i18n.t(i18n.keys.select_macro_to_see_others)}
                        </div>
                      )}
                    </div> 
                  </div>

                  {/* Right Container - Default Personalization Fields */}
                  <div className={`container-bg ${styles.rightContainer}`}>
                    <div style={{ padding: tokens.spacingHorizontalS }}>
                      {/* Persona Field Chips Header */}
                      <div style={{ 
                        display: 'flex', 
                        flexWrap: 'wrap', 
                        gap: tokens.spacingHorizontalS, 
                        marginBottom: tokens.spacingVerticalS,
                        padding: tokens.spacingVerticalS
                      }}>
                        {DEFAULT_PERSONALIZATION_FIELDS.map(field => (
                          <Tag
                            key={field.name}
                            appearance={selectedPersonaField === field.name ? 'filled' : 'outline'}
                            onClick={() => handlePersonaFieldClick(field.name)}
                            style={{
                              cursor: 'pointer',
                              backgroundColor: '#FFFFFF80',
                              border: '1px solid #FFFFFF',
                              ...(selectedPersonaField === field.name && {
                                backgroundColor: '#4F3ED71A',
                                border: '1px solid #222AE5',
                                color: '#202224',
                              }),
                            }}
                          >
                            {field.label}
                          </Tag>
                        ))}
                      </div>
                      {/* Values for Selected Persona Field */}
                      {selectedPersonaField && (
                        <div style={{ marginTop: tokens.spacingVerticalS }}>
                          <div className={styles.chipContainer}>
                            {DEFAULT_PERSONALIZATION_FIELDS.find(f => f.name === selectedPersonaField)?.values.map(value => 
                              renderPersonalizationFieldChip(value, selectedPersonaField)
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              /* Rules Added Tab Content - Combinations Viewer */
              <div style={{ 
                height: '100%', 
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column'
              }}>
                {combinations.length === 0 ? (
                  <div className={styles.combinationsEmptyState}>
                    <Text size={600} weight="bold" style={{ color: tokens.colorNeutralForeground2 }}>
                      📋 {i18n.t(i18n.keys.no_combinations_yet)}
                    </Text>
                    <Text size={400} style={{ color: tokens.colorNeutralForeground3 }}>
                      {i18n.t(i18n.keys.no_combinations)}
                    </Text>
                    <Button 
                      appearance="primary" 
                      onClick={() => setSelectedTab('combo-builder')}
                      size="large"
                    >
                      {i18n.t(i18n.keys.create_first_combination)}
                    </Button>
                  </div>
                ) : (
                  <>
                    {/* Metrics Bar */}
                    <div className={styles.metricsBar}>
                      <div className={styles.metricCard}>
                        <Text size={400} weight="bold" style={{ color: tokens.colorBrandForeground1 }}>
                          📊 {metrics.total}
                        </Text>
                        <Text size={300} style={{ color: tokens.colorNeutralForeground2 }}>
                          {i18n.t(i18n.keys.total_combinations)}
                        </Text>
                      </div>
                      <div className={styles.metricCard}>
                        <Text size={400} weight="bold" style={{ 
                          color: metrics.duplicates > 0 ? tokens.colorPaletteRedForeground2 : tokens.colorPaletteGreenForeground2 
                        }}>
                          {metrics.duplicates > 0 ? '⚠️' : '✅'} {metrics.duplicates}
                        </Text>
                        <Text size={300} style={{ color: tokens.colorNeutralForeground2 }}>
                          {i18n.t(i18n.keys.duplicate_combinations)}
                        </Text>
                      </div>
                      <div className={styles.metricCard}>
                        <Text size={400} weight="bold" style={{ color: tokens.colorBrandForeground1 }}>
                          🔑 {metrics.uniqueKeys}
                        </Text>
                        <Text size={300} style={{ color: tokens.colorNeutralForeground2 }}>
                          Unique Keys
                        </Text>
                      </div>
                    </div>

                    {/* Combinations Accordion */}
                    <div className={styles.combinationsContainer}>
                      {combinations.map((combination, index) => {
                        const isCurrentDuplicate = isCombinationDuplicate(combinations, index);
                        const isExpanded = expandedIndex === index;
                        
                        return (
                          <div
                            key={index}
                            className={`${styles.accordionItem} ${isCurrentDuplicate ? styles.duplicateAccordionItem : ''}`}
                          >
                            <div 
                              className={styles.accordionHeader}
                              onClick={() => handleToggleExpand(index)}
                            >
                              <div className={styles.accordionHeaderContent}>
                                <Button
                                  appearance="subtle"
                                  icon={isExpanded ? <ChevronDown24Regular /> : <ChevronRight24Regular />}
                                  size="small"
                                  style={{ minWidth: 'auto', padding: 0, color: tokens.colorBrandForeground1 }}
                                />
                                <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalXXS }}>
                                  <Text size={400} weight="bold" style={{ color: tokens.colorBrandForeground1 }}>
                                    Combination #{index + 1}
                                  </Text>
                                  <Text size={200} style={{ color: tokens.colorNeutralForeground2 }}>
                                    🔑 {combination.key}
                                  </Text>
                                </div>
                              </div>
                              
                              <div className={styles.accordionControls}>
                                {isCurrentDuplicate && (
                                  <Badge
                                    appearance="important"
                                    icon={<WarningRegular />}
                                    size="small"
                                  >
                                    Duplicate
                                  </Badge>
                                )}
                                <Button
                                  appearance="subtle"
                                  icon={<Delete24Regular />}
                                  onClick={(event) => handleDeleteClick(index, event)}
                                  size="small"
                                  title={i18n.t(i18n.keys.delete_combination)}
                                  style={{ minWidth: 'auto' }}
                                />
                              </div>
                            </div>

                            {isExpanded && (
                              <div className={styles.accordionBody}>
                                <div className={styles.section}>
                                  <Text size={400} className={styles.sectionTitle}>
                                    📊 Mapping
                                  </Text>
                                  <div className={styles.mappingGrid}>
                                    {renderMapping(combination.mapping)}
                                  </div>
                                </div>

                                <div className={styles.section}>
                                  <Text size={400} className={styles.sectionTitle}>
                                    👤 Persona
                                  </Text>
                                  <div className={styles.mappingGrid}>
                                    {renderPersona(combination.persona)}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={(event, data) => setDeleteDialogOpen(data.open)}>
        <DialogSurface>
          <DialogBody>
            <DialogTitle>{i18n.t(i18n.keys.confirm_deletion)}</DialogTitle>
            <DialogContent>
              {i18n.t(i18n.keys.delete_combination_confirm_msg)}
            </DialogContent>
            <DialogActions>
              <DialogTrigger disableButtonEnhancement>
                <Button appearance="secondary">{i18n.t(i18n.keys.cancel)}</Button>
              </DialogTrigger>
              <Button appearance="primary" onClick={handleConfirmDelete}>
                {i18n.t(i18n.keys.delete_combination)}
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
      
      {/* Toast Container */}
      <Toaster position="top" alignment="center" />
        </>
      )}
    </div>
  );
};

export default Personalization;
