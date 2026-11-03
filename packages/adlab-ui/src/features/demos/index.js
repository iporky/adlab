import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { css } from '@emotion/react';
import { Button, tfsuiTheme } from '@tfs/ui-components-next';

import { closeDialog, openDialog } from '../../commons/dialog/dialogSlice';
import { addNotification, removeNotification } from '../../commons/notifications/notificationSlice';
import { closePrompt, openPrompt } from '../../commons/prompt/promptSlice';
import { FlexDiv } from '../../components/styled';

const MessageCenter = () => {
  const dispatch = useDispatch();

  const triggerNotifications = useCallback(() => {
    const messages = [
      {
        title: 'Closeable Toast',
        message: `This notification has an aria close icon in addition to action button.`,
        intent: 'info',
      },
      {
        title: 'Actionable Toast',
        message: `This toast can have action buttons.`,
        intent: 'success',
        actions: [
          {
            label: 'Trigger More',
            onClick: (arg, id) => {
              dispatch(removeNotification(id));
              triggerNotifications();
            },
          },
        ],
      },
      {
        title: <em>Customized Toast</em>,
        message: (
          <div>
            This toast takes <b>jsx</b> elements for a <u>content</u>.
          </div>
        ),
        intent: 'success',
        actions: [
          {
            label: 'Clear',
            onClick: (arg, id) => {
              dispatch(removeNotification(id));
            },
          },
        ],
      },
      {
        title: 'Timed Toast',
        message: `This warning will automatically clear out on 5 seconds.`,
        intent: 'warning',
        clear: 5000,
      },
      {
        title: 'Persistent Toast',
        message: `This toast will persist until the clea button is clicked. Additional text being added here...`,
        intent: 'error',
        actions: [
          {
            label: 'Clear',
            onClick: (arg, id) => {
              dispatch(removeNotification(id));
            },
          },
        ],
      },
    ];

    messages.forEach((msg) => {
      dispatch(addNotification(msg));
    });
  }, [dispatch]);

  const triggerPrompt = useCallback(() => {
    dispatch(
      openPrompt({
        title: 'Prompt Demo',
        content: (
          <>
            <div>
              The prompt body can contain a <b>string or jsx elements</b> and both will be rendered perfectly.
            </div>
            <div>
              <b>Click on the buttons below to see the actions.</b>
            </div>
          </>
        ),
        actions: [
          {
            label: 'Action 1',
            appearance: 'primary',
            onClick: () => {
              dispatch(closePrompt());
              dispatch(
                addNotification({
                  title: 'Prompt Action',
                  message: `Notification triggered by clicking prompt Action 1.`,
                  intent: 'success',
                  closable: false,
                  clear: 5000,
                  actions: [
                    {
                      label: 'Clear',
                      onClick: (arg, id) => {
                        dispatch(removeNotification(id));
                      },
                    },
                  ],
                }),
              );
            },
          },
        ],
      }),
    );
  }, [dispatch]);

  const triggerDialog = useCallback(() => {
    dispatch(
      openDialog({
        title: 'Dialog Demo',
        content: (
          <>
            <div>
              The dialog body can contain a <b>string or jsx elements</b> and both will be rendered perfectly.
            </div>
            <FlexDiv
              styles={css`
                height: 150px;
              `}
            />
            <div>
              <b>Click on the buttons below to see the actions.</b>
            </div>
          </>
        ),
        affirmationButtonLabel: 'Save',
        onAffirmation: () => {
          dispatch(
            openPrompt({
              title: 'Dialog Affirmation Action',
              content: (
                <div>
                  You have clicked the dialog affirmation action. <br />
                  <b>Prompt action has been chained.</b>
                </div>
              ),
              actions: [
                {
                  label: 'Done',
                  onClick: () => {
                    dispatch(closePrompt());
                    dispatch(closeDialog());
                    dispatch(
                      addNotification({
                        title: 'Prompt Action',
                        message: `Notification triggered by clicking prompt Done.`,
                        intent: 'success',
                        closable: false,
                        clear: 5000,
                        actions: [
                          {
                            label: 'Clear',
                            onClick: (arg, id) => {
                              dispatch(removeNotification(id));
                            },
                          },
                        ],
                      }),
                    );
                  },
                },
              ],
            }),
          );
        },
      }),
    );
  }, [dispatch]);

  return (
    <FlexDiv
      column
      gap={tfsuiTheme.spacingVerticalXL}
      styles={css`
        justify-content: center;
        margin-top: 15%;
      `}
    >
      <Button appearance={'primary'} onClick={triggerNotifications}>
        Trigger Notifications
      </Button>
      <Button appearance={'primary'} onClick={triggerDialog}>
        Trigger Dialog
      </Button>
      <Button appearance={'primary'} onClick={triggerPrompt}>
        Trigger Prompt
      </Button>
    </FlexDiv>
  );
};

export default MessageCenter;
