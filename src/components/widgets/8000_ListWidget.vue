<script setup lang="ts">
import Widget from "@/components/Widget.vue";
import { removeDragImage } from "@/util/drag";
import { ref } from "vue";

const DRAG_HANDLE_HORIZONTAL_OFFSET = -10;

const model = defineModel<Type>({ required: true });

interface DragInfo {
  index: number;
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
    const draggedItem = model.value[dragIndex];
    model.value.splice(dragIndex, 1);
    model.value.splice(dragIndex + 1, 0, draggedItem);
    dragInfo.value.index += 1;
    return;
  }
  const prevSibling = dragInfo.value.element.previousElementSibling;
  if (prevSibling && event.clientY <= verticalCenter(prevSibling)) {
    const draggedItem = model.value[dragIndex];
    model.value.splice(dragIndex, 1);
    model.value.splice(dragIndex - 1, 0, draggedItem);
    dragInfo.value.index -= 1;
    return;
  }
}

function onDragStart(event: DragEvent, i: number) {
  dragInfo.value = { index: i, x: 0, y: 0, element: null!, height: 0 };
  updateDragPosition(event);
  event.dataTransfer?.setData(
    "application/json",
    JSON.stringify(model.value[i])
  );
  removeDragImage(event);
}

function onDragEnd() {
  dragInfo.value = undefined;
}
</script>

<script lang="ts">
export type Type = unknown[];

export function matches(value: unknown): value is Type {
  return Array.isArray(value);
}

export function defaultValue(): Type {
  return [];
}
</script>

<template>
  <div class="ListWidget">
    <span class="title">list</span>
    <ol>
      <li
        v-for="(item, i) in model"
        :ref="el => i === dragInfo?.index && (dragInfo.element = el as HTMLElement, dragInfo.height = (el as HTMLElement).getBoundingClientRect().height)"
        :class="{ dragging: i === dragInfo?.index }"
        draggable="true"
        @drag.stop="onDrag"
        @dragover.stop="onDrag"
        @dragstart.stop="onDragStart($event, i)"
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
        <Widget :model-value="item" @update:model-value="model[i] = $event" />
      </li>
    </ol>
    <!-- FIXME: styling, also consider the UX of adding a new widget. -->
    <!-- TODO: be able to change widget types, for any subtree, at all times, on the fly -->
    <button type="button" @click="model.push(null)">+</button>
    <div class="drop-area"></div>
    <Teleport v-if="dragInfo" to="body">
      <div
        class="dragged-item"
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
        <Widget :model-value="model[dragInfo.index]" />
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.ListWidget {
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

li {
  display: flex;
  pointer-events: none;
}

li > * {
  pointer-events: auto;
}

button {
  background: lch(100% 0 0 / 0.1);
  border-radius: 4px;
  width: 16px;
  height: 16px;
  transition-property: background-color;
}

button:hover {
  background: lch(100% 0 0 / 0.2);
}

.drop-area {
  height: 16px;
  border-radius: 4px;
  border: 2px dashed lch(100% 0 0 / 0.2);
  margin-top: 4px;
  background-clip: padding-box;
  transition-property: background-color;
}

.drop-area:hover {
  background: lch(100% 0 0 / 0.1);
}

.dragging {
  opacity: 50%;
}

.drag-handle {
  display: flex;
  align-items: center;
  cursor: grab;
  margin-right: 4px;
}

.dragged-item {
  display: flex;
  align-items: center;
  position: fixed;
  pointer-events: none;
  background: lch(100% 0 0 / 0.1);
  padding: 4px;
  border-radius: 4px;
}
</style>
