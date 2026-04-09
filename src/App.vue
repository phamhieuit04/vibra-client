<template>
    <DarkModeToggle v-if="showFloatingThemeControl" position="top-left" />
    <RouterView v-slot="{ Component }">
        <Transition
            enter-from-class="opacity-0"
            enter-active-class="duration-300"
            enter-to-class="opacity-100"
            leave-from-class="opacity-100"
            leave-active-class="duration-300"
            leave-to-class="opacity-0"
        >
            <component v-bind:is="Component" />
        </Transition>
    </RouterView>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import DarkModeToggle from '@/components/ThemeToggle.vue';

const route = useRoute();

const showFloatingThemeControl = computed(() => {
    const authRouteNames = ['login', 'signup', 'verify', 'verify-done', 'interest-gerne'];
    return authRouteNames.includes(String(route.name || ''));
});
</script>
