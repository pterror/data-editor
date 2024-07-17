<script setup lang="ts">
import Widget from "@/components/Widget.vue";
import { removeDragImage } from "@/util/drag";
import { ref } from "vue";

const DRAG_HANDLE_HORIZONTAL_OFFSET = -10;

const model = defineModel<Type>({ required: true });

const newKey = ref<string>();

interface DragInfo {
  index: number;
  key: string;
  x: number;
  y: number;
  element: HTMLElement;
  height: number;
}

const dragInfo = ref<DragInfo>();

function updateDragPosition(event: DragEvent) {
  if (!dragInfo.value) return;
  dragInfo.value.x = event.clientX;
  dragInfo.value.y = event.clientY;
}

function verticalCenter(element: Element) {
  const rect = element.getBoundingClientRect();
  return rect.top + rect.height / 2;
}

function onDrag(event: DragEvent) {
  if (event.clientY < 0 || !dragInfo.value) return;
  if (event.clientX === 0 && event.clientY === 0) return;
  const dragIndex = dragInfo.value.index;
  updateDragPosition(event);
  const nextSibling = dragInfo.value.element.nextElementSibling;
  if (nextSibling && event.clientY >= verticalCenter(nextSibling)) {
    const entries = Object.entries(model.value);
    const draggedItem = entries[dragIndex];
    entries.splice(dragIndex, 1);
    entries.splice(dragIndex + 1, 0, draggedItem);
    model.value = Object.fromEntries(entries);
    dragInfo.value.index += 1;
    return;
  }
  const prevSibling = dragInfo.value.element.previousElementSibling;
  if (prevSibling && event.clientY <= verticalCenter(prevSibling)) {
    const entries = Object.entries(model.value);
    const draggedItem = entries[dragIndex];
    entries.splice(dragIndex, 1);
    entries.splice(dragIndex - 1, 0, draggedItem);
    model.value = Object.fromEntries(entries);
    dragInfo.value.index -= 1;
    return;
  }
}

function onDragStart(event: DragEvent, i: number, k: string) {
  dragInfo.value = { index: i, key: k, x: 0, y: 0, element: null!, height: 0 };
  updateDragPosition(event);
  event.dataTransfer?.setData(
    "application/json",
    JSON.stringify(model.value[k])
  );
  removeDragImage(event);
}

function onDragEnd() {
  dragInfo.value = undefined;
}

// FIXME: dragging the empty space makes the parent's drag trigger
</script>

<script lang="ts">
export interface Type extends Record<string, unknown> {}

export function matches(value: unknown): value is Type {
  return typeof value === "object" && value != null && !Array.isArray(value);
}

export function defaultValue(): Type {
  return {};
}
</script>

<template>
  <!-- TODO: convenient struct editor. -->
  <div class="StructWidget">
    <span class="title">struct</span>
    <ol>
      <li
        v-for="([k, item], i) in Object.entries(model)"
        :ref="el => k === dragInfo?.key && (dragInfo.element = el as HTMLElement, dragInfo.height = (el as HTMLElement).getBoundingClientRect().height)"
        class="item"
        :class="{ dragging: k === dragInfo?.key }"
        draggable="true"
        @drag.stop="onDrag"
        @dragover.stop="onDrag"
        @dragstart.stop="onDragStart($event, i, k)"
        @dragend.stop="onDragEnd"
      >
        <div class="drag-handle">
          <svg viewBox="0 0 1 1" height="16" width="16">
            <path
              d="M.2.35L.8.35ZM.2.65L.8.65"
              stroke="lch(100 0 0 / 0.2)"
              stroke-width="0.15"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        {{ k }}:&nbsp;
        <Widget :model-value="item" @update:model-value="model[k] = $event" />
      </li>
    </ol>
    <form class="new-key-form" @submit.prevent>
      <button
        type="button"
        :disabled="newKey == null || newKey in model"
        :title="
          newKey != null && newKey in model
            ? 'this struct already has a key named \'' + newKey + '\''
            : undefined
        "
        @click="newKey && (model[newKey] = null)"
      >
        +
      </button>
      <div><input type="text" class="new-key" v-model="newKey" />:</div>
    </form>
    <Teleport v-if="dragInfo" to="body">
      <div
        class="item dragged-item"
        :style="{
          left: `${dragInfo.x + DRAG_HANDLE_HORIZONTAL_OFFSET}px`,
          top: `${dragInfo.y - dragInfo.height / 2}px`,
        }"
      >
        <svg class="drag-handle" viewBox="0 0 1 1" height="16" width="16">
          <path
            d="M.3.35L.7.35ZM.3.65L.7.65"
            stroke="lch(100 0 0 / 0.2)"
            stroke-width="0.15"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        {{ dragInfo.key }}:&nbsp;
        <Widget :model-value="model[dragInfo.key]" />
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.StructWidget {
  display: flex;
  flex-flow: column;
  background: lch(100% 0 0 / 0.1);
  border-radius: 4px;
  padding: 4px;
}

.title {
  font-size: 66.6666%;
}

ol {
  display: flex;
  flex-flow: column;
  margin-block: 0;
  margin-inline: 0;
  padding-inline: 0;
  list-style-type: none;
  gap: 4px;
}

.item {
  display: flex;
  align-items: center;
  pointer-events: none;
}

.item > * {
  pointer-events: auto;
}

button {
  background: lch(100% 0 0 / 0.1);
  border-radius: 4px;
  width: 16px;
  height: 16px;
  transition-property: background-color;
}

button:not(:disabled):hover {
  background: lch(100% 0 0 / 0.2);
}

.dragging {
  opacity: 50%;
}

.drag-handle {
  align-self: stretch;
  display: flex;
  align-items: center;
  cursor: grab;
  margin-right: 4px;
}

.dragged-item {
  display: flex;
  position: fixed;
  pointer-events: none;
  background: lch(100% 0 0 / 0.1);
  padding: 4px;
  border-radius: 4px;
}

.new-key-form {
  display: flex;
  align-items: center;
  gap: 4px;
}

.new-key {
  width: 64px;
  background: lch(100% 0 0 / 0.075);
  text-align: center;
  border: none;
  border-radius: 4px;
  padding: 4px;
}
</style>
