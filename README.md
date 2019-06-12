[![npm version](https://badge.fury.io/js/vue-jsonpath-picker.svg)](https://badge.fury.io/js/vue-jsonpath-picker)

# Vue JSON Picker

**Vue JSON Picker** is an adaptation of the [jsonpath-picker-vanilly](https://github.com/ryshu/vue-jsonpath-picker) lib.
This plugin provide you the **jsonpath-picker** component which allow you to render JSON Object into HTML and let your user pick [JSONPath](http://goessner.net/articles/JsonPath/) from this view.

An [online tool](https://ryshu.github.io/jsonpath-picker/) is available to test used lib.

## Features

- Syntax highlighting
- Collapsible and expandable child nodes
- Clickable links
- Easily readable and minimal DOM structure
- Path picking

## Plugin Installation

Load the npm package

```sh
npm i --save vue-jsonpath-picker
```

And register in vue the plugins

``` javascript
import JSONPathPicker from 'vue-jsonpath-picker';
import Vue from 'vue';

Vue.use(JSONPathPicker);
```

## Usage

``` html
<json-pathpicker :code="JSON Object" v-on:path="pathChangeHandler" />
```

## Contributing

Feel free to post feature requests, create pull requests or report bugs.

## Credits

**JSON path picker** is based on [jQuery json-path picker](https://github.com/piotros/json-path-picker) plugin.
Big thanks to [Piotr 'piotros' Baran](https://github.com/piotros) for creating an awesome project!
