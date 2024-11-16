<template>
  <AuthLayout title="Tableau de bord">
    <!-- Formulaire de création -->
    <div class="mb-8 p-6 bg-white rounded-xl shadow-sm">
      <div class="flex flex-col sm:flex-row gap-4">
        <input v-model="newTask" type="text" placeholder="Nouvelle tâche"
          class="flex-1 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none">
        <select v-model="selectedColumn"
          class="p-3 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none">
          <option value="" disabled selected>Sélectionner une colonne</option>
          <option v-for="column in kanbanStore.columns" :key="column.name" :value="column">
            {{ column.name }}
          </option>
        </select>
        <button @click="addTask"
          class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 flex items-center justify-center">
          <span class="mr-2">Ajouter</span>
          <font-awesome-icon icon="fa-solid fa-plus" />
        </button>
      </div>
    </div>

    <!-- Kanban board -->
    <div class="bg-white rounded-xl shadow-sm p-6">
      <KanbanComponent :columns="kanbanStore.columns" />
    </div>
  </AuthLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Column } from '@/types/todo';
import KanbanComponent from '@/components/Kanban/Kanban.vue'
import { useKanbanStore } from '@/stores/kanban-todo'
import { useToast } from '@/composable/useToast'
import AuthLayout from '@/layouts/AuthLayout.vue'

const kanbanStore = useKanbanStore()
const { showToast } = useToast()
const newTask = ref<string>('');
const selectedColumn = ref<Column | null>(null);

const addTask = async (): Promise<void> => {
  if (!newTask.value.trim() || !selectedColumn.value) {
    showToast('Veuillez remplir tous les champs', 'error');
    return;
  }
  const result = await kanbanStore.apiPostCreateTodo({
    title: newTask.value,
    status: selectedColumn.value.name,
  })
  if (result) {
    showToast('Tâche ajoutée avec succès', 'success');
    newTask.value = '';
  } else {
    showToast('Erreur lors de l\'ajout de la tâche', 'error');
  }
};

onMounted(async () => {
  try {
    const tasks = await kanbanStore.fetchTodos()
    if (tasks && tasks.length > 0) {
      tasks.forEach(task => {
        kanbanStore.addTask(task.status, {
          id: task.id,
          title: task.title,
          status: task.status,
          completed: task.completed,
          createdAt: task.createdAt,
          userId: task.userId
        })
      })
    }
  } catch (error) {
    showToast('Erreur lors du chargement des tâches', 'error')
  }
})
</script>