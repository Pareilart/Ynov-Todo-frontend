<template>
  <div v-if="isVisible" :id="`toast-${type}`"
    class="flex items-center w-full max-w-lg p-4 mb-4 text-gray-500 bg-white rounded-lg shadow ">
    <div :class="iconClasses">
      <font-awesome-icon :icon="iconClass" />
      <span class="sr-only">{{ iconLabel }}</span>
    </div>
    <div class="ms-3 text-sm font-normal">{{ message }}</div>
    <button @click="close" type="button"
      class="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 "
      :aria-label="closeLabel">
      <span class="sr-only">{{ closeLabel }}</span>
      <font-awesome-icon icon="fa-solid fa-xmark" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  message: string;
  type: ToastType;
  duration: number;
}

const props = withDefaults(defineProps<ToastProps>(), {
  type: 'success',
  duration: 2000
});

const isVisible = ref < boolean > (true);

const emit = defineEmits<{
  (e: 'remove'): void
}>();

// Show toast when the message changes
watch(() => props.message, (newMessage) => {
  if (newMessage) {
    isVisible.value = true;
    setTimeout(() => {
      isVisible.value = false;
      emit('remove');
    }, props.duration);
  }
});

const close = () => {
  isVisible.value = false;
  emit('remove');
};

const iconClasses = computed((): string => {
  const baseClasses = 'inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg';
  const typeClasses: Record<ToastType, string> = {
    success: 'text-green-500 bg-green-100',
    error: 'text-red-500 bg-red-100',
    warning: 'text-orange-500 bg-orange-100',
    info: 'text-blue-500 bg-blue-100',
  };
  return `${baseClasses} ${typeClasses[props.type]}`;
});

const iconClass = computed((): [string, string] => {
  const icons: Record<ToastType, [string, string]> = {
    success: ['fas', 'circle-check'],
    error: ['fas', 'circle-xmark'],
    warning: ['fas', 'triangle-exclamation'],
    info: ['fas', 'circle-info'],
  };
  return icons[props.type];
});

const iconLabel = computed((): string => {
  const labels: Record<ToastType, string> = {
    success: 'Icône de succès',
    error: 'Icône d\'erreur',
    warning: 'Icône d\'avertissement',
    info: 'Icône d\'information',
  };
  return labels[props.type];
});

const closeLabel = computed((): string => 'Fermer');
</script>