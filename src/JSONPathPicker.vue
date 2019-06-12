<template>
    <div class="json-path-picker" @click="pickPath">
        <pre ref="json-renderer" class="json-tree"></pre>

        <input class="path" type="hidden" id="path" v-model="clickedPath" @change="$emit('path', clickedPath)">
    </div>
</template>

<script>
import { jsonPathPicker, clearJsonPathPicker } from 'jsonpath-picker-vanilla'

export default {
    name: 'JSONPathPicker',
    data() {
        return {
            clickedPath: '',
            path: { value: ''},
        }
    },
    props: {
        code: {
            type: Object,
            default() {
                return {
                    sample: "This is a sample"
                }
            }
        }
    },
    methods: {
        pickPath(ev) {
            // Check if ev target is the pick-path
            if(ev.target && ev.target.classList.contains('pick-path')) {
                this.$emit('path', this.path.value);
            }
        }
    },
    mounted() {
        // Render jpPicker
        if (this.$refs['json-renderer']) {
            jsonPathPicker(this.$refs['json-renderer'], this.$props.code, [this.path]);
        }
    },
    watch: {
        code: function(val) {
            if (this.$refs['json-renderer']) {
                clearJsonPathPicker(this.$refs['json-renderer']);
                if (val) {
                    jsonPathPicker(this.$refs['json-renderer'], this.$props.code, [this.path]);
                }
            }
        }
    },
    destroyed() {
        if (this.$refs['json-renderer']) {
            clearJsonPathPicker(this.$refs['json-renderer']);
        }
    },
}
</script>

<style lang="scss" scoped>

.json-path-picker {
    padding: 3px 10px;
}

</style>

