import {createHandler, StartServer} from "@solidjs/start/server"
import * as i18n from "./i18n"
import * as m from "~/paraglide/messages.js"

export default createHandler(() => {
	const language_tag = i18n.useLocationLanguageTag() ?? i18n.sourceLanguageTag

	return (
		<StartServer
			document={props => (
				<html lang={language_tag}>
					<head>
						<title>Paraglide SolidStart - Hacker News</title>
						<meta charset="utf-8" />
						<meta name="viewport" content="width=device-width, initial-scale=1" />
						<meta
							name="description"
							content={m.root_description({}, {languageTag: language_tag})}
						/>
						<link rel="manifest" href="/manifest.webmanifest" />
						<i18n.AlternateLinks languageTag={language_tag} />
						{props.assets}
					</head>
					<body>
						<div id="app">{props.children}</div>
						{props.scripts}
					</body>
				</html>
			)}
		/>
	)
})
