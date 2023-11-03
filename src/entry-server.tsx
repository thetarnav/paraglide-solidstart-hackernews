import * as start_server from 'solid-start/entry-server'

export default start_server.createHandler(
    start_server.renderAsync(event => <start_server.StartServer event={event} />),
)
