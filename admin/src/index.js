import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './App';
import { registerLicense } from '@syncfusion/ej2-base';
import { Provider } from 'react-redux';
import { persistor, store } from './redux/store';
import { PersistGate } from 'redux-persist/integration/react';

registerLicense(
  'ORg4AjUWIQA/Gnt2VVhiQlFaclxJXGNWf1tpR2NbfU50flBHal5XVAciSV9jS3xTf0RrWXtbc3dRQGFYWA=='
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
