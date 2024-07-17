import { reactive, type defineComponent } from "vue";

export type WidgetRenderer = ReturnType<
  typeof defineComponent<
    { modelValue: unknown },
    { "update:modelValue": (modelValue: unknown) => void }
  >
>;

export interface WidgetModule<Type = unknown> {
  default: WidgetRenderer;
  matches: (value: unknown) => value is Type;
  defaultValue: () => Type;
}

export type WidgetRegistry = WidgetModule[];

export const allWidgetModules: WidgetModule[] = reactive([]);

export function registerWidget(module: WidgetModule) {
  allWidgetModules.push(module);
}

export function getWidget(value: unknown) {
  for (const widgetModule of allWidgetModules) {
    if (widgetModule.matches(value)) {
      return widgetModule.default;
    }
  }
}
