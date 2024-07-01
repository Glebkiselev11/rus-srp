<script setup lang="ts">
import TableRowComp from "@/components/Table/TableRowComp.vue";
import { SkeletonItemComp } from "@/shared/ui/SkeletonItem";

const props = defineProps<{
  rows: number;
  gridTemplateColumns: string;
  centralColumnsCount: number;
}>();
</script>

<template>
  <TableRowComp
    v-for="row in props.rows"
    :key="row"
    :grid-template-columns="props.gridTemplateColumns"
  >
    <td />

    <td>
      <SkeletonItemComp width="40px" height="40px" border-radius="8px" />
    </td>

    <td v-for="col in props.centralColumnsCount" :key="`${row}-${col}`">
      <SkeletonItemComp height="20px" random-width border-radius="4px" />
    </td>

    <td>
      <SkeletonItemComp height="20px" random-width border-radius="4px" />
    </td>
  </TableRowComp>
</template>
