<template>
  <div class="max-w-6xl mx-auto p-6">
    <h1 class="text-3xl font-bold text-gray-800 mb-8 text-center">Gestionnaire de Tâches</h1>

    <!-- Formulaire de création -->
    <div class="mb-8 p-6 bg-white rounded-xl">
      <div class="flex flex-col sm:flex-row gap-4">
        <input 
          v-model="newTask" 
          type="text" 
          placeholder="Nouvelle tâche" 
          class="flex-1 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        >
        <select 
          v-model="selectedColumn" 
          class="p-3 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        >
          <option value="" disabled selected>Sélectionner une colonne</option>
          <option v-for="column in kanbanStore.columns" :key="column.name" :value="column">
            {{ column.name }}
          </option>
        </select>
        <button @click="addTask" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 flex items-center justify-center">
          <span class="mr-2">Ajouter</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>

    <KanbanComponent 
      :columns="kanbanStore.columns" 
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { Column } from '@/types/todo';
import KanbanComponent from '@/components/Kanban/Kanban.vue'
import { useKanbanStore } from '@/stores/kanban-todo'

const kanbanStore = useKanbanStore()
const newTask = ref<string>('');
const selectedColumn = ref<Column | null>(null);

const addTask = (): void => {
  if (!newTask.value.trim() || !selectedColumn.value) return;
  kanbanStore.addTask(selectedColumn.value.name, newTask.value);
  newTask.value = '';
};
</script>