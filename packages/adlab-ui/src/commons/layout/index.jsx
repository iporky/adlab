import React from 'react';
import { Outlet } from 'react-router-dom';

import { FlexDiv } from '../../components/styled';
import withLocaleContext from '../../hocs/withLocaleContext.jsx';

const DialogModal = React.lazy(() => import('../dialog'));
const Prompt = React.lazy(() => import('../prompt/index.jsx'));
const Navbar = React.lazy(() => import('../navbar'));
const NotificationsBar = React.lazy(() => import('../notifications'));

const Layout = withLocaleContext(() => (
  <>
    <FlexDiv>
      <Navbar />
      <NotificationsBar />
      <DialogModal />
      <Prompt />
    </FlexDiv>
    <Outlet />
  </>
));

export default Layout;
