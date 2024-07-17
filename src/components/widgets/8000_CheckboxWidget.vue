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
  <label class="CheckboxWidget">
    <input type="checkbox" v-model="model" />
    <svg class="tick" viewBox="0 0 1 1">
      <path
        d="M0.2 0.575L0.35 0.725 0.8 0.275"
        fill="none"
        stroke="white"
        stroke-linejoin="round"
        stroke-linecap="round"
      />
    </svg>
  </label>
</template>

<style scoped>
.CheckboxWidget {
  position: relative;
  display: block;
  background: lch(100% 0 0 / 0.1);
  width: 16px;
  height: 16px;
  border-radius: 4px;
  cursor: pointer;
  transition-property: background-color;
}

.tick {
  position: absolute;
  top: 0;
  stroke-width: 0;
  height: 100%;
  width: 100%;
  transition-property: stroke-width;
}

.CheckboxWidget:hover {
  background: lch(100% 0 0 / 0.2);
}

.CheckboxWidget:has(:checked) {
  background: lch(50% 30 240);
}

.CheckboxWidget:has(:checked) .tick {
  stroke-width: 0.15px;
}

input {
  display: none;
}
</style>
