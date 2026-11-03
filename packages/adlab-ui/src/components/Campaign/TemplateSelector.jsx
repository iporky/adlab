import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FileUploader } from 'react-drag-drop-files';
import styled from '@emotion/styled';
import { FlexDiv } from '../styled';
import { ArrowLeft24Regular, SearchRegular } from '@tfs/icons';
import {
  Combobox,
  Option,
  Button,
  makeStyles,
  Text,
  tokens,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbButton,
  BreadcrumbDivider,
  Tab,
  TabList,
  tfsuiTheme,
  Image,
  Input,
  Label,
} from '@tfs/ui-components-next';
import XLSXFileIcon from '../../icons/XLSXFileIcon';
import i18n from '../../helpers/i18n';
import ExcelJS from 'exceljs';
import {
  useGetTemplatesQuery,
  useGetFoldersQuery,
  useGetFilesQuery,
  useCreatePersonaConfigMutation,
  useGetPersonaConfigQuery,
  personalizationApi,
} from '../../features/api/personalizationApi';
import { extractMacrosFromJSON } from '../../utils/generic';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    padding: tokens.spacingHorizontalL,
  },
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    width: '50vw',
    gap: tokens.spacingHorizontalS,
  },
  backButton: {
    padding: 0,
    minWidth: 0,
  },
  tabRoot: {
    alignItems: 'flex-start',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    padding: '20px 5px',
    rowGap: '20px',
  },
  content: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: tokens.spacingHorizontalL,
    marginLeft: tokens.spacingVerticalM,
    marginBottom: tokens.spacingVerticalM,
  },
  left: {
    width: '20%',
    display: 'flex',
    flexDirection: 'column',
  },
  right: {
    width: '80%',
    display: 'flex',
    flexDirection: 'row',
    gap: tokens.spacingVerticalL,
  },
  templateContainer: {
    display: 'grid',
    gap: '4px',
    overflow: 'auto',
    maxHeight: '75vh',
    gridTemplateColumns: 'repeat(3, 1fr)',
  },
  templateHeader: {
    backgroundColor: 'rgba(190, 186, 186, 0.20)',
    flexDirection: 'row',
    display: 'flex',
    justifyContent: 'space-between',
    padding: tokens.spacingVerticalS,
    alignItems: 'center',
  },
  templateSelected: {
    borderRadius: '3px',
    border: '2px solid rgba(79, 62, 215, 0.84)',
    background: 'rgba(79, 62, 215, 0.10)',
    borderRadius: tokens.borderRadiusMedium,
    fontWeight: 'bold',
  },
  template: {
    borderRadius: tokens.borderRadiusMedium,
    border: '1px solid #FFF',
    cursor: 'pointer',
  },
  downloadButton: {
    marginTop: '60px',
    marginBottom: '60px',
    borderRadius: '10px',
    border: '1px solid #705CF6',
    display: 'flex',
    padding: '16px 58px',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '10px',
  },
  downloadText: {
    verticalAlign: 'middle',
    cursor: 'pointer',
    color: '#552EC5',
    textAlign: 'center',
    fontSize: '18px',
    fontStyle: 'normal',
    fontWeight: 500,
    lineHeight: 'normal',
  },
  fileContainer: {
    width: '100%',
    height: 'auto',
    padding: tokens.spacingVerticalL,
    justifySelf: 'end',
    borderRadius: tokens.borderRadiusLarge,
    backgroundColor: '#eef0f9',
    boxShadow: tokens.shadow4,
    overflowY: 'auto',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    marginBottom: tokens.spacingVerticalM,
  },
});

const acceptedFileTypes = ['xlsx'];

const FileUploaderDropZone = styled(FlexDiv)`
  maxwidth: 508px;
  height: 135px;
  flex-shrink: 0;
  justify-content: space-between;
  border-radius: ${tfsuiTheme.borderRadiusMedium};
  padding: ${tfsuiTheme.spacingVerticalXL} ${tfsuiTheme.spacingHorizontalXL};
  cursor: pointer;
  border-radius: 11px;
  border: 1px dashed #4f3ed7;
  background: rgba(255, 255, 255, 0.25);
  color: #aba6a6;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

const TemplateSelector = () => {
  const styles = useStyles();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const campaignId = '64e3a57f0a9b9e2c3c0a6f14'; //useSelector((state) => state.campaign.campaignId);
  const { data: personaConfig } = useGetPersonaConfigQuery({ campaignId, includeCombinations: false });
  const [templates, setTemplates] = React.useState([]);
  const [isTemplateLoading, setIsTemplateLoading] = React.useState(false);
  //const [isFilesLoading, setIsFilesLoading] = React.useState(false);
  const [filteredTemplates, setFilteredTemplates] = React.useState([]);
  const [selectedTemplate, setSelectedTemplate] = React.useState(null);
  const [selectedTab, setSelectedTab] = React.useState('template');
  const [selectedTemplateFolderId, setSelectedTemplateFolderId] = React.useState(null);
  const [selectedImageFolder, setSelectedImageFolder] = React.useState(null);
  const [templateDetails, setTemplateDetails] = React.useState({});
  const templateRefs = useRef([]);

  const { error: folders, isLoading: isFoldersLoading } = useGetFoldersQuery();
  const { error: files, isLoading: isFilesLoading } = useGetFilesQuery({ folderId: selectedImageFolder?.id });

  useEffect(() => {
    if (folders?.length > 0) {
      onTemplateFolderSelect(null, { optionValue: folders[0].id });
      onImageFolderSelect(null, { value: folders[0].id });
    }
  }, [folders]);

  useEffect(() => {
    if (personaConfig && templates.length > 0) {
      // preselect the template if it exists in personaConfig
      handleTemplateSelect(null, { value: personaConfig.template?.id });
    }
  }, [personaConfig, templates]);

  const onTabSelect = (event, data) => {
    setSelectedTab(data.value);
  };

  const onTemplateFolderSelect = async (event, data) => {
    const folderId = data.optionValue;
    if (folderId) {
      setSelectedTemplateFolderId(folderId);
      const { error: templateData } = await dispatch(personalizationApi.endpoints.getTemplates.initiate({ folderId }));
      setTemplates(templateData);
      setFilteredTemplates(templateData);
      setSelectedTemplate(null);
      templateRefs.current = [];
      setTemplateDetails({});
    }
  };

  const onImageFolderSelect = (event, data) => {
    const folderId = data.value;
    const selected = folders.find((folder) => folder.id === folderId);
    setSelectedImageFolder(selected);
  };

  const handleTemplateSelect = async (event, data) => {
    const templateId = data.value;
    if (templateId) {
      const t = templates.find((template) => template.id == templateId);
      setSelectedTemplate(t);
      // Scroll to the selected template
      const el = templateRefs.current[templateId];
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      const u = URL.parse(`https:${t?.imageurl}`);
      const templateGuid = u.searchParams.get('template');
      const orgId = u.searchParams.get('orgId');
      const { data: templateJson } = await dispatch(
        personalizationApi.endpoints.getTemplateDetails.initiate({ orgId, templateGuid }),
      );
      let macros = extractMacrosFromJSON(templateJson, templateJson);
      // Filter macros to remove duplicates by name
      macros = macros.filter((macro, index, self) => {
        return index === self.findIndex((m) => m.name === macro.name);
      });
      setTemplateDetails({ macros });
    }
  };

  const handleDownloadMatrix = async () => {
    if (selectedTemplate) {
      const link = document.createElement('a');
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Matrix Template');
      worksheet.columns = templateDetails?.macros.map((macro) => ({
        header: macro.name,
        key: macro.name,
      }));
      const blob = new Blob([await workbook.xlsx.writeBuffer()], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      link.href = URL.createObjectURL(blob);
      link.download = `${selectedTemplate.name}_matrix.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleSelectFolder = async () => {
    const { data } = await dispatch(
      personalizationApi.endpoints.updatePersonaConfig.initiate({ campaignId, imageFolder: selectedImageFolder?.name }),
    );
  };

  const onFileDrop = async (file) => {
    const finalTemplate = {
      id: selectedTemplate?.id,
      width: selectedTemplate?.width,
      height: selectedTemplate?.height,
      name: selectedTemplate?.name,
      macros: templateDetails?.macros || [],
    };
    // check if personConfig exists for this campaign
    let personaConfig;
    const personConfigResult = await dispatch(
      personalizationApi.endpoints.getPersonaConfig.initiate({ campaignId, includeCombinations: false }),
    );
    if ('data' in personConfigResult) {
      // If personConfig exists, update it with the new macros
      personaConfig = await dispatch(
        personalizationApi.endpoints.updatePersonaConfig.initiate({ campaignId, template: finalTemplate }),
      );
    } else {
      // If personConfig does not exist, create a new one
      personaConfig = await dispatch(
        personalizationApi.endpoints.createPersonaConfig.initiate({ campaignId, template: finalTemplate }),
      );
    }

    // Use personaConfigId to upload matrix file
    if ('data' in personaConfig) {
      const formData = new FormData();
      formData.append('file', file);
      try {
        await dispatch(
          personalizationApi.endpoints.uploadMatrixData.initiate({
            campaignId,
            personaConfigId: personaConfig.data.id,
            file: formData,
          }),
        );
        // Handle success, e.g., show a success message or update state
      } catch (error) {
        console.error('Error uploading matrix file:', error);
        // Handle error, e.g., show an error message
      }
    }
  };

  const handleSearchChange = (event) => {
    const searchValue = event.target.value.toLowerCase();
    const filteredTemplates = templates.filter((template) => template.name.toLowerCase().includes(searchValue));
    setFilteredTemplates(filteredTemplates);
  };

  const renderTemplateOptions = () => (
    <div className={styles.content}>
      <div className={styles.left} style={{ overflowY: 'auto', maxHeight: '75vh' }}>
        <Combobox
          id="templateFolderSelector"
          placeholder="Select a folder"
          selectedOptions={[selectedTemplateFolderId]}
          value={folders?.find((f) => f.id === selectedTemplateFolderId)?.name || ''}
          onOptionSelect={onTemplateFolderSelect}
          size="large"
        >
          {folders?.map((f) => (
            <Option key={f.id} value={f.id}>
              {f.name}
            </Option>
          ))}
        </Combobox>
        <br />
        <Input contentBefore={<SearchRegular />} placeholder="Search templates..." onChange={handleSearchChange} />
        <TabList selectedValue={selectedTemplate?.id} onTabSelect={handleTemplateSelect} vertical>
          {isTemplateLoading ? (
            <Text size={500} weight="semibold" style={{ padding: tokens.spacingVerticalL }}>
              {i18n.t(i18n.keys.loading_templates)}
            </Text>
          ) : (
            filteredTemplates?.map((template) => (
              <Tab key={template.id} value={template.id}>
                {template.name}
              </Tab>
            ))
          )}
        </TabList>
      </div>
      <div className={styles.right}>
        <div className={styles.templateContainer}>
          {templates?.map((template) => (
            <div
              key={template.id}
              className={`${selectedTemplate?.id === template.id ? styles.templateSelected : styles.template}`}
              ref={(el) => (templateRefs.current[template.id] = el)}
            >
              <div className={styles.templateHeader}>
                <Label for={`templateRadio${template.id}`} style={{ fontSize: '16px' }}>
                  {template.name}
                </Label>
                <Input
                  type="radio"
                  id={`templateRadio${template.id}`}
                  appearance="underline"
                  value={template.id}
                  checked={selectedTemplate?.id === template.id}
                  onChange={handleTemplateSelect}
                />
              </div>
              <iframe
                id={`templatePreview${template.id}`}
                src={`${template?.imageurl}&mode=preview`}
                style={{ maxWidth: `280px`, height: `260px` }}
              />
            </div>
          ))}
        </div>
        <div style={{overflowY: 'auto', maxHeight: '75vh', minWidth: '260px' }}>
          {selectedTemplate && (
            <div className={styles.fileContainer}>
              <div className={styles.fileContainer}>
                <div style={{ width: '100%' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <tbody>
                      <tr style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '8px', fontWeight: 'bold', width: '40%' }}>Template name</td>
                        <td style={{ padding: '8px' }}>{selectedTemplate?.name}</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '8px', fontWeight: 'bold' }}>Width</td>
                        <td style={{ padding: '8px' }}>{selectedTemplate?.width}</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '8px', fontWeight: 'bold' }}>Height</td>
                        <td style={{ padding: '8px' }}>{selectedTemplate?.height}</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '8px', fontWeight: 'bold' }}>Dynamic fields</td>
                        <td style={{ padding: '8px' }}>{templateDetails?.macros ? 'yes' : 'no'}</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '8px', fontWeight: 'bold' }}>Macros</td>
                        <td style={{ padding: '8px' }}>{templateDetails?.macros?.length || 0}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className={styles.downloadButton}>
                <Text onClick={handleDownloadMatrix} className={styles.downloadText}>
                  {i18n.t(i18n.keys.download_matrix)}
                </Text>
              </div>
              <Text bd>{i18n.t(i18n.keys.upload_matrix)}</Text>
              <FileUploader name="file-uploader" handleChange={onFileDrop} types={acceptedFileTypes}>
                <FileUploaderDropZone row>
                  <FlexDiv gap={tfsuiTheme.spacingHorizontalS} style={{ margin: '20px' }}>
                    <XLSXFileIcon height={'32px'} width={'32px'} />
                  </FlexDiv>
                  <FlexDiv column>
                    <Text caption1>{i18n.t(i18n.keys.upload_matrix_placeholder)}</Text>
                  </FlexDiv>
                </FileUploaderDropZone>
              </FileUploader>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderFolderOptions = () => (
    <div className={styles.content}>
      <div className={styles.left}>
        <TabList selectedValue={selectedImageFolder?.id} onTabSelect={onImageFolderSelect} vertical>
          {isFoldersLoading ? (
            <Text size={500} weight="semibold" style={{ padding: tokens.spacingVerticalL }}>
              {i18n.t(i18n.keys.loading_folders)}
            </Text>
          ) : (
            folders?.map((folder) => (
              <Tab key={folder.name} value={folder.id}>
                {folder.name} ({folder.assets})
              </Tab>
            ))
          )}
        </TabList>
      </div>
      <div className={styles.right}>
        <div style={{ display: 'flex', gap: 8, overflow: 'auto', flexDirection: 'column', width: '100%' }}>
          {isFilesLoading ? (
            <Text size={500} weight="semibold" style={{ padding: tokens.spacingVerticalL }}>
              {i18n.t(i18n.keys.loading_files)}
            </Text>
          ) : (
            files?.map((file) => (
              <div key={file.name} style={{ marginBottom: tokens.spacingVerticalM, height: 250, width: 250 }}>
                <Image src={file.imageurl} fit="contain" alt={file.name} />
              </div>
            ))
          )}
        </div>
        {selectedImageFolder && (
          <div style={{overflowY: 'auto', maxHeight: '75vh', minWidth: '260px' }}>
            <div className={styles.fileContainer}>
              <div className={styles.fileContainer}>
                <div style={{ width: '100%' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <tbody>
                      <tr style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '8px', fontWeight: 'bold', width: '40%' }}>Folder name</td>
                        <td style={{ padding: '8px' }}>{selectedImageFolder?.name}</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '8px', fontWeight: 'bold' }}>Tag name</td>
                        <td style={{ padding: '8px' }}>{selectedImageFolder?.tagName || ''}</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '8px', fontWeight: 'bold' }}>Created by</td>
                        <td style={{ padding: '8px' }}>{selectedImageFolder?.createdBy || ''}</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '8px', fontWeight: 'bold' }}>Assets</td>
                        <td style={{ padding: '8px' }}>{selectedImageFolder?.assets || ''}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className={styles.downloadButton}>
                <Text onClick={handleSelectFolder} className={styles.downloadText}>
                  {i18n.t(i18n.keys.select_this_folder)}
                </Text>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div>
      <div style={{ padding: '12px 12px 0px 12px' }}>
        <Breadcrumb aria-label="Breadcrumb navigation">
          <BreadcrumbItem>
            <BreadcrumbButton href="/adlab">Home</BreadcrumbButton>
          </BreadcrumbItem>
          <BreadcrumbDivider />
          <BreadcrumbItem>
            <BreadcrumbButton href="/adlab/campaigns">Campaigns</BreadcrumbButton>
          </BreadcrumbItem>
          <BreadcrumbDivider />
          <BreadcrumbItem>
            <BreadcrumbButton href="/adlab/campaign/template" current>
              Creatives
            </BreadcrumbButton>
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
      <div className="campaign-bg">
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
                {i18n.t(i18n.keys.template)}
              </Text>
            </div>
            <Button appearance="primary" onClick={() => navigate('/adlab/campaign/personalization')}>
              Next
            </Button>
          </div>
          <div className={styles.tabRoot}>
            <TabList selectedValue={selectedTab} onTabSelect={onTabSelect}>
              <Tab value="template">{i18n.t(i18n.keys.template_tab)}</Tab>
              <Tab value="imageFolder">{i18n.t(i18n.keys.image_folder_tab)}</Tab>
            </TabList>
          </div>
          {selectedTab === 'template' ? renderTemplateOptions() : renderFolderOptions()}
        </div>
      </div>
    </div>
  );
};

export default TemplateSelector;
