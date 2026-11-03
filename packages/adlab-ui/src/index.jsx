import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider as ReduxProvider } from 'react-redux';
import { FluentProvider, tfsuiTheme } from '@tfs/ui-components-next';

import ErrorBoundary from './components/ErrorBoundary';
import i18n from './helpers/i18n';
import { enableMockServiceWorker } from './helpers/msw';
import reportWebVitals from './helpers/webVitals';
import App from './App';
import { store } from './store';

/**
 * Preprocess before application startup
 * @returns {Promise<Awaited<unknown>[]>}
 */
const preprocess = () => {
  return Promise.all([enableMockServiceWorker(), i18n.initiateI18N()]);
};

const root = ReactDOM.createRoot(document.getElementById('root'));

preprocess()
  .then(() => {
    root.render(
      <React.StrictMode>
        <ReduxProvider store={store}>
          <FluentProvider theme={tfsuiTheme}>
            <App />
          </FluentProvider>
        </ReduxProvider>
      </React.StrictMode>,
    );
  })
  .catch((err) => {
    root.render(<ErrorBoundary error={err} />);
  });

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint.
reportWebVitals();
