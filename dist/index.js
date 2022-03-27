/*!
 * vue-jsonpath-picker v1.1.5
 * (c) Oscar Marie--Taillefer
 * Released under the MIT License.
 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsonpathPickerVanilla = require('jsonpath-picker-vanilla');
require('jsonpath-picker-vanilla/lib/jsonpath-picker.min.css');

//
var script = {
  name: 'JSONPathPicker',
  data: function data() {
    return {
      clickedPath: '',
      path: {
        value: ''
      }
    };
  },
  props: {
    code: {
      type: Object,
      "default": function _default() {
        return {
          sample: "This is a sample"
        };
      }
    },
    opts: Object,
    "default": function _default() {
      return {};
    }
  },
  methods: {
    pickPath: function pickPath(ev) {
      // Check if ev target is the pick-path
      if (ev.target && ev.target.classList.contains('pick-path')) {
        this.$emit('path', this.path.value);
      }
    }
  },
  mounted: function mounted() {
    // Render jpPicker
    if (this.$refs['json-renderer']) {
      jsonpathPickerVanilla.jsonPathPicker(this.$refs['json-renderer'], this.$props.code, [this.path], this.$props.opts);
    }
  },
  watch: {
    code: function code(val) {
      if (this.$refs['json-renderer']) {
        jsonpathPickerVanilla.clearJsonPathPicker(this.$refs['json-renderer']);

        if (val) {
          jsonpathPickerVanilla.jsonPathPicker(this.$refs['json-renderer'], this.$props.code, [this.path], this.$props.opts);
        }
      }
    }
  },
  destroyed: function destroyed() {
    if (this.$refs['json-renderer']) {
      jsonpathPickerVanilla.clearJsonPathPicker(this.$refs['json-renderer']);
    }
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
var __vue_script__ = script;
/* template */

var __vue_render__ = function __vue_render__() {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('div', {
    staticClass: "json-path-picker",
    on: {
      "click": _vm.pickPath
    }
  }, [_c('pre', {
    ref: "json-renderer",
    staticClass: "json-tree"
  }), _vm._v(" "), _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.clickedPath,
      expression: "clickedPath"
    }],
    staticClass: "path",
    attrs: {
      "type": "hidden",
      "id": "path"
    },
    domProps: {
      "value": _vm.clickedPath
    },
    on: {
      "change": function change($event) {
        return _vm.$emit('path', _vm.clickedPath);
      },
      "input": function input($event) {
        if ($event.target.composing) {
          return;
        }

        _vm.clickedPath = $event.target.value;
      }
    }
  })]);
};

var __vue_staticRenderFns__ = [];
/* style */

var __vue_inject_styles__ = function __vue_inject_styles__(inject) {
  if (!inject) return;
  inject("data-v-07df53e9_0", {
    source: ".json-path-picker[data-v-07df53e9]{padding:3px 10px}",
    map: undefined,
    media: undefined
  });
};
/* scoped */


var __vue_scope_id__ = "data-v-07df53e9";
/* module identifier */

var __vue_module_identifier__ = undefined;
/* functional template */

var __vue_is_functional_template__ = false;
/* style inject SSR */

/* style inject shadow dom */

var __vue_component__ = /*#__PURE__*/normalizeComponent({
  render: __vue_render__,
  staticRenderFns: __vue_staticRenderFns__
}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, false, createInjector, undefined, undefined);

var config = {
  install: function install(Vue) {
    // Let's register our component globally
    // https://vuejs.org/v2/guide/components-registration.html
    Vue.component("jsonpath-picker", __vue_component__);
  }
};

exports.config = config;
exports["default"] = config;
