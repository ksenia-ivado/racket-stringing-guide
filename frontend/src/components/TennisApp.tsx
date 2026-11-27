import { useEffect } from 'react'
import { LangProvider, translate, useLanguage } from '../i18n'
import { Footer } from './Footer'
import { LangToggle } from './LangToggle'
import { TennisPage } from './TennisPage'
import { HeaderLink, Topbar } from './Topbar'

/** Entry for tennis.html: live ATP and WTA singles, separate from the stringing guide. */
export function TennisApp() {
  const [lang, setLang] = useLanguage()
  useEffect(() => {
    document.title = translate(lang, 'title.tennis')
  }, [lang])
  return (
    <LangProvider value={lang}>
      <div className="app">
        <Topbar subtitle={translate(lang, 'header.tennisSubtitle')}>
          <HeaderLink
            href={import.meta.env.BASE_URL}
            label={translate(lang, 'header.guide')}
            short={translate(lang, 'header.guide.short')}
          />
          <LangToggle lang={lang} onChange={setLang} />
        </Topbar>
        <TennisPage />
        <Footer />
      </div>
    </LangProvider>
  )
}
