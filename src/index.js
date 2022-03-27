import JSONPathPicker from "./JSONPathPicker.vue";

import 'jsonpath-picker-vanilla/lib/jsonpath-picker.min.css';

export const config = {
    install(Vue) {
        // Let's register our component globally
        // https://vuejs.org/v2/guide/components-registration.html
        Vue.component("jsonpath-picker", JSONPathPicker);
    }
}

export default config;
