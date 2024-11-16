<template>
  <div class="flex flex-col lg:flex-row gap-6">
    <ColumnComponent
      v-for="column in columns" 
      :key="column.name"
      :column="column"
      :check-move="checkMove"
      :on-change="(event) => onChange(column.name, event)" 
    />
  </div>
</template>

<script setup lang="ts">
import type { Column } from '@/types/todo';
import ColumnComponent from './Column.vue';
import { useKanbanStore } from '@/stores/kanban-todo';
import { TODO_STATUS } from '@/types/todo';
import { useToast } from '@/composable/useToast';

const kanbanStore = useKanbanStore();
const { showToast } = useToast();
// Définir la prop columns
defineProps<{
  columns: Column[]
}>();

const checkMove = (evt: any): boolean => {
  return true;
};

// Fonction de gestion du changement de statut
const onChange = async (columnName: string, event: any): Promise<void> => {
  try {
    if (event.added) {
      await kanbanStore.updateStatus(event.added.element.id, columnName as TODO_STATUS);
      showToast(`Tâche déplacée dans "${columnName}"`, 'success');
    }
  } catch (error) {
    console.error("Erreur lors du changement de statut :", error);
  }
};
</script>
