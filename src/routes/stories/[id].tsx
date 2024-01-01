import * as solid from "solid-js"
import * as router from "@solidjs/router"
import * as m from "~/paraglide/messages.js"
import * as api from "~/api"
import * as i18n from "~/i18n"

export const route = {
	load(props) {
		void api.getStory(`item/${props.params.id}`)
	},
} satisfies router.RouteDefinition

const Story: solid.Component<router.RouteSectionProps> = props => {
	const story = router.createAsync(() => {
		return api.getStory(`item/${props.params.id}`)
	})

	return (
		<solid.Show when={story()}>
			<div class="item-view">
				<div class="item-view-header">
					<a href={story()!.url} target="_blank">
						<h1>{story()!.title}</h1>
					</a>
					<solid.Show when={story()!.domain}>
						<span class="host">({story()!.domain})</span>
					</solid.Show>
					<p class="meta">
						{m.story_points({points: story()!.points})} | {m.story_by()}{" "}
						<router.A href={i18n.translateHref(`/users/${story()!.user}`)}>
							{story()!.user}
						</router.A>{" "}
						{story()!.time_ago}
					</p>
				</div>
				<div class="item-view-comments">
					<p class="item-view-comments-header">
						{story()!.comments_count
							? `${story()!.comments_count} ${m.story_comments()}`
							: m.story_no_comments()}
					</p>
					<ul class="comment-children">
						<solid.For each={story()!.comments}>
							{comment => <Comment comment={comment} />}
						</solid.For>
					</ul>
				</div>
			</div>
		</solid.Show>
	)
}

export default Story

export const Toggle: solid.ParentComponent = props => {
	const [open, setOpen] = solid.createSignal(true)

	return (
		<>
			<div class="toggle" classList={{open: open()}}>
				<a onClick={() => setOpen(o => !o)}>
					{open() ? "[-]" : "[+] " + m.story_comments_collapsed()}
				</a>
			</div>
			<ul class="comment-children" style={{display: open() ? "block" : "none"}}>
				{props.children}
			</ul>
		</>
	)
}

export const Comment: solid.Component<{comment: api.Comment}> = props => {
	return (
		<li class="comment">
			<div class="by">
				<router.A href={i18n.translateHref(`/users/${props.comment.user}`)}>
					{props.comment.user}
				</router.A>{" "}
				{props.comment.time_ago}
			</div>
			<div class="text" innerHTML={props.comment.content} />
			<solid.Show when={props.comment.comments.length}>
				<Toggle>
					<solid.For each={props.comment.comments}>
						{comment => <Comment comment={comment} />}
					</solid.For>
				</Toggle>
			</solid.Show>
		</li>
	)
}
