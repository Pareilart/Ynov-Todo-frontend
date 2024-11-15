<template>
  <div class="flex-1 bg-gray-50 p-4 rounded-xl border border-gray-200">
    <h3 class="text-lg font-semibold text-gray-700 mb-4 flex items-center">
      <span class="w-3 h-3 rounded-full mr-2" :class="columnColor"></span>
      {{ column.name }}
    </h3>
    <draggable 
      v-model="column.tasks" 
      group="tasks" 
      :move="checkMove" 
      @change="onChange"
      class="min-h-[200px]"
    >
      <TaskComponent
        v-for="task in column.tasks" 
        :key="task.id"
        :task="task"
      />
    </draggable>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Column } from '../../types/todo';
import TaskComponent from './Task.vue';

const props = defineProps<{
  column: Column,
  checkMove: (evt: any) => boolean,
  onChange: (event: any) => void
}>();

const columnColor = computed(() => ({
  'bg-red-500': props.column.name === 'À faire',
  'bg-yellow-500': props.column.name === 'En cours',
  'bg-green-500': props.column.name === 'Terminé',
  'bg-gray-500': props.column.name === 'Archivé'
}));
</script> 