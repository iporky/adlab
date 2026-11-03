import React, { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import { AlertRegular, PersonRegular, QuestionCircleRegular, SettingsRegular } from '@tfs/icons';
import {
  Menu,
  MenuDivider,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  MultiLevelPicker,
  Navbar as TFSNavbar,
  NavbarMenu,
  tfsuiTheme,
} from '@tfs/ui-components-next';

import { Divider, FlexDiv, Text } from '../../components/styled';
import { selectAppConfig, selectUser, updateAppWorkspaceConfig } from '../../features/session/sessionSlice';
import { oktaAuth } from '../../helpers/authN';
import i18n from '../../helpers/i18n';
import Bullseye from '../../icons/Bullseye';

const UserMenuOptions = css`
  letter-spacing: 1px;
  font-weight: 600;
`;

const UserMenuPopover = ({ userMenuConfig }) => (
  <Menu>
    <MenuTrigger disableButtonEnhancement>
      <PersonRegular />
    </MenuTrigger>

    <MenuPopover>
      <MenuList>
        <MenuItem>
          <Text body1 bd>
            {userMenuConfig.name}
          </Text>
          <Text caption1>{userMenuConfig.email}</Text>
        </MenuItem>
        <MenuDivider />
        <MenuItem onClick={userMenuConfig.logout}>
          <Text body1 styles={UserMenuOptions}>
            {i18n.t(i18n.keys.logout, null, { capitalize: true })}
          </Text>
        </MenuItem>
      </MenuList>
    </MenuPopover>
  </Menu>
);
UserMenuPopover.propTypes = {
  userMenuConfig: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    logout: PropTypes.func,
  }).isRequired,
};

const MultiLevelWorkspacePicker = () => {
  const [showPicker, setShowPicker] = useState(false);

  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const { selectedClientId, selectedAccountId } = useSelector(selectAppConfig);

  const appConfig = useMemo(
    () =>
      user.permissions &&
      Object.entries(user.permissions?.clients).map(([clientId, client]) => ({
        title: client.clientDisplayName,
        field: 'clientId',
        data: { clientId },
        items: Object.entries(client.accounts).map(([accountId, account]) => ({
          title: account.accountDisplayName,
          field: 'accountId',
          data: { accountId },
        })),
      })),
    [user.permissions],
  );

  const label = useMemo(() => {
    const selectedClient = user.permissions?.clients[selectedClientId];
    return `${selectedClient?.clientDisplayName} - ${selectedClient?.accounts[selectedAccountId]?.accountDisplayName}`;
  }, [user.permissions, selectedClientId, selectedAccountId]);

  const updateWorkspace = useCallback(
    ([selectedClientId, selectedAccountId]) => {
      dispatch(updateAppWorkspaceConfig({ selectedClientId, selectedAccountId }));
      setShowPicker(false);
    },
    [dispatch],
  );

  return (
    <NavbarMenu
      items={[
        {
          title: (
            <>
              {showPicker && (
                <MultiLevelPicker
                  config={{
                    title: i18n.t(i18n.keys.choose_workspace, null, {
                      capitalize: true,
                    }),
                    items: appConfig,
                  }}
                  selection={[selectedClientId, selectedAccountId]}
                  onSelect={(selected) => updateWorkspace(selected)}
                />
              )}
              <FlexDiv
                styles={css`
                  gap: ${tfsuiTheme.spacingHorizontalS};
                `}
                onClick={() => setShowPicker(true)}
              >
                <Text
                  body1Strong
                  styles={css`
                    height: 65px;
                    align-content: center;
                    margin-bottom: 5px;
                  `}
                >
                  {label}
                </Text>
                <div>
                  <SettingsRegular />
                </div>
              </FlexDiv>
            </>
          ),
        },
      ]}
    />
  );
};

const Navbar = () => {
  const user = useSelector(selectUser);
  const userMenuConfig = {
    name: `${user.firstName} ${user.lastName}`,
    email: user.email,
    logout: () =>
      oktaAuth.signOut({
        clearTokensBeforeRedirect: true,
        revokeAccessToken: true,
        revokeRefreshToken: true,
      }),
  };

  return (
    <div className="custom-navbar">
      <TFSNavbar
        style={{
          height: '65px',
          minHeight: '65px',
          maxHeight: '65px',
          backgroundColor: '#F1F4F9'
        }}
        title={
          <FlexDiv
            styles={css`
              gap: ${tfsuiTheme.spacingHorizontalL};
            `}
          >
            <Divider />
            <Bullseye />
            <Text
              bd
              styles={css`
                color: ${tfsuiTheme.colorPaletteCornflowerBorderActive};
              `}
            >
              {i18n.t(i18n.keys.app_name, null, { capitalize: true })}
            </Text>
          </FlexDiv>
        }
      leftContent={
        <NavbarMenu
          items={
            [
              /*{ to: '', title: i18n.keys.home },
            { to: 'demos', title: i18n.keys.demos },*/
            ]
          }
          renderItem={({ to, title, onClick }, className) => {
            let navProps = {};
            if (onClick) {
              navProps.onClick = onClick;
            } else {
              navProps.to = to;
            }
            return (
              <NavLink
                key={to}
                {...navProps}
                end
                style={({ isActive }) => ({
                  ...(isActive && {
                    color: tfsuiTheme.colorBrandBackground,
                    borderTopColor: tfsuiTheme.colorBrandBackground,
                    cursor: 'default',
                  }),
                })}
                className={className}
              >
                {i18n.t(title, null, { startCase: true })}
              </NavLink>
            );
          }}
        />
      }
      middleContent={null}
      rightContent={
        <FlexDiv>
          <NavbarMenu
            items={[
              { title: <QuestionCircleRegular />, href: '' },
              { title: <AlertRegular />, href: '' },
            ]}
          />
          <Divider
            styles={css`
              margin-bottom: 5px;
            `}
          />
          <MultiLevelWorkspacePicker />
          <Divider
            styles={css`
              margin-bottom: 5px;
            `}
          />
          <NavbarMenu items={[{ title: <UserMenuPopover userMenuConfig={userMenuConfig} /> }]} />
        </FlexDiv>
      }
    />
    </div>
  );
};

Navbar.propTypes = {};

export default Navbar;
