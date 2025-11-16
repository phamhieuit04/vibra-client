<script setup>
import { api } from '@/api/axios';
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
const router = useRouter();

const { currentTrack, isPlaying } = storeToRefs(useSong);

const popularAlbum = ref([]);
const topArtist = ref([]);
const topSong = ref([]);
const interestSongs = ref([]);
const isLoading = ref(true);

async function FetchAlbumData() {
    try {
        const res = await api.get('/home/list-album', {
            headers: {
                Authorization: 'Bearer ' + authStore.user.token,
            },
        });
        popularAlbum.value = res.data.data;
    } catch (e) {
        console.log(e);
    }
}
async function FetchArtistData() {
    try {
        const res = await api.get('/home/list-artist', {
            headers: {
                Authorization: 'Bearer ' + authStore.user.token,
            },
        });
        topArtist.value = res.data.data;
    } catch (e) {
        console.log(e);
    }
}
async function FetchSongData() {
    try {
        const res = await api.get('/home/list-song', {
            headers: {
                Authorization: 'Bearer ' + authStore.user.token,
            },
        });
        console.log(res.data.data);
        topSong.value = res.data.data;
    } catch (e) {
        console.log(e);
    }
}

async function FetchInterestSongData() {
    try {
        const res = await api.get('/home/get-recommended-songs', {
            headers: {
                Authorization: 'Bearer ' + authStore.user.token,
            },
        });
        console.log(res.data.data);
        interestSongs.value = res.data.data;
    } catch (e) {
        console.log(e);
    }
}

async function playThisAlbum(id) {
    try {
        const res = await api.get(`/playlist/show/${id}`, {
            headers: {
                Authorization: 'Bearer ' + authStore.user.token,
            },
        });
        useSong.addAndPlayThisPlaylist(res.data.data);
    } catch (e) {
        console.log(e);
        useActivity.addNotify(true, 'Call Api thất bại!');
    }
}

async function handleLoading() {
    await FetchInterestSongData();
    await FetchAlbumData();
    await FetchArtistData();
    await FetchSongData();
    isLoading.value = false;
}

onMounted(() => {
    handleLoading();
});
</script>
<template>
    <div class="h-full w-full space-y-6 rounded-[24px] bg-[#1D1512] text-[#FFFF]">
        <div class="scrollbar-style h-[calc(100vh-12rem)] overflow-auto px-8 py-8">

            <div class="mb-8 text-[#FFE5D6]">
                <h2 class="mb-1 text-2xl font-semibold">
                    Bài hát phù hợp với bạn
                </h2>
                <div class="scrollbar-style flex space-x-4 overflow-x-auto">
                    <div class="flex w-max space-x-4 px-1 py-2">
                        <div v-for="item in interestSongs" :key="item.id"
                            class="w-48 flex-shrink-0 cursor-pointer rounded-lg px-2 duration-200 ease-in-out hover:scale-105 hover:brightness-105"
                            @click="useSong.playOrPauseThisSong(item)">
                            <div class="mb-2 h-40 w-40 rounded-full bg-zinc-700">
                                <img class="h-40 w-40 rounded-full object-cover" :src="item.thumbnail_path" alt=""
                                    :class="{
                                        'animate-spin':
                                            currentTrack.id == item.id &&
                                            isPlaying,
                                    }" style="animation-duration: 5s" @error="
                                        (event) =>
                                            (event.target.src = defaultImgage)
                                    " />
                            </div>
                            <div class="flex justify-between">
                                <div>
                                    <p class="font-medium">{{ item.name }}</p>
                                    <p class="text-sm">
                                        {{ item.total_played }} lượt nghe
                                    </p>
                                </div>
                                <button @click.stop="
                                    useSong.addSongToWaitlist(item)
                                    " class="mr-4 rounded p-1 text-[#FFE5D6]/50 hover:bg-white/5">
                                    <Icon icon="material-symbols:home-storage-outline" class="text-2xl" />
                                </button>
                            </div>
                        </div>

                        <div v-if="isLoading"
                            class="w-48 flex-shrink-0 cursor-pointer rounded-lg px-2 duration-200 ease-in-out hover:scale-105 hover:brightness-105">
                            <div class="mb-2 h-40 w-40 rounded-full bg-zinc-700"></div>
                            <div class="flex justify-between">
                                <div>
                                    <div class="my-2 h-5 w-24 rounded bg-zinc-700"></div>
                                    <div class="my-2 h-5 w-28 rounded bg-zinc-700"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <div class="mb-8 text-[#FFE5D6]">
                <h2 class="mb-1 text-2xl font-semibold">Album phổ biến</h2>
                <div class="scrollbar-style flex space-x-4 overflow-x-auto">
                    <div class="flex w-max space-x-4 px-1 py-2">
                        <div v-for="item in popularAlbum" :key="popularAlbum.id"
                            class="group relative w-48 flex-shrink-0 cursor-pointer rounded-lg px-2 duration-200 ease-in-out hover:scale-105 hover:brightness-105">
                            <div @click="
                                useView.selectItem(item);
                            useView.setComponent('PlaylistPage');
                            useView.setPlaylistData(item);
                            ">
                                <div class="mb-2 h-48 w-48 rounded-xl bg-zinc-700">
                                    <img class="h-48 w-48 rounded-xl object-cover" :src="item.thumbnail_path" alt=""
                                        @error="
                                            (event) =>
                                            (event.target.src =
                                                defaultImgage)
                                        " />
                                </div>
                                <button
                                    class="absolute bottom-16 right-1 flex h-14 w-14 translate-y-2 transform items-center justify-center rounded-full opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 hover:scale-105 hover:bg-black hover:brightness-110"
                                    :style="{
                                        backgroundColor: useView.currentColor,
                                    }" @click.stop="playThisAlbum(item.id)">
                                    <span class="ml-0.5 text-3xl text-black">▶</span>
                                </button>
                                <p class="font-medium">{{ item.name }}</p>
                                <p class="text-sm">
                                    {{ item.total_song }} bài hát
                                </p>
                            </div>
                        </div>

                        <div v-if="isLoading"
                            class="group relative w-48 flex-shrink-0 cursor-pointer rounded-lg px-2 duration-200 ease-in-out hover:scale-105 hover:brightness-105">
                            <div>
                                <div class="mb-2 h-48 w-48 rounded-xl bg-zinc-700"></div>
                                <div class="my-2 h-5 w-28 rounded bg-zinc-700"></div>
                                <div class="my-2 h-5 w-24 rounded bg-zinc-700"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="mb-8 text-[#FFE5D6]">
                <h2 class="mb-1 text-2xl font-semibold">
                    Nghệ sĩ với nhiều người theo dõi
                </h2>
                <div class="scrollbar-style flex space-x-4 overflow-x-auto">
                    <div class="flex w-max space-x-4 px-1 py-2">
                        <div v-for="item in topArtist" :key="item.id"
                            class="w-48 flex-shrink-0 cursor-pointer rounded-lg px-2 duration-200 ease-in-out hover:scale-105 hover:brightness-105">
                            <div @click="
                                useView.selectItem(item);
                            useView.setComponent('ArtistPage');
                            useView.setArtistData(item);
                            ">
                                <div class="mb-2 h-48 w-48 rounded-full bg-zinc-700">
                                    <img class="h-48 w-48 rounded-full object-cover" :src="item.avatar_path" alt=""
                                        @error="
                                            (event) =>
                                            (event.target.src =
                                                defaultImgage)
                                        " />
                                </div>
                                <p class="font-medium">{{ item.name }}</p>
                                <p class="text-sm">
                                    {{ item.followers }} người theo dõi
                                </p>
                            </div>
                        </div>

                        <div v-if="isLoading"
                            class="w-48 flex-shrink-0 cursor-pointer rounded-lg px-2 duration-200 ease-in-out hover:scale-105 hover:brightness-105">
                            <div>
                                <div class="mb-2 h-48 w-48 rounded-full bg-zinc-700"></div>
                                <div class="my-2 h-5 w-24 rounded bg-zinc-700"></div>
                                <div class="my-2 h-5 w-28 rounded bg-zinc-700"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="mb-8 text-[#FFE5D6]">
                <h2 class="mb-1 text-2xl font-semibold">
                    Bài hát có nhiều lượt nghe
                </h2>
                <div class="scrollbar-style flex space-x-4 overflow-x-auto">
                    <div class="flex w-max space-x-4 px-1 py-2">
                        <div v-for="item in topSong" :key="item.id"
                            class="w-48 flex-shrink-0 cursor-pointer rounded-lg px-2 duration-200 ease-in-out hover:scale-105 hover:brightness-105"
                            @click="useSong.playOrPauseThisSong(item)">
                            <div class="mb-2 h-40 w-40 rounded-full bg-zinc-700">
                                <img class="h-40 w-40 rounded-full object-cover" :src="item.thumbnail_path" alt=""
                                    :class="{
                                        'animate-spin':
                                            currentTrack.id == item.id &&
                                            isPlaying,
                                    }" style="animation-duration: 5s" @error="
                                        (event) =>
                                            (event.target.src = defaultImgage)
                                    " />
                            </div>
                            <div class="flex justify-between">
                                <div>
                                    <p class="font-medium">{{ item.name }}</p>
                                    <p class="text-sm">
                                        {{ item.total_played }} lượt nghe
                                    </p>
                                </div>
                                <button @click.stop="
                                    useSong.addSongToWaitlist(item)
                                    " class="mr-4 rounded p-1 text-[#FFE5D6]/50 hover:bg-white/5">
                                    <Icon icon="material-symbols:home-storage-outline" class="text-2xl" />
                                </button>
                            </div>
                        </div>

                        <div v-if="isLoading"
                            class="w-48 flex-shrink-0 cursor-pointer rounded-lg px-2 duration-200 ease-in-out hover:scale-105 hover:brightness-105">
                            <div class="mb-2 h-40 w-40 rounded-full bg-zinc-700"></div>
                            <div class="flex justify-between">
                                <div>
                                    <div class="my-2 h-5 w-24 rounded bg-zinc-700"></div>
                                    <div class="my-2 h-5 w-28 rounded bg-zinc-700"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
