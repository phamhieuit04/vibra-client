<script setup>
import apiHelper from '@/helpers/apiHelper';
import { onMounted, ref, watch, toRefs, computed } from 'vue';
import { useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/stores/auth';
import { useViewStore } from '@/stores/view';
import { useSongStore } from '@/stores/song';
import { useModalStore } from '@/stores/modal';
import { useActivityStore } from '@/stores/activity';
import defaultImgage from '@/assets/default.jpg';

const useView = useViewStore();
const authStore = useAuthStore();
const useSong = useSongStore();
const useModal = useModalStore();
const useActivity = useActivityStore();

const { categoriesData } = storeToRefs(useView);

const songByCateList = ref([]);

async function getCategoriesSong() {
    try {
        const res = await apiHelper.get(`/category/show/${categoriesData.value.id}`, {
            headers: {
                Authorization: 'Bearer ' + authStore.user.token,
            },
        });
        songByCateList.value = res.data.data;
    } catch (e) {
        console.log(e);
        useActivity.addNotify(true, 'Call Api thất bại!');
    }
}

onMounted(() => {
    getCategoriesSong();
});
</script>
<template>
    <div class="dark:text-[#FFFF] text-black">
        <div class="scrollbar-style h-[calc(100vh-190px)] w-full overflow-y-auto px-16 pt-4">
            <h2 class="mb-4 mt-7 text-2xl font-semibold">
                Danh sách nhạc {{ categoriesData.name }} nổi bật
            </h2>
            <div class="flex flex-wrap justify-start gap-12">
                <div v-if="songByCateList.length > 4" class="flex">
                    <div v-for="item in 4" :key="item.id"
                        class="cursor-pointer rounded-lg px-2 duration-200 ease-in-out hover:scale-105" @click="
                            useSong.playOrPauseThisSong(songByCateList[item])
                            " style="width: 14.75rem">
                        <div class="mb-2 h-48 w-48 rounded-full bg-zinc-700">
                            <img class="h-full w-full rounded-full object-cover"
                                :src="songByCateList[item].thumbnail_path" />
                        </div>
                        <div class="mt-4 pr-8 text-center">
                            <p class="font-medium">
                                {{ songByCateList[item].name }}
                            </p>

                            <div class="mt-1 flex items-center justify-center gap-2 text-sm text-zinc-400">
                                <p>
                                    {{ songByCateList[item].total_played }} lượt
                                    nghe
                                </p>
                                <button @click.stop="
                                    useSong.addSongToWaitlist(
                                        songByCateList[item],
                                    )
                                    " class="rounded p-1 text-[#FFE5D6]/50 hover:bg-white/5">
                                    <Icon icon="material-symbols:home-storage-outline" class="text-2xl" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-else class="flex">
                    <div v-for="item in songByCateList" :key="item.id"
                        class="cursor-pointer rounded-lg px-2 duration-200 ease-in-out hover:scale-105"
                        @click="useSong.playOrPauseThisSong(item)" style="width: 14.75rem">
                        <div class="mb-2 h-48 w-48 rounded-full bg-zinc-700">
                            <img class="h-full w-full rounded-full object-cover" :src="item.thumbnail_path" />
                        </div>
                        <div class="mt-4 pr-8 text-center">
                            <p class="font-medium">{{ item.name }}</p>

                            <div class="mt-1 flex items-center justify-center gap-2 text-sm text-zinc-400">
                                <p>{{ item.total_played }} lượt nghe</p>
                                <button @click.stop="
                                    useSong.addSongToWaitlist(item)
                                    " class="rounded p-1 text-[#FFE5D6]/50 hover:bg-white/5">
                                    <Icon icon="material-symbols:home-storage-outline" class="text-2xl" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <h2 class="mb-4 mt-12 text-2xl font-semibold">Bài hát</h2>
            <div class="scrollbar-style mt-3 h-[21.3rem] overflow-y-auto pr-8">
                <div v-for="item in songByCateList" :key="item.id"
                    class="flex cursor-pointer items-center justify-between rounded-lg p-2 transition hover:bg-gray-100 dark:hover:bg-[#2a1d18]"
                    @click="useSong.playOrPauseThisSong(item)">
                    <div class="flex items-center space-x-4">
                        <div class="h-10 w-10 rounded-md bg-zinc-700">
                            <img class="h-full w-full rounded-xl object-cover" :src="item.thumbnail_path" />
                        </div>
                        <span class="font-medium">{{ item.name }}</span>
                    </div>
                    <div class="flex items-center space-x-8 text-sm">
                        <span>{{ item.total_played }} lượt nghe</span>
                        <button @click.stop="useSong.addSongToWaitlist(item)"
                            class="mr-4 rounded p-1 text-gray-600 hover:bg-gray-200 dark:text-[#FFE5D6]/50 dark:hover:bg-white/5">
                            <Icon icon="material-symbols:home-storage-outline" class="text-2xl" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
