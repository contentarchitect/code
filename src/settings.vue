<template>
	<css-grid :columns="['1fr', '1fr']" gap="8px 0">
		<label for="">Mode</label>
		<v-select v-model="value.language">
			<option :value="''" v-if="languages.length"></option>
			<option v-for="language in languages" :value="language" :key="language">{{ language }}</option>
		</v-select>
	</css-grid>
</template>

<script>
import { CssGrid, VSelect } from "@contentarchitect/editor"

export default {
	components: {
		CssGrid,
		VSelect,
	},
	props: ['value'],
	data () {
		return {
			languages: Object.keys(Prism.languages).filter(lang => typeof Prism.languages[lang] !== "function")
		}
	}
}
</script>

<style>
</style>