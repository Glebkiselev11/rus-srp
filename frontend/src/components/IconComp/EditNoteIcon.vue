<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "EditNoteIcon",
  props: {
    size: {
      type: String,
      required: true,
    },
  },
});
</script>

<template>
  <svg :width="size" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 19.5V18.0208L16.5 13.5208L17.9792 15L13.4792 19.5H12ZM4.5 15.125V13.875H10.75V15.125H4.5ZM18.875 14.1042L17.3958 12.625L18 12.0208C18.1111 11.9097 18.2569 11.8542 18.4375 11.8542C18.6181 11.8542 18.7639 11.9097 18.875 12.0208L19.4792 12.625C19.5903 12.7361 19.6458 12.8819 19.6458 13.0625C19.6458 13.2431 19.5903 13.3889 19.4792 13.5L18.875 14.1042ZM4.5 11.6875V10.4375H14.2917V11.6875H4.5ZM4.5 8.25V7H14.2917V8.25H4.5Z"
    />
  </svg>
</template>
