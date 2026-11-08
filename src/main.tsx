import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import './shared/i18n/i18n'

const root = document.getElementById('root')
if (!root) throw new Error('Missing the #root element')

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
