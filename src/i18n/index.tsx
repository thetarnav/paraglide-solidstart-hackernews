/*

TODO

- [x] basic paraglide setup
- [x] basic route mapping to include language tag prefix
- [x] fix language tag leaking between requests
- [ ] keep prefix after navigation
- [x] switching language as page reload
- [ ] make this into package

*/

import * as solid from 'solid-js'
import * as paraglide from '../paraglide/runtime.js'
import * as router from '@solidjs/router'

export type AvailableLanguageTag = paraglide.AvailableLanguageTag

export const availableLanguageTags = paraglide.availableLanguageTags

export const LanguageTagCtx = solid.createContext<AvailableLanguageTag>()
export const LanguageTagProvider = LanguageTagCtx.Provider
export const useLanguageTag = (): AvailableLanguageTag => {
    const ctx = solid.useContext(LanguageTagCtx)
    if (!ctx) {
        throw new Error('LanguageTagCtx not found')
    }
    return ctx
}

paraglide.setLanguageTag(useLanguageTag)

export const getLanguageTagFromURL = (): AvailableLanguageTag => {
    let language_tag: AvailableLanguageTag = paraglide.sourceLanguageTag
    const location = router.useLocation()
    const pathname = location.pathname
    for (const tag of availableLanguageTags) {
        if (pathname.startsWith(`/${tag}/`)) {
            language_tag = tag
            break
        }
    }
    return language_tag
}

export const switchLanguageTag = (new_language_tag: AvailableLanguageTag): void => {
    for (const tag of availableLanguageTags) {
        const prefix = `/${tag}/`
        if (location.pathname.startsWith(prefix)) {
            location.pathname = `/${new_language_tag}/${location.pathname.slice(prefix.length)}`
            return
        }
    }
    location.pathname = `/${new_language_tag}${location.pathname}`
}

type RouteDefinition = router.RouteDefinition<string | string[]>

const LANGUAGE_TAG_MATCH_FILTER = {language_tag: availableLanguageTags} as const
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
