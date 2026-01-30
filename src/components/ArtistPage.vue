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

const { artistData } = storeToRefs(useView);
const { followArtistList } = storeToRefs(useActivity);

const isFollowed = ref(false);
const isMe = ref(false);
const thisArtistListSong = ref([]);
const thisArtistListAlbum = ref([]);

const bgColor = ref('#FFFFFF');

function checkMe() {
    isMe.value = false;
    if (artistData.value.id === authStore.user.id) {
        isMe.value = true;
    }
}

async function getArtistSong() {
    try {
        const res = await api.get(
            `/artist/get-artist-songs/${artistData.value.id}`,
            {
                headers: {
                    Authorization: 'Bearer ' + authStore.user.token,
                },
            },
        );
        thisArtistListSong.value = res.data.data;
    } catch (e) {
        console.log(e);
        useActivity.addNotify(true, 'Call Api thất bại!');
    }
}
async function getArtistAlbum() {
    try {
        const res = await api.get(
            `/artist/get-artist-albums/${artistData.value.id}`,
            {
                headers: {
                    Authorization: 'Bearer ' + authStore.user.token,
                },
            },
        );
        thisArtistListAlbum.value = res.data.data;
    } catch (e) {
        console.log(e);
        useActivity.addNotify(true, 'Call Api thất bại!');
    }
}

async function followThisArtist() {
    try {
        const res = await api.get(`/artist/follow/${artistData.value.id}`, {
            headers: {
                Authorization: 'Bearer ' + authStore.user.token,
            },
        });
        useActivity.fetchData();
        isFollowed.value = !isFollowed.value;
        useActivity.addNotify(false, 'Bạn đã theo dõi nghệ sĩ!');
    } catch (e) {
        console.log(e);
        useActivity.addNotify(true, 'Call Api thất bại!');
    }
}
async function unfollowThisArtist() {
    try {
        const res = await api.get(
            `/library/destroy-favorite-artist/${artistData.value.id}`,
            {
                headers: {
                    Authorization: 'Bearer ' + authStore.user.token,
                },
            },
        );
        useActivity.fetchData();
        isFollowed.value = !isFollowed.value;
        useActivity.addNotify(false, 'Bạn đã hủy theo dõi nghệ sĩ!');
    } catch (e) {
        console.log(e);
        useActivity.addNotify(true, 'Call Api thất bại!');
    }
}

async function blockThisArtist() {
    try {
        const res = await api.get(`/artist/block/${artistData.value.id}`, {
            headers: {
                Authorization: 'Bearer ' + authStore.user.token,
            },
        });
        unfollowThisArtist();
        useActivity.fetchData();
        useView.setComponent('HomePage');
        useActivity.addNotify(false, 'Bạn đã hạn chế nghệ sĩ!');
    } catch (e) {
        console.log(e);
        useActivity.addNotify(true, 'Call Api thất bại!');
    }
}

watch(
    () => artistData.value,
    () => {
        getArtistSong();
        getArtistAlbum();
        checkMe();
        isFollowed.value = false;
        followArtistList.value.forEach((artist) => {
            if (artist.artist_id === artistData.value.id) {
                isFollowed.value = true;
            }
        });
    },
);

onMounted(() => {
    getArtistSong();
    getArtistAlbum();
    checkMe();
    followArtistList.value.forEach((artist) => {
        if (artist.artist_id === artistData.value.id) {
            isFollowed.value = true;
        }
    });
});
</script>
<template>
    <div
        class="scrollbar-style h-[calc(100vh-12rem)] w-full space-y-6 overflow-y-auto rounded-[24px] bg-white text-gray-900 dark:bg-[#1D1512] dark:text-[#FFFF]">
        <div class="relative h-96 items-center">
            <img :src="artistData.avatar_path" alt="" class="absolute z-0 h-full w-full object-cover" />

            <div
                class="relative z-10 flex h-full flex-col justify-end space-y-2 bg-gradient-to-t from-black/60 to-transparent p-16">
                <p class="flex text-lg font-semibold text-white">
                    <Icon icon="mdi:check-decagram" class="mr-2 text-2xl text-blue-500" />
                    Nghệ sĩ được xác minh
                </p>
                <h1 class="text-8xl font-black text-white">{{ artistData.name }}</h1>
                <p class="mt-1 text-lg font-semibold text-white">
                    {{ artistData.followers }} người theo dõi
                </p>
            </div>
        </div>

        <div class="px-12">
            <div class="">
                <div class="flex justify-between">
                    <div class="mb-5 flex items-center space-x-6">
                        <button
                            class="group flex h-14 w-14 items-center justify-center rounded-full transition hover:bg-black hover:scale-110 dark:hover:bg-black"
                            :style="{ backgroundColor: useView.currentColor }">
                            <Icon icon="mdi:play" class="ml-0.5 text-5xl text-black group-hover:text-white" @click="
                                useSong.addAndPlayThisPlaylist(
                                    thisArtistListSong,
                                )
                                " />
                        </button>
                        <button @click.stop="
                            useSong.addPlaylistToWaitlist(
                                thisArtistListSong,
                            )
                            "
                            class="mr-4 rounded p-1 text-gray-600 hover:bg-gray-200 dark:text-[#FFE5D6]/50 dark:hover:bg-white/5">
                            <Icon icon="material-symbols:home-storage-outline" class="text-5xl" />
                        </button>

                        <div v-if="!isMe">
                            <button v-if="!isFollowed" @click="followThisArtist"
                                class="rounded-full border px-4 py-2 text-sm font-semibold transition hover:scale-110"
                                :style="{
                                    borderColor: useView.currentColor,
                                    color: useView.currentColor,
                                }">
                                Theo dõi
                            </button>
                            <button v-else @click="unfollowThisArtist"
                                class="rounded-full border px-4 py-2 text-sm font-semibold hover:scale-110" :style="{
                                    borderColor: useView.currentColor,
                                    color: useView.currentColor,
                                }">
                                Hủy theo dõi
                            </button>
                        </div>
                    </div>
                    <div>
                        <button v-if="!isMe" @click="blockThisArtist"
                            class="rounded-full border border-red-500 px-4 py-2 text-sm font-semibold text-red-500 transition hover:bg-red-500 hover:text-white dark:hover:text-black">
                            Hạn chế nghệ sĩ
                        </button>
                    </div>
                </div>

                <div class="w-full" v-if="thisArtistListSong.length > 0">
                    <h2 class="pl-14 text-2xl font-semibold">Phổ biến</h2>
                    <div class="px-12">
                        <div v-for="(item, index) in thisArtistListSong" :key="item.id"
                            @click="useSong.playThisSong(item)"
                            class="flex cursor-pointer items-center justify-between rounded-lg py-2 pr-4 transition hover:bg-gray-100 dark:hover:bg-[#2a1d18]">
                            <div class="flex items-center space-x-4">
                                <span class="w-5 text-right">{{
                                    ++index
                                }}</span>
                                <img class="h-16 w-16 rounded-md object-cover" :src="item.thumbnail_path" />
                                <span class="font-medium">{{
                                    item.name
                                }}</span>
                            </div>
                            <div class="flex items-center space-x-8 text-sm">
                                <span>{{ item.total_played }} lượt nghe</span>
                                <button @click.stop="
                                    useSong.addSongToWaitlist(item)
                                    "
                                    class="mr-4 rounded p-1 text-gray-600 hover:bg-gray-200 dark:text-[#FFE5D6]/50 dark:hover:bg-white/5">
                                    <Icon icon="material-symbols:home-storage-outline" class="text-2xl" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="mt-8">
                <h2 class="mb-3 pl-14 text-2xl font-semibold">
                    Giới thiệu về nghệ sĩ
                </h2>
                <div class="">
                    <div
                        class="relative mb-3 flex h-[30rem] w-full cursor-pointer flex-col justify-end overflow-hidden rounded-3xl p-12 duration-200 ease-in-out hover:scale-[102%]">
                        <img class="absolute inset-0 h-full w-full rounded-3xl object-cover"
                            :src="artistData.avatar_path" />
                        <div class="relative z-10">
                            <p class="text-2xl font-semibold text-white">
                                {{ artistData.followers }} người theo dõi trên
                                nền tảng
                            </p>
                            <p class="text-xl font-semibold text-white">
                                {{ artistData.description }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="mt-8" v-if="thisArtistListAlbum.length > 0">
                <div class="mb-2 space-y-2 pl-14 font-semibold">
                    <h2 class="text-2xl">Danh sách Album</h2>
                </div>

                <div class="scrollbar-style w-full overflow-x-auto">
                    <div class="flex w-max space-x-4 px-1 py-2">
                        <div v-for="item in thisArtistListAlbum" :key="item.id"
                            class="w-48 flex-shrink-0 cursor-pointer rounded-lg px-2 duration-200 ease-in-out hover:scale-105"
                            @click="
                                useView.selectItem(item);
                            useView.setComponent('PlaylistPage');
                            useView.setPlaylistData(item);
                            ">
                            <div class="mb-2 h-48 w-48 rounded-xl bg-gray-300 dark:bg-zinc-700">
                                <img class="h-full w-full rounded-xl object-cover" :src="item.thumbnail_path" />
                            </div>
                            <p class="text-xl font-semibold">{{ item.name }}</p>
                            <p class="text-sm">
                                Năm
                                {{ new Date(item.created_at).getFullYear() }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>