<template>
    <div class="fixed bottom-0 right-0 mt-10 w-screen px-10" style="z-index: 1000;">
        <TransitionGroup name="list" tag="ul" class="flex flex-col-reverse items-end gap-4">
            <ToastVue v-for="toast in toasts" :key="toast.id" v-bind="toast" />
        </TransitionGroup>
    </div>
</template>

<script setup lang="ts">
import { ref, type Ref } from 'vue';
import ToastVue from '@/components/Toast/Toast.vue';
import { useToast } from '@/composable/useToast';
import type { Toast } from '@/types/toast';

const { toasts } = useToast() as { toasts: Ref<Toast[]> };
</script>

<style scoped>
.list-enter-active,
.list-leave-active {
    transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
    opacity: 0;
    transform: translateY(-30px);
}
</style>