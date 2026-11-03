import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { css } from '@emotion/react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTrigger,
  Field,
  makeStyles,
  ProgressBar as TFSProgressBar,
  tfsuiTheme,
} from '@tfs/ui-components-next';

import { FlexDiv, Text } from '../../components/styled';

import {
  closeProgressBar,
  isProgressBarOpenSelector,
  messageSelector,
  optionsSelector,
  progressSelector,
} from './progressBarSlice';

const useStyles = makeStyles({
  progressField: {
    flexGrow: 1,
  },
  progressbar: {
    marginTop: tfsuiTheme.spacingVerticalSNudge,
  },
});

const ProgressBar = () => {
  const classes = useStyles();

  const isOpen = useSelector(isProgressBarOpenSelector);
  const message = useSelector(messageSelector);
  const options = useSelector(optionsSelector);
  const progress = useSelector(progressSelector);

  const dispatch = useDispatch();

  useEffect(() => {
    if (progress === 1 && options.autoHide) {
      setTimeout(() => {
        dispatch(closeProgressBar());
      }, 200);
    }
  }, [dispatch, options, progress]);

  return (
    <Dialog modalType="alert" open={isOpen}>
      <DialogSurface>
        <DialogBody>
          <DialogContent>
            <FlexDiv
              gap={tfsuiTheme.spacingHorizontalS}
              styles={css`
                width: 100%;
              `}
            >
              <Field validationMessage={message} validationState="none" className={classes.progressField}>
                <TFSProgressBar
                  value={progress || 1}
                  className={classes.progressbar}
                  thickness="large"
                  {...(progress === 1 && { color: 'success' })}
                  {...(options.isError && { color: 'error' })}
                />
              </Field>
              {progress && (
                <Text
                  caption1
                  styles={css`
                    align-self: flex-start;
                  `}
                >
                  {`${Math.floor(progress * 100)}%`}
                </Text>
              )}
            </FlexDiv>
          </DialogContent>
          {!options.autoHide && (
            <DialogActions>
              <DialogTrigger disableButtonEnhancement>
                <Button appearance="secondary" onClick={() => dispatch(closeProgressBar())}>
                  Close
                </Button>
              </DialogTrigger>
              {options.actions.map((action) => (
                <Button key={action.label} appearance={action.appearance || 'primary'} onClick={action.onClick}>
                  {action.label}
                </Button>
              ))}
            </DialogActions>
          )}
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
};

export default ProgressBar;
