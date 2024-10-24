import React from 'react';
import ReactDOM from 'react-dom/client';
import i18n from './config/i18next';
import { I18nextProvider } from 'react-i18next';
import { AppRoutes } from './Routes';
import './config/i18next';
import './scss/main.scss';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <I18nextProvider i18n = {i18n}>
            <AppRoutes />     
        </I18nextProvider>
    </React.StrictMode>
);