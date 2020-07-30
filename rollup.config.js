import svg from 'rollup-plugin-vue-inline-svg'
import vue from 'rollup-plugin-vue'

export default {
	input: 'src/main.js',
	external: ["vue", '@contentarchitect/editor'],
	output: {
		file: 'dist/code.js',
		format: 'umd',
		name: 'Code',
		globals: {
			vue: "Vue",
			'@contentarchitect/editor': 'ContentArchitect'
		}
	},
	plugins: [
		svg(),
		vue()
	]
}