<script setup lang="ts">
const model = defineModel<Type>({ required: true });
</script>

<script lang="ts">
export type Type = boolean;

export function matches(value: unknown): value is Type {
  return typeof value === "boolean";
}

export function defaultValue(): Type {
  return false;
}
</script>

<template>
  <input type="checkbox" class="CheckboxInputWidget" v-model="model" />
</template>
