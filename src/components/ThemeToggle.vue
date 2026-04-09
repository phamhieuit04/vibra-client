<script setup>
import { computed, onMounted, ref } from 'vue';
import { useViewStore } from '@/stores/view';
import {
    COLOR_OPTIONS,
    DEFAULT_COLOR,
    applyTheme,
    getStoredTheme,
    initColorFromStorage,
    setStoredTheme,
} from '@/helpers/themePreferences';

const props = defineProps({
    position: {
        type: String,
        default: 'top-left',
    },
});

const useView = useViewStore();
const openColorMenu = ref(false);
const isDark = ref(false);

const currentColor = computed(() => useView.currentColor || DEFAULT_COLOR);
const containerClass = computed(() => {
    if (props.position === 'header-left') {
        return 'relative z-30 flex items-center gap-2 rounded-full border border-zinc-200 bg-white/70 p-2 shadow-sm backdrop-blur-md dark:border-zinc-700 dark:bg-black/25';
    }
    return 'fixed left-4 top-4 z-50 flex items-center gap-2 rounded-full border border-zinc-200 bg-white/70 p-2 shadow-sm backdrop-blur-md dark:border-zinc-700 dark:bg-black/25';
});

function toggleDarkMode() {
    isDark.value = !isDark.value;
    const mode = isDark.value ? 'dark' : 'light';
    applyTheme(mode);
    setStoredTheme(mode);
}

function selectColor(color) {
    useView.setCurrentColor(color);
    openColorMenu.value = false;
}

onMounted(() => {
    const storedTheme = getStoredTheme();
    isDark.value = storedTheme === 'dark';
    applyTheme(storedTheme);

    if (!useView.currentColor) {
        useView.setCurrentColor(initColorFromStorage());
    }
});
</script>

<template>
    <div :class="containerClass">
        <button
            @click="toggleDarkMode"
            role="switch"
            :aria-checked="isDark"
            class="relative inline-flex h-7 w-12 items-center rounded-full bg-gray-300 transition-colors duration-300 focus:outline-none dark:bg-zinc-700"
        >
            <span
                class="inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300"
                :class="isDark ? 'translate-x-6' : 'translate-x-1'"
            />
        </button>

        <div class="relative flex items-center">
            <button
                @click="openColorMenu = !openColorMenu"
                class="size-7 rounded-full border-2 border-white/60"
                :style="{ backgroundColor: currentColor }"
                aria-label="Change theme color"
            ></button>
            <div
                v-if="openColorMenu"
                class="absolute left-full top-1/2 ml-5 flex -translate-y-1/2 flex-nowrap gap-2 rounded-xl bg-white p-2 shadow-xl dark:bg-[#1F1F1F]"
            >
                <button
                    v-for="color in COLOR_OPTIONS"
                    :key="color"
                    @click="selectColor(color)"
                    class="h-7 w-7 rounded-full border border-gray-300 hover:scale-105 dark:border-gray-600"
                    :style="{ backgroundColor: color }"
                    :aria-label="`Select color ${color}`"
                ></button>
            </div>
        </div>
    </div>
</template>