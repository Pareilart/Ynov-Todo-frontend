<template>
  <div class="flex flex-col lg:flex-row gap-6">
    <ColumnComponent
      v-for="column in columns" 
      :key="column.name"
      :column="column"
      :check-move="checkMove"
      :on-change="onChange"
    />
  </div>
</template>

<script setup lang="ts">
import type { Column } from '@/types/todo';
import ColumnComponent from './Column.vue';

// Définir la prop columns
defineProps<{
  columns: Column[]
}>();

const checkMove = (evt: any): boolean => {
  return true;
};

const onChange = (event: any): void => {
  console.log('Changement détecté :', event);
};
</script> 