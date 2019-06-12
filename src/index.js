import JSONPathPicker from "./JSONPathPicker.vue";

export default {
 install(Vue) {
  // Let's register our component globally
  // https://vuejs.org/v2/guide/components-registration.html
  Vue.component("jsonpath-picker", JSONPathPicker);
 }
};