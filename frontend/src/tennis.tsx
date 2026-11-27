import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { TennisApp } from './components/TennisApp'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TennisApp />
  </StrictMode>,
)
