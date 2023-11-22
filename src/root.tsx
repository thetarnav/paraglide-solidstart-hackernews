// @refresh reload
import * as solid from 'solid-js'
import * as solid_web from 'solid-js/web'
import * as start from 'solid-start'
import * as i18n from './i18n'
import messages_pl_url from './paraglide/messages/pl.js?url'
import messages_en_url from './paraglide/messages/en.js?url'

import './root.css'

declare global {
    var m: typeof import('./paraglide/messages/pl.js')
}

export default function Root() {
    const language_tag = i18n.getLanguageTagFromURL()

    return (
        <i18n.LanguageTagProvider value={language_tag}>
            <start.Html lang={language_tag}>
                <start.Head>
                    <start.Title>Paraglide SolidStart - Hacker News</start.Title>
                    <start.Meta charset="utf-8" />
                    <start.Meta name="viewport" content="width=device-width, initial-scale=1" />
                    {(() => {
                        /*
                        Need to read it outside of the <Meta> because of this bug:
                        https://github.com/solidjs/solid-start/issues/1115
                        */
                        const description = m.root_description()
                        return <start.Meta name="description" content={description} />
                    })()}
                    <start.Link rel="manifest" href="/manifest.webmanifest" />
                </start.Head>
                <start.Body>
                    <Nav />
                    <solid.ErrorBoundary fallback={<></>}>
                        <solid.Suspense fallback={<div class="news-list-nav">{m.loading()}</div>}>
                            <start.Routes>
                                <i18n.I18nRoutes>
                                    <start.FileRoutes />
                                </i18n.I18nRoutes>
                            </start.Routes>
                        </solid.Suspense>
                    </solid.ErrorBoundary>
                    <solid_web.NoHydration>
                        <script type="module">
                            {`import * as m from "${
                                language_tag === 'pl' ? messages_pl_url : messages_en_url
                            }";globalThis.m=m;`}
                        </script>
                    </solid_web.NoHydration>
                    <start.Scripts />
                </start.Body>
            </start.Html>
        </i18n.LanguageTagProvider>
    )
}

const Nav: solid.Component = () => {
    return (
        <header class="header">
            <nav class="inner">
                <start.A href="/">
                    <strong>HN</strong>
                </start.A>
                <start.A href="/new">
                    <strong>{m.nav_new()}</strong>
                </start.A>
                <start.A href="/show">
                    <strong>{m.nav_show()}</strong>
                </start.A>
                <start.A href="/ask">
                    <strong>{m.nav_ask()}</strong>
                </start.A>
                <start.A href="/job">
                    <strong>{m.nav_job()}</strong>
                </start.A>
                <a
                    class="github"
                    href="http://github.com/solidjs/solid"
                    target="_blank"
                    rel="noreferrer"
                >
                    {m.root_built_with()}
                </a>
                <div class="language">
                    <LanguageSwitch />
                </div>
            </nav>
        </header>
    )
}

const LanguageSwitch: solid.Component = () => {
    const language_tag = i18n.languageTag()

    return (
        <select
            name="language"
            onChange={e => {
                const new_language_tag = e.target.value as i18n.AvailableLanguageTag
                i18n.setLanguageTag(new_language_tag)
            }}
        >
            {i18n.availableLanguageTags.map(tag => (
                <option value={tag} selected={tag === language_tag}>
                    {tag}
                </option>
            ))}
        </select>
    )
}
