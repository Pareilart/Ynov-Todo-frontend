<template>
    <div v-if="isVisible" :id="`toast-${type}`" class="flex items-center w-full max-w-lg p-4 mb-4 text-gray-500 bg-white rounded-lg shadow ">
      <div :class="iconClasses">
        <font-awesome-icon :icon="iconClass" />
        <span class="sr-only">{{ iconLabel }}</span>
      </div>
      <div class="ms-3 text-sm font-normal">{{ message }}</div>
      <button @click="close" type="button" class="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 " :aria-label="closeLabel">
        <span class="sr-only">{{ closeLabel }}</span>
        <font-awesome-icon icon="fa-solid fa-xmark" />
      </button>
    </div>
  </template>
  
  <script setup>
  import { ref, watch, computed } from 'vue';
  
  const props = defineProps({
    message: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        default: 'success', // success, error, info, warning
        validator: (value) => ['success', 'error', 'info', 'warning'].includes(value)
    },
    duration: {
        type: Number,
        default: 2000,
    },
  });
  
  const isVisible = ref(true);
  
  // Show toast when the message changes
  watch(() => props.message, (newMessage) => {
    if (newMessage) {
        isVisible.value = true;
        setTimeout(() => {
            isVisible.value = false;
        }, props.duration);
    }
  });
  
  const close = () => {
    isVisible.value = false;
  };
  
  const iconClasses = computed(() => {
    const baseClasses = 'inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg';
    const typeClasses = {
      success: 'text-green-500 bg-green-100',
      error: 'text-red-500 bg-red-100',
      warning: 'text-orange-500 bg-orange-100',
      info: 'text-blue-500 bg-blue-100',
    };
    return `${baseClasses} ${typeClasses[props.type] || typeClasses.success}`;
  });
  
  const iconClass = computed(() => {
    const icons = {
      success: ['fas', 'circle-check'],
      error: ['fas', 'circle-xmark'],
      warning: ['fas', 'triangle-exclamation'],
      info: ['fas', 'circle-info'],
    };
    return icons[props.type] || icons.success;
  });
  
  const iconLabel = computed(() => {
    const labels = {
      success: 'Icône de succès',
      error: 'Icône d\'erreur',
      warning: 'Icône d\'avertissement',
      info: 'Icône d\'information',
    };
    return labels[props.type] || labels.success;
  });
  
  const closeLabel = computed(() => 'Fermer');
  </script>
  