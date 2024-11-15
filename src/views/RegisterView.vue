<template>
  <GuestLayout>
    <h1 class="text-3xl font-bold text-center text-gray-900 mb-8">Inscription</h1>
    
    <form @submit.prevent="handleRegister" class="space-y-6">
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
        <input 
          type="email" 
          id="email" 
          v-model="email" 
          required
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
      </div>
      
      <div>
        <label for="password" class="block text-sm font-medium text-gray-700">Mot de passe</label>
        <input 
          type="password" 
          id="password" 
          v-model="password" 
          required
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
      </div>

      <div>
        <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Confirmer le mot de passe</label>
        <input 
          type="password" 
          id="confirmPassword" 
          v-model="confirmPassword" 
          required
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
      </div>

      <button 
        type="submit"
        class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        S'inscrire
      </button>
    </form>
  </GuestLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import GuestLayout from '@/layouts/GuestLayout.vue'
import { useToast } from '@/composable/useToast'

const { showToast } = useToast()

const email = ref('')
const password = ref('')
const confirmPassword = ref('')

const handleRegister = () => {
  if (password.value !== confirmPassword.value) {
    showToast('Les mots de passe ne correspondent pas', 'error')
    return
  }
  // Logique d'inscription à implémenter
  console.log('Register attempt:', { email: email.value, password: password.value })
}
</script> 