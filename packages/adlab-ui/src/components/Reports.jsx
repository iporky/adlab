import React from 'react';
import { useSelector } from 'react-redux';
import { ChartMultiple24Regular } from '@tfs/icons';
import { makeStyles, Text, tokens } from '@tfs/ui-components-next';

import { selectUser } from '../features/session/sessionSlice';

const useStyles = makeStyles({
  root: {
    padding: tokens.spacingVerticalL,
  },
  title: {
    marginBottom: tokens.spacingVerticalM,
    color: tokens.colorNeutralForeground1,
  },
  headerContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    marginBottom: tokens.spacingVerticalM,
  },
  iconContainer: {
    display: 'flex',
    alignItems: 'center',
    color: tokens.colorBrandForeground1,
  },
});

function Reports() {
  const user = useSelector(selectUser);
  const styles = useStyles();

  // Check if user is authenticated
  const isAuthenticated = !!user && Object.keys(user).length > 0;

  if (!isAuthenticated) {
    return (
      <div className={styles.root}>
        <Text size={400} weight="semibold" block>
          Please login to access reports
        </Text>
      </div>
    );
  }

  return (
    <div className={styles.root}>
      <div className={styles.headerContainer}>
        <span className={styles.iconContainer}>
          <ChartMultiple24Regular />
        </span>
        <Text size={700} weight="semibold" block className={styles.title}>
          Reports
        </Text>
      </div>
      <Text size={300}>View analytics and performance reports for your campaigns.</Text>
    </div>
  );
}

export default Reports;
