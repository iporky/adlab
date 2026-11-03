import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { css } from '@emotion/react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
} from '@tfs/ui-components-next';
import { isEmpty } from 'lodash';

import { HR } from '../../components/styled';

import { closeDialog, selectDialogContents } from './dialogSlice';

const DialogModal = () => {
  const [showDialog, setShowDialog] = useState(false);
  const dialogContents = useSelector(selectDialogContents);

  const {
    title = undefined,
    content = undefined,
    footer = undefined,
    showHeader = true,
    showFooter = true,
    showRejectionButton = true,
    rejectionButtonLabel = 'Close',
    onRejection = () => {},
    rejectionButtonDisabled = false,
    showAffirmationButton = true,
    affirmationButtonLabel = 'Done',
    onAffirmation = () => {},
    affirmationButtonDisabled = false,
  } = dialogContents;
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isEmpty(dialogContents)) {
      setShowDialog(true);
    } else setShowDialog(false);
  }, [dialogContents, dispatch]);

  const handleDialogRejection = useCallback(() => {
    onRejection();
    dispatch(closeDialog());
  }, [onRejection, dispatch]);

  const handleDialogAffirmation = useCallback(() => {
    onAffirmation();
  }, [onAffirmation]);

  return (
    <Dialog open={showDialog}>
      <DialogSurface>
        <DialogBody>
          {showHeader && (
            <DialogTitle>
              {title}
              <HR
                styles={css`
                  margin: 4px 0;
                `}
              />
            </DialogTitle>
          )}
          <DialogContent>
            {content}
            <HR
              styles={css`
                margin: 10px 0;
              `}
            />
          </DialogContent>
          {showFooter &&
            (footer || (
              <DialogActions fluid>
                {showRejectionButton && (
                  <DialogTrigger disableButtonEnhancement>
                    <Button appearance="secondary" onClick={handleDialogRejection} disabled={rejectionButtonDisabled}>
                      {rejectionButtonLabel}
                    </Button>
                  </DialogTrigger>
                )}
                {showAffirmationButton && (
                  <Button appearance="primary" onClick={handleDialogAffirmation} disabled={affirmationButtonDisabled}>
                    {affirmationButtonLabel}
                  </Button>
                )}
              </DialogActions>
            ))}
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
};
export default DialogModal;
