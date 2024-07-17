<script setup lang="ts">
const model = defineModel<Type>({ required: true });
</script>

<script lang="ts">
export type Type = string;

export function matches(value: unknown): value is Type {
  return typeof value === "string";
}

export function defaultValue(): Type {
  return "";
}
</script>

<template>
  <input class="TextInputWidget" type="text" v-model="model" />
</template>

<style scoped>
.TextInputWidget {
  width: 64px;
  background: lch(100% 0 0 / 0.075);
  text-align: center;
  border: none;
  border-radius: 4px;
  padding: 4px;
}
</style>
