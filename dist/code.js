(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('@contentarchitect/editor')) :
	typeof define === 'function' && define.amd ? define(['@contentarchitect/editor'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Code = factory(global.ContentArchitect));
}(this, (function (editor) { 'use strict';

	//
	//
	//
	//

	// https://css-tricks.com/snippets/javascript/htmlentities-for-javascript/
	function htmlEntities(str) {
	    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
	}

	var script = {
		props: ['value'],
		data () {
			return {
				highlighted: ''
			}
		},
		methods: {
			highlight () {
				let highlighted;
				if (typeof Prism != "undefined" && Prism.languages[this.value.language]) {
					// "\n" is necessary. Beacuse if textarea has an empty new line, <pre> doesn't add new line. In this situation, the heights aren't equal.
					highlighted = Prism.highlight(this.value.code + "\n", Prism.languages[this.value.language] || "", this.value.language || "");
				} else {
					highlighted = htmlEntities(this.value.code + "\n");
				}

				this.highlighted = highlighted;
				let rendered = `<pre class="language-${this.value.language}"><code class="language-${this.value.language}">${highlighted}</code></pre>`;
				this.value.highlighted = rendered;
			}
		},
		watch: {
			"value.code": {
				immediate: true,
				handler: "highlight"
			},
			"value.language": "highlight"
		}
	};

	function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
	    if (typeof shadowMode !== 'boolean') {
	        createInjectorSSR = createInjector;
	        createInjector = shadowMode;
	        shadowMode = false;
	    }
	    // Vue.extend constructor export interop.
	    const options = typeof script === 'function' ? script.options : script;
	    // render functions
	    if (template && template.render) {
	        options.render = template.render;
	        options.staticRenderFns = template.staticRenderFns;
	        options._compiled = true;
	        // functional template
	        if (isFunctionalTemplate) {
	            options.functional = true;
	        }
	    }
	    // scopedId
	    if (scopeId) {
	        options._scopeId = scopeId;
	    }
	    let hook;
	    if (moduleIdentifier) {
	        // server build
	        hook = function (context) {
	            // 2.3 injection
	            context =
	                context || // cached call
	                    (this.$vnode && this.$vnode.ssrContext) || // stateful
	                    (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
	            // 2.2 with runInNewContext: true
	            if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
	                context = __VUE_SSR_CONTEXT__;
	            }
	            // inject component styles
	            if (style) {
	                style.call(this, createInjectorSSR(context));
	            }
	            // register component module identifier for async chunk inference
	            if (context && context._registeredComponents) {
	                context._registeredComponents.add(moduleIdentifier);
	            }
	        };
	        // used by ssr in case component is cached and beforeCreate
	        // never gets called
	        options._ssrRegister = hook;
	    }
	    else if (style) {
	        hook = shadowMode
	            ? function (context) {
	                style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
	            }
	            : function (context) {
	                style.call(this, createInjector(context));
	            };
	    }
	    if (hook) {
	        if (options.functional) {
	            // register for functional component in vue file
	            const originalRender = options.render;
	            options.render = function renderWithStyleInjection(h, context) {
	                hook.call(context);
	                return originalRender(h, context);
	            };
	        }
	        else {
	            // inject component registration as beforeCreate hook
	            const existing = options.beforeCreate;
	            options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
	        }
	    }
	    return script;
	}

	const isOldIE = typeof navigator !== 'undefined' &&
	    /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
	function createInjector(context) {
	    return (id, style) => addStyle(id, style);
	}
	let HEAD;
	const styles = {};
	function addStyle(id, css) {
	    const group = isOldIE ? css.media || 'default' : id;
	    const style = styles[group] || (styles[group] = { ids: new Set(), styles: [] });
	    if (!style.ids.has(id)) {
	        style.ids.add(id);
	        let code = css.source;
	        if (css.map) {
	            // https://developer.chrome.com/devtools/docs/javascript-debugging
	            // this makes source maps inside style tags work properly in Chrome
	            code += '\n/*# sourceURL=' + css.map.sources[0] + ' */';
	            // http://stackoverflow.com/a/26603875
	            code +=
	                '\n/*# sourceMappingURL=data:application/json;base64,' +
	                    btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) +
	                    ' */';
	        }
	        if (!style.element) {
	            style.element = document.createElement('style');
	            style.element.type = 'text/css';
	            if (css.media)
	                style.element.setAttribute('media', css.media);
	            if (HEAD === undefined) {
	                HEAD = document.head || document.getElementsByTagName('head')[0];
	            }
	            HEAD.appendChild(style.element);
	        }
	        if ('styleSheet' in style.element) {
	            style.styles.push(code);
	            style.element.styleSheet.cssText = style.styles
	                .filter(Boolean)
	                .join('\n');
	        }
	        else {
	            const index = style.ids.size - 1;
	            const textNode = document.createTextNode(code);
	            const nodes = style.element.childNodes;
	            if (nodes[index])
	                style.element.removeChild(nodes[index]);
	            if (nodes.length)
	                style.element.insertBefore(textNode, nodes[index]);
	            else
	                style.element.appendChild(textNode);
	        }
	    }
	}

	/* script */
	const __vue_script__ = script;

	/* template */
	var __vue_render__ = function() {
	  var _vm = this;
	  var _h = _vm.$createElement;
	  var _c = _vm._self._c || _h;
	  return _c(
	    "pre",
	    {
	      ref: "pre",
	      staticClass: "code-pre",
	      class: ["language-" + _vm.value.language]
	    },
	    [
	      _c(
	        "code",
	        {
	          ref: "code",
	          staticClass: "code",
	          class: ["language-" + _vm.value.language]
	        },
	        [
	          _c("div", { staticClass: "textarea-container" }, [
	            _c("textarea", {
	              directives: [
	                {
	                  name: "model",
	                  rawName: "v-model",
	                  value: _vm.value.code,
	                  expression: "value.code"
	                }
	              ],
	              ref: "textarea",
	              attrs: {
	                spellcheck: "false",
	                autocapitalize: "off",
	                autocomplete: "off",
	                autocorrect: "off",
	                "data-gramm": "false"
	              },
	              domProps: { value: _vm.value.code },
	              on: {
	                input: function($event) {
	                  if ($event.target.composing) {
	                    return
	                  }
	                  _vm.$set(_vm.value, "code", $event.target.value);
	                }
	              }
	            })
	          ]),
	          _c("span", { domProps: { innerHTML: _vm._s(_vm.highlighted) } })
	        ]
	      )
	    ]
	  )
	};
	var __vue_staticRenderFns__ = [];
	__vue_render__._withStripped = true;

	  /* style */
	  const __vue_inject_styles__ = function (inject) {
	    if (!inject) return
	    inject("data-v-22bf1c3d_0", { source: "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n", map: {"version":3,"sources":[],"names":[],"mappings":"","file":"view.vue"}, media: undefined });

	  };
	  /* scoped */
	  const __vue_scope_id__ = "data-v-22bf1c3d";
	  /* module identifier */
	  const __vue_module_identifier__ = undefined;
	  /* functional template */
	  const __vue_is_functional_template__ = false;
	  /* style inject SSR */
	  
	  /* style inject shadow dom */
	  

	  
	  const __vue_component__ = /*#__PURE__*/normalizeComponent(
	    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
	    __vue_inject_styles__,
	    __vue_script__,
	    __vue_scope_id__,
	    __vue_is_functional_template__,
	    __vue_module_identifier__,
	    false,
	    createInjector,
	    undefined,
	    undefined
	  );

	//

	var script$1 = {
		components: {
			CssGrid: editor.CssGrid,
			VSelect: editor.VSelect,
		},
		props: ['value'],
		data () {
			return {
				languages: Object.keys(Prism.languages).filter(lang => typeof Prism.languages[lang] !== "function")
			}
		}
	};

	/* script */
	const __vue_script__$1 = script$1;

	/* template */
	var __vue_render__$1 = function() {
	  var _vm = this;
	  var _h = _vm.$createElement;
	  var _c = _vm._self._c || _h;
	  return _c(
	    "css-grid",
	    { attrs: { columns: ["1fr", "1fr"], gap: "8px 0" } },
	    [
	      _c("label", { attrs: { for: "" } }, [_vm._v("Mode")]),
	      _vm._v(" "),
	      _c(
	        "v-select",
	        {
	          model: {
	            value: _vm.value.language,
	            callback: function($$v) {
	              _vm.$set(_vm.value, "language", $$v);
	            },
	            expression: "value.language"
	          }
	        },
	        [
	          _vm.languages.length
	            ? _c("option", { domProps: { value: "" } })
	            : _vm._e(),
	          _vm._v(" "),
	          _vm._l(_vm.languages, function(language) {
	            return _c(
	              "option",
	              { key: language, domProps: { value: language } },
	              [_vm._v(_vm._s(language))]
	            )
	          })
	        ],
	        2
	      )
	    ],
	    1
	  )
	};
	var __vue_staticRenderFns__$1 = [];
	__vue_render__$1._withStripped = true;

	  /* style */
	  const __vue_inject_styles__$1 = function (inject) {
	    if (!inject) return
	    inject("data-v-17a17b4e_0", { source: "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n", map: {"version":3,"sources":[],"names":[],"mappings":"","file":"settings.vue"}, media: undefined });

	  };
	  /* scoped */
	  const __vue_scope_id__$1 = undefined;
	  /* module identifier */
	  const __vue_module_identifier__$1 = undefined;
	  /* functional template */
	  const __vue_is_functional_template__$1 = false;
	  /* style inject SSR */
	  
	  /* style inject shadow dom */
	  

	  
	  const __vue_component__$1 = /*#__PURE__*/normalizeComponent(
	    { render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 },
	    __vue_inject_styles__$1,
	    __vue_script__$1,
	    __vue_scope_id__$1,
	    __vue_is_functional_template__$1,
	    __vue_module_identifier__$1,
	    false,
	    createInjector,
	    undefined,
	    undefined
	  );

	var icon = { render: function () { var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('svg',{attrs:{"xmlns":"http://www.w3.org/2000/svg","height":"24","width":"24"}},[_c('path',{attrs:{"d":"M0 0h24v24H0V0z","fill":"none"}}),_c('path',{attrs:{"d":"M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"}})]) } };

	class Code extends editor.Block {
		static get viewComponent () {
			return __vue_component__;
		}

		static get settingsComponent () {
			return __vue_component__$1;
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
			}).join("\n");

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

	return Code;

})));
