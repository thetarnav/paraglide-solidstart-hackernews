import * as solid from 'solid-js'
import * as solid_web from 'solid-js/web'
import * as messages from '@inlang/paraglide-js/hn/messages'
import * as paraglide from '@inlang/paraglide-js/hn'

export const m = messages
export let languageTag: solid.Accessor<paraglide.AvailableLanguageTag> = paraglide.languageTag
export let setLanguageTag = paraglide.setLanguageTag
export const availableLanguageTags = paraglide.availableLanguageTags

export const init = (): void => {
    /* no reactivity needed on server */
    if (solid_web.isServer) return

    const [_languageTag, _setLanguageTag] = solid.createSignal(paraglide.languageTag())
    paraglide.setLanguageTag(_languageTag)
    setLanguageTag = _setLanguageTag
    languageTag = _languageTag
}
