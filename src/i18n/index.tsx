/*

TODO

- [x] basic paraglide setup
- [x] basic route mapping to include language tag prefix
- [ ] fix language tag leaking between requests
- [ ] language tag query param
- [ ] reuse existing url matching logic
- [ ] switching language as page reload?
- [ ] make this into package

*/

import * as solid from 'solid-js'
import * as solid_web from 'solid-js/web'
import * as messages from '@inlang/paraglide-js/hn/messages'
import * as paraglide from '@inlang/paraglide-js/hn'
import * as router from '@solidjs/router'

export const m = messages
export let languageTag: solid.Accessor<paraglide.AvailableLanguageTag> = paraglide.languageTag
export let setLanguageTag = paraglide.setLanguageTag
export const availableLanguageTags = paraglide.availableLanguageTags

export const init = (): void => {
    /*
        use the language tag from the URL if available
    */
    let init_language_tag: paraglide.AvailableLanguageTag = paraglide.sourceLanguageTag
    const location = router.useLocation()
    const pathname = location.pathname
    for (const tag of paraglide.availableLanguageTags) {
        if (pathname.startsWith(`/${tag}/`)) {
            init_language_tag = tag
            break
        }
    }

    /*
        Need to use ctx api instead of a global variable
        to avoid language tag being leaked between requests
    */
    /* no reactivity needed on server */
    // if (solid_web.isServer) return

    const [_languageTag, _setLanguageTag] = solid.createSignal(init_language_tag)
    paraglide.setLanguageTag(_languageTag)
    setLanguageTag = _setLanguageTag
    languageTag = _languageTag
}

type RouteDefinition = router.RouteDefinition<string | string[]>

const LANGUAGE_TAG_MATCH_FILTER = {
    language_tag: paraglide.availableLanguageTags,
} as const

const LANGUAGE_TAG_PATH = `/:language_tag`

export const I18nRoutes: solid.FlowComponent = props => {
    return solid.createMemo(() => {
        const routes = props.children as any as RouteDefinition[]

        return routes.map(original_route => {
            const route = {...original_route}
            const path = route.path

            if (typeof path === 'string') {
                route.path = [LANGUAGE_TAG_PATH + path, path]
            } else {
                const i18n_paths = path.map(p => LANGUAGE_TAG_PATH + p)
                route.path = [...i18n_paths, ...path]
            }

            route.matchFilters = {
                ...route.matchFilters,
                ...LANGUAGE_TAG_MATCH_FILTER,
            }

            return route
        })
    }) as any
}
