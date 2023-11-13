import * as solid from 'solid-js'
import {A, RouteDataArgs, useRouteData} from 'solid-start'
import * as m from '~/paraglide/messages.js'
import * as api from '~/api'

const stories_map = {
    top: 'news',
    new: 'newest',
    show: 'show',
    ask: 'ask',
    job: 'jobs',
} as const

export const routeData = ({location, params}: RouteDataArgs) => {
    const page = () => +location.query.page || 1
    const type = () => (params.stories || 'top') as keyof typeof stories_map

    const [stories] = solid.createResource(
        () => `${stories_map[type()]}?page=${page()}`,
        api.unsafeFetchStories,
    )

    return {type, stories, page}
}

export const Story: solid.Component<{story: api.Story}> = props => {
    return (
        <li class="news-item">
            <span class="score">{props.story.points}</span>
            <span class="title">
                <solid.Show
                    when={props.story.url}
                    fallback={<A href={`/item/${props.story.id}`}>{props.story.title}</A>}
                >
                    <a href={props.story.url} target="_blank" rel="noreferrer">
                        {props.story.title}
                    </a>
                    <span class="host"> ({props.story.domain})</span>
                </solid.Show>
            </span>
            <br />
            <span class="meta">
                <solid.Show
                    when={props.story.type !== 'job'}
                    fallback={<A href={`/stories/${props.story.id}`}>{props.story.time_ago}</A>}
                >
                    {m.story_by()} <A href={`/users/${props.story.user}`}>{props.story.user}</A>{' '}
                    {props.story.time_ago} |{' '}
                    <A href={`/stories/${props.story.id}`}>
                        {props.story.comments_count
                            ? `${props.story.comments_count} ${m.story_comments()}`
                            : m.story_discuss()}
                    </A>
                </solid.Show>
            </span>
            <solid.Show when={props.story.type !== 'link'}>
                {' '}
                <span class="label">{props.story.type}</span>
            </solid.Show>
        </li>
    )
}

const Stories: solid.Component = () => {
    const {page, type, stories} = useRouteData<typeof routeData>()

    return (
        <div class="news-view">
            <div class="news-list-nav">
                <solid.Show
                    when={page() > 1}
                    fallback={
                        <span class="page-link disabled" aria-disabled="true">
                            {'<'} {m.stories_prev()}
                        </span>
                    }
                >
                    <A
                        class="page-link"
                        href={`/${type()}?page=${page() - 1}`}
                        aria-label={m.stories_prev_page()}
                    >
                        {'<'} {m.stories_prev()}
                    </A>
                </solid.Show>
                <span>{m.stories_page({count: page()})}</span>
                <solid.Show
                    when={stories() && stories()!.length >= 29}
                    fallback={
                        <span class="page-link disabled" aria-disabled="true">
                            {m.stories_next()} {'>'}
                        </span>
                    }
                >
                    <A
                        class="page-link"
                        href={`/${type()}?page=${page() + 1}`}
                        aria-label={m.stories_next_page()}
                    >
                        {m.stories_next()} {'>'}
                    </A>
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
