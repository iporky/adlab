import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft24Regular, ArrowRight24Regular, ChevronDown24Regular, ChevronRight16Regular } from '@tfs/icons';
import { Accordion, AccordionHeader, AccordionItem, AccordionPanel, Button, makeStyles, Spinner, Tag, Text, tokens } from '@tfs/ui-components-next';
import _ from 'lodash';

import SampleInputs from '../../commons/SampleInputs';
import { formatName } from '../../commons/utils';
import { useGetObjectiveGoalsQuery, useGetObjectiveTypesQuery } from '../../features/api/campaignApi';
import i18n from '../../helpers/i18n';
import { setSelectedGoal, updateObjectives } from '../../store/slices/campaignSlice';
import { getTagStyles,transformObjectiveGoals, transformObjectiveTypes } from '../../utils/generic';

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
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: tokens.spacingHorizontalL,
    marginBottom: tokens.spacingVerticalM,
  },
  objectivesSection: {
    width: '270px',
    display: 'flex',
    flexDirection: 'column',
    maxHeight: 'calc(100vh - 100px)',
    overflowY: 'auto',
  },
  accordion: {
    width: '100%',
    fontWeight: '400 !important',
    fontStyle: 'normal',
    fontSize: '16px',
    lineHeight: '100%',
    letterSpacing: '0%',
    maxHeight: 'calc(100vh - 150px)',
    overflowY: 'auto',
  },
  accordionItem: {
    border: 'none',
    height: 'auto',
    minHeight: '40px',
    '&:last-child': {
      marginBottom: 0,
    },
    padding: tokens.spacingVerticalS,
  },
  accordionHeader: {
    padding: `${tokens.spacingVerticalM} ${tokens.spacingHorizontalL}`,
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
    height: 40,
    backgroundColor: '#FFFFFF80',
    border: '1px solid #FFFFFF',
  },
  accordionPanel: {
    padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalL}`,
    backgroundColor: '#FFFFFF80',
    border: '1px solid #FFFFFF',
    margin: 0,
    maxHeight: '300px',
    overflowY: 'auto',
  },
  objectivesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXS,
    paddingLeft: tokens.spacingHorizontalM,
  },
  objectiveTag: {
    width: '100%',
    cursor: 'pointer',
    padding: '0 !important',
    border: 'none !important',
    background: 'transparent !important',
  },
  objectiveTagWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalM}`,
    borderRadius: tokens.borderRadiusMedium,
    border: '1px solid transparent',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
  goalsSection: {
    width: '320px',
    display: 'flex',
    flexDirection: 'column',
  },
  goalsCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXS,
    padding: tokens.spacingVerticalL,
    borderRadius: tokens.borderRadiusLarge,
    height: 'auto',
  },
  goalTag: {
    width: '100%',
    justifyContent: 'flex-start',
  },
  sampleSection: {
    flex: 1,
    minWidth: 0,
  },
});

// Transform objectiveTypes and objectiveGoals if they are objects of objects
const Objectives = () => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedGoal, formData } = useSelector((state) => state.campaign);
  const [selectedObjective, setSelectedObjective] = useState(formData.objectives.selectedObjective);
  const [focusedField, setFocusedField] = useState(selectedObjective);
  const [expandedAccordion, setExpandedAccordion] = useState(null);

  const { data: rawObjectiveTypes = {}, isLoading: loadingObjectives, error } = useGetObjectiveTypesQuery();
  const { data: rawObjectiveGoals = {}, isLoading: loadingGoals } = useGetObjectiveGoalsQuery();
  
  const objectiveTypes = transformObjectiveTypes(rawObjectiveTypes);
  const objectiveGoals = transformObjectiveGoals(rawObjectiveGoals);

  useEffect(() => {
    dispatch(
      updateObjectives({
        selectedObjective,
        selectedGoal,
      }),
    );
  }, [dispatch, selectedObjective, selectedGoal]);

  useEffect(() => {
    if (formData.objectives.selectedObjective) {
      setFocusedField(formData.objectives.selectedObjective.toUpperCase());
    }
  }, [formData.objectives.selectedObjective]);

  const handleObjectiveClick = (objective) => {
    setSelectedObjective(objective);
    setFocusedField(objective?.toUpperCase());
    dispatch(setSelectedGoal(null));
  };

  const handleGoalClick = (goal) => {
    dispatch(setSelectedGoal(goal));
  };

  const handleAccordionChange = (categoryValue) => {
    setExpandedAccordion(expandedAccordion === categoryValue ? null : categoryValue);
  };

  const handleNext = () => {
    // Navigate to platform selector page
    navigate('/adlab/campaign/platform');
  };

  const showGoals = selectedObjective && objectiveGoals[selectedObjective];

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
            {i18n.t(i18n.keys.objectives_header)}
          </Text>
        </div>
        <Button appearance="primary" onClick={handleNext}>
          {i18n.t(i18n.keys.next)}
        </Button>
      </div>

      <div className={styles.content}>
        <div className={`${styles.objectivesSection} container-bg`}>
          <div className={styles.card}>
            {loadingObjectives ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: tokens.spacingVerticalL }}>
                <Spinner size="medium" />
              </div>
            ) : error ? (
              <Text color="error">{i18n.t(i18n.keys.error_loading_objectives)}: {error}</Text>
            ) : (
              <Accordion className={styles.accordion} collapsible>
                {Object.entries(objectiveTypes).map(([category, objectives]) => (
                  <AccordionItem 
                    key={category} 
                    value={category}
                    className={styles.accordionItem}
                  >
                    <AccordionHeader 
                      className={styles.accordionHeader}
                      expandIcon={''}
                      onClick={() => handleAccordionChange(category)}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                        <Text>
                          {formatName(category)}
                        </Text>
                        <ChevronDown24Regular 
                          style={{ 
                            transform: expandedAccordion === category ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.2s ease-in-out'
                          }} 
                        />
                      </div>
                    </AccordionHeader>
                    <AccordionPanel className={styles.accordionPanel}>
                      <div className={styles.objectivesList}>
                        {objectives.map(({ name, value }) => (
                          <div
                            key={value}
                            className={styles.objectiveTagWrapper}
                            onClick={() => handleObjectiveClick(value)}
                            style={{
                              ...getTagStyles(selectedObjective === value, tokens),
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              width: '100%'
                            }}
                          >
                            <Text>{formatName(name)}</Text>
                            <ChevronRight16Regular />
                          </div>
                        ))}
                      </div>
                    </AccordionPanel>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </div>
        </div>

        {showGoals && (
          <>
            <ArrowRight24Regular style={{ alignSelf: 'center' }} />
            <div className={styles.goalsSection}>
              <div className={`${styles.goalsCard} container-bg`}>
                {loadingGoals ? (
                  <div style={{ display: 'flex', justifyContent: 'center', padding: tokens.spacingVerticalL }}>
                    <Spinner size="medium" />
                  </div>
                ) : (
                  objectiveGoals[selectedObjective].map((goal) => (
                    <Tag
                      key={goal}
                      appearance={selectedGoal === goal ? 'filled' : 'outline'}
                      onClick={() => handleGoalClick(goal)}
                      className={styles.goalTag}
                      style={getTagStyles(selectedGoal === goal, tokens)}
                    >
                      {formatName(goal)}
                    </Tag>
                  ))
                )}
              </div>
            </div>
          </>
        )}
        {!showGoals && <div style={{ width: '320px' }} />}
        <div className={styles.sampleSection}>
          <SampleInputs focusedField={focusedField} />
        </div>
      </div>
    </div>
    </div>
  );
};

export default Objectives;