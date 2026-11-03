import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft24Regular, ArrowUploadFilled, Delete24Regular } from '@tfs/icons';
import { Button, Input, makeStyles, Text, tokens } from '@tfs/ui-components-next';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: tokens.colorNeutralBackground1,
    padding: tokens.spacingHorizontalL,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: tokens.spacingVerticalXL,
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
  },
  backButton: {
    padding: 0,
    minWidth: 0,
  },
  content: {
    display: 'flex',
    gap: tokens.spacingHorizontalL,
    flex: 1,
  },
  mainContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
  },
  uploadSection: {
    border: `2px dashed ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusMedium,
    padding: tokens.spacingVerticalXXL,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: tokens.spacingVerticalM,
    cursor: 'pointer',
    backgroundColor: tokens.colorNeutralBackground2,
    '&:hover': {
      backgroundColor: tokens.colorNeutralBackground3,
    },
  },
  uploadIcon: {
    fontSize: '48px',
    color: tokens.colorNeutralForeground2,
  },
  fileList: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
  },
  fileItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: tokens.spacingVerticalS,
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: tokens.borderRadiusMedium,
  },
});

const CreativeUpload = () => {
  const styles = useStyles();
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const handleFileUpload = (event) => {
    const newFiles = Array.from(event.target.files);
    setFiles([...files, ...newFiles]);
  };

  const handleRemoveFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };
  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <Button
            appearance="subtle"
            icon={<ArrowLeft24Regular />}
            onClick={() => navigate(-1)}
            className={styles.backButton}
          />
          <Text size={400} weight="semibold">
            Creative Upload
          </Text>
        </div>
        <Button appearance="primary" onClick={() => navigate('/adlab/campaign/template')}>
          Next
        </Button>
      </div>

      <div className={styles.content}>
        <div className={styles.mainContent}>
          <Input type="file" id="file-upload" style={{ display: 'none' }} onChange={handleFileUpload} multiple />
          <label htmlFor="file-upload" className={styles.uploadSection}>
            <ArrowUploadFilled className={styles.uploadIcon} />
            <Text size={300}>Drag and drop your files here or click to browse</Text>
            <Text size={200} color={tokens.colorNeutralForeground2}>
              Supported formats: JPG, PNG, MP4, etc.
            </Text>
          </label>

          <div className={styles.fileList}>
            {files.map((file, index) => (
              <div key={index} className={styles.fileItem}>
                <Text>{file.name}</Text>
                <Button appearance="subtle" icon={<Delete24Regular />} onClick={() => handleRemoveFile(index)} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreativeUpload;