import React from 'react';
import { useSelector } from 'react-redux';
import { ChartMultiple24Regular, Person24Regular, Settings24Regular } from '@tfs/icons';
import { Button, makeStyles, Text, tokens } from '@tfs/ui-components-next';

import { selectUser } from '../features/session/sessionSlice';

const useStyles = makeStyles({
  root: {
    padding: `${tokens.spacingVerticalM} 0`,
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: `0 ${tokens.spacingHorizontalL}`,
  },
  welcomeText: {
    marginBottom: tokens.spacingVerticalL,
    color: tokens.colorNeutralForeground1,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: tokens.spacingHorizontalL,
    '@media (min-width: 768px)': {
      gridTemplateColumns: '1fr 1fr',
    },
  },
  paper: {
    borderRadius: tokens.borderRadiusMedium,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    padding: tokens.spacingVerticalL,
    backgroundColor: tokens.colorNeutralBackground1,
  },
  list: {
    padding: 0,
    margin: 0,
    listStyle: 'none',
  },
  listItem: {
    display: 'flex',
    alignItems: 'center',
    padding: tokens.spacingVerticalS,
    cursor: 'pointer',
    borderRadius: tokens.borderRadiusSmall,
    '&:hover': {
      backgroundColor: tokens.colorNeutralBackground2,
    },
  },
  listItemIcon: {
    marginRight: tokens.spacingHorizontalS,
    display: 'flex',
    alignItems: 'center',
  },
  statBox: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
  },
  loginContainer: {
    textAlign: 'center',
    marginTop: tokens.spacingVerticalXXL,
    maxWidth: '600px',
    margin: '0 auto',
  },
});

function Dashboard() {
  const user = useSelector(selectUser);
  const styles = useStyles();

  // Check if user is authenticated
  const isAuthenticated = !!user && Object.keys(user).length > 0;

  if (!isAuthenticated) {
    return (
      <div className={styles.loginContainer}>
        <Text size={400} weight="semibold" block>
          Please login to access the dashboard
        </Text>
        <Button appearance="primary">Login</Button>
      </div>
    );
  }

  return (
    <div className={styles.root}>
      <div className={styles.container}>
        {' '}
        <Text size={700} weight="semibold" block className={styles.welcomeText}>
          Welcome, {user?.firstName || 'User'}
        </Text>
        <div className={styles.grid}>
          <div className={styles.paper}>
            <Text size={500} weight="semibold" block>
              Quick Actions
            </Text>
            <ul className={styles.list}>
              {' '}
              <li className={styles.listItem}>
                <span className={styles.listItemIcon}>
                  <Person24Regular />
                </span>
                <Text>View Profile</Text>
              </li>
              <li className={styles.listItem}>
                <span className={styles.listItemIcon}>
                  <Settings24Regular />
                </span>
                <Text>Settings</Text>
              </li>
            </ul>
          </div>
          <div className={styles.paper}>
            <Text size={500} weight="semibold" block>
              Statistics
            </Text>{' '}
            <div className={styles.statBox}>
              <ChartMultiple24Regular />
              <Text size={200} color={tokens.colorNeutralForeground2}>
                No data available
              </Text>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
