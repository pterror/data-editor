<script setup lang="ts">
const model = defineModel<Type>({ required: true });
</script>

<script lang="ts">
export interface Type {
  type: "markup.text";
  text: string;
}

export function matches(value: any): value is Type {
  return value?.type === "markup.text" && typeof value.text === "string";
}

export function defaultValue(): Type {
  return { type: "markup.text", text: "" };
}
</script>

<template>
  <span
    class="MarkupTextWidget"
    contenteditable
    @input="
      model = {
        ...model,
        text: ($event.target as HTMLElement).textContent ?? '',
      }
    "
  >
    {{ model.text }}
  </span>
</template>
