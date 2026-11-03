import React from 'react';
import { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { ChevronDown24Regular, ChevronRight24Regular } from '@tfs/icons';
import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  makeStyles,
  Tag,
  Text,
  tokens,
} from '@tfs/ui-components-next';

import { formatName } from '../../../commons/utils';
import { useGetDeviceDataQuery } from '../../../features/api/campaignApi';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
  },
  header: {
    height: '48px',
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: tokens.borderRadiusMedium,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
  },
  tagGroup: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: tokens.spacingHorizontalXS,
    padding: tokens.spacingVerticalM,
  },
});

const DeviceSelector = ({ onChange, initialValue = {}, onAccordionChange }) => {
  const styles = useStyles();
  const { data: deviceData = {}, isLoading, error } = useGetDeviceDataQuery();
  const deviceTypes = Object.entries(deviceData.deviceTypes || {}).map(([value, name]) => ({ value, name }));
  const osTypes = Object.entries(deviceData.operatingSystems || {}).map(([value, name]) => ({ value, name }));
  const deviceMakeTypes = Object.entries(deviceData.manufacturers || {}).map(([value, name]) => ({ value, name }));
  const [selectedDevices, setSelectedDevices] = useState(initialValue.devices || []);
  const [selectedOs, setSelectedOs] = useState(initialValue.os || []);
  const [selectedMakes, setSelectedMakes] = useState(initialValue.makes || []);
  const [activeCategory, setActiveCategory] = useState('devices');

  const handleDeviceToggle = useCallback(
    (value) => {
      setSelectedDevices((prev) => {
        const newSelected = prev.includes(value)
          ? prev.filter((item) => item !== value)
          : [...prev, value];
        onChange?.({
          devices: newSelected,
          os: selectedOs,
          makes: selectedMakes,
        });
        return newSelected;
      });
    },
    [onChange, selectedOs, selectedMakes]
  );

  const handleOsToggle = useCallback(
    (value) => {
      setSelectedOs((prev) => {
        const newSelected = prev.includes(value)
          ? prev.filter((item) => item !== value)
          : [...prev, value];
        onChange?.({
          devices: selectedDevices,
          os: newSelected,
          makes: selectedMakes,
        });
        return newSelected;
      });
    },
    [onChange, selectedDevices, selectedMakes]
  );

  const handleMakeToggle = useCallback(
    (value) => {
      setSelectedMakes((prev) => {
        const newSelected = prev.includes(value)
          ? prev.filter((item) => item !== value)
          : [...prev, value];
        onChange?.({
          devices: selectedDevices,
          os: selectedOs,
          makes: newSelected,
        });
        return newSelected;
      });
    },
    [onChange, selectedDevices, selectedOs]
  );

  const handleAccordionChange = useCallback(
    (_, data) => {
      const newValue = data.value;
      setActiveCategory(newValue);
      onAccordionChange?.(newValue);
    },
    [onAccordionChange]
  );

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 24 }}>
        <span>Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ color: 'red', padding: 24 }}>
        {error.message || 'Failed to load device data'}
      </div>
    );
  }

  return (
    <div className={styles.root}>
      {/* Device Types Section */}
      <Accordion value={activeCategory} onValueChange={handleAccordionChange} multiple={false}>
        <AccordionItem value="devices">
          <AccordionHeader className={styles.header} expandIcon={activeCategory === 'devices' ? <ChevronDown24Regular /> : <ChevronRight24Regular />}>
            <Text>Device Types ({selectedDevices.length} selected)</Text>
          </AccordionHeader>
          <AccordionPanel>
            <div className={styles.tagGroup}>
              {deviceTypes.map((device) => (
                <Tag
                  key={device.value}
                  appearance={selectedDevices.includes(device.value) ? 'filled' : 'outline'}
                  onClick={() => handleDeviceToggle(device.value)}
                  style={{
                    cursor: 'pointer',
                    minWidth: '120px',
                    height: '32px',
                    textAlign: 'center',
                    ...(selectedDevices.includes(device.value) && {
                      backgroundColor: tokens.colorBrandBackground,
                      borderColor: tokens.colorBrandBackground,
                      color: tokens.colorNeutralForegroundInverted,
                    }),
                  }}
                >
                  {formatName(device.name)}
                </Tag>
              ))}
            </div>
          </AccordionPanel>
        </AccordionItem>
        {/* Device Makes Section */}
        <AccordionItem value="makes">
          <AccordionHeader className={styles.header} expandIcon={activeCategory === 'makes' ? <ChevronDown24Regular /> : <ChevronRight24Regular />}>
            <Text>Device Makes ({selectedMakes.length} selected)</Text>
          </AccordionHeader>
          <AccordionPanel>
            <div className={styles.tagGroup}>
              {deviceMakeTypes.map((make) => (
                <Tag
                  key={make.value}
                  appearance={selectedMakes.includes(make.value) ? 'filled' : 'outline'}
                  onClick={() => handleMakeToggle(make.value)}
                  style={{
                    cursor: 'pointer',
                    minWidth: '120px',
                    height: '32px',
                    textAlign: 'center',
                    ...(selectedMakes.includes(make.value) && {
                      backgroundColor: tokens.colorBrandBackground,
                      borderColor: tokens.colorBrandBackground,
                      color: tokens.colorNeutralForegroundInverted,
                    }),
                  }}
                >
                  {formatName(make.name)}
                </Tag>
              ))}
            </div>
          </AccordionPanel>
        </AccordionItem>
        {/* Operating Systems Section */}
        <AccordionItem value="os">
          <AccordionHeader className={styles.header} expandIcon={activeCategory === 'os' ? <ChevronDown24Regular /> : <ChevronRight24Regular />}>
            <Text>Operating Systems ({selectedOs.length} selected)</Text>
          </AccordionHeader>
          <AccordionPanel>
            <div className={styles.tagGroup}>
              {osTypes.map((os) => (
                <Tag
                  key={os.value}
                  appearance={selectedOs.includes(os.value) ? 'filled' : 'outline'}
                  onClick={() => handleOsToggle(os.value)}
                  style={{
                    cursor: 'pointer',
                    minWidth: '120px',
                    height: '32px',
                    textAlign: 'center',
                    ...(selectedOs.includes(os.value) && {
                      backgroundColor: tokens.colorBrandBackground,
                      borderColor: tokens.colorBrandBackground,
                      color: tokens.colorNeutralForegroundInverted,
                    }),
                  }}
                >
                  {formatName(os.name)}
                </Tag>
              ))}
            </div>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

DeviceSelector.propTypes = {
  onChange: PropTypes.func,
  onAccordionChange: PropTypes.func,
  initialValue: PropTypes.shape({
    devices: PropTypes.arrayOf(PropTypes.string),
    os: PropTypes.arrayOf(PropTypes.string),
    makes: PropTypes.arrayOf(PropTypes.string),
  }),
};

export default DeviceSelector;
