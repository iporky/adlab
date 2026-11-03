import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

import BasicDetails from './components/Campaign/BasicDetails';
import Campaigns from './components/Campaign/Campaigns';
import CombinationsVisualizer from './components/Campaign/CombinationsVisualizer';
import Objectives from './components/Campaign/Objectives';
import Personalization from './components/Campaign/Personalization';
import PlatformSelector from './components/Campaign/PlatformSelector';
import Tags from './components/Campaign/Tags';
import Targeting from './components/Campaign/Targeting';
import TemplateSelector from './components/Campaign/TemplateSelector';
import Dashboard from './components/Dashboard';
import Reports from './components/Reports';
import AppLayout from './AppLayout';

const router = createBrowserRouter([
  {
    path: '/adlab',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'campaigns',
        element: <Campaigns />,
      },
      {
        path: 'reports',
        element: <Reports />,
      },
      {
        path: 'campaign/basic',
        element: <BasicDetails />,
      },
      {
        path: 'campaign/objectives',
        element: <Objectives />,
      },
      {
        path: 'campaign/targeting',
        element: <Targeting />,
      },
      {
        path: 'campaign/platform',
        element: <PlatformSelector />,
      },
      {
        path: 'campaign/tags',
        element: <Tags />,
      },
      {
        path: 'campaign/template',
        element: <TemplateSelector />,
      },
      {
        path: 'campaign/personalization',
        element: <Personalization />,
      },
      {
        path: 'campaign/combinations',
        element: <CombinationsVisualizer />,
      },
    ],
  },
]);

export default router;