import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { DismissRegular } from '@tfs/icons';
import {
  Button,
  makeStyles,
  MessageBar,
  MessageBarActions,
  MessageBarBody,
  MessageBarGroup,
  MessageBarTitle,
  tfsuiTheme,
} from '@tfs/ui-components-next';
import { isEmpty } from 'lodash';

import { FlexDiv } from '../../components/styled';
import i18n from '../../helpers/i18n';

import { messagesSelector, removeNotification } from './notificationSlice';

const NotificationsContainer = styled.div`
  position: absolute;
  top: 5%;
  left: 50%;
  transform: translateX(-50%);
  padding: ${tfsuiTheme.spacingHorizontalMNudge};
  border: 2px solid ${tfsuiTheme.colorBrandForeground1};
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: ${tfsuiTheme.colorSubtleBackgroundSelected};
  z-index: 1000;
`;
const useStyles = makeStyles({
  messageBarGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',

    height: 'auto',
    overflow: 'auto',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'end',
    gap: '5px',
  },
});

const NotificationsBar = () => {
  const styles = useStyles();

  const notifications = useSelector(messagesSelector);
  const dispatch = useDispatch();

  const removeNotificationFn = useCallback(
    (id) => {
      dispatch(removeNotification(id));
    },
    [dispatch],
  );

  useEffect(() => {
    notifications.forEach(({ clear, id }) => {
      if (clear) {
        setTimeout(() => {
          removeNotificationFn(id);
        }, clear);
      }
    });
  }, [dispatch, notifications, removeNotificationFn]);

  return (
    !isEmpty(notifications) && (
      <NotificationsContainer>
        {notifications.length > 1 && (
          <FlexDiv
            styles={css`
              justify-content: flex-end;
            `}
          >
            <Button
              aria-label={i18n.t(i18n.keys.clear_all)}
              appearance={'primary'}
              onClick={() => {
                notifications.forEach(({ id }) => removeNotificationFn(id));
              }}
            >
              {i18n.t(i18n.keys.clear_all, null, { capitalize: true })}
            </Button>
          </FlexDiv>
        )}
        <MessageBarGroup animate={'both'} className={styles.messageBarGroup}>
          {notifications.map(({ id, intent, title, message, actions }) => (
            <MessageBar key={`${intent}-${id}`} intent={intent}>
              <MessageBarBody>
                <MessageBarTitle>{title}</MessageBarTitle>
                {message}
              </MessageBarBody>
              {actions && !isEmpty(actions) && (
                <MessageBarActions
                  containerAction={
                    <Button
                      name="dismiss"
                      onClick={() => removeNotificationFn(id)}
                      aria-label="dismiss"
                      appearance="transparent"
                      icon={<DismissRegular />}
                    />
                  }
                >
                  {actions.map(({ label, onClick, intent: actionIntent }) => (
                    <Button key={label} onClick={(args) => onClick(args, id)} intent={actionIntent}>
                      {label}
                    </Button>
                  ))}
                </MessageBarActions>
              )}
            </MessageBar>
          ))}
        </MessageBarGroup>
      </NotificationsContainer>
    )
  );
};

export default NotificationsBar;
