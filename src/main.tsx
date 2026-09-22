import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Register Workbox PWA service worker for offline rural resilience
registerSW({
  immediate: true,
  onOfflineReady() {
    console.log('Aarambh AI is ready to work offline in rural areas');
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
