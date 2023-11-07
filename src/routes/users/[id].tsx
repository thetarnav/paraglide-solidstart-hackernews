import * as solid from 'solid-js'
import {RouteDataArgs, useRouteData} from 'solid-start'
import * as m from '@inlang/paraglide-js/hn/messages'
import * as api from '~/api'

export const routeData = (props: RouteDataArgs) => {
    const [user] = solid.createResource(() => `user/${props.params.id}`, api.unsafeFetchUser)
    return user
}

const UserPage: solid.Component = () => {
    const user = useRouteData<typeof routeData>()

    return (
        <div class="user-view">
            <solid.Show when={user()}>
                <solid.Show when={!user()!.error} fallback={<h1>{m.user_not_found()}</h1>}>
                    <h1>
                        {m.user_name()}: {user()!.id}
                    </h1>
                    <ul class="meta">
                        <li>
                            <span class="label">{m.user_created()}:</span> {user()!.created}
                        </li>
                        <li>
                            <span class="label">{m.user_karma()}:</span> {user()!.karma}
                        </li>
                        <solid.Show when={user()!.about}>
                            <li innerHTML={user()!.about} class="about" />{' '}
                        </solid.Show>
                    </ul>
                    <p class="links">
                        <a href={`https://news.ycombinator.com/submitted?id=${user()!.id}`}>
                            {m.user_submissions()}
                        </a>{' '}
                        |{' '}
                        <a href={`https://news.ycombinator.com/threads?id=${user()!.id}`}>
                            {m.user_comments()}
                        </a>
                    </p>
                </solid.Show>
            </solid.Show>
        </div>
    )
}

export default UserPage
