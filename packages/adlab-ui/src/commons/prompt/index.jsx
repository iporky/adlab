import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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

import { closePrompt, selectPromptContents } from './promptSlice';

const Prompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const promptContents = useSelector(selectPromptContents);
  const {
    title = undefined,
    content = undefined,
    actions = [],
    showRejectionButton = true,
    rejectionButtonLabel = 'Close',
    onRejection = () => {},
    rejectionButtonDisabled = false,
  } = promptContents;
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isEmpty(promptContents)) {
      setShowPrompt(true);
    } else setShowPrompt(false);
  }, [setShowPrompt, promptContents]);

  const handleDialogRejection = useCallback(() => {
    onRejection();
    dispatch(closePrompt());
  }, [onRejection, dispatch]);

  return (
    <Dialog modalType="alert" open={showPrompt}>
      <DialogSurface>
        <DialogBody>
          {title && <DialogTitle>{title}</DialogTitle>}
          <DialogContent>{content}</DialogContent>
          <DialogActions>
            <DialogTrigger disableButtonEnhancement>
              {showRejectionButton && (
                <Button appearance="secondary" onClick={handleDialogRejection} disabled={rejectionButtonDisabled}>
                  {rejectionButtonLabel}
                </Button>
              )}
            </DialogTrigger>
            {actions.map((action) => (
              <Button key={action.label} appearance={action.appearance || 'primary'} onClick={action.onClick}>
                {action.label}
              </Button>
            ))}
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
};

export default Prompt;
