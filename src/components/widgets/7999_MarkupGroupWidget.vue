<script setup lang="ts">
import Widget from "@/components/Widget.vue";

const model = defineModel<Type>({ required: true });

function normalize(start: number) {
  let child: any = model.value.children[start];
  if (child?.type === "markup.text" && typeof child.text === "string") {
    let prevChild: any = model.value.children[start - 1];
    while (
      prevChild?.type === "markup.text" &&
      typeof prevChild.text === "string"
    ) {
      start -= 1;
      child = prevChild;
      prevChild = model.value.children[start - 1];
    }
    let count = 0;
    let newText = child.text;
    while (true) {
      const nextChild: any = model.value.children[start + count + 1];
      if (
        nextChild?.type !== "markup.text" ||
        typeof nextChild.text !== "string"
      ) {
        break;
      }
      newText += nextChild.text;
      count += 1;
    }
    child.text = newText;
    // TODO: calculate and restore cursor. ideally handle selections too
    model.value.children.splice(start + 1, count);
  }
}
</script>

<script lang="ts">
export interface Type {
  type: "markup.group";
  children: unknown[];
}

export function matches(value: any): value is Type {
  return value?.type === "markup.group" && Array.isArray(value.children);
}

export function defaultValue(): Type {
  return { type: "markup.group", children: [] };
}
</script>

<template>
  <div class="MarkupRootWidget">
    <Widget
      v-for="(child, i) in model.children"
      :model-value="child"
      @update:model-value="(model.children[i] = $event), normalize(i)"
    />
  </div>
</template>
