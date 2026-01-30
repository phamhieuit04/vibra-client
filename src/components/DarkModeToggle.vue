<script setup>
import { ref, onMounted } from 'vue';

const isDark = ref(false);

onMounted(() => {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        isDark.value = true;
        document.documentElement.classList.add('dark');
    } else {
        isDark.value = false;
        document.documentElement.classList.remove('dark');
    }
});

const toggleDarkMode = () => {
    isDark.value = !isDark.value;

    if (isDark.value) {
        document.documentElement.classList.add('dark');
        localStorage.theme = 'dark';
    } else {
        document.documentElement.classList.remove('dark');
        localStorage.theme = 'light';
    }
};
</script>

<template>
    <button @click="toggleDarkMode" role="switch" :aria-checked="isDark" class="
      relative inline-flex h-7 w-12 items-center
      rounded-full
      transition-colors duration-300
      focus:outline-none
      bg-gray-300 dark:bg-zinc-700
    ">
        <span class="
        inline-block h-5 w-5
        transform rounded-full
        bg-white shadow-md
        transition-transform duration-300
      " :class="isDark ? 'translate-x-6' : 'translate-x-1'" />
    </button>
</template>
