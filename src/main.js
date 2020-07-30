import { Block } from "@contentarchitect/editor"
import view from "./view.vue"
import settings from "./settings.vue"
import icon from "./icon.svg"

export default class Code extends Block {
	static get viewComponent () {
		return view;
	}

	static get settingsComponent () {
		return settings;
	}

	static get icon () {
		return icon
	}

	static defaultSettings = {
	}

	static defaultData () {
		return {
			language: '',
			code: '',
			highlighted: ''
		}
	}

	toHTML () {
		return this.highlighted
	}

	static serializeFromHTML (html) {
		// const language = /language-(.+)$/.exec(languageClass)[1]
		const language = html.dataset.language;

		let code = Array.from(html.querySelectorAll("pre")).map(line => {
			return line.innerText
		}).join("\n")

		return {
			language,
			code,
			highlighted: ''
		}
	}

	get dataset () {
		return {
			language: this.language
		}
	}
}