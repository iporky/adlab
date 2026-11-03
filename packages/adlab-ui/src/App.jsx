import { Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import styled from '@emotion/styled';
import { LoginCallback, Security } from '@okta/okta-react';
import { Favicon, tfsuiTheme } from '@tfs/ui-components-next';

import { SecureRoute } from './commons/security/SecureRoute';
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
import ErrorBoundary from './components/ErrorBoundary';
import Reports from './components/Reports';
import { oktaAuth } from './helpers/authN';
import AppLayout from './AppLayout';
import { LoadingIndicator } from './components';

import './App.scss';

const AppFrame = styled.div`
  background: ${tfsuiTheme.colorNeutralBackgroundDisabled};
  min-height: 100vh;
`;

const App = () => (
  <BrowserRouter>
    <Security
      oktaAuth={oktaAuth}
      restoreOriginalUri={(oktaAuth, originalUri) => {
        window.location.replace(originalUri);
      }}
    >
      <AppFrame>
        <Favicon />
        <ErrorBoundary>
          <Suspense fallback={<LoadingIndicator />}>
            <Routes>
              <Route path="/login/callback" element={<LoginCallback />} />
              <Route path="/" element={<Navigate to="/adlab" replace />} />
              {/* Secure Routes */}
              <Route
                path="/adlab"
                element={
                  <SecureRoute>
                    <AppLayout />
                  </SecureRoute>
                }
              >
                <Route index element={<Dashboard />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="campaigns" element={<Campaigns />} />
                <Route path="reports" element={<Reports />} />
                <Route path="campaign/basic" element={<BasicDetails />} />
                <Route path="campaign/objectives" element={<Objectives />} />
                <Route path="campaign/targeting" element={<Targeting />} />
                <Route path="campaign/platform" element={<PlatformSelector />} />
                <Route path="campaign/tags" element={<Tags />} />
                <Route path="campaign/template" element={<TemplateSelector />} />
                <Route path="campaign/personalization" element={<Personalization />} />
                <Route path="campaign/combinations" element={<CombinationsVisualizer />} />
                <Route path="campaign/review" element={<BasicDetails />} />
                <Route path="campaign/visualizer" element={<CombinationsVisualizer />} />
              </Route>
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </AppFrame>
    </Security>
  </BrowserRouter>
);

export default App;