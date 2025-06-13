import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import 'bootstrap/dist/css/bootstrap.css'
import 'primereact/resources/themes/lara-dark-purple/theme.css'; // or another theme like 'lara-light-blue'
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
