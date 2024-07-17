<script setup lang="ts">
import { getWidget } from "@/components/Widget/widgets";

const model = defineModel<unknown>({ required: true });
</script>

<template>
  <component :is="getWidget(model)" v-model="model" />
</template>

<style scoped></style>
