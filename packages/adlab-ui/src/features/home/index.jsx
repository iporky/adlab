import React from 'react';
import styled from '@emotion/styled';
import { tfsuiTheme } from '@tfs/ui-components-next';

import { SectionalHeader } from '../../components';
import { FlexDiv } from '../../components/styled';
import withLocaleContext from '../../hocs/withLocaleContext';
import SocialAdsCreator from '../campaign/SocialAdsCreator.jsx';

const HomeFrame = styled(FlexDiv)`
  gap: ${tfsuiTheme.spacingVerticalXXL};
  overflow-x: auto;
  align-items: flex-start;
  padding: ${tfsuiTheme.spacingVerticalMNudge};
`;

const Home = () => {
  return (
    <HomeFrame column gap={tfsuiTheme.spacingVerticalXS}>
      <SectionalHeader sectionTitle="Campaign Ad Creator" />
      <SocialAdsCreator />
    </HomeFrame>
  );
};

export default withLocaleContext(Home);
