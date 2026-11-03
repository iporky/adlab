import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { ChartMultiple24Regular, DocumentMultiple24Regular, Home24Regular } from '@tfs/icons';
import { makeStyles, tfsuiTheme } from '@tfs/ui-components-next';

import { Text } from '../components/styled';

export const drawerWidth = 100;

const useStyles = makeStyles({
  navFrame: {
    width: '100px',
    height: '100%',
    padding: `${tfsuiTheme.spacingVerticalM} 0`,
    display: 'flex',
    flexDirection: 'column',
  },
  navItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0',
    cursor: 'pointer',
  },
  iconContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    transition: 'background-color 0.2s ease',
  },
  activeIconContainer: {
    backgroundColor: tfsuiTheme.colorBrandBackground, // TFS purple background for active state
    boxShadow: '0px 4px 4px 0px #4F3ED733',
  },
  inactiveIconContainer: {
    backgroundColor: 'transparent',
    '&:hover': {
      backgroundColor: tfsuiTheme.colorNeutralBackground3Hover,
    },
  },
  activeIcon: {
    color: tfsuiTheme.colorNeutralForegroundInverted, // White text on purple background
    fontSize: '19px',
  },
  inactiveIcon: {
    color: '#AAA6A6',
    fontSize: '19px',
  },
  iconText: {
    marginTop: '2px',
    textAlign: 'center',
    fontSize: '12px !important',
    fontFamily: tfsuiTheme.fontFamilyBase,
    fontWeight: '400 !important',
    lineHeight: '100%',
  },
  activeText: {
    color: tfsuiTheme.colorBrandForeground1, // TFS purple text color
    fontWeight: tfsuiTheme.fontWeightSemibold, // Make active text semi-bold for better visibility
  },
  inactiveText: {
    color: '#AAA6A6',
  },
  divider: {
    border: 'none',
    height: '1px',
    margin: '4px 16px',
    backgroundColor: tfsuiTheme.colorNeutralStroke2,
  },
sidenavContainer: {
  background: '#FFFFFF54',
  border: '1px solid #CAE6FF',
  width: '100px',
  height: '75vh',
  margin: '5px 20px',
  borderRadius: '14px',
  borderWidth: '1px',
}
});

const StyledDivider = () => {
  const styles = useStyles();
  return <hr className={styles.divider} />;
};

const navItems = [
  { text: 'Dashboard', icon: Home24Regular, path: '/adlab' },
  { text: 'Campaigns', icon: DocumentMultiple24Regular, path: '/adlab/campaigns' },
  { text: 'Reports', icon: ChartMultiple24Regular, path: '/adlab/reports' },
];

const NavItem = ({ text, icon: Icon, isActive, onClick }) => {
  const styles = useStyles();

  return (
    <div className={styles.navItem} onClick={onClick}>
      <div className={`${styles.iconContainer} ${isActive ? styles.activeIconContainer : styles.inactiveIconContainer}`}>
        <Icon className={isActive ? styles.activeIcon : styles.inactiveIcon} />
      </div>
      <Text className={`${styles.iconText} ${isActive ? styles.activeText : styles.inactiveText}`}>{text}</Text>
    </div>
  );
};

NavItem.propTypes = {
  text: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired,
  path: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

const Sidebar = () => {
  const styles = useStyles();
  const navigate = useNavigate();
  const location = useLocation();
  const isItemActive = (path) => {
    // For campaigns menu item, highlight it for both '/campaign' and '/campaigns' paths
    if (path === '/adlab/campaigns') {
      return location.pathname.includes('/campaign') || location.pathname.includes('/campaigns');
    }

    // For other menu items, exact match or starting with the path
    return location.pathname === path || (location.pathname.startsWith(path) && path !== '/adlab');
  };

  return (
    <nav className={styles.sidenavContainer}>
      <div className={styles.navFrame}>
        {navItems.map((item, index) => (
          <React.Fragment key={item.text}>
            <NavItem
              text={item.text}
              icon={item.icon}
              path={item.path}
              isActive={isItemActive(item.path)}
              onClick={() => navigate(item.path)}
            />
            {index < navItems.length - 1 && <StyledDivider />}
          </React.Fragment>
        ))}
      </div>
    </nav>
  );
};

export default Sidebar;