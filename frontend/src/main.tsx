import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppRoutes } from './Routes';
import './scss/main.scss';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <AppRoutes />
    </React.StrictMode>
);