/*!
 * vue-jsonpath-picker v1.0.1
 * (c) Oscar Marie--Taillefer
 * Released under the MIT License.
 */
'use strict';

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/**
 * Check if arg is either an array with at least 1 element, or a dict with at least 1 key
 * @return boolean
 */
function isCollapsable(arg) {
  return arg instanceof Object && Object.keys(arg).length > 0;
}
/**
 * Check if a string represents a valid url
 * @return boolean
 */


function isUrl(string) {
  var regexp = /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/;
  return regexp.test(string);
}
/**
 * Transform a json object into html representation
 * @return string
 */


function json2html(json, options) {
  var html = '';

  if (typeof json === 'string') {
    // Escape tags
    var tmp = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    if (isUrl(tmp)) {
      html += "<a href=\"".concat(tmp, "\" class=\"json-string\">").concat(tmp, "</a>");
    } else {
      html += "<span class=\"json-string\">\"".concat(tmp, "\"</span>");
    }
  } else if (typeof json === 'number') {
    html += "<span class=\"json-literal\">".concat(json, "</span>");
  } else if (typeof json === 'boolean') {
    html += "<span class=\"json-literal\">".concat(json, "</span>");
  } else if (json === null) {
    html += '<span class="json-literal">null</span>';
  } else if (json instanceof Array) {
    if (json.length > 0) {
      html += '[<ol class="json-array">';

      for (var i = 0; i < json.length; i += 1) {
        html += "<li data-key-type=\"array\" data-key=\"".concat(i, "\">"); // Add toggle button if item is collapsable

        if (isCollapsable(json[i])) {
          html += '<a href class="json-toggle"></a>';
        }

        html += json2html(json[i], options); // Add comma if item is not last

        if (i < json.length - 1) {
          html += ',';
        }

        html += '</li>';
      }

      html += '</ol>]';
    } else {
      html += '[]';
    }
  } else if (_typeof(json) === 'object') {
    var keyCount = Object.keys(json).length;

    if (keyCount > 0) {
      html += '{<ul class="json-dict">';

      for (var key in json) {
        if (json.hasOwnProperty(key)) {
          html += "<li data-key-type=\"object\" data-key=\"".concat(key, "\">");
          var keyRepr = options.outputWithQuotes ? "<span class=\"json-string\">\"".concat(key, "\"</span>") : key; // Add toggle button if item is collapsable

          if (isCollapsable(json[key])) {
            html += "<a href class=\"json-toggle\">".concat(keyRepr, "</a>");
          } else {
            html += keyRepr;
          }

          html += '<span class="pick-path" title="Pick path">&' + options.pickerIcon + ';</span>';
          html += ": ".concat(json2html(json[key], options)); // Add comma if item is not last

          keyCount -= 1;

          if (keyCount > 0) {
            html += ',';
          }

          html += '</li>';
        }
      }

      html += '</ul>}';
    } else {
      html += '{}';
    }
  }

  return html;
}
/**
 * Remove an event listener
 * @param  {String}   event    The event type
 * @param  {Node}     elem     The element to remove the event to (optional, defaults to window)
 * @param  {Function} callback The callback that ran on the event
 * @param  {Boolean}  capture  If true, forces bubbling on non-bubbling events
 */


function off(event, elem, callback, capture) {
  var captureIntern = capture;
  var callbackIntern = callback;
  var elemIntern = elem;

  if (typeof elem === 'function') {
    captureIntern = callback;
    callbackIntern = elem;
    elemIntern = window;
  }

  captureIntern = !!captureIntern;
  elemIntern = typeof elemIntern === 'string' ? document.querySelector(elemIntern) : elemIntern;
  if (!elemIntern) return;
  elemIntern.removeEventListener(event, callbackIntern, captureIntern);
}
/**
 * Equivalent of JQuery $().siblings(sel) with callback features
 *
 * Retrieve all siblings/neighbors of a node
 * Usage:
 * - siblings(node, '.collapse', (sib) => { });
 * - const sibs = siblings(node);
 * - const sibs = siblings(node, '.collapse');
 *
 * @param {HTMLNode} el Element to apply siblings methods
 * @param {String} sel CSS Selector
 * @param {Function} callback (sib) => {}
 */


function siblings(el, sel, callback) {
  var sibs = [];

  for (var i = 0; i < el.parentNode.children.length; i += 1) {
    var child = el.parentNode.children[i];

    if (child !== el && (!sel || child.matches(sel))) {
      sibs.push(child);
    }
  } // If a callback is passed, call it on each sibs


  if (callback && typeof callback === 'function') {
    for (var _i = 0; _i < sibs.length; _i += 1) {
      callback(sibs[_i]);
    }
  }

  return sibs;
}
/**
 * Fire a click handler to the specified node.
 * Event handlers can detect that the event was fired programatically
 * by testing for a 'synthetic=true' property on the event object
 * @param {HTMLNode} node The node to fire the event handler on.
 */


function fireClick(node) {
  // Make sure we use the ownerDocument from the provided node to avoid cross-window problems
  var doc;

  if (node.ownerDocument) {
    doc = node.ownerDocument;
  } else if (node.nodeType === 9) {
    // the node may be the document itself, nodeType 9 = DOCUMENT_NODE
    doc = node;
  } else {
    throw new Error("Invalid node passed to fireEvent: ".concat(node.id));
  }

  if (node.dispatchEvent) {
    var eventClass = 'MouseEvents';
    var event = doc.createEvent(eventClass);
    event.initEvent('click', true, true); // All events created as bubbling and cancelable.

    event.synthetic = true;
    node.dispatchEvent(event, true);
  } else if (node.fireEvent) {
    // IE-old school style, you can drop this if you don't need to support IE8 and lower
    var _event = doc.createEventObject();

    _event.synthetic = true; // allow detection of synthetic events

    node.fireEvent('onclick', _event);
  }
}
/**
 * Check if an element is visible or not
 * @param {HTMLNode} elem Element to check
 * @returns {Boolean}
 */


function isHidden(elem) {
  var width = elem.offsetWidth;
  var height = elem.offsetHeight;
  return width === 0 && height === 0 || window.getComputedStyle(elem).display === 'none';
}
/**
 * Method use to retrieve parents of given element
 * @param {HTMLNode} elem Element which we want parents
 * @param {Strign} sel selector to filter parents (CSS selectors)
 * @returns {Array<HTMLNode>}
 */


function getParents(elem, sel) {
  var result = [];

  for (var p = elem && elem.parentElement; p; p = p.parentElement) {
    if (!sel || p.matches(sel)) {
      result.push(p);
    }
  }

  return result;
}
/**
 * Plugin method
 * @param source: Element
 * @param json: a javascript object
 * @param target: NodeListOf<Element> | Element | { value: String }[] | { value: String }
 * @param opt: an optional options hash
 */


function jsonPathPicker(source, json, target, opt) {
  var options = opt || {};

  if (!source instanceof Element) {
    return 1;
  }

  var targetList = [];

  if (target) {
    if (target.length) {
      targetList = target;
    } else if (target.value) {
      targetList = [target];
    } else {
      return 3;
    }
  } else {
    return 3;
  }

  options.pathQuotesType = options.pathQuotesType !== undefined ? options.pathQuotesType : 'single'; // Transform to HTML

  options.pickerIcon = options.pickerIcon || '#x1f4cb';
  var html = json2html(json, options);
  if (isCollapsable(json)) html = "<a href class=\"json-toggle\"></a>".concat(html); // Insert HTML in target DOM element

  source.innerHTML = html; // Bind click on toggle buttons

  off('click', source);

  function HandlerEventToggle(elm, event) {
    // Change class
    elm.classList.toggle('collapsed'); // Fetch every json-dict and json-array to toggle them

    var subTarget = siblings(elm, 'ul.json-dict, ol.json-array', function (el) {
      el.style.display = el.style.display === '' || el.style.display === 'block' ? 'none' : 'block';
    }); // ForEach subtarget, previous siblings return array so we parse it

    for (var i = 0; i < subTarget.length; i += 1) {
      if (!isHidden(subTarget[i])) {
        // Parse every siblings with '.json-placehoder' and remove them (previous add by else)
        siblings(subTarget[i], '.json-placeholder', function (el) {
          return el.parentNode.removeChild(el);
        });
      } else {
        // count item in object / array
        var childs = subTarget[i].children;
        var count = 0;

        for (var j = 0; j < childs.length; j += 1) {
          if (childs[j].tagName === 'LI') {
            count += 1;
          }
        }

        var placeholder = count + (count > 1 ? ' items' : ' item'); // Append a placeholder

        subTarget[i].insertAdjacentHTML('afterend', "<a href class=\"json-placeholder\">".concat(placeholder, "</a>"));
      }
    } // Prevent propagation


    event.stopPropagation();
    event.preventDefault();
  }

  source.addEventListener('click', function ToggleEventListener(event) {
    var t = event.target;

    while (t && t !== this) {
      if (t.matches('a.json-toggle')) {
        HandlerEventToggle.call(null, t, event);
        event.stopPropagation();
        event.preventDefault();
      }

      t = t.parentNode;
    }
  }); // Simulate click on toggle button when placeholder is clicked

  function SimulateClickHandler(elm, event) {
    siblings(elm, 'a.json-toggle', function (el) {
      return fireClick(el);
    });
    event.stopPropagation();
    event.preventDefault();
  }

  source.addEventListener('click', function SimulateClickEventListener(event) {
    var t = event.target;

    while (t && t !== this) {
      if (t.matches('a.json-placeholder')) {
        SimulateClickHandler.call(null, t, event);
      }

      t = t.parentNode;
    }
  });

  function PickPathHandler(elm) {
    if (targetList.length === 0) {
      return;
    }

    var $parentsList = getParents(elm, 'li').reverse();
    var pathSegments = [];

    for (var i = 0; i < $parentsList.length; i += 1) {
      var key = $parentsList[i].dataset.key;
      var keyType = $parentsList[i].dataset.keyType;

      if (keyType === 'object' && typeof key !== 'number' && options.processKeys && options.keyReplaceRegexPattern !== undefined) {
        var keyReplaceRegex = new RegExp(options.keyReplaceRegexPattern, options.keyReplaceRegexFlags);
        var keyReplacementText = options.keyReplacementText === undefined ? '' : options.keyReplacementText;
        key = key.replace(keyReplaceRegex, keyReplacementText);
      }

      pathSegments.push({
        key: key,
        keyType: keyType
      });
    }

    var quotes = {
      none: '',
      single: '\'',
      "double": '"'
    };
    var quote = quotes[options.pathQuotesType];
    pathSegments = pathSegments.map(function (segment, idx) {
      var isBracketsNotation = options.pathNotation === 'brackets';
      var isKeyForbiddenInDotNotation = !/^\w+$/.test(segment.key) || typeof segment.key === 'number';

      if (segment.keyType === 'array' || segment.isKeyANumber) {
        return "[".concat(segment.key, "]");
      }

      if (isBracketsNotation || isKeyForbiddenInDotNotation) {
        return "[".concat(quote).concat(segment.key).concat(quote, "]");
      }

      if (idx > 0) {
        return ".".concat(segment.key);
      }

      return segment.key;
    });
    var path = pathSegments.join('');

    for (var _i2 = 0; _i2 < targetList.length; _i2 += 1) {
      if (targetList[_i2].value !== undefined) {
        targetList[_i2].value = path;
      }
    }
  }

  source.addEventListener('click', function PickEventListener(event) {
    var t = event.target;

    while (t && t !== this) {
      if (t.matches('.pick-path')) {
        PickPathHandler.call(null, t, event);
      }

      t = t.parentNode;
    }
  });

  if (options.outputCollapsed === true) {
    // Trigger click to collapse all nodes
    var elms = document.querySelectorAll('a.json-toggle');

    for (var i = 0; i < elms.length; i += 1) {
      fireClick(elms[i]);
    }
  }
}
/**
 * Plugin clear method
 * @param source: Element
 */


function clearJsonPathPicker(source) {
  source.removeEventListener('click');
}

var jsonpathPickerVanilla = {
  jsonPathPicker: jsonPathPicker,
  clearJsonPathPicker: clearJsonPathPicker
};
var jsonpathPickerVanilla_1 = jsonpathPickerVanilla.jsonPathPicker;
var jsonpathPickerVanilla_2 = jsonpathPickerVanilla.clearJsonPathPicker;

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
    jsonpathPickerVanilla_1(this.$refs['json-renderer'], this.$props.code, [this.path]);
  },
  watch: {
    code: function code(val) {
      jsonpathPickerVanilla_2(this.$refs['json-renderer']);

      if (val) {
        jsonpathPickerVanilla_1(this.$refs['json-renderer'], this.$props.code, [this.path]);
      }
    }
  },
  destroyed: function destroyed() {
    jsonpathPickerVanilla_2(this.$refs['json-renderer']);
  }
};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier
/* server only */
, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
  if (typeof shadowMode !== 'boolean') {
    createInjectorSSR = createInjector;
    createInjector = shadowMode;
    shadowMode = false;
  } // Vue.extend constructor export interop.


  var options = typeof script === 'function' ? script.options : script; // render functions

  if (template && template.render) {
    options.render = template.render;
    options.staticRenderFns = template.staticRenderFns;
    options._compiled = true; // functional template

    if (isFunctionalTemplate) {
      options.functional = true;
    }
  } // scopedId


  if (scopeId) {
    options._scopeId = scopeId;
  }

  var hook;

  if (moduleIdentifier) {
    // server build
    hook = function hook(context) {
      // 2.3 injection
      context = context || // cached call
      this.$vnode && this.$vnode.ssrContext || // stateful
      this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext; // functional
      // 2.2 with runInNewContext: true

      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__;
      } // inject component styles


      if (style) {
        style.call(this, createInjectorSSR(context));
      } // register component module identifier for async chunk inference


      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier);
      }
    }; // used by ssr in case component is cached and beforeCreate
    // never gets called


    options._ssrRegister = hook;
  } else if (style) {
    hook = shadowMode ? function () {
      style.call(this, createInjectorShadow(this.$root.$options.shadowRoot));
    } : function (context) {
      style.call(this, createInjector(context));
    };
  }

  if (hook) {
    if (options.functional) {
      // register for functional component in vue file
      var originalRender = options.render;

      options.render = function renderWithStyleInjection(h, context) {
        hook.call(context);
        return originalRender(h, context);
      };
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate;
      options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
    }
  }

  return script;
}

var normalizeComponent_1 = normalizeComponent;

var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
function createInjector(context) {
  return function (id, style) {
    return addStyle(id, style);
  };
}
var HEAD = document.head || document.getElementsByTagName('head')[0];
var styles = {};

function addStyle(id, css) {
  var group = isOldIE ? css.media || 'default' : id;
  var style = styles[group] || (styles[group] = {
    ids: new Set(),
    styles: []
  });

  if (!style.ids.has(id)) {
    style.ids.add(id);
    var code = css.source;

    if (css.map) {
      // https://developer.chrome.com/devtools/docs/javascript-debugging
      // this makes source maps inside style tags work properly in Chrome
      code += '\n/*# sourceURL=' + css.map.sources[0] + ' */'; // http://stackoverflow.com/a/26603875

      code += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) + ' */';
    }

    if (!style.element) {
      style.element = document.createElement('style');
      style.element.type = 'text/css';
      if (css.media) style.element.setAttribute('media', css.media);
      HEAD.appendChild(style.element);
    }

    if ('styleSheet' in style.element) {
      style.styles.push(code);
      style.element.styleSheet.cssText = style.styles.filter(Boolean).join('\n');
    } else {
      var index = style.ids.size - 1;
      var textNode = document.createTextNode(code);
      var nodes = style.element.childNodes;
      if (nodes[index]) style.element.removeChild(nodes[index]);
      if (nodes.length) style.element.insertBefore(textNode, nodes[index]);else style.element.appendChild(textNode);
    }
  }
}

var browser = createInjector;

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
  inject("data-v-ef9df3de_0", {
    source: ".json-path-picker[data-v-ef9df3de]{padding:3px 10px}",
    map: undefined,
    media: undefined
  });
};
/* scoped */


var __vue_scope_id__ = "data-v-ef9df3de";
/* module identifier */

var __vue_module_identifier__ = undefined;
/* functional template */

var __vue_is_functional_template__ = false;
/* style inject SSR */

var JSONPathPicker = normalizeComponent_1({
  render: __vue_render__,
  staticRenderFns: __vue_staticRenderFns__
}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, browser, undefined);

var index = {
  install: function install(Vue) {
    // Let's register our component globally
    // https://vuejs.org/v2/guide/components-registration.html
    Vue.component("jsonpath-picker", JSONPathPicker);
  }
};

module.exports = index;
