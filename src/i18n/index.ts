/*

TODO

- [x] basic paraglide setup
- [x] basic route mapping to include language tag prefix
- [x] fix language tag leaking between requests
- [x] keep prefix after navigation
- [x] switching language as page reload
- [ ] full client-side only i18n variant
- [ ] make this into package

*/

import * as solid from 'solid-js'
import * as solid_web from 'solid-js/web'
import * as paraglide from '../paraglide/runtime.js'
import * as router from '@solidjs/router'

export type AvailableLanguageTag = paraglide.AvailableLanguageTag

export const availableLanguageTags = paraglide.availableLanguageTags

export const getLanguageTagFromURL = (): AvailableLanguageTag => {
    const location = solid_web.isServer ? router.useLocation() : window.location
    const pathname = location.pathname

    let language_tag: AvailableLanguageTag = paraglide.sourceLanguageTag
    for (const tag of availableLanguageTags) {
        if (pathname.startsWith(`/${tag}/`)) {
            language_tag = tag
            break
        }
    }

    return language_tag
}

const prefixPathnameWithLanguageTag = (
    pathname: string,
    language_tag: AvailableLanguageTag,
): string => {
    const normalized_pathname = pathname[0] === '/' ? pathname : '/' + pathname

    for (const tag of availableLanguageTags) {
        const prefix = `/${tag}/`
        if (normalized_pathname.startsWith(prefix)) {
            return tag === language_tag
                ? pathname
                : '/' + language_tag + normalized_pathname.slice(prefix.length - 1)
        }
    }
    return '/' + language_tag + normalized_pathname
}

const LANGUAGE_TAG_MATCH_FILTER = {language_tag: availableLanguageTags} as const
const LANGUAGE_TAG_PATH = `/:language_tag`

export const I18nRoutes: solid.FlowComponent = props => {
    return solid.createMemo(() => {
        const routes = props.children as any as router.RouteDefinition<string | string[]>[]

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

export let languageTag: solid.Accessor<AvailableLanguageTag>
export let setLanguageTag: (language_tag: AvailableLanguageTag) => void
export let LanguageTagProvider: solid.ContextProviderComponent<AvailableLanguageTag>

if (solid_web.isServer) {
    const LanguageTagCtx = solid.createContext<AvailableLanguageTag>()

    setLanguageTag = () => {
        throw new Error('setLanguageTag not available on server')
    }
    LanguageTagProvider = LanguageTagCtx.Provider
    languageTag = () => {
        const ctx = solid.useContext(LanguageTagCtx)
        if (!ctx) {
            throw new Error('LanguageTagCtx not found')
        }
        return ctx
    }

    paraglide.setLanguageTag(languageTag)
} else {
    setLanguageTag = paraglide.setLanguageTag
    LanguageTagProvider = props => {
        const language_tag = props.value

        const navigate = router.useNavigate()
        router.useBeforeLeave(e => {
            if (typeof e.to !== 'string') return

            const pathname_with_prefix = prefixPathnameWithLanguageTag(e.to, language_tag)
            if (pathname_with_prefix === e.to) return

            e.preventDefault()
            navigate(pathname_with_prefix, e.options)
        })

        return props.children
    }
    languageTag = paraglide.languageTag

    setLanguageTag(getLanguageTagFromURL())

    paraglide.onSetLanguageTag(new_language_tag => {
        location.pathname = prefixPathnameWithLanguageTag(location.pathname, new_language_tag)
    })
}
