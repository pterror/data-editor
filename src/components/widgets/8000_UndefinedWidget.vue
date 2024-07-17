<script setup lang="ts">
defineModel<Type>({ required: true });

// FIXME: styling
</script>

<script lang="ts">
export type Type = undefined;

export function matches(value: unknown): value is Type {
  return value === undefined;
}

export function defaultValue(): Type {
  return undefined;
}
</script>

<template>
  <div class="UndefinedWidget">__</div>
</template>

<style scoped>
.UndefinedWidget {
  display: block;
}
</style>
