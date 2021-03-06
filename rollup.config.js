import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import css from 'rollup-plugin-css-only';
import alias from '@rollup/plugin-alias';  // KJB: in support of: Absolute Imports

// KJB: supporting TailwindCSS
import sveltePreprocess from 'svelte-preprocess';
import tailwindcss      from 'tailwindcss';          // KJB: in support of ES Modules
import tailwindConfig   from './tailwind.config.js'; //      (found in tailwind.config.js)
                                                     //      - This is fully described in:
                                                     //        TOOLING.md#setup-tw-themes
const production = !process.env.ROLLUP_WATCH;

function serve() {
	let server;

	function toExit() {
		if (server) server.kill(0);
	}

	return {
		writeBundle() {
			if (server) return;
			server = require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
				stdio: ['ignore', 'inherit', 'inherit'],
				shell: true
			});

			process.on('SIGTERM', toExit);
			process.on('exit', toExit);
		}
	};
}

export default {
	input: 'src/main.js',
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'app',
		file: 'public/build/bundle.js'
	},
	plugins: [
		svelte({
			compilerOptions: {
				// enable run-time checks when not in production
				dev: !production
			},

      // KJB: supporting TailwindCSS
      preprocess: sveltePreprocess({
        // https://github.com/kaisermann/svelte-preprocess/#user-content-options
        sourceMap: !production,
        postcss: {
          plugins: [
          //require("tailwindcss"),      // ... KJB: normal usage
            tailwindcss(tailwindConfig), // ... KJB: in support of ES Modules (in tailwind.config.js)
            require("autoprefixer"),
          //require("postcss-nesting"),
          ],
        },
      }),
		}),

		// we'll extract any component CSS out into
		// a separate file - better for performance
		css({ output: 'bundle.css' }),

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration -
		// consult the documentation for details:
		// https://github.com/rollup/plugins/tree/master/packages/commonjs
		resolve({
			browser: true,
			dedupe: ['svelte']
		}),
		commonjs(),

		// In dev mode, call `npm run start` once
		// the bundle has been generated
		!production && serve(),

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		!production && livereload('public'),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser(),

    // KJB: Absolute Imports
    alias({
      entries: [
        // allow:      import {formChecker}  from "svelte-native-forms";
        // instead of: import {formChecker}  from "../../snf/src";
        { find: 'svelte-native-forms', replacement: 'snf/src/index.js' },
      ]
    })
	],
	watch: {
		clearScreen: false
	}
};
