import * as solid from 'solid-js'
import * as start from 'solid-start'
import * as api from '~/api'

export const routeData = (props: start.RouteDataArgs) => {
    const [story] = solid.createResource(() => `item/${props.params.id}`, api.unsafeFetchStory)
    return story
}

export const Toggle: solid.ParentComponent = props => {
    const [open, setOpen] = solid.createSignal(true)

    return (
        <>
            <div class="toggle" classList={{open: open()}}>
                <a onClick={() => setOpen(o => !o)}>{open() ? '[-]' : '[+] comments collapsed'}</a>
            </div>
            <ul class="comment-children" style={{display: open() ? 'block' : 'none'}}>
                {props.children}
            </ul>
        </>
    )
}

export const Comment: solid.Component<{comment: api.Comment}> = props => {
    return (
        <li class="comment">
            <div class="by">
                <start.A href={`/users/${props.comment.user}`}>{props.comment.user}</start.A>{' '}
                {props.comment.time_ago} ago
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

const Story: solid.Component = () => {
    const story = start.useRouteData<typeof routeData>()
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
                        {story()!.points} points | by{' '}
                        <start.A href={`/users/${story()!.user}`}>{story()!.user}</start.A>{' '}
                        {story()!.time_ago} ago
                    </p>
                </div>
                <div class="item-view-comments">
                    <p class="item-view-comments-header">
                        {story()!.comments_count
                            ? story()!.comments_count + ' comments'
                            : 'No comments yet.'}
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
