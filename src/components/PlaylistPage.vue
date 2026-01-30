<script setup>
import { api } from '@/api/axios';
import SongRow from './SongRow.vue';
import { Icon } from '@iconify/vue';
import { useSongStore } from '@/stores/song';
import { useViewStore } from '@/stores/view';
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';
import { onMounted, ref, watch } from 'vue';
import defaultImgage from '@/assets/default.jpg';
import FavCover from '@/assets/FavCover.jpg';
import { useActivityStore } from '@/stores/activity';

const authStore = useAuthStore();
const useSong = useSongStore();
const useView = useViewStore();
const useActivity = useActivityStore();

const { followAlbumList } = storeToRefs(useActivity);
const { playlistData } = storeToRefs(useView);
const playlistSong = ref([]);
const reloadKey = ref(0);
const isFollowed = ref(false);
const isLoading = ref(true);

async function FetchPlaylistData() {
    if (playlistData.value.type == 1) {
        try {
            const res = await api.get(`/playlist/show/${playlistData.value.id}`, {
                headers: {
                    Authorization: 'Bearer ' + authStore.user.token,
                },
            });
            playlistSong.value = res.data.data;
        } catch (e) {
            console.log(e);
            useActivity.addNotify(true, 'Call Api thất bại!');
        }
    } else {
        try {
            const res = await api.get(`/library/list-playlist-song/${playlistData.value.id}`, {
                headers: {
                    Authorization: 'Bearer ' + authStore.user.token,
                },
            });
            const rawList = res.data.data;
            const onlySongs = rawList.map((item) => item.song);
            playlistSong.total_song = onlySongs.value;
            playlistSong.value = onlySongs;
        } catch (e) {
            console.log(e);
            useActivity.addNotify(true, 'Call Api thất bại!');
        }
    }
}

async function addToLibrary() {
    try {
        const res = await api.get(`/home/store/${playlistData.value.id}`, {
            headers: {
                Authorization: 'Bearer ' + authStore.user.token,
            },
        });
        useActivity.fetchData();
        isFollowed.value = !isFollowed.value;
        useActivity.addNotify(false, 'Đã thêm vào thư viện!');
    } catch (e) {
        console.log(e);
        useActivity.addNotify(true, 'Call Api thất bại!');
    }
}
async function removeFromLibrary() {
    try {
        const res = await api.get(`/library/destroy-playlist/${playlistData.value.id}`, {
            headers: {
                Authorization: 'Bearer ' + authStore.user.token,
            },
        });
        useActivity.fetchData();
        isFollowed.value = !isFollowed.value;
        useActivity.addNotify(false, 'Đã xóa khỏi thư viện!');
    } catch (e) {
        console.log(e);
        useActivity.addNotify(true, 'Call Api thất bại!');
    }
}

async function downloadThisPlaylist() {
    if (!playlistData.value.id) return;
    try {
        const res = await api.get(`/payment/create-bill?playlist_id=${playlistData.value.id}`, {
            headers: {
                Authorization: 'Bearer ' + authStore.user.token,
            },
        });
        if (res.data.code == 200) {
            useActivity.setDownload(res.data.data);
            window.location.href = res.data.data.checkout_url;
        } else {
            useActivity.addNotify(true, 'Không lấy được link thanh toán!');
        }
    } catch (err) {
        console.error(err);
        useActivity.addNotify(true, 'Không lấy được link thanh toán!');
    }
}

function onSongDel(trackId) {
    playlistSong.value = playlistData.value.songs;
    playlistSong.value = playlistSong.value.filter((t) => t.id !== trackId);
    playlistData.value.songs = playlistSong.value;
    reloadKey.value++;
}

function onPlaylistSongDel(trackId) {
    FetchPlaylistData();
}

watch(() => playlistData.value, async () => {
    isLoading.value = true;
    if (!playlistData.value.isFav) {
        await FetchPlaylistData();
        followAlbumList.value.forEach((album) => {
            if (album.id === playlistData.value.id) {
                isFollowed.value = true;
            }
        });
    } else {
        playlistSong.value = playlistData.value.songs;
    }
    isLoading.value = false;
});

onMounted(async () => {
    isLoading.value = true;
    if (!playlistData.value.isFav) {
        await FetchPlaylistData();
        followAlbumList.value.forEach((album) => {
            if (album.id === playlistData.value.id) {
                isFollowed.value = true;
            }
        });
    } else {
        playlistSong.value = playlistData.value.songs;
    }
    isLoading.value = false;
});
</script>
<template>
    <div class="h-[calc(100vh-12rem)] overflow-y-auto p-8 scrollbar-none">
        <div class="relative flex w-full items-center">
            <div class="aspect-square h-48 w-48 rounded-xl bg-gray-300 dark:bg-gray-500">
                <img v-if="playlistData.isFav" class="aspect-square max-h-48 max-w-48 rounded-xl object-cover"
                    :src="FavCover" />
                <img v-else class="aspect-square max-h-48 max-w-48 rounded-xl object-cover"
                    :src="playlistData.thumbnail_path" @error="(event) => (event.target.src = defaultImgage)" />
            </div>
            <div class="w-[100% - 192px] ml-5">
                <div class="text-lg font-semibold text-gray-900 dark:text-white">
                    {{ playlistData.type == 1 ? 'Album' : 'Danh sách phát' }}
                </div>
                <div
                    class="wrap-normal flex-1 whitespace-pre break-normal text-7xl font-bold text-gray-900 dark:text-white md:whitespace-normal md:break-all">
                    {{ playlistData.name }}
                </div>

                <div class="mt-[28px] flex text-gray-700 dark:text-gray-300">
                    <Icon v-if="playlistData.type == 1 && !isFollowed"
                        icon="material-symbols:add-circle-outline-rounded"
                        class="ml-2 mr-2 flex cursor-pointer pb-2 text-6xl hover:scale-110 transition-transform"
                        @click="addToLibrary" />
                    <Icon v-else-if="playlistData.type == 1" icon="material-symbols:check-circle"
                        class="ml-2 mr-2 flex cursor-pointer pb-2 text-6xl hover:scale-110 transition-transform"
                        @click="removeFromLibrary" />

                    <button @click.stop="
                        useSong.addPlaylistToWaitlist(playlistSong)
                        "
                        class="mr-4 rounded p-1 text-gray-600 hover:bg-gray-200 dark:text-[#FFE5D6]/50 dark:hover:bg-white/5">
                        <Icon icon="material-symbols:home-storage-outline" class="text-5xl" />
                    </button>
                    <button v-if="playlistData.type == 1" @click.stop="
                        useSong.setDownload('playlist');
                    useSong.setPlaylist(playlistSong);
                    downloadThisPlaylist();
                    "
                        class="mr-4 rounded p-1 text-gray-600 hover:bg-gray-200 dark:text-[#FFE5D6]/50 dark:hover:bg-white/5">
                        <Icon icon="material-symbols:arrow-circle-down-outline-rounded" class="text-5xl" />
                    </button>
                    <div class="mt-5 flex text-[13px]">
                        {{ playlistData.author?.name }}
                    </div>
                    <Icon v-if="!playlistData.isFav" icon="ci:dot-03-m" class="ml-2 mr-2 mt-5 flex text-lg" />
                    <div class="mt-5 flex text-[13px]">
                        {{
                            !playlistData.isFav
                                ? new Date(
                                    playlistData.created_at,
                                ).getFullYear()
                                : ''
                        }}
                    </div>
                    <Icon icon="ci:dot-03-m" class="ml-2 mr-2 mt-5 flex text-lg" />
                    <span class="mt-5 flex text-[13px]">{{ playlistData.total_song }} bài hát</span>
                    <Icon v-if="playlistData.type == 1" icon="ci:dot-03-m" class="ml-2 mr-2 mt-5 flex text-lg" />
                    <span v-if="playlistData.type == 1" class="mt-5 flex text-[13px]">{{ playlistData.price }}
                        vnd</span>
                </div>
            </div>
        </div>

        <div class="mt-6"></div>
        <div class="flex items-center justify-between px-5 pt-2">
            <div class="flex items-center justify-between text-gray-600 dark:text-gray-400">
                <div class="mr-7">#</div>
                <div class="text-base">Tiêu đề</div>
            </div>
        </div>

        <div class="mt-2 border-b border-b-gray-300 dark:border-b-[#A2A2A2]"></div>
        <div class="mb-4"></div>
        <ul class="w-full" :key="reloadKey">
            <SongRow v-for="(track, index) in playlistSong" :key="track.id" :playlist="playlistData" :track="track"
                :index="++index" :isFav="!playlistData.isFav" @delete-fav-song="onSongDel"
                @deletePlaylistSong="onPlaylistSongDel" />

            <li v-if="isLoading" class="my-2 flex h-14 cursor-pointer items-center justify-between rounded-md">
                <div class="flex w-full items-center py-1.5">
                    <div class="shimmer ml-[14px] mr-[10px] h-10 w-[40px] cursor-pointer rounded"></div>
                    <div>
                        <div class="shimmer mt-1 h-5 w-24 rounded font-semibold"></div>
                        <div class="shimmer my-1 h-5 w-20 rounded font-semibold"></div>
                    </div>
                </div>
                <div class="flex items-center">
                    <div class="shimmer mx-4 h-4 w-10 rounded"></div>
                    <div class="shimmer mx-3 h-4 w-4 rounded"></div>
                    <div class="shimmer mx-4 h-4 w-4 rounded"></div>
                </div>
            </li>
        </ul>
    </div>
</template>

<style scoped>
@keyframes shimmer {
    0% {
        background-position: -1000px 0;
    }

    100% {
        background-position: 1000px 0;
    }
}

.shimmer {
    background: linear-gradient(90deg,
            rgba(0, 0, 0, 0.05) 0%,
            rgba(0, 0, 0, 0.1) 20%,
            rgba(0, 0, 0, 0.15) 40%,
            rgba(0, 0, 0, 0.1) 60%,
            rgba(0, 0, 0, 0.05) 100%);
    background-size: 1000px 100%;
    animation: shimmer 2s infinite linear;
}

.dark .shimmer {
    background: linear-gradient(90deg,
            rgba(255, 255, 255, 0.05) 0%,
            rgba(255, 255, 255, 0.1) 20%,
            rgba(255, 255, 255, 0.15) 40%,
            rgba(255, 255, 255, 0.1) 60%,
            rgba(255, 255, 255, 0.05) 100%);
    background-size: 1000px 100%;
    animation: shimmer 2s infinite linear;
}
</style>