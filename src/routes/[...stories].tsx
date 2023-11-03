import * as solid from 'solid-js'
import * as start from 'solid-start'
import * as api from '~/lib/api'

const stories_map = {
    top: 'news',
    new: 'newest',
    show: 'show',
    ask: 'ask',
    job: 'jobs',
} as const

export const routeData = ({location, params}: start.RouteDataArgs) => {
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
                    fallback={
                        <start.A href={`/item/${props.story.id}`}>{props.story.title}</start.A>
                    }
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
                    fallback={
                        <start.A href={`/stories/${props.story.id}`}>
                            {props.story.time_ago}
                        </start.A>
                    }
                >
                    by <start.A href={`/users/${props.story.user}`}>{props.story.user}</start.A>{' '}
                    {props.story.time_ago} |{' '}
                    <start.A href={`/stories/${props.story.id}`}>
                        {props.story.comments_count
                            ? `${props.story.comments_count} comments`
                            : 'discuss'}
                    </start.A>
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
    const {page, type, stories} = start.useRouteData<typeof routeData>()

    return (
        <div class="news-view">
            <div class="news-list-nav">
                <solid.Show
                    when={page() > 1}
                    fallback={
                        <span class="page-link disabled" aria-disabled="true">
                            {'<'} prev
                        </span>
                    }
                >
                    <start.A
                        class="page-link"
                        href={`/${type()}?page=${page() - 1}`}
                        aria-label="Previous Page"
                    >
                        {'<'} prev
                    </start.A>
                </solid.Show>
                <span>page {page()}</span>
                <solid.Show
                    when={stories() && stories()!.length >= 29}
                    fallback={
                        <span class="page-link disabled" aria-disabled="true">
                            more {'>'}
                        </span>
                    }
                >
                    <start.A
                        class="page-link"
                        href={`/${type()}?page=${page() + 1}`}
                        aria-label="Next Page"
                    >
                        more {'>'}
                    </start.A>
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
