<script setup>
import { useViewStore } from '@/stores/view';

const useView = useViewStore();
</script>

<template>
    <div
        class="container mx-auto flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-zinc-900 dark:text-white"
    >
        <h1 class="text-center text-4xl sm:text-6xl lg:text-8xl">Xác thực thành công!</h1>
        <RouterLink
            to="/login"
            class="text-center text-2xl underline hover:opacity-75 sm:text-3xl"
            :style="{ color: useView.currentColor }"
        >
            Nhấn vào đây để tiến hành đăng nhập
        </RouterLink>
    </div>
</template>
