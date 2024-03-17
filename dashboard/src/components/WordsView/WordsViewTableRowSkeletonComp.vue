<script lang="ts">
import { defineComponent } from "vue";
import TableRowComp from "@/components/Table/TableRowComp.vue";
import SkeletonItemComp from "@/components/SkeletonItemComp.vue";

export default defineComponent({
  name: "WordsViewTableRowSkeletonComp",
  components: {
    TableRowComp,
    SkeletonItemComp,
  },

  props: {
    rows: {
      type: Number,
      required: true,
    },
    gridTemplateColumns: {
      type: String,
      required: true,
    },
    centralColumnsCount: {
      type: Number,
      required: true,
    },
  },
});
</script>

<template>
  <TableRowComp
    v-for="row in rows"
    :key="row"
    :grid-template-columns="gridTemplateColumns"
  >
    <td />

    <td>
      <SkeletonItemComp width="40px" height="40px" border-radius="8px" />
    </td>

    <td v-for="col in centralColumnsCount" :key="`${row}-${col}`">
      <SkeletonItemComp height="20px" random-width border-radius="4px" />
    </td>

    <td>
      <SkeletonItemComp height="20px" random-width border-radius="4px" />
    </td>
  </TableRowComp>
</template>
