<script setup>
import { api } from '@/api/axios';
import { ref, computed, onMounted } from 'vue';
import { Icon } from '@iconify/vue';
import { useViewStore } from '@/stores/view';
import { storeToRefs } from 'pinia';
import { useSongStore } from '@/stores/song';
import { useAuthStore } from '@/stores/auth';
import { useModalStore } from '@/stores/modal';
import { useActivityStore } from '@/stores/activity';
import defaultImgage from '@/assets/default.jpg';

let openMenu = ref(false);
let openUploadAlbum = ref(false);

const useActivity = useActivityStore();
const useView = useViewStore();
const authStore = useAuthStore();
const useSong = useSongStore();
const useModal = useModalStore();
const { currentComponent, isFullscreen } = storeToRefs(useView);
const { openEditProfile, openUploadSong, openEditAlbum } =
    storeToRefs(useModal);
const { myPlaylistList, followArtistList, myAlbumList, mySongList } =
    storeToRefs(useActivity);

const bills = ref([]);

async function getBills() {
    try {
        const res = await api.get(`/profile/payment-history`, {
            headers: {
                Authorization: 'Bearer ' + authStore.user.token,
            },
        });
        console.log(res.data.data);
        if (res.data.code == 200) {
            bills.value = res.data.data;
        }
    } catch (e) {
        console.log(e);
        useActivity.addNotify(true, 'Call Api thất bại!');
    }
}

async function createAlbum() {
    try {
        const res = await api.get(`/profile/create-album`, {
            headers: {
                Authorization: 'Bearer ' + authStore.user.token,
            },
        });
        if (res.data.code == 200) {
            useActivity.addNotify(false, 'Tạo Album thành công!');
            useActivity.fetchUserData();
        }
    } catch (e) {
        console.log(e);
        useActivity.addNotify(true, 'Call Api thất bại!');
    }
}

function albumCheck() {
    if (myAlbumList.value.length > 0) {
        openUploadSong.value = true;
    } else {
        useActivity.addNotify(
            true,
            'Vui lòng tạo ít nhất một Album để chứa bài hát!',
        );
    }
}

onMounted(() => {
    getBills();
    useActivity.fetchUserData();
    console.log(authStore.user);
});
</script>

<template>
    <div class="h-[76%] w-full space-y-10 rounded-[24px]
               bg-white dark:bg-[#1D1512]
               text-zinc-900 dark:text-white">
        <div class="flex h-52 items-center space-x-7 px-10 py-6 rounded-t-[24px]
                   bg-gradient-to-b
                   from-white/60 to-zinc-200
                   dark:from-[#1D1512]/20 dark:to-[#312825]">
            <div class="aspect-square h-[160px] w-[160px] rounded-full bg-zinc-300 dark:bg-zinc-600">
                <img class="aspect-square h-[160px] w-[160px] rounded-full object-cover"
                    :src="authStore.user.avatar_path" alt="" @error="(event) => (event.target.src = defaultImgage)" />
            </div>

            <div class="space-y-2">
                <p class="text-lg text-zinc-500 dark:text-zinc-400">Hồ sơ</p>
                <h1 class="text-6xl font-bold">
                    {{ authStore.user.name }}
                </h1>
                <p class="mt-1 text-lg text-zinc-500 dark:text-zinc-400">
                    {{ myPlaylistList.length }} Playlist •
                    {{ followArtistList.length }} nghệ sĩ đang theo dõi
                </p>
            </div>
        </div>

        <div class="scrollbar-style relative h-[calc(100vh-450px)] overflow-y-auto px-10">
            <button class="mb-5 rounded-full p-2 text-3xl
                       text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900
                       dark:text-zinc-400 dark:hover:bg-zinc-600 dark:hover:text-white" @click="openMenu = !openMenu">
                <Icon icon="ph:dots-three-outline-fill" />
            </button>
            <span v-if="openMenu" class="absolute left-10 top-14 z-20 w-[200px] p-1
                       bg-white dark:bg-[#282828]
                       shadow-lg rounded-lg">
                <ul class="text-[14px] font-semibold
                           text-zinc-700 dark:text-gray-200">
                    <li class="cursor-pointer px-3 py-2
                               hover:bg-zinc-200 dark:hover:bg-[#3E3D3D]" @click="openEditProfile = true">
                        Chỉnh sửa hồ sơ
                    </li>
                    <li class="cursor-pointer px-3 py-2
                               hover:bg-zinc-200 dark:hover:bg-[#3E3D3D]" @click="albumCheck">
                        Đăng tải bài hát
                    </li>
                    <li class="cursor-pointer px-3 py-2
                               hover:bg-zinc-200 dark:hover:bg-[#3E3D3D]" @click="createAlbum">
                        Tạo một album
                    </li>
                </ul>
            </span>

            <div class="mb-3 mt-8" v-if="myAlbumList.length > 0">
                <h2 class="mb-4 text-lg font-semibold">
                    Album của tôi
                </h2>

                <div class="scrollbar-style overflow-x-auto">
                    <div class="flex w-max space-x-7 px-1 py-2">
                        <div v-for="item in myAlbumList" :key="item.id" class="group w-48 flex-shrink-0 cursor-pointer
                                   transition-all duration-200
                                   hover:scale-105 hover:brightness-105" @click="
                                    useView.selectItem(item);
                                useView.setComponent('PlaylistPage');
                                useView.setPlaylistData(item);
                                ">
                            <div class="mb-2 h-48 w-full rounded-xl
                                bg-zinc-200 dark:bg-zinc-700
                                ring-1 ring-zinc-300 dark:ring-zinc-600
                                overflow-hidden">
                                <img class="h-full w-full object-cover" :src="item.thumbnail_path"
                                    @error="(event) => (event.target.src = defaultImgage)" />
                            </div>
                            <div class="flex justify-between">
                                <div>
                                    <p class="text-lg font-medium">
                                        {{ item.name }}
                                    </p>
                                    <p class="text-sm text-zinc-500 dark:text-zinc-400">
                                        Năm {{ new Date(item.created_at).getFullYear() }}
                                    </p>
                                </div>

                                <button class="rounded p-2
                                           text-zinc-500 hover:bg-black/5
                                           dark:text-[#FFE5D6]/50 dark:hover:bg-white/5" @click.stop="
                                            useModal.setPlaylistEditData(item);
                                        openEditAlbum = true;
                                        ">
                                    <Icon icon="material-symbols:edit-square-rounded" class="text-xl" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="mb-3 mt-8" v-if="mySongList.length > 0">
                <h2 class="mb-4 text-lg font-semibold
               text-zinc-900 dark:text-white">
                    Danh sách bài hát của tôi
                </h2>

                <div class="scrollbar-style overflow-x-auto">
                    <div class="flex w-max space-x-7 px-1 py-2">
                        <div v-for="item in mySongList" :key="item.id" class="group relative flex-shrink-0 cursor-pointer
                       transition-all duration-200 ease-in-out
                       hover:scale-105 hover:brightness-105" @click="useSong.playThisSong(item)">
                            <div class="mb-5 h-32 w-32 rounded-full
                           bg-zinc-300 dark:bg-zinc-700">
                                <img class="h-full w-full rounded-full object-cover" :src="item.thumbnail_path"
                                    @error="(event) => (event.target.src = defaultImgage)" />
                            </div>

                            <div class="flex justify-between">
                                <p class="font-medium text-zinc-900 dark:text-white">
                                    {{ item.name }}
                                </p>

                                <button @click.stop="useSong.addSongToWaitlist(item)" class="mr-4 rounded p-1
                               text-zinc-500 hover:bg-black/5
                               dark:text-[#FFE5D6]/50 dark:hover:bg-white/5">
                                    <Icon icon="material-symbols:home-storage-outline" class="text-2xl" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="myPlaylistList.length > 0" class="mt-8">
                <h2 class="mb-4 text-lg font-semibold
               text-zinc-900 dark:text-white">
                    Playlist của tôi
                </h2>

                <div class="scrollbar-style overflow-x-auto">
                    <div class="flex w-max space-x-7 px-1 py-2">
                        <div v-for="item in myPlaylistList" :key="item.id" class="group w-32 flex-shrink-0 cursor-pointer
                        transition-all duration-200 ease-in-out
                        hover:scale-105 hover:brightness-105" @click="
                            useView.selectItem(item);
                        useView.setComponent('PlaylistPage');
                        useView.setPlaylistData(item);
                        ">
                            <div
                                class="mb-2 h-32 w-full rounded-xl overflow-hidden bg-zinc-300 dark:bg-zinc-700 ring-1 ring-zinc-300 dark:ring-zinc-600">
                                <img img class="h-full w-full object-cover" :src="item.thumbnail_path"
                                    @error="(event) => (event.target.src = defaultImgage)" />
                            </div>

                            <p class="font-medium text-zinc-900 dark:text-white">
                                {{ item.name }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="mt-8" v-if="followArtistList.length > 0">
                <h2 class="mb-4 text-lg font-semibold
               text-zinc-900 dark:text-white">
                    Đang theo dõi
                </h2>

                <div class="scrollbar-style overflow-x-auto">
                    <div class="flex w-max space-x-7 px-1 py-2">
                        <div v-for="item in followArtistList" :key="item.id" class="group flex-shrink-0 cursor-pointer
                       transition-all duration-200 ease-in-out
                       hover:scale-105 hover:brightness-105" @click="
                        useView.selectItem(item.artist);
                    useView.setComponent('ArtistPage');
                    useView.setArtistData(item.artist);
                    ">
                            <div class="mb-5 h-32 w-32 rounded-full
                           bg-zinc-300 dark:bg-zinc-700 ring-1 ring-zinc-300 dark:ring-zinc-600">
                                <img class="h-full w-full rounded-full object-cover" :src="item.artist.avatar_path"
                                    @error="(event) => (event.target.src = defaultImgage)" />
                            </div>

                            <p class="text-sm text-zinc-500 dark:text-zinc-400">
                                {{ item.artist.name }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>


            <div v-if="bills.length > 0">
                <h2 class="mb-4 mt-8 text-lg font-semibold">
                    Lịch sử thanh toán
                </h2>

                <div class="scrollbar-style max-h-[30rem] overflow-y-auto rounded-lg
                           border border-zinc-300 dark:border-gray-700">
                    <table class="min-w-full bg-white dark:bg-[#1a1a1a]">
                        <thead class="sticky top-0
                                   bg-zinc-200 dark:bg-[#2a2a2a]">
                            <tr>
                                <th v-for="title in ['Mã giao dịch', 'Ngày thanh toán', 'Số tiền', 'Tên', 'Gói dịch vụ', 'Trạng thái']"
                                    :key="title" class="px-4 py-3 text-left text-sm font-semibold
                                           text-zinc-700 dark:text-[#FFE5D6]">
                                    {{ title }}
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr v-for="item in bills" :key="item.id" class="border-t border-zinc-200 dark:border-gray-700
                                       transition-colors
                                       hover:bg-zinc-100 dark:hover:bg-[#2a2a2a]">
                                <td class="px-4 py-3 text-zinc-600 dark:text-[#B0B0B0]">
                                    {{ item.id }}
                                </td>
                                <td class="px-4 py-3 text-zinc-600 dark:text-[#B0B0B0]">
                                    {{ new Date(item.created_at).toLocaleDateString('vi-VN') }}
                                </td>
                                <td class="px-4 py-3 text-zinc-600 dark:text-[#B0B0B0]">
                                    {{
                                        item.playlist_id
                                            ? item.playlist.price
                                            : item.song.price
                                    }} vnd
                                </td>
                                <td class="px-4 py-3 text-zinc-600 dark:text-[#B0B0B0]">
                                    {{
                                        item.playlist_id
                                            ? item.playlist.name
                                            : item.song.name
                                    }}
                                </td>
                                <td class="px-4 py-3 text-zinc-600 dark:text-[#B0B0B0]">
                                    {{ item.playlist_id ? 'Album' : 'Bài hát' }}
                                </td>
                                <td class="px-4 py-3">
                                    <span
                                        class="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold"
                                        :class="{
                                            'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400': item.status == 2,
                                            'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400': item.status == 1,
                                        }">
                                        <span class="h-2 w-2 rounded-full" :class="{
                                            'bg-green-500': item.status == 2,
                                            'bg-yellow-500': item.status == 1,
                                        }"></span>

                                        {{
                                            item.status == 1
                                                ? 'Thất bại'
                                                : 'Thành công'
                                        }}
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>
