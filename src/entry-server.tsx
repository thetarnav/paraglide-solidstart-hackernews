import * as start_server from 'solid-start/entry-server'
import * as m from '~/paraglide/messages.js'

globalThis.m = m

export default start_server.createHandler(
    start_server.renderAsync(event => <start_server.StartServer event={event} />),
)
