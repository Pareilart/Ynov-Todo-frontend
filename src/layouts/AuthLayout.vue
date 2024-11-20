<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navbar -->
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <!-- Logo et navigation principale -->
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <router-link to="/todos" class="text-xl font-bold text-gray-800">
                {{ props.title }}
              </router-link>
            </div>
            <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
              <router-link 
                v-if="authStore.hasRole('ADMIN')"
                to="/admin/users"
                class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                :class="[$route.path === '/users' ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300']"
              >
                Liste des utilisateurs
              </router-link>
            </div>
          </div>

          <!-- Menu utilisateur -->
          <div class="flex items-center">
            <button
              class="p-2 text-gray-600 hover:text-gray-800 rounded-md"
              @click="logout"
            >
              <font-awesome-icon icon="fa-solid fa-right-from-bracket" />
              <span class="ml-2">Déconnexion</span>
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Contenu principal -->
    <main class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <slot></slot>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const props = defineProps<{
  title: string
}>()

const router = useRouter()
const authStore = useAuthStore()

const logout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script> 