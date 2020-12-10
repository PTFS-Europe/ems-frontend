import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import { Provider } from 'react-redux';
import './i18n';
import * as serviceWorker from './serviceWorker';
import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';

import './index.scss';
import { store } from './store';
import api from './classes/EmsApi';

// Initialise our Sentry tracing
Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN,
    autoSessionTracking: true,
    integrations: [
        new Integrations.BrowserTracing()
    ],
    tracesSampleRate: 1.0
});

// Initialise our API request and response interceptors
api.requestInterceptor();
api.responseInterceptor();

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
);

serviceWorker.unregister();
