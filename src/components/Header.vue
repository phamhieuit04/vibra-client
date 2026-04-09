<script setup>
import apiHelper from '@/helpers/apiHelper';
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';
import defaultImgage from '@/assets/default.jpg';
import LogoText from '@/assets/LogoText.svg';
import { useAuthStore } from '@/stores/auth';
import { useSongStore } from '@/stores/song';
import { useViewStore } from '@/stores/view';
import { useModalStore } from '@/stores/modal';
import { useActivityStore } from '@/stores/activity';
import DarkModeToggle from '@/components/ThemeToggle.vue';

const useSong = useSongStore();

const useActivity = useActivityStore();
const useModal = useModalStore();
const useView = useViewStore();
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const searchValue = ref('');

const isDarkMode = ref(false);

const updateDarkMode = () => {
    isDarkMode.value = document.documentElement.classList.contains('dark');
};

function goHome() {
    router.push({ name: 'index-home' });
    searchValue.value = '';
}

function goSearch() {
    router.push({ name: 'index-search' });
}

function goCategories() {
    router.push({ name: 'index-categories' });
}

function goUser() {
    router.push({ name: 'index-user' });
}

async function getAllCategories() {
    try {
        const res = await apiHelper.get('/category/index', {
            headers: {
                Authorization: 'Bearer ' + authStore.user.token,
            },
        });

        if (res.data.code === 200) {
            useActivity.setCategories(res.data.data);
        }
    } catch (e) {
        console.log(e);
        useActivity.addNotify(true, 'Call Api thất bại!');
    }
}

async function logout() {
    try {
        const res = await apiHelper.get('/logout', {
            headers: {
                Authorization: 'Bearer ' + authStore.user.token,
            },
        });

        if (useSong.isPlaying) {
            useSong.audio?.pause();
        }
        useSong.$reset();
        useView.$reset();
        useModal.loading = true;
        setTimeout(() => {
            if (res.data.code === 200) {
                router.push('/login');
                authStore.$reset();
            }
        }, 2000);
        setTimeout(() => {
            useModal.loading = false;
        }, 3000);
    } catch (e) {
        console.log(e);
        useActivity.addNotify(true, 'Call Api thất bại!');
    }
}

onMounted(() => {
    getAllCategories();

    updateDarkMode();

    const observer = new MutationObserver(updateDarkMode);
    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class'],
    });
});
</script>

<template>
    <div class="fixed right-0 z-20 flex h-[64px] w-[100%] items-center justify-between px-12"
        :style="{ backgroundColor: useView.currentColor }">
        <div class="relative flex items-center gap-3">
            <img class="size-20 cursor-pointer text-[64px] text-white transition duration-200 hover:opacity-80"
                :src="LogoText" @click="goHome" />
            <DarkModeToggle position="header-left" />
        </div>

        <!-- Home & Search -->
        <div class="flex items-center gap-2 self-center">
            <div class="flex items-center gap-3">
                <div @click="
                    goHome();
                "
                    class="flex size-12 items-center justify-center rounded-full bg-black/20 transition duration-200 hover:bg-black/30 dark:bg-[#1f1f1f] dark:hover:bg-[#2a2a2a]">
                    <Icon icon="material-symbols:home" class="size-8 cursor-pointer transition duration-200" :class="route.name === 'index-home'
                        ? 'text-white dark:text-[#FFE5D6]'
                        : 'text-white/50 dark:text-[#FFE5D6]/30'
                        " />
                </div>
                <div
                    class="flex w-96 items-center justify-between gap-3 rounded-3xl bg-white/70 px-3 py-2 outline outline-2 outline-transparent transition-all duration-200 focus-within:outline-black hover:bg-white dark:bg-[#212121] dark:focus-within:outline-white dark:hover:bg-[#2a2a2a]">
                    <div class="flex w-full items-center gap-2 border-r-2 border-zinc-300 dark:border-[#7c7c7c]">
                        <Icon icon="material-symbols:search-rounded"
                            class="size-8 cursor-pointer transition duration-200" :class="route.name === 'index-search'
                                ? 'text-zinc-900 dark:text-[#FFE5D6]'
                                : 'text-zinc-600 dark:text-[#FFE5D6]/50'
                                " />
                        <input v-model="searchValue" @input="useActivity.changeSearchKey(searchValue)" type="text"
                            class="w-full border-none bg-transparent text-zinc-900 placeholder-zinc-500 outline-none focus:outline-none dark:text-white dark:placeholder-white/40"
                            @click="goSearch" placeholder="Bạn muốn phát nội dung gì?" />
                    </div>
                    <Icon icon="fluent:collections-empty-16-filled"
                        class="cursor-pointer text-3xl transition duration-200 hover:scale-110" @click="goCategories" :class="route.name === 'index-categories'
                            ? 'text-zinc-900 dark:text-[#FFE5D6]'
                            : 'text-zinc-600 dark:text-[#FFE5D6]/50'
                            " />
                </div>
            </div>
        </div>

        <!-- Right Controls -->
        <div class="flex items-center gap-3">
            <div class="flex h-[44px] items-center justify-center rounded-full font-bold text-white">
                <button @click="goUser" type="button" class="cursor-pointer hover:scale-105">
                    <div class="flex h-[43px] items-center rounded-full bg-white/30 p-[2px] dark:bg-gray-500"
                        width="44">
                        <img class="aspect-square rounded-full object-cover" width="42" :src="authStore.user.avatar_path
                            ? authStore.user.avatar_path
                            : defaultImgage
                            " @error="
                                (event) => (event.target.src = defaultImgage)
                            " alt="" />
                    </div>
                </button>
            </div>
            <button @click="logout()" type="button"
                class="h-9 w-28 cursor-pointer rounded-full font-semibold transition-all duration-200 hover:scale-105"
                :class="isDarkMode
                    ? 'bg-[#1D1512] hover:brightness-125'
                    : 'bg-white text-gray-900 hover:brightness-95'
                    " :style="isDarkMode ? { color: useView.currentColor } : {}">
                Đăng xuất
            </button>
        </div>
    </div>
</template>