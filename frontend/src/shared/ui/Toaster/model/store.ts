import type { Toast } from "./types";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useToaster = defineStore("toaster", () => {
  const toasts = ref<Toast[]>([]);

  const addToast = (toast: Toast) => {
    toasts.value.push(toast);

    setTimeout(() => {
      toasts.value.shift();
    }, 5000);
  };

  return { toasts, addToast };
});
