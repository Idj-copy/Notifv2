import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Register service worker
/*

import {registerSW} from 'virtual:pwa-register';
const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm('Nouveau contenu disponible. Recharger ?')) {
      updateSW(true);
    }
  },
  onOfflineReady() {
    console.log('Application prête à fonctionner hors ligne');
  },
});
*/
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
