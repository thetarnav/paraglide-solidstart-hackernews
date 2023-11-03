import * as solid from 'solid-js'
import {RouteDataArgs, useRouteData} from 'solid-start'
import * as api from '~/api'
import * as i18n from '~/i18n'

export const routeData = (props: RouteDataArgs) => {
    const [user] = solid.createResource(() => `user/${props.params.id}`, api.unsafeFetchUser)
    return user
}

const UserPage: solid.Component = () => {
    const user = useRouteData<typeof routeData>()

    return (
        <div class="user-view">
            <solid.Show when={user()}>
                <solid.Show when={!user()!.error} fallback={<h1>{i18n.m.user_not_found()}</h1>}>
                    <h1>
                        {i18n.m.user_name()}: {user()!.id}
                    </h1>
                    <ul class="meta">
                        <li>
                            <span class="label">{i18n.m.user_created()}:</span> {user()!.created}
                        </li>
                        <li>
                            <span class="label">{i18n.m.user_karma()}:</span> {user()!.karma}
                        </li>
                        <solid.Show when={user()!.about}>
                            <li innerHTML={user()!.about} class="about" />{' '}
                        </solid.Show>
                    </ul>
                    <p class="links">
                        <a href={`https://news.ycombinator.com/submitted?id=${user()!.id}`}>
                            {i18n.m.user_submissions()}
                        </a>{' '}
                        |{' '}
                        <a href={`https://news.ycombinator.com/threads?id=${user()!.id}`}>
                            {i18n.m.user_comments()}
                        </a>
                    </p>
                </solid.Show>
            </solid.Show>
        </div>
    )
}

export default UserPage
