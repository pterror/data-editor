<script setup lang="ts">
const model = defineModel<Type>({ required: true });
</script>

<script lang="ts">
export type Type = number;

export function matches(value: unknown): value is Type {
  return typeof value === "number";
}

export function defaultValue(): Type {
  return 0;
}
</script>

<template>
  <input class="NumberInputWidget" type="number" v-model="model" />
</template>

<style scoped>
.NumberInputWidget {
  width: 64px;
  background: lch(100% 0 0 / 0.075);
  text-align: center;
  border: none;
  border-radius: 4px;
  padding: 4px;
}

.NumberInputWidget {
  appearance: none;
  -moz-appearance: textfield;
}

.NumberInputWidget:hover {
  background: lch(100% 0 0 / 0.125);
}

.NumberInputWidget::-webkit-outer-spin-button,
.NumberInputWidget::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
