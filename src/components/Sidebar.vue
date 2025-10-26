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
import FavCover from '@/assets/FavCover.jpg';

const useView = useViewStore();
const authStore = useAuthStore();
const useSong = useSongStore();
const useModal = useModalStore();
const useActivity = useActivityStore();

const { followArtistList, followAlbumList, favSongList, myPlaylistList } =
    storeToRefs(useActivity);
const { openEditPlaylist } = storeToRefs(useModal);

const filter = ref('all');
const search = ref('');
const filteredPlaylist = computed(() => {
    return myPlaylistList.value.filter((item) =>
        item.name.toLowerCase().includes(search.value.toLowerCase()),
    );
});
const filteredAlbum = computed(() => {
    return followAlbumList.value.filter((item) =>
        item.name.toLowerCase().includes(search.value.toLowerCase()),
    );
});
const filteredArtist = computed(() => {
    return followArtistList.value.filter((item) =>
        item.artist.name.toLowerCase().includes(search.value.toLowerCase()),
    );
});

const createPlaylist = async () => {
    try {
        const res = await api.post('/library/store-playlist', {}, {
            headers: {
                Authorization: 'Bearer ' + authStore.user.token,
            },
        });
        useActivity.fetchData();
        useActivity.addNotify(false, 'Tạo playlist thành công!!');
    } catch (error) {
        console.error('Lỗi khi tạo playlist:', error);
        useActivity.addNotify(true, 'Tạo playlist thất bại!!');
    }
};

const deletePlaylist = async (item) => {
    try {
        const res = await api.get(`/library/destroy-playlist/${item.id}`, {
            headers: {
                Authorization: 'Bearer ' + authStore.user.token,
            },
        });
        useActivity.fetchData();
        useActivity.addNotify(false, 'Xóa playlist thành công!!');
        useView.setComponent('HomePage');
    } catch (error) {
        console.error('Lỗi khi xóa playlist:', error);
        useActivity.addNotify(true, 'Xóa playlist thất bại!!');
    }
};

const editPlaylist = async (playlist) => {
    useModal.setPlaylistEditData(playlist);
    openEditPlaylist.value = true;
};

onMounted(() => {
    useActivity.fetchData();
});
</script>

<template>
    <div class="fixed bottom-0 left-0 top-0 z-0 w-full" :style="{ backgroundColor: useView.currentColor }"></div>
    <div class="fixed left-1.5 top-[64px] z-50 h-[83.4%] w-[22.4%] rounded-[24px] bg-[#1D1512] p-6">
        <div class="mx-1 mb-4 flex items-center justify-between">
            <h2 class="text-xl font-semibold text-[#FFE5D6]">Thư viện</h2>
            <div class="flex items-center gap-2">
                <button @click="createPlaylist"
                    class="flex items-center gap-2 rounded-full bg-[#47342D] px-3 py-1 text-sm text-[#FFE5D6] transition-all duration-200 hover:bg-transparent">
                    <span class="text-base font-semibold">+</span>
                    <span class="font-semibold">Tạo</span>
                </button>
            </div>
        </div>

        <div class="mb-4 flex gap-2">
            <button
                class="rounded-full bg-[#47342D] px-3 py-1 text-sm font-semibold transition-all duration-200 hover:bg-[#47342D]/20"
                :class="filter === 'all'
                    ? 'bg-[#FFE5D6] text-[#47342D] hover:bg-[#FFE5D6]'
                    : 'bg-[#47342D] text-[#FFE5D6]'
                    " @click="filter = 'all'">
                Tất cả
            </button>
            <button
                class="rounded-full bg-[#47342D] px-3 py-1 text-sm font-semibold transition-all duration-200 hover:bg-[#47342D]/20"
                :class="filter === 'playlist'
                    ? 'bg-[#FFE5D6] text-[#47342D] hover:bg-[#FFE5D6]'
                    : 'bg-[#47342D] text-[#FFE5D6]'
                    " @click="filter = 'playlist'">
                Danh sách phát
            </button>
            <button
                class="rounded-full bg-[#47342D] px-3 py-1 text-sm font-semibold transition-all duration-200 hover:bg-[#47342D]/20"
                :class="filter === 'artist'
                    ? 'bg-[#FFE5D6] text-[#47342D] hover:bg-[#FFE5D6]'
                    : 'bg-[#47342D] text-[#FFE5D6]'
                    " @click="filter = 'artist'">
                Nghệ sĩ
            </button>
        </div>

        <input type="text" v-model="search" placeholder="Tìm kiếm"
            class="my-2 w-full rounded-full bg-[#1D1512] px-5 py-2 text-[#FFE5D6] outline outline-2 outline-[#BC4D15] transition-all duration-200 focus:outline-white"
            :style="{ outlineColor: useView.currentColor }" />

        <div class="h-[82%] overflow-y-auto scrollbar-none">
            <TransitionGroup tag="div" enter-active-class="transform-gpu" enter-class="opacity-0 -translate-x-full"
                enter-to-class="opacity-100 translate-x-0" leave-active-class="absolute transform-gpu"
                leave-class="opacity-100 translate-x-0" leave-to-class="opacity-0 translate-y-full"
                class="flex flex-col gap-2 overflow-hidden">
                <div v-if="filter == 'all' || filter == 'playlist'"
                    class="mt-2 flex cursor-pointer items-center gap-3 rounded p-3 transition-all duration-200 hover:bg-white/10"
                    @click="
                        useView.selectItem(favSongList);
                    useView.setComponent('PlaylistPage');
                    useView.setPlaylistData(favSongList);
                    " :class="{ 'bg-white/10': useView.selected === favSongList }">
                    <div class="flex h-10 w-10 items-center justify-center rounded bg-white/10">
                        <img class="w-fixed max-h-10 max-w-10 flex-shrink-0 rounded object-cover" :src="FavCover"
                            @error="
                                (event) => (event.target.src = defaultImgage)
                            " />
                    </div>

                    <div class="min-w-0 flex-1">
                        <div class="whitespace-nowrap font-semibold leading-4 text-[#FFE5D6]">
                            Bài hát yêu thích
                        </div>
                        <div class="text-s font-medium text-[#FFE5D6]/50">
                            {{ favSongList.total_song }} bài hát
                        </div>
                    </div>
                </div>

                <div v-for="(item, index) in filteredPlaylist" :key="index"
                    v-if="filter == 'all' || filter == 'playlist'"
                    class="flex cursor-pointer items-center gap-3 rounded p-3 transition-all duration-200 hover:bg-white/10"
                    @click="
                        useView.selectItem(item);
                    useView.setComponent('PlaylistPage');
                    useView.setPlaylistData(item);
                    " :class="{ 'bg-white/10': useView.selected === item }">
                    <div class="flex h-10 w-10 rounded bg-white/10">
                        <img :src="item.thumbnail_path" class="w-10 flex-shrink-0 rounded object-cover" @error="
                            (event) => (event.target.src = defaultImgage)
                        " />
                    </div>

                    <div>
                        <div class="white flex-1 break-normal font-semibold leading-4 text-[#FFE5D6] md:break-all">
                            {{ item.name }}
                        </div>
                        <div class="text-s font-medium text-[#FFE5D6]/50">
                            {{
                                item.type === 2
                                    ? 'Danh sách phát • ' +
                                    item.total_song +
                                    ' bài hát'
                                    : 'Album của nghệ sĩ • ' +
                                    item.total_song +
                                    ' bài hát'
                            }}
                        </div>
                    </div>
                    <div class="ml-auto">
                        <button class="rounded p-2 text-[#FFE5D6]/50 transition-all duration-200 hover:bg-white/5"
                            @click.stop="
                                editPlaylist(item);
                            console.log(item);
                            ">
                            <Icon icon="material-symbols:edit-square-rounded" class="text-xl" />
                        </button>
                        <button class="rounded p-1.5 text-[#FFE5D6]/50 transition-all duration-200 hover:bg-white/5"
                            @click.stop="deletePlaylist(item)">
                            <Icon icon="material-symbols:delete-rounded" class="text-2xl" />
                        </button>
                    </div>
                </div>
                <div v-for="(item, index) in filteredAlbum" :key="index" v-if="filter == 'all' || filter == 'playlist'"
                    class="flex cursor-pointer items-center gap-3 rounded p-3 transition-all duration-200 hover:bg-white/10"
                    @click="
                        useView.selectItem(item);
                    useView.setComponent('PlaylistPage');
                    useView.setPlaylistData(item);
                    " :class="{ 'bg-white/10': useView.selected === item }">
                    <div class="flex h-10 w-10 rounded bg-white/10">
                        <img :src="item.thumbnail_path" class="h-10 w-10 flex-shrink-0 rounded object-cover" @error="
                            (event) => (event.target.src = defaultImgage)
                        " />
                    </div>

                    <div>
                        <div class="font-semibold leading-4 text-[#FFE5D6]">
                            {{ item.name }}
                        </div>
                        <div class="text-s font-medium text-[#FFE5D6]/50">
                            {{
                                item.type === 2
                                    ? 'Danh sách phát • ' +
                                    item.total_song +
                                    ' bài hát'
                                    : 'Album của nghệ sĩ • ' +
                                    item.total_song +
                                    ' bài hát'
                            }}
                        </div>
                    </div>
                    <div class="ml-auto">
                        <button class="rounded p-1 text-[#FFE5D6]/50 hover:bg-white/5"
                            @click.stop="deletePlaylist(item)">
                            <Icon icon="material-symbols:delete-rounded" class="text-2xl" />
                        </button>
                    </div>
                </div>

                <div v-for="(item, index) in filteredArtist" :key="index" v-if="filter == 'all' || filter == 'artist'"
                    class="flex cursor-pointer items-center gap-3 rounded p-3 transition-all duration-200 hover:bg-white/10"
                    @click="
                        useView.selectItem(item.artist);
                    useView.setComponent('ArtistPage');
                    useView.setArtistData(item.artist);
                    " :class="{
                        'bg-white/10':
                            useView.selected?.email == item.artist.email,
                    }">
                    <div class="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                        <img :src="item.artist.avatar_path" class="h-10 w-10 flex-shrink-0 rounded-full object-cover"
                            @error="
                                (event) => (event.target.src = defaultImgage)
                            " />
                    </div>

                    <div>
                        <div class="font-semibold leading-4 text-[#FFE5D6]">
                            {{ item.artist.name }}
                        </div>
                        <div class="text-s font-medium text-[#FFE5D6]/50">
                            {{ ' Nghệ sĩ ' }}
                        </div>
                    </div>
                </div>
            </TransitionGroup>
        </div>
    </div>
</template>
