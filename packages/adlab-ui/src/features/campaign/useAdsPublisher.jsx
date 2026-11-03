import React, { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { CheckmarkCircle32Filled, ErrorCircleFilled } from '@tfs/icons';
import { makeStyles, tfsuiTheme } from '@tfs/ui-components-next';
import { capitalize, keys } from 'lodash';

import { closeProgressBar } from '../../commons/progressBar/progressBarSlice';
import { closePrompt, openPrompt } from '../../commons/prompt/promptSlice';
import { FlexDiv } from '../../components/styled';
import { usePublishAdsToPlatformMutation } from '../api/apiSlice';

const useClasses = makeStyles({
  checkmarkCircleFilled: {
    color: tfsuiTheme.colorPaletteGreenForeground1,
    fontSize: '32px',
  },
  errorCircleFilled: {
    color: tfsuiTheme.colorStatusDangerBackground3,
    fontSize: '32px',
  },
});

const useAdsPublisher = ({ platform, adsList, resetParentState }) => {
  const classes = useClasses();
  const dispatch = useDispatch();

  const [publishAdsToPlatform, { isLoading, isSuccess, isError, error, reset: resetPublishAdsMutation }] =
    usePublishAdsToPlatformMutation({});

  const publishAdsHandler = useCallback(() => {
    dispatch(
      openPrompt({
        title: 'Publish Ads',
        content: (
          <div>
            Are you sure you want to upload these ads to <b>{capitalize(platform)}</b>?
          </div>
        ),
        actions: [
          {
            label: 'Publish Ads',
            onClick: () => {
              dispatch(closePrompt());
              dispatch(publishAdsToPlatform({ platform, adsList }));
            },
          },
        ],
        rejectionButtonLabel: 'Cancel',
      }),
    );
  }, [dispatch, publishAdsToPlatform, platform, adsList]);

  useEffect(() => {
    if (isSuccess) {
      dispatch(
        openPrompt({
          title: (
            <FlexDiv gap={tfsuiTheme.spacingHorizontalS}>
              <CheckmarkCircle32Filled className={classes.checkmarkCircleFilled} />
              <div>Ads Published</div>
            </FlexDiv>
          ),
          content: `Your ads have been successfully published to ${platform}.`,
          onRejection: () => {
            resetParentState();
          },
        }),
      );
    }
  }, [dispatch, isSuccess, platform, resetParentState, classes.checkmarkCircleFilled]);

  useEffect(() => {
    if (isError) {
      dispatch(closeProgressBar());
      dispatch(
        openPrompt({
          title: (
            <FlexDiv gap={tfsuiTheme.spacingHorizontalS}>
              <ErrorCircleFilled className={classes.errorCircleFilled} />
              <div>Ads Publishing Failed</div>
            </FlexDiv>
          ),
          content: (
            <>
              <div>An error occurred while publishing the ads. Please try again.</div>
              {error?.data?.message && (
                <div>
                  {error.data.message} for {keys(error.data.errors).length} records.
                </div>
              )}
            </>
          ),
        }),
      );
    }
  }, [isError, error, dispatch, classes.errorCircleFilled]);

  return [publishAdsHandler, isLoading, isError, error?.data, resetPublishAdsMutation];
};

useAdsPublisher.propTypes = {};

export default useAdsPublisher;
