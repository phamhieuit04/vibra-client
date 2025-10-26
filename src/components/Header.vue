<script setup>
import { api } from '@/api/axios';
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';
import defaultImgage from '@/assets/default.jpg';
import LogoText from '@/assets/LogoText.svg';
import { useAuthStore } from '@/stores/auth';
import { useSongStore } from '@/stores/song';
import { useViewStore } from '@/stores/view';
import { useModalStore } from '@/stores/modal';
import { useActivityStore } from '@/stores/activity';

const useSong = useSongStore();

let openColorMenu = ref(false);

const useActivity = useActivityStore();
const useModal = useModalStore();
const useView = useViewStore();
const authStore = useAuthStore();
const router = useRouter();

const searchValue = ref('');
const colorList = ref([
    '#BC4D15',
    '#645283',
    '#a8bfc9',
    '#CD5C5C',
    '#a3b18a',
    '#9e9fa5',
    '#926F4F',
    '#FEA7A0',
    '#c3a995',
    '#44B78B',
]);

async function getAllCategories() {
    try {
        const res = await api.get('/category/index', {
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
        const res = await api.get('/logout', {
            headers: {
                Authorization: 'Bearer ' + this.authStore.user.token,
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
    useView.setComponent('HomePage');
    if (useView.currentColor == null) {
        useView.currentColor = '#BC4D15';
    }
});
</script>

<template>
    <div class="fixed right-0 z-20 flex h-[64px] w-[100%] items-center justify-between bg-[#BC4D15]"
        :style="{ backgroundColor: useView.currentColor }">
        <div class="relative ml-8 flex items-center gap-3">
            <img class="size-20 cursor-pointer text-[64px] text-white transition duration-200 hover:text-black"
                :src="LogoText" @click="
                    useView.setComponent('HomePage');
                useView.selectItem(this);
                " />
            <!-- <Icon icon="tabler:poo-filled" @click="useView.setComponent('HomePage'); useView.selectItem(this)"
				class="text-white transition duration-200 cursor-pointer size-10 hover:text-black text-[64px]" /> -->
            <div class="relative ml-0 h-8 w-8 cursor-pointer rounded-full bg-black shadow-2xl hover:scale-105">
                <div @click="openColorMenu = !openColorMenu"
                    class="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-gray-400"
                    :style="{ backgroundColor: useView.currentColor }"></div>
            </div>
            <div v-if="openColorMenu"
                class="absolute left-[140px] flex h-10 items-center rounded-xl bg-black transition duration-500">
                <div class="mx-2 h-6 w-6 cursor-pointer rounded-full hover:scale-110" v-for="color in colorList"
                    :style="{ backgroundColor: color }" @click="useView.setCurrentColor(color)"></div>
            </div>
        </div>

        <!-- Home & Search -->
        <div class="flex items-center gap-2 self-center">
            <div class="flex items-center gap-3">
                <div @click="
                    useView.setComponent('HomePage');
                useView.selectItem(this);
                searchValue = '';
                "
                    class="flex size-12 items-center justify-center rounded-full bg-[#1f1f1f] transition duration-200 hover:bg-[#2a2a2a]">
                    <Icon icon="material-symbols:home" class="size-8 cursor-pointer transition duration-200" :class="useView.currentComponent === 'HomePage'
                        ? 'text-[#FFE5D6]'
                        : 'text-[#FFE5D6]/30'
                        " />
                </div>
                <div
                    class="flex w-96 items-center justify-between gap-3 rounded-3xl bg-[#212121] px-3 py-2 outline outline-2 transition-all duration-200 focus-within:bg-[#2a2a2a] focus-within:outline-white hover:bg-[#2a2a2a]">
                    <div class="flex w-full items-center gap-2 border-r-2 border-[#7c7c7c]">
                        <Icon icon="material-symbols:search-rounded"
                            class="size-8 cursor-pointer transition duration-200" :class="useView.currentComponent === 'SearchPage'
                                ? 'text-[#FFE5D6]'
                                : 'text-[#FFE5D6]/30'
                                " />
                        <input v-model="searchValue" @input="useActivity.changeSearchKey(searchValue)" type="text"
                            class="w-full border-none bg-transparent text-white outline-[#BC4D15] focus:outline-none"
                            @click="
                                useView.setComponent('SearchPage');
                            useView.selectItem(this);
                            " placeholder="Bạn muốn phát nội dung gì?" />
                    </div>
                    <Icon icon="fluent:collections-empty-16-filled"
                        class="cursor-pointer text-3xl transition duration-200 hover:scale-110" @click="
                            useView.setComponent('CategoriesPage');
                        useView.selectItem(this);
                        " :class="useView.currentComponent === 'CategoriesPage'
                            ? 'text-[#FFE5D6]'
                            : 'text-[#FFE5D6]/30'
                            " />
                </div>
            </div>
        </div>

        <!-- Right Controls -->
        <div class="flex items-center gap-3">
            <div class="flex h-[44px] items-center justify-center rounded-full font-bold text-white">
                <button @click="
                    useView.setComponent('UserPage');
                useView.selectItem(this);
                " type="button" class="cursor-pointer hover:scale-105">
                    <div class="flex h-[43px] items-center rounded-full bg-gray-500 p-[2px]" width="44">
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
                class="mr-[10px] h-9 w-28 cursor-pointer rounded-full bg-[#1D1512] hover:scale-105 hover:brightness-125">
                <div class="brightness-125" :style="{ color: useView.currentColor }">
                    Đăng xuất
                </div>
            </button>
        </div>
    </div>
</template>
