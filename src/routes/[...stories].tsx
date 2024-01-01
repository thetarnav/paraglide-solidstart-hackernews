import * as solid from "solid-js"
import * as router from "@solidjs/router"
import * as m from "~/paraglide/messages.js"
import * as api from "~/api"
import * as i18n from "~/i18n"

export const route = {
	load(props) {
		const page = +props.location.query.page || 1
		const type = api.isStoryType(props.params.stories) ? props.params.stories : "top"
		const path = api.getStoriesPath(type, page)
		void api.getStories(path)
	},
} satisfies router.RouteDefinition

const Stories: solid.Component<router.RouteSectionProps> = props => {
	const page = () => +props.location.query.page || 1
	const type = () => (api.isStoryType(props.params.stories) ? props.params.stories : "top")

	const stories = router.createAsync(() => {
		return api.getStories(api.getStoriesPath(type(), page()))
	})

	return (
		<div class="news-view">
			<div class="news-list-nav">
				<solid.Show
					when={page() > 1}
					fallback={
						<span class="page-link disabled" aria-disabled="true">
							{"<"} {m.stories_prev()}
						</span>
					}
				>
					<router.A
						class="page-link"
						href={i18n.translateHref(`/${type()}?page=${page() - 1}`)}
						aria-label={m.stories_prev_page()}
					>
						{"<"} {m.stories_prev()}
					</router.A>
				</solid.Show>
				<span>{m.stories_page({count: page()})}</span>
				<solid.Show
					when={stories() && stories()!.length >= 29}
					fallback={
						<span class="page-link disabled" aria-disabled="true">
							{m.stories_next()} {">"}
						</span>
					}
				>
					<router.A
						class="page-link"
						href={i18n.translateHref(`/${type()}?page=${page() + 1}`)}
						aria-label={m.stories_next_page()}
					>
						{m.stories_next()} {">"}
					</router.A>
				</solid.Show>
			</div>
			<main class="news-list">
				<solid.Show when={stories()}>
					<ul>
						<solid.For each={stories()}>{story => <Story story={story} />}</solid.For>
					</ul>
				</solid.Show>
			</main>
		</div>
	)
}
export default Stories

const Story: solid.Component<{story: api.Story}> = props => {
	return (
		<li class="news-item">
			<span class="score">{props.story.points}</span>
			<span class="title">
				<solid.Show
					when={props.story.url}
					fallback={
						<router.A href={i18n.translateHref(`/item/${props.story.id}`)}>
							{props.story.title}
						</router.A>
					}
				>
					<a href={i18n.translateHref(props.story.url)} target="_blank" rel="noreferrer">
						{props.story.title}
					</a>
					<span class="host"> ({props.story.domain})</span>
				</solid.Show>
			</span>
			<br />
			<span class="meta">
				<solid.Show
					when={props.story.type !== "job"}
					fallback={
						<router.A href={i18n.translateHref(`/stories/${props.story.id}`)}>
							{props.story.time_ago}
						</router.A>
					}
				>
					{m.story_by()}{" "}
					<router.A href={i18n.translateHref(`/users/${props.story.user}`)}>
						{props.story.user}
					</router.A>{" "}
					{props.story.time_ago} |{" "}
					<router.A href={i18n.translateHref(`/stories/${props.story.id}`)}>
						{props.story.comments_count
							? `${props.story.comments_count} ${m.story_comments()}`
							: m.story_discuss()}
					</router.A>
				</solid.Show>
			</span>
			<solid.Show when={props.story.type !== "link"}>
				{" "}
				<span class="label">{props.story.type}</span>
			</solid.Show>
		</li>
	)
}
