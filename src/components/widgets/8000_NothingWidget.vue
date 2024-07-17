<script setup lang="ts">
defineModel<null>({ required: true });

// FIXME: styling
</script>

<script lang="ts">
export type Type = null;

export function matches(value: unknown): value is Type {
  return value === null;
}

export function defaultValue(): Type {
  return null;
}
</script>

<template>
  <div class="NothingWidget">_</div>
</template>

<style scoped>
.NothingWidget {
  display: block;
}
</style>
