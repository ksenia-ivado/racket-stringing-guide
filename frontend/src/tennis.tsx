import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Footer } from './components/Footer'
import { TennisPage } from './components/TennisPage'
import { HeaderLink, Topbar } from './components/Topbar'

/** Entry for tennis.html: live ATP and WTA singles, separate from the stringing guide. */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div className="app">
      <Topbar subtitle="Live ATP & WTA singles">
        <HeaderLink href={import.meta.env.BASE_URL} label="← Stringing guide" short="← Guide" />
      </Topbar>
      <TennisPage />
      <Footer />
    </div>
  </StrictMode>,
)
