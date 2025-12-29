import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Analytics } from '@vercel/analytics/react'
import './index.css'
import App from './App.jsx'

import GlobalErrorBoundary from './components/common/GlobalErrorBoundary.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GlobalErrorBoundary>
      <App />
      <Analytics />
    </GlobalErrorBoundary>
  </StrictMode>,
)
