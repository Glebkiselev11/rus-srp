import type { Toast } from "@/types/toast";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useToasterStore = defineStore("toaster", () => {
  const toasts = ref<Toast[]>([]);

  const addToast = (toast: Toast) => {
    toasts.value.push(toast);

    setTimeout(() => {
      toasts.value.shift();
    }, 5000);
  };

  return { toasts, addToast };
});
