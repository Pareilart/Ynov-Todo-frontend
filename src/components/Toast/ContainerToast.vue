<template>
    <div class="fixed bottom-0 right-0 mt-10 w-screen px-10" style="z-index: 1000;">
        <TransitionGroup name="list" tag="ul" class="flex flex-col-reverse items-end gap-4">
            <Toast v-for="toast in toasts" :key="toast.id" v-bind="toast" />
        </TransitionGroup>
    </div>
</template>

<script setup>
import Toast from '@/components/Toast/Toast.vue';
import { useToast } from '@/composable/useToast';

const { toasts } = useToast();
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