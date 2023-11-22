import * as vite from 'vite'
import solid from 'solid-start/vite'
import netlify from 'solid-start-netlify'
// import nodeAdapter from 'solid-start-node'

export default vite.defineConfig(({command}) => ({
    plugins: [
        solid({
            adapter: netlify({edge: true}),
            // adapter: nodeAdapter(),
        }),
    ],
    optimizeDeps: {
        exclude: command === 'serve' ? ['@inlang/paraglide-js'] : [],
    },
    // build: { minify: false },
}))
