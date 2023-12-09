// @refresh reload
import * as solid from 'solid-js'
import * as start from 'solid-start'
import * as m from '~/paraglide/messages.js'
import * as i18n from './i18n'

import './root.css'

export default function Root() {
    const url_language_tag = i18n.getLanguageTagFromURL()
    const language_tag = url_language_tag ?? i18n.sourceLanguageTag

    return (
        <i18n.LanguageTagProvider value={language_tag}>
            <start.Html lang={language_tag}>
                <start.Head>
                    <start.Title>Paraglide SolidStart - Hacker News</start.Title>
                    <start.Meta charset="utf-8" />
                    <start.Meta name="viewport" content="width=device-width, initial-scale=1" />
                    <start.Meta
                        name="description"
                        content={m.root_description({}, {languageTag: language_tag})}
                    />
                    <start.Link rel="manifest" href="/manifest.webmanifest" />
                </start.Head>
                <start.Body>
                    <Nav />
                    <solid.ErrorBoundary fallback={<></>}>
                        <solid.Suspense fallback={<div class="news-list-nav">{m.loading()}</div>}>
                            <start.Routes base={url_language_tag}>
                                <start.FileRoutes />
                            </start.Routes>
                        </solid.Suspense>
                    </solid.ErrorBoundary>
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
                <start.A href={i18n.translateHref('/')}>
                    <strong>HN</strong>
                </start.A>
                <start.A href={i18n.translateHref('/new')}>
                    <strong>{m.nav_new()}</strong>
                </start.A>
                <start.A href={i18n.translateHref('/show')}>
                    <strong>{m.nav_show()}</strong>
                </start.A>
                <start.A href={i18n.translateHref('/ask')}>
                    <strong>{m.nav_ask()}</strong>
                </start.A>
                <start.A href={i18n.translateHref('/job')}>
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
                    <i18n.LocaleSwitcher />
                </div>
            </nav>
        </header>
    )
}
