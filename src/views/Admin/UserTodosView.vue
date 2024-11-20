<template>
    <AuthLayout title="Liste des utilisateurs">
        <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
                <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titre</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Complétée</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date de création</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="task in tasks" :key="task.id">
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ task.id }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ task.title }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <span :class="{
                            'px-2 py-1 text-xs font-medium rounded-full': true,
                            'bg-yellow-100 text-yellow-800': task.status === 'EN_ATTENTE',
                            'bg-gray-100 text-gray-800': task.status === 'ARCHIVEE'
                        }">
                            {{ task.status }}
                        </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span :class="{
                            'px-2 py-1 text-xs font-medium rounded-full': true,
                            'bg-green-100 text-green-800': task.completed,
                            'bg-red-100 text-red-800': !task.completed
                        }">
                            {{ task.completed ? 'Oui' : 'Non' }}
                        </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {{ new Date(task.createdAt).toLocaleDateString('fr-FR') }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <button 
                            v-if="canDeleteTask"
                            @click="handleTaskDelete(task.id)"
                            class="text-red-500 hover:text-red-700"
                        >
                            <span class="sr-only">Supprimer</span>
                            <font-awesome-icon icon="fa-solid fa-trash" />
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
    </AuthLayout>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import AuthLayout from '@/layouts/AuthLayout.vue'
import { useApiAdminUser } from '@/api/apiAdminUser'
import type { Task } from '@/types/todo'
import { useAuthStore } from '@/stores/auth'
import { useApiTodo } from '@/api/apiTodo'
import { useToast } from '@/composable/useToast'

const route = useRoute()
const userId = parseInt(route.params.userId as string)

const { fetchUserTodos } = useApiAdminUser()
const tasks = ref<Task[]>([])

const authStore = useAuthStore()
const { showToast } = useToast()

const canDeleteTask = computed(() => {
    return authStore.hasPermission('delete:todos') && authStore.hasRole('ADMIN')
})

const { deleteTodo } = useApiTodo()

const handleTaskDelete = async (taskId: number) => {
    try {
        await deleteTodo(taskId)
        tasks.value = tasks.value.filter(task => task.id !== taskId)
        showToast('Tâche supprimée', 'warning')
    } catch (error) {
        showToast(
            error instanceof Error ? error.message : 'Erreur lors de la suppression de la tâche',
            'error'
        )
    }
}

onMounted(async () => {
    const response = await fetchUserTodos(userId)
    tasks.value = response.data
})
</script>
