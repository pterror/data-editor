<script setup lang="ts">
import Widget from "@/components/Widget.vue";
import { allWidgetModules } from "@/components/Widget/widgets";
import { ref } from "vue";

// const model = ref<unknown>({ number: 1, text: "some text", truth: false });
const model = ref<unknown>([
  {
    type: "markup.group",
    children: [
      { type: "markup.text", text: "aaa" },
      { type: "markup.bold", value: { type: "markup.text", text: "bbb" } },
      { type: "markup.italic", value: { type: "markup.text", text: "ccc" } },
      {
        type: "markup.bold",
        value: {
          type: "markup.italic",
          value: { type: "markup.text", text: "ddd" },
        },
      },
    ],
  },
  false,
  true,
  1,
  "a",
  { foo: "a", bar: false, baz: [1, 2, null, true] },
]);
</script>

<template>
  <div class="Editor">
    <div class="editor">
      <div class="input">
        <Widget v-model="model" />
      </div>
      <div class="blank-widgets">
        <component
          v-for="module_ in allWidgetModules"
          draggable="true"
          :is="module_.default"
          :model-value="module_.defaultValue()"
        />
      </div>
    </div>
    <div class="output">
      <div>
        <h3>json</h3>
        <pre><code>{{ model }}</code></pre>
      </div>
    </div>
  </div>
</template>

<style scoped>
.Editor {
  height: 100%;
  display: flex;
  /* temporary */
  flex-flow: column;
  padding: 8px;
  gap: 16px;
}

summary {
  cursor: pointer;
  user-select: none;
}

h3 {
  font-size: 100%;
  font-weight: normal;
  padding: 0 8px;
}

.editor,
.input,
.output,
.output > * {
  flex: 1 0 0;
}

.editor {
  display: flex;
}

.blank-widgets {
  display: flex;
  flex-flow: column;
  gap: 4px;
}

.input {
  display: grid;
  place-items: center;
}

.output {
  display: flex;
  flex-flow: column;
}
</style>
