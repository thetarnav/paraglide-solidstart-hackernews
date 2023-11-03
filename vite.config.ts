import * as vite from 'vite'
import solid from 'solid-start/vite'
import netlify from 'solid-start-netlify'

export default vite.defineConfig(({command}) => ({
    plugins: [
        solid({
            adapter: netlify({edge: true}),
        }),
    ],
    optimizeDeps: {
        exclude: command === 'serve' ? ['@inlang/paraglide-js'] : [],
    },
}))
