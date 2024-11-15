<template>
  <div 
    class="bg-white p-4 mb-3 rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-200 cursor-pointer flex items-center gap-3"
    :class="{
      'border-gray-100': !task.completed,
      'border-green-200 bg-green-50': task.completed
    }"
  >
    <input
      type="checkbox"
      :checked="task.completed"
      @change="handleTaskToggle"
      class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
    >
    <span :class="{ 'line-through text-gray-500': task.completed }">
      {{ task.name }}
    </span>
    <button 
      @click.stop="handleTaskDelete"
      class="ml-auto text-red-500 hover:text-red-700"
    >
      <span class="sr-only">Supprimer</span>
      <font-awesome-icon icon="fa-solid fa-trash" />
    </button>
  </div>
</template>

<script setup lang="ts">
import type { Task } from '@/types/todo';
import { useKanbanStore } from '@/stores/kanban-todo';
import { useToast } from '@/composable/useToast';

const kanbanStore = useKanbanStore();
const { showToast } = useToast();

const props = defineProps<{
  task: Task
}>();

const handleTaskToggle = () => {
  kanbanStore.toggleTaskComplete(props.task.id);
  showToast(
    props.task.completed ? 'Tâche marquée comme non terminée' : 'Tâche marquée comme terminée',
    'success'
  );
};

const handleTaskDelete = () => {
  kanbanStore.deleteTask(props.task.id);
  showToast('Tâche supprimée', 'warning');
};
</script> 