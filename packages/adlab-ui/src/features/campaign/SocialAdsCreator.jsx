import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { FileUploader } from 'react-drag-drop-files';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { CheckmarkCircle32Filled, CheckmarkCircleWarningFilled } from '@tfs/icons';
import { Button, makeStyles, Spinner, tfsuiTheme, ToggleButton } from '@tfs/ui-components-next';
import { isEmpty, keys } from 'lodash';

import { LoadingIndicator } from '../../components';
import { FlexDiv, Text } from '../../components/styled';
import CSVFileIcon from '../../icons/CSVFileIcon.jsx';
import JSONFileIcon from '../../icons/JSONFileIcon.jsx';
import SnapchatIcon from '../../icons/SnapchatIcon.jsx';
import TikTokIcon from '../../icons/TikTokIcon.jsx';
import XLSXFileIcon from '../../icons/XLSXFileIcon.jsx';

import AdDataTable from './AdDataTable.jsx';
import useAdsPublisher from './useAdsPublisher.jsx';
import useParseFileForRecords from './useParseFileForRecords.jsx';

const acceptedFileTypes = ['csv', 'json', 'xlsx'];

const SocialAdsCreatorFrame = styled(FlexDiv)`
  position: relative;
`;
const FileDropperFrame = styled(FlexDiv)`
  margin: 0 10px;
  align-items: flex-start;
  gap: ${tfsuiTheme.spacingVerticalXL};
`;

const PlatformSelectorFrame = styled(FileDropperFrame)`
  align-self: flex-start;
`;

const FileDropSummaryFrame = styled(FileDropperFrame)`
  flex-direction: column;
  border-left: 2px solid ${tfsuiTheme.colorCompoundBrandForeground1};
  padding-left: ${tfsuiTheme.spacingHorizontalXL};
  gap: ${tfsuiTheme.spacingVerticalM};
  margin-top: 42px;
  width: 420px;
`;

const LoadingIndicatorFrame = styled(FlexDiv)`
  position: relative;
  height: 250px;
  width: 100%;
`;
const ContextActionFrame = styled(FileDropperFrame)`
  border-left: 2px solid ${tfsuiTheme.colorCompoundBrandForeground1};
  margin: 42px 10px 0;
  height: 70%;
  align-items: center;
  justify-content: center;
  padding-left: ${tfsuiTheme.spacingHorizontalXL};
  gap: ${tfsuiTheme.spacingHorizontalM};
`;

const FileUploaderDropZone = styled(FlexDiv)`
  border: 2px dashed ${tfsuiTheme.colorCompoundBrandForeground1};
  width: 420px;
  height: 100px;
  justify-content: space-between;
  border-radius: ${tfsuiTheme.borderRadiusMedium};
  padding: ${tfsuiTheme.spacingVerticalXL} ${tfsuiTheme.spacingHorizontalXL};
`;

const TableWrapperFrame = styled(FlexDiv)`
  overflow: auto;
  align-self: flex-start;
  align-items: flex-start;
  ${({ styles }) => ({ ...styles })};
`;

const TableWrapper = ({ children: table }) => {
  const tableWrapperRef = useRef();
  const [parentRect, setParentRect] = useState({ height: 0, width: 0 });

  useLayoutEffect(() => {
    const updateWidth = () => {
      if (tableWrapperRef.current && tableWrapperRef.current.parentElement.parentElement) {
        setParentRect({
          width: tableWrapperRef.current.parentElement.parentElement.offsetWidth - 20,
          height: tableWrapperRef.current.parentElement.parentElement.offsetHeight - 10,
        });
      }
    };

    window.addEventListener('resize', updateWidth);
    updateWidth();

    return () => {
      window.removeEventListener('resize', updateWidth);
    };
  }, []);

  useLayoutEffect(() => {
    if (tableWrapperRef.current) {
      tableWrapperRef.current['style'].width = `${parentRect.width}px`;
    }
  }, [parentRect]);

  return <TableWrapperFrame ref={tableWrapperRef}>{table}</TableWrapperFrame>;
};
TableWrapper.propTypes = {
  children: PropTypes.node,
};

const useClasses = makeStyles({
  checkmarkCircleFilled: {
    color: tfsuiTheme.colorPaletteGreenForeground1,
    fontSize: '32px',
  },
  checkmarkWarningCircleFilled: {
    color: tfsuiTheme.colorStatusWarningBorderActive,
    fontSize: '32px',
  },
});

const FileUploadStatus = ({ parseResults, classes }) => {
  if (!parseResults) {
    return <Spinner label="Parsing file..." />;
  }

  return isEmpty(parseResults.errors) ? (
    <>
      <CheckmarkCircle32Filled className={classes.checkmarkCircleFilled} />
      <Text caption1 bd>
        File uploaded successfully
      </Text>
    </>
  ) : (
    <>
      <CheckmarkCircleWarningFilled className={classes.checkmarkWarningCircleFilled} />
      <Text caption1 bd>
        File uploaded with errors
      </Text>
    </>
  );
};
FileUploadStatus.propTypes = {
  parseResults: PropTypes.object,
  classes: PropTypes.object,
};

const platforms = {
  Snapchat: SnapchatIcon,
  TikTok: TikTokIcon,
};

const PlatformSelector = ({ selectedPlatform, setPlatform }) => (
  <PlatformSelectorFrame column>
    <Text bd>Select a platform to upload the ads</Text>
    <FlexDiv gap={tfsuiTheme.spacingHorizontalM}>
      {keys(platforms).map((platform) => {
        const PlatformIcon = platforms[platform];
        return (
          <ToggleButton
            key={platform}
            appearance={selectedPlatform === platform ? 'subtle' : 'outline'}
            onClick={() => setPlatform(platform)}
            checked={selectedPlatform === platform}
          >
            <FlexDiv gap={tfsuiTheme.spacingHorizontalS}>
              <PlatformIcon />
              <Text bd>{platform}</Text>
            </FlexDiv>
          </ToggleButton>
        );
      })}
    </FlexDiv>
  </PlatformSelectorFrame>
);
PlatformSelector.propTypes = {
  selectedPlatform: PropTypes.string,
  setPlatform: PropTypes.func,
};

const AdsFileUploader = ({ onFileDrop, file, parseResults, classes }) => (
  <>
    <FileDropperFrame column>
      <Text bd>Drop or upload a csv / xlsx or json file with ad information for the selected platform</Text>
      <FileUploader name="file-uploader" handleChange={onFileDrop} types={acceptedFileTypes}>
        <FileUploaderDropZone column>
          <FlexDiv gap={tfsuiTheme.spacingHorizontalS}>
            <CSVFileIcon height={'32px'} width={'32px'} />
            <XLSXFileIcon height={'32px'} width={'32px'} />
            <JSONFileIcon height={'32px'} width={'32px'} />
          </FlexDiv>
          {file ? (
            <FlexDiv column>
              <FileUploadStatus parseResults={parseResults} classes={classes} />
            </FlexDiv>
          ) : (
            <FlexDiv column>
              <Text caption1>Click here to upload or drop a file</Text>
              <Text caption1>[{acceptedFileTypes.join(', ')}]</Text>
            </FlexDiv>
          )}
        </FileUploaderDropZone>
      </FileUploader>
    </FileDropperFrame>
    {file && (
      <FileDropSummaryFrame>
        <Text bd>File Parsing Summary</Text>
        <Text caption1>
          <b>File Name:</b> {file ? file.name : 'No file uploaded'}
        </Text>
        <Text caption1>
          <b>File Size:</b> {file ? (file.size / 1024).toFixed(2) : '0'} Kbs
        </Text>
        <Text caption1>
          <b>File Type:</b> {file ? file.type : 'No file uploaded'}
        </Text>
        {parseResults && (
          <>
            <Text caption1>
              <b>Number of records read:</b> {parseResults.data.length}
            </Text>
            {!isEmpty(parseResults.errors) && (
              <Text
                caption1
                styles={css`
                  color: ${tfsuiTheme.colorStatusWarningBorderActive};
                `}
              >
                <b>Number of error records:</b> {parseResults.errors.length}
              </Text>
            )}
          </>
        )}
      </FileDropSummaryFrame>
    )}
  </>
);
AdsFileUploader.propTypes = {
  onFileDrop: PropTypes.func,
  file: PropTypes.object,
  parseResults: PropTypes.object,
  classes: PropTypes.object,
};

const SocialAdsCreator = () => {
  const classes = useClasses();
  const [file, setFile] = useState(undefined);
  const [platform, setPlatform] = useState(keys(platforms)[0]);
  const [parseResults, resetParserHook] = useParseFileForRecords(file);

  const onFileDrop = (file) => {
    resetParserHook();
    setFile(file);
  };

  const resetParentState = useCallback(() => {
    resetParserHook();
    setFile(undefined);
    setPlatform(keys(platforms)[0]);
  }, [resetParserHook]);

  const [publishAdsHandler, isAdsBeingPublished, isErrorPublishing, publishingErrors, resetPublishAdsMutation] =
    useAdsPublisher({
      platform,
      adsList: parseResults.data,
      resetParentState,
    });

  const handleUploadAds = useCallback(() => {
    publishAdsHandler();
  }, [publishAdsHandler]);

  return (
    <SocialAdsCreatorFrame column gap={tfsuiTheme.spacingVerticalXL}>
      <PlatformSelector selectedPlatform={platform} setPlatform={setPlatform} />
      <FlexDiv
        styles={css`
          align-self: flex-start;
        `}
      >
        <AdsFileUploader file={file} onFileDrop={onFileDrop} parseResults={parseResults} classes={classes} />
        {file && (
          <ContextActionFrame>
            <Button
              appearance={'primary'}
              name={'upload-ads'}
              disabled={isEmpty(parseResults.data) || !isEmpty(parseResults.errors) || isAdsBeingPublished}
              onClick={handleUploadAds}
            >
              Publish Ads
            </Button>
            <Button
              appearance={'outline'}
              name={'reset'}
              onClick={() => {
                resetParentState();
                resetPublishAdsMutation();
              }}
            >
              Reset
            </Button>
          </ContextActionFrame>
        )}
      </FlexDiv>
      {file && (
        <>
          {parseResults.meta.aborted !== undefined && !parseResults.meta.aborted ? (
            <TableWrapper>
              <AdDataTable
                adsInfo={parseResults}
                {...(isErrorPublishing && {
                  validationErrors: publishingErrors.errors,
                })}
              />
            </TableWrapper>
          ) : (
            <LoadingIndicatorFrame>
              <LoadingIndicator label={'Loading Records...'} />
            </LoadingIndicatorFrame>
          )}
        </>
      )}
    </SocialAdsCreatorFrame>
  );
};

SocialAdsCreator.propTypes = {};

export default SocialAdsCreator;
