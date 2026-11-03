import React, { useMemo,useState } from 'react';
import { useDispatch,useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft24Regular, ChevronDown24Regular, ChevronRight24Regular,Delete24Regular, WarningRegular } from '@tfs/icons';
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
  makeStyles, 
  Tag, 
  Text, 
  Toast,
  Toaster,
  ToastTitle,
  tokens, 
  useToastController
} from '@tfs/ui-components-next';

import i18n from '../../helpers/i18n';
import { deleteCombination } from '../../store/slices/campaignSlice';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    padding: tokens.spacingHorizontalM,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: tokens.spacingVerticalS,
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
    height: '70vh',
    overflow: 'hidden',
  },
  metricsSection: {
    flexShrink: 0,
  },
  combinationsSection: {
    flex: 1,
    overflowY: 'auto',
    paddingRight: tokens.spacingHorizontalXS, // Add padding for scrollbar
  },
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
    minWidth: 0, // Allows text to truncate if needed
  },
  accordionControls: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    flexShrink: 0, // Prevents controls from shrinking
  },
  accordionBody: {
    padding: `0 ${tokens.spacingVerticalL} ${tokens.spacingVerticalL} ${tokens.spacingVerticalL}`,
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: `0 0 ${tokens.borderRadiusLarge} ${tokens.borderRadiusLarge}`,
    animation: 'slideDown 0.2s ease-out',
  },
  '@keyframes slideDown': {
    from: {
      opacity: 0,
      transform: 'translateY(-10px)',
    },
    to: {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
  duplicateBadge: {
    position: 'absolute',
    top: tokens.spacingVerticalS,
    right: tokens.spacingVerticalS,
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
  tag: {
    maxWidth: '100%',
    overflowWrap: 'anywhere',
    wordBreak: 'break-word',
    whiteSpace: 'normal',
    minWidth: 0,
    fontSize: tokens.fontSizeBase100,
  },
  emptyState: {
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
});

const CombinationsVisualizer = () => {
  const styles = useStyles();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { dispatchToast } = useToastController();
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [combinationToDelete, setCombinationToDelete] = useState(null);
  const [expandedIndex, setExpandedIndex] = useState(null);
  
  const formData = useSelector((state) => state.campaign.formData);

  // Log final campaign data on Generate and View Data click
  const handleGenerateAndViewData = () => {
    console.log('Final campaign data:', formData);
    navigate('/adlab/campaign/next-step');
  };
  const combinations = formData.personalization?.combinations || [];

  const handleToggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const handleDeleteClick = (index, event) => {
    event.stopPropagation(); // Prevent accordion toggle when clicking delete
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

  // Calculate metrics
  const metrics = useMemo(() => {
    const totalCombinations = combinations.length;
    
    // Find duplicates by comparing JSON strings of combinations
    const duplicates = [];
    const seen = new Map();
    
    combinations.forEach((combination, index) => {
      const key = JSON.stringify({
        key: combination.key,
        mapping: combination.mapping,
        persona: combination.persona
      });
      
      if (seen.has(key)) {
        duplicates.push(index);
        if (!duplicates.includes(seen.get(key))) {
          duplicates.push(seen.get(key));
        }
      } else {
        seen.set(key, index);
      }
    });

    const uniqueKeys = new Set(combinations.map(c => c.key)).size;
    
    return {
      total: totalCombinations,
      duplicates: duplicates.length,
      uniqueKeys
    };
  }, [combinations]);

  const renderValue = (value) => {
    if (Array.isArray(value)) {
      return value.map((item, index) => (
        <Tag key={index} size="small" appearance="outline" className={styles.tag}>
          {item}
        </Tag>
      ));
    }
    return (
      <Tag size="small" appearance="filled" className={styles.tag}>
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

  const isDuplicate = (index) => {
    const current = combinations[index];
    const currentKey = JSON.stringify({
      key: current.key,
      mapping: current.mapping,
      persona: current.persona
    });
    
    return combinations.some((other, otherIndex) => {
      if (otherIndex <= index) return false;
      const otherKey = JSON.stringify({
        key: other.key,
        mapping: other.mapping,
        persona: other.persona
      });
      return currentKey === otherKey;
    });
  };

  return (
    <div className="campaign-bg">
      {/* Breadcrumbs */}
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
            <BreadcrumbButton current>Combinations</BreadcrumbButton>
          </BreadcrumbItem>
        </Breadcrumb>
      </div>

      <div className={styles.root}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <Button
              appearance="subtle"
              icon={<ArrowLeft24Regular />}
              onClick={() => navigate(-1)}
              className={styles.backButton}
            />
            <Text size={400} weight="semibold">
              {i18n.t(i18n.keys.combinations_visualizer_header)}
            </Text>
          </div>
          <div style={{ display: 'flex', gap: tokens.spacingHorizontalM }}>
            <Button 
              appearance="outline" 
              onClick={() => navigate('/adlab/campaign/personalization')}
            >
              {i18n.t(i18n.keys.add_more_combinations)}
            </Button>
            <Button appearance="primary" onClick={handleGenerateAndViewData}>
              {i18n.t(i18n.keys.generate_and_view_data)}
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className={styles.content}>
          {combinations.length === 0 ? (
            <div className={styles.emptyState}>
              <Text size={600} weight="bold" style={{ color: tokens.colorNeutralForeground2 }}>
                📋 No Combinations Yet
              </Text>
              <Text size={400} style={{ color: tokens.colorNeutralForeground3 }}>
                {i18n.t(i18n.keys.no_combinations)}
              </Text>
              <Button 
                appearance="primary" 
                onClick={() => navigate('/adlab/campaign/personalization')}
                size="large"
              >
                Create Your First Combination
              </Button>
            </div>
          ) : (
            <>
              {/* Metrics Bar */}
              <div className={styles.metricsSection}>
                <div className={styles.metricsBar}>
                  <div className={styles.metricCard}>
                    <Text size={400} weight="bold" style={{ color: tokens.colorBrandForeground1 }}>
                      📊 {metrics.total}
                    </Text>                  <Text size={300} style={{ color: tokens.colorNeutralForeground2 }}>
                    {i18n.t(i18n.keys.total_combinations)}
                  </Text>
                  </div>
                  <div className={styles.metricCard}>
                    <Text size={400} weight="bold" style={{ 
                      color: metrics.duplicates > 0 ? tokens.colorPaletteRedForeground2 : tokens.colorPaletteGreenForeground2 
                    }}>
                      {metrics.duplicates > 0 ? '⚠️' : '✅'} {metrics.duplicates}
                    </Text>                  <Text size={300} style={{ color: tokens.colorNeutralForeground2 }}>
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
              </div>

              {/* Combinations Accordion */}
              <div className={styles.combinationsSection}>
                <div className={styles.combinationsContainer}>
                {combinations.map((combination, index) => {
                  const isCurrentDuplicate = isDuplicate(index);
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
              </div>
            </>
          )}
        </div>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={(event, data) => {
          if (!data.open) {
            handleCancelDelete();
          }
        }}>
          <DialogSurface>
            <DialogTitle>{i18n.t(i18n.keys.delete_combination)}</DialogTitle>
            <DialogContent>
              <DialogBody>
                <Text>{i18n.t(i18n.keys.delete_combination_confirm)}</Text>
              </DialogBody>
              <DialogActions>
                <Button appearance="secondary" onClick={handleCancelDelete}>
                  Cancel
                </Button>
                <Button appearance="primary" onClick={handleConfirmDelete}>
                  {i18n.t(i18n.keys.delete_combination)}
                </Button>
              </DialogActions>
            </DialogContent>
          </DialogSurface>
        </Dialog>

        {/* Toast Container */}
        <Toaster />
      </div>
    </div>
  );
};

export default CombinationsVisualizer;
