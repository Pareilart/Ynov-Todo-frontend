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
      @change="handleChange"
      class="min-h-[200px]"
    >
      <div v-show="column.tasks.length > 0">
        <TaskComponent
          v-for="task in column.tasks" 
          :key="task.id"
          :task="task"
        />
      </div>
      <div v-show="column.tasks.length <= 0">
        <div class="flex justify-center items-center h-full">
          <p class="text-gray-500">Aucune tâche</p>
        </div>
      </div>
    </draggable>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Column } from '../../types/todo';
import TaskComponent from './Task.vue';
import { useToast } from '../../composable/useToast';
import { useKanbanStore } from '@/stores/kanban-todo';
import { TODO_STATUS } from '@/types/todo';

const kanbanStore = useKanbanStore();

const props = defineProps<{
  column: Column,
  checkMove: (evt: any) => boolean,
  onChange: (event: any) => void
}>();

const { showToast } = useToast();

const columnColor = computed(() => ({
  'bg-red-500': props.column.name === 'EN_ATTENTE',
  'bg-yellow-500': props.column.name === 'EN_COURS',
  'bg-green-500': props.column.name === 'TERMINEE',
  'bg-gray-500': props.column.name === 'ARCHIVEE'
}));

const handleChange = async (event: any) => {
  try {
    console.log(props.column.name)
    if (event.added) {
      await kanbanStore.updateStatus(event.added.element.id, props.column.name as TODO_STATUS);
      showToast(`Tâche déplacée dans "${props.column.name}"`, 'success');
    }
  } catch (error) {
    console.error("Erreur lors du changement de statut :", error);
  }
};
</script> 