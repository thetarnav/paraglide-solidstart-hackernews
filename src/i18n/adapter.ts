/*

Paraglide — SolidStart Adapter

This file will in the future be a npm package.
Right now you can copy it into your project.
And use it like this: (see ./index.ts)

*/

import * as solid from 'solid-js'
import * as solid_web from 'solid-js/web'
import * as router from '@solidjs/router'

/**
 * Normalize a pathname.
 * (e.g. "/foo" → "/foo")
 * (e.g. "foo" → "/foo")
 */
export function normalizePathname(pathname: string): string {
    return pathname[0] === '/' ? pathname : '/' + pathname
}

/**
 * Get the language tag from the URL.
 *
 * @param pathname The pathname to check. (e.g. "/en/foo") (use {@link normalizePathname} first)
 * @param all_language_tags All available language tags. (From paraglide, e.g. "en", "de")
 * @returns The language tag from the URL, or `undefined` if no language tag was found.
 */
export function languageTagInPathname<T extends string>(
    pathname: string,
    all_language_tags: readonly T[],
): T | undefined {
    for (const tag of all_language_tags) {
        if (pathname.startsWith(`/${tag}/`)) {
            return tag
        }
    }
}

/**
 * Get the language tag from the URL, using `router.useLocation()`. (needs to be used under `router.Router` context)
 *
 * @param all_language_tags All available language tags. (From paraglide, e.g. "en", "de")
 * @returns The language tag from the URL, or `undefined` if no language tag was found.
 */
export function getLanguageTagFromURL<T extends string>(
    all_language_tags: readonly T[],
): T | undefined {
    const location = router.useLocation()
    const normalized_pathname = normalizePathname(location.pathname)
    return languageTagInPathname(normalized_pathname, all_language_tags)
}

/**
 * Prefix a pathname with a language tag.
 *
 * @param pathname The pathname to prefix. (e.g. "/foo", "foo")
 * @param target_language_tag The language tag to prefix the pathname with. (e.g. "en")
 * @param all_language_tags All available language tags. (From paraglide, e.g. "en", "de")
 * @param source_language_tag The language tag of the source language. (e.g. "en")
 * @returns The prefixed pathname.
 * - If the pathname already has a language tag, it will be replaced with the target language tag.
 * - If the pathname has no language tag, it will be prefixed with the target language tag.
 * - If the source language tag is the same as the target language tag, or target language tag is already in the pathname, the pathname will be returned unchanged. (can be checked with `===`)
 */
export function prefixPathnameWithLanguageTag<T extends string>(
    pathname: string,
    target_language_tag: T,
    all_language_tags: readonly T[],
    source_language_tag: T,
): string {
    const normalized_pathname = normalizePathname(pathname)
    const pathname_language_tag = languageTagInPathname(normalized_pathname, all_language_tags)

    if (pathname_language_tag === target_language_tag) {
        return pathname
    }
    if (pathname_language_tag !== undefined) {
        return normalized_pathname.replace(pathname_language_tag, target_language_tag)
    }
    if (source_language_tag === target_language_tag) {
        return pathname
    }
    return '/' + target_language_tag + normalized_pathname
}

/**
 * The compiled paraglide runtime module.
 * (e.g. "paraglide/runtime.js")
 */
export interface Paraglide<T extends string> {
    readonly setLanguageTag: (language_tag: T | (() => T)) => void
    readonly languageTag: () => T
    readonly onSetLanguageTag: (callback: (language_tag: T) => void) => void
    readonly availableLanguageTags: readonly T[]
    readonly sourceLanguageTag: T
}

export interface I18n<T extends string> {
    readonly languageTag: solid.Accessor<T>
    readonly setLanguageTag: (language_tag: T) => void
    readonly LanguageTagProvider: solid.ContextProviderComponent<T>
}

/**
 * Create an i18n adapter for SolidStart.
 *
 * @param paraglide The compiled paraglide runtime module. (e.g. "paraglide/runtime.js")
 * @returns An i18n adapter for SolidStart.
 * @example
 * ```ts
 * import * as paraglide from '../paraglide/runtime.js'
 *
 * export const {LanguageTagProvider, languageTag, setLanguageTag} = adapter.createI18n(paraglide)
 * ```
 */
export function createI18n<T extends string>(paraglide: Paraglide<T>): I18n<T> {
    let languageTag: I18n<T>['languageTag']
    let setLanguageTag: I18n<T>['setLanguageTag']
    let LanguageTagProvider: I18n<T>['LanguageTagProvider']

    // SERVER
    if (solid_web.isServer) {
        const LanguageTagCtx = solid.createContext<T>()
        LanguageTagProvider = LanguageTagCtx.Provider

        setLanguageTag = () => {
            throw new Error('setLanguageTag not available on server')
        }
        languageTag = () => {
            const ctx = solid.useContext(LanguageTagCtx)
            if (!ctx) {
                throw new Error('LanguageTagCtx not found')
            }
            return ctx
        }

        paraglide.setLanguageTag(languageTag)
    }
    // BROWSER
    else {
        LanguageTagProvider = props => {
            const language_tag = props.value
            setLanguageTag(language_tag)

            /*
            Keep the language tag in the URL
            */
            const navigate = router.useNavigate()
            router.useBeforeLeave(e => {
                if (typeof e.to !== 'string') return

                const pathname_with_prefix = prefixPathnameWithLanguageTag(
                    e.to,
                    language_tag,
                    paraglide.availableLanguageTags,
                    paraglide.sourceLanguageTag,
                )
                /* prevent infinite loop */
                if (pathname_with_prefix === e.to) return

                e.preventDefault()
                navigate(pathname_with_prefix, e.options)
            })

            return props.children
        }

        setLanguageTag = paraglide.setLanguageTag
        languageTag = paraglide.languageTag

        paraglide.onSetLanguageTag(new_language_tag => {
            const new_pathname = prefixPathnameWithLanguageTag(
                location.pathname,
                new_language_tag,
                paraglide.availableLanguageTags,
                paraglide.sourceLanguageTag,
            )
            /* prevent infinite loop */
            if (new_pathname !== location.pathname) {
                location.pathname = new_pathname
            }
        })
    }

    return {
        languageTag,
        setLanguageTag,
        LanguageTagProvider,
    }
}
