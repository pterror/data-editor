<script setup lang="ts">
import Widget from "@/components/Widget.vue";

const model = defineModel<Type>({ required: true });
// TODO: disable ctrl+b/cmd+b here and in the italic widget
</script>

<script lang="ts">
export interface Type {
  type: "markup.bold";
  value: unknown;
}

export function matches(value: any): value is Type {
  return value?.type === "markup.bold" && "value" in value;
}

export function defaultValue(): Type {
  return { type: "markup.bold", value: { type: "markup.text", text: "" } };
}
</script>

<template>
  <b class="MarkupBoldWidget">
    <Widget
      :model-value="model.value"
      @update:model-value="model = { ...model, value: $event }"
    />
  </b>
</template>
