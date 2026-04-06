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
import defaultImgage from '@/assets/default.jpg';
import { useActivityStore } from '@/stores/activity';

const useView = useViewStore();
const authStore = useAuthStore();
const useSong = useSongStore();
const useModal = useModalStore();
const useActivity = useActivityStore();
const { allCategories } = storeToRefs(useActivity);
const { currentTrack } = storeToRefs(useSong);
const { followArtistList } = storeToRefs(useActivity);

const isFollowed = ref(false);

async function followThisArtist() {
    try {
        const res = await apiHelper.get(`/artist/follow/${currentTrack.value.author.id}`, {
            headers: {
                Authorization: 'Bearer ' + authStore.user.token,
            },
        });
        useActivity.fetchData();
        isFollowed.value = !isFollowed.value;
        useActivity.addNotify(false, 'Đã theo dõi nghệ sĩ!');
    } catch (e) {
        console.log(e);
        useActivity.addNotify(true, 'Call Api thất bại!');
    }
}
async function unfollowThisArtist() {
    try {
        const res = await apiHelper.get(`/library/destroy-favorite-artist/${currentTrack.value.author.id}`, {
            headers: {
                Authorization: 'Bearer ' + authStore.user.token,
            },
        });
        useActivity.fetchData();
        isFollowed.value = !isFollowed.value;
        useActivity.addNotify(false, 'Đã bỏ theo dõi nghệ sĩ!');
    } catch (e) {
        console.log(e);
        useActivity.addNotify(true, 'Call Api thất bại!');
    }
}

watch(() => currentTrack.value, () => {
    isFollowed.value = false;
    followArtistList.value.forEach((artist) => {
        if (artist.artist_id === currentTrack.value.author.id) {
            isFollowed.value = true;
        }
    });
});

onMounted(() => {
    isFollowed.value = false;
    followArtistList.value.forEach((artist) => {
        if (artist.artist_id === currentTrack.value.author.id) {
            isFollowed.value = true;
        }
    });
});
</script>
<template>
    <div class="relative h-[calc(100vh-155px)] w-full bg-gray-300 text-gray-900 dark:bg-slate-400 dark:text-white">
        <div class="h-full">
            <img class="h-full w-full object-cover brightness-75" :src="currentTrack?.thumbnail_path" />
        </div>

        <div
            class="absolute bottom-5 left-1/2 w-11/12 -translate-x-1/2 transform rounded-2xl bg-white p-4 dark:bg-[#1D1512]">
            <h2 class="mb-3 text-sm font-semibold">Giới thiệu về nghệ sĩ</h2>
            <div class="mb-4 flex items-center justify-between">
                <div class="h-16 w-16 rounded-full bg-gray-400 dark:bg-gray-600">
                    <img class="h-full w-full rounded-full object-cover" :src="currentTrack?.author.avatar_path" />
                </div>
                <div v-if="currentTrack?.author.id !== authStore.user.id">
                    <button v-if="!isFollowed" @click="followThisArtist"
                        class="rounded-full border px-4 py-2 text-sm font-semibold transition hover:scale-110" :style="{
                            borderColor: useView.currentColor,
                            color: useView.currentColor,
                        }">
                        Theo dõi
                    </button>
                    <button v-else @click="unfollowThisArtist"
                        class="rounded-full border px-4 py-2 text-sm font-semibold transition hover:scale-110" :style="{
                            borderColor: useView.currentColor,
                            color: useView.currentColor,
                        }">
                        Hủy theo dõi
                    </button>
                </div>
            </div>

            <div>
                <h3 class="text-2xl font-semibold">{{ currentTrack?.name }}</h3>
                <p class="text-sm text-gray-600 dark:text-zinc-400">
                    {{ currentTrack?.author.followers }} người theo dõi
                </p>
                <h2 class="mb-1 mt-2 text-sm font-semibold">
                    Album {{ currentTrack?.playlist.name }}
                </h2>
                <div class="max-h-24 overflow-y-auto scrollbar-none">
                    <p class="mt-1 text-sm">
                        {{ currentTrack?.playlist.description }}
                    </p>
                </div>
                <h2 class="mb-2 mt-5 text-sm font-semibold">
                    Về bài hát bạn đang nghe
                </h2>
                <div class="max-h-24 overflow-y-auto scrollbar-none">
                    <p class="mt-2 text-sm">{{ currentTrack?.description }}</p>
                </div>
            </div>
        </div>
    </div>
</template>