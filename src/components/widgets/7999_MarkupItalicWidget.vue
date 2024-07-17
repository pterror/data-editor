<script setup lang="ts">
import Widget from "@/components/Widget.vue";

const model = defineModel<Type>({ required: true });
</script>

<script lang="ts">
export interface Type {
  type: "markup.italic";
  value: unknown;
}

export function matches(value: any): value is Type {
  return value?.type === "markup.italic" && "value" in value;
}

export function defaultValue(): Type {
  return { type: "markup.italic", value: { type: "markup.text", text: "" } };
}

// NOTE: oblique and custom slant angles intentionally omitted
</script>

<template>
  <i class="MarkupItalicWidget">
    <Widget
      :model-value="model.value"
      @update:model-value="model = { ...model, value: $event }"
    />
  </i>
</template>
