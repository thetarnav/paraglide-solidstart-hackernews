import * as vite from 'vite'
import solid from 'solid-start/vite'
import netlify from 'solid-start-netlify'

export default vite.defineConfig({
    plugins: [solid({adapter: netlify({edge: true})})],
})
