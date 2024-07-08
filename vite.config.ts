import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
// import babel from 'vite-plugin-babel';

export default defineConfig({
	plugins: [
		sveltekit(),
		// babel({
		// 	babelConfig: {
		// 		plugins: [
		// 			'preval',
		// 			'@babel/plugin-syntax-import-attributes',
		// 		],
		// 		babelrc: false,
		// 		configFile: false,
		// 		presets: ["@babel/preset-typescript"],
		// 	},
		// 	filter: /\.m?[j|t]sx?$/,
		// 	exclude: /node_modules/,
		// }),
	],
});
