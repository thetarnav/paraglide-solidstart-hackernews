// @refresh reload
import * as solid from 'solid-js'
import * as start from 'solid-start'
import * as i18n from './i18n'

import './root.css'

const Nav: solid.Component = () => {
    return (
        <header class="header">
            <nav class="inner">
                <start.A href="/">
                    <strong>HN</strong>
                </start.A>
                <start.A href="/new">
                    <strong>{i18n.m.nav_new()}</strong>
                </start.A>
                <start.A href="/show">
                    <strong>{i18n.m.nav_show()}</strong>
                </start.A>
                <start.A href="/ask">
                    <strong>{i18n.m.nav_ask()}</strong>
                </start.A>
                <start.A href="/job">
                    <strong>{i18n.m.nav_job()}</strong>
                </start.A>
                <a
                    class="github"
                    href="http://github.com/solidjs/solid"
                    target="_blank"
                    rel="noreferrer"
                >
                    {i18n.m.root_built_with()}
                </a>
                <div class="language">
                    <select
                        name="language"
                        onChange={e => i18n.setLanguageTag(e.currentTarget.value as any)}
                    >
                        {i18n.availableLanguageTags.map(tag => (
                            <option value={tag} selected={tag === i18n.languageTag()}>
                                {tag}
                            </option>
                        ))}
                    </select>
                </div>
            </nav>
        </header>
    )
}

export default function Root() {
    i18n.init()

    return (
        <start.Html lang={i18n.languageTag()}>
            <start.Head>
                <start.Title>Paraglide SolidStart - Hacker News</start.Title>
                <start.Meta charset="utf-8" />
                <start.Meta name="viewport" content="width=device-width, initial-scale=1" />
                <start.Meta name="description" content={i18n.m.root_description()} />
                <start.Link rel="manifest" href="/manifest.webmanifest" />
            </start.Head>
            <start.Body>
                <Nav />
                <solid.ErrorBoundary fallback={<></>}>
                    <solid.Suspense fallback={<div class="news-list-nav">{i18n.m.loading()}</div>}>
                        <start.Routes>
                            <start.FileRoutes />
                        </start.Routes>
                    </solid.Suspense>
                </solid.ErrorBoundary>
                <start.Scripts />
            </start.Body>
        </start.Html>
    )
}
