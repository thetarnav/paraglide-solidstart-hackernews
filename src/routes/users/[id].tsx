import * as solid from 'solid-js'
import * as start from 'solid-start'
import * as api from '~/lib/api.js'

export const routeData = (props: start.RouteDataArgs) => {
    const [user] = solid.createResource(() => `user/${props.params.id}`, api.unsafeFetchUser)
    return user
}

const UserPage: solid.Component = () => {
    const user = start.useRouteData<typeof routeData>()

    return (
        <div class="user-view">
            <solid.Show when={user()}>
                <solid.Show when={!user()!.error} fallback={<h1>User not found.</h1>}>
                    <h1>User : {user()!.id}</h1>
                    <ul class="meta">
                        <li>
                            <span class="label">Created:</span> {user()!.created}
                        </li>
                        <li>
                            <span class="label">Karma:</span> {user()!.karma}
                        </li>
                        <solid.Show when={user()!.about}>
                            <li innerHTML={user()!.about} class="about" />{' '}
                        </solid.Show>
                    </ul>
                    <p class="links">
                        <a href={`https://news.ycombinator.com/submitted?id=${user()!.id}`}>
                            submissions
                        </a>{' '}
                        |{' '}
                        <a href={`https://news.ycombinator.com/threads?id=${user()!.id}`}>
                            comments
                        </a>
                    </p>
                </solid.Show>
            </solid.Show>
        </div>
    )
}

export default UserPage
