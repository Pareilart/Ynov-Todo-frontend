<template>
    <AuthLayout title="Liste des utilisateurs">
        <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
                <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="user in users" :key="user.id">
                    <td class="px-6 py-4 whitespace-nowrap">{{ user.name }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">{{ user.email }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <router-link :to="`/admin/users/${user.id}/todos`" class="text-blue-500 hover:text-blue-700">
                            Voir les tâches
                            <font-awesome-icon icon="fa-solid fa-eye" />
                        </router-link>
                    </td>
                </tr>
            </tbody>
        </table>
    </AuthLayout>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import AuthLayout from '@/layouts/AuthLayout.vue'
import { useApiAdminUser } from '@/api/apiAdminUser'
import type { User } from '@/types/user'
const { fetchUsers } = useApiAdminUser()

const users = ref<User[]>([])

onMounted(async () => {
    const response = await fetchUsers()
    users.value = response.data
})
</script>
