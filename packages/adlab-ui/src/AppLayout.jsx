import React from 'react';
import { Outlet } from 'react-router-dom';
import styled from '@emotion/styled';
import { tfsuiTheme } from '@tfs/ui-components-next';

import DialogModal from './commons/dialog';
import Navbar from './commons/navbar';
import NotificationsBar from './commons/notifications';
import ProgressBar from './commons/progressBar';
import Prompt from './commons/prompt';
import Sidebar from './commons/Sidebar';
import { FlexDiv } from './components/styled';

const ApplicationBody = styled(FlexDiv)`
  align-items: flex-start !important;
  height: calc(100vh);
  background: var(--campaign-bg-gradient);
`;

const OutletFrame = styled.div`
  height: 100%;
  width: 92%;
  background: var(--campaign-bg-gradient);
  border-radius: ${tfsuiTheme.spacingVerticalL};
  box-shadow: 0 4px 15px 12px #00000005;
  overflow: hidden;
`;

const AppLayout = () => (
  <>
    <Navbar />
    <NotificationsBar />
    <DialogModal />
    <Prompt />
    <ProgressBar />
    <ApplicationBody>
      <Sidebar />
      <OutletFrame>
        <Outlet />
      </OutletFrame>
    </ApplicationBody>
  </>
);

export default AppLayout;