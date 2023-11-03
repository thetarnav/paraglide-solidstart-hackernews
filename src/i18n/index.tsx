import * as solid from 'solid-js'
import * as solid_web from 'solid-js/web'
import * as messages from '@inlang/paraglide-js/hn/messages'
import * as paraglide from '@inlang/paraglide-js/hn'

const entries = <T extends object>(obj: T) => Object.entries(obj) as [keyof T, T[keyof T]][]

export let m: typeof messages = messages
export let languageTag: solid.Accessor<paraglide.AvailableLanguageTag> = paraglide.languageTag
export const setLanguageTag = paraglide.setLanguageTag
export const availableLanguageTags = paraglide.availableLanguageTags

export const init = (): void => {
    /* no reactivity needed on server */
    if (solid_web.isServer) return

    const [_languageTag, _setLanguageTag] = solid.createSignal(paraglide.languageTag())
    paraglide.onSetLanguageTag(_setLanguageTag)

    languageTag = _languageTag

    m = {...messages}
    for (const [key, value] of entries(m)) {
        m[key] = (...a) => {
            languageTag() // track languageTag
            return value(...a)
        }
    }
}
