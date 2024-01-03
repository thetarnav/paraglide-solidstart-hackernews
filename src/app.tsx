// @refresh reload
import {Router, A} from "@solidjs/router"
import {FileRoutes} from "@solidjs/start"
import * as solid from "solid-js"
import * as i18n from "./i18n"
import * as m from "~/paraglide/messages.js"

import "./root.css"

const App: solid.Component = () => {
	const url_language_tag = i18n.useLocationLanguageTag()
	const language_tag = url_language_tag ?? i18n.sourceLanguageTag

	return (
		<Router
			base={url_language_tag}
			root={props => (
				<i18n.LanguageTagProvider value={language_tag}>
					<solid.Suspense>
						<Nav />
						{props.children}
					</solid.Suspense>
				</i18n.LanguageTagProvider>
			)}
		>
			<FileRoutes />
		</Router>
	)
}
export default App

const Nav: solid.Component = () => {
	return (
		<header class="header">
			<nav class="inner">
				<A href="/">
					<strong>HN</strong>
				</A>
				<A href="/new">
					<strong>{m.nav_new()}</strong>
				</A>
				<A href="/show">
					<strong>{m.nav_show()}</strong>
				</A>
				<A href="/ask">
					<strong>{m.nav_ask()}</strong>
				</A>
				<A href="/job">
					<strong>{m.nav_job()}</strong>
				</A>
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
