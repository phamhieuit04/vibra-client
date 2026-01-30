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
const recentRotation = ref([]);
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

async function FetchRecentRotation() {
    try {
        const res = await api.get('/home/recent-rotation', {
            params: {
                limit: 5,
            },
            headers: {
                Authorization: 'Bearer ' + authStore.user.token,
            },
        });
        recentRotation.value = res.data.data;
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
    await FetchRecentRotation();
    await FetchAlbumData();
    await FetchArtistData();
    await FetchSongData();
    isLoading.value = false;
}

const trackDurations = ref({});
function caculateTrackTime(song_path, songId) {
    if (trackDurations.value[songId]) {
        return trackDurations.value[songId];
    }

    const audio = new Audio(song_path);
    audio.addEventListener('loadedmetadata', function () {
        const duration = audio.duration;
        const minutes = Math.floor(duration / 60);
        const seconds = Math.floor(duration % 60);
        trackDurations.value[songId] =
            minutes + ':' + seconds.toString().padStart(2, '0');
    });

    return '--:--';
}

const sectionOrder = ref([]);
function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

onMounted(async () => {
    // Khởi tạo thứ tự sections ngay từ đầu
    sectionOrder.value = shuffle([
        'interestSongs',
        'popularAlbum',
        'recentRotation',
        'topArtist',
        'topSong',
    ]);

    // Sau đó mới load data
    await handleLoading();
});
</script>
<template>
    <div
        class="scrollbar-style h-[calc(100vh-12rem)] w-full space-y-6 overflow-auto rounded-[24px] bg-[#1D1512] px-8 py-8 text-[#FFFF] scrollbar-none"
    >
        <div v-for="section in sectionOrder" :key="section">
            <template v-if="section === 'interestSongs'">
                <div
                    v-if="interestSongs.length > 0"
                    class="mb-8 text-[#FFE5D6]"
                >
                    <h2 class="mb-1 text-2xl font-semibold">
                        Bài hát phù hợp với bạn
                    </h2>
                    <div class="space-y-2">
                        <div
                            v-for="item in interestSongs.slice(0, 5)"
                            :key="item.id"
                            class="flex cursor-pointer items-center rounded-lg p-3 duration-200 ease-in-out hover:bg-white/5"
                            @click="useSong.playOrPauseThisSong(item)"
                        >
                            <img
                                class="h-14 w-14 object-cover transition-all duration-300"
                                :class="{
                                    'animate-spin rounded-full':
                                        currentTrack.id == item.id && isPlaying,
                                    'rounded-md': !(
                                        currentTrack.id == item.id && isPlaying
                                    ),
                                }"
                                :src="item.thumbnail_path"
                                alt=""
                                style="animation-duration: 5s"
                                @error="
                                    (event) =>
                                        (event.target.src = defaultImgage)
                                "
                            />
                            <div class="ml-4 flex-1">
                                <p class="font-medium">{{ item.name }}</p>
                                <p class="text-sm text-[#FFE5D6]/70">
                                    {{ item.total_played }} lượt nghe
                                </p>
                            </div>
                            <div class="flex items-center justify-center">
                                <div class="mx-5 text-xs text-gray-400">
                                    {{
                                        caculateTrackTime(
                                            item.song_path,
                                            item.id,
                                        )
                                    }}
                                </div>
                                <button
                                    @click.stop="
                                        useSong.addSongToWaitlist(item)
                                    "
                                    class="rounded p-2 text-[#FFE5D6]/50 hover:bg-white/5"
                                >
                                    <Icon
                                        icon="material-symbols:home-storage-outline"
                                        class="text-2xl"
                                    />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="isLoading" class="mb-8 text-[#FFE5D6]">
                    <div class="shimmer mb-3 h-8 w-64 rounded"></div>
                    <div class="space-y-2">
                        <div
                            v-for="i in 5"
                            :key="'interest-skeleton-' + i"
                            class="flex items-center rounded-lg p-3"
                        >
                            <div class="shimmer h-14 w-14 rounded-md"></div>
                            <div class="ml-4 flex-1">
                                <div
                                    class="shimmer mb-2 h-5 w-32 rounded"
                                ></div>
                                <div class="shimmer h-4 w-24 rounded"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </template>

            <template v-else-if="section === 'popularAlbum'">
                <div class="mb-8 text-[#FFE5D6]">
                    <h2 class="mb-1 text-2xl font-semibold">Album phổ biến</h2>
                    <div class="relative">
                        <div
                            class="scrollbar-style flex space-x-4 overflow-x-auto pr-8"
                        >
                            <div class="flex w-max space-x-4 px-1 py-2">
                                <div
                                    v-for="item in popularAlbum"
                                    :key="popularAlbum.id"
                                    class="group relative w-48 flex-shrink-0 cursor-pointer rounded-lg px-2 duration-200 ease-in-out hover:scale-105 hover:brightness-105"
                                >
                                    <div
                                        @click="
                                            useView.selectItem(item);
                                            useView.setComponent(
                                                'PlaylistPage',
                                            );
                                            useView.setPlaylistData(item);
                                        "
                                    >
                                        <div
                                            class="mb-2 h-48 w-48 rounded-xl bg-zinc-700"
                                        >
                                            <img
                                                class="h-48 w-48 rounded-xl object-cover"
                                                :src="item.thumbnail_path"
                                                alt=""
                                                @error="
                                                    (event) =>
                                                        (event.target.src =
                                                            defaultImgage)
                                                "
                                            />
                                        </div>
                                        <button
                                            class="absolute bottom-16 right-1 flex h-14 w-14 translate-y-2 transform items-center justify-center rounded-full opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 hover:scale-105 hover:bg-black hover:brightness-110"
                                            :style="{
                                                backgroundColor:
                                                    useView.currentColor,
                                            }"
                                            @click.stop="playThisAlbum(item.id)"
                                        >
                                            <span
                                                class="ml-0.5 text-3xl text-black"
                                                >▶</span
                                            >
                                        </button>
                                        <p class="font-medium">
                                            {{ item.name }}
                                        </p>
                                        <p class="text-sm">
                                            {{ item.total_song }} bài hát
                                        </p>
                                    </div>
                                </div>
                                <div
                                    v-for="i in isLoading ? 5 : 0"
                                    :key="'album-skeleton-' + i"
                                    class="group relative w-48 flex-shrink-0 cursor-pointer rounded-lg px-2"
                                >
                                    <div
                                        class="shimmer mb-2 h-48 w-48 rounded-xl"
                                    ></div>
                                    <div
                                        class="shimmer my-2 h-5 w-28 rounded"
                                    ></div>
                                    <div
                                        class="shimmer my-2 h-5 w-24 rounded"
                                    ></div>
                                </div>
                            </div>
                        </div>
                        <div
                            class="pointer-events-none absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-[#1D1512] to-transparent"
                        ></div>
                    </div>
                </div>
            </template>

            <template v-else-if="section === 'recentRotation'">
                <div
                    v-if="recentRotation.length > 0"
                    class="mb-8 text-[#FFE5D6]"
                >
                    <h2 class="mb-1 text-2xl font-semibold">
                        Lắng nghe gần đây
                    </h2>
                    <div class="space-y-2">
                        <div
                            v-for="item in recentRotation.slice(0, 5)"
                            :key="item.id"
                            class="flex cursor-pointer items-center rounded-lg p-3 duration-200 ease-in-out hover:bg-white/5"
                            @click="useSong.playOrPauseThisSong(item)"
                        >
                            <img
                                class="h-14 w-14 object-cover transition-all duration-300"
                                :class="{
                                    'animate-spin rounded-full':
                                        currentTrack.id == item.id && isPlaying,
                                    'rounded-md': !(
                                        currentTrack.id == item.id && isPlaying
                                    ),
                                }"
                                :src="item.thumbnail_path"
                                alt=""
                                style="animation-duration: 5s"
                                @error="
                                    (event) =>
                                        (event.target.src = defaultImgage)
                                "
                            />
                            <div class="ml-4 flex-1">
                                <p class="font-medium">{{ item.name }}</p>
                                <p class="text-sm text-[#FFE5D6]/70">
                                    {{ item.total_played }} lượt nghe
                                </p>
                            </div>
                            <div class="flex items-center justify-center">
                                <div class="mx-5 text-xs text-gray-400">
                                    {{
                                        caculateTrackTime(
                                            item.song_path,
                                            item.id,
                                        )
                                    }}
                                </div>
                                <button
                                    @click.stop="
                                        useSong.addSongToWaitlist(item)
                                    "
                                    class="rounded p-2 text-[#FFE5D6]/50 hover:bg-white/5"
                                >
                                    <Icon
                                        icon="material-symbols:home-storage-outline"
                                        class="text-2xl"
                                    />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="isLoading" class="mb-8 text-[#FFE5D6]">
                    <div class="shimmer mb-3 h-8 w-64 rounded"></div>
                    <div class="space-y-2">
                        <div
                            v-for="i in 5"
                            :key="'recent-skeleton-' + i"
                            class="flex items-center rounded-lg p-3"
                        >
                            <div class="shimmer h-14 w-14 rounded-md"></div>
                            <div class="ml-4 flex-1">
                                <div
                                    class="shimmer mb-2 h-5 w-32 rounded"
                                ></div>
                                <div class="shimmer h-4 w-24 rounded"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </template>

            <template v-else-if="section === 'topArtist'">
                <div class="mb-8 text-[#FFE5D6]">
                    <h2 class="mb-1 text-2xl font-semibold">
                        Nghệ sĩ với nhiều người theo dõi
                    </h2>
                    <div class="mb-6 grid grid-cols-5 gap-4 px-1 py-4">
                        <div
                            v-for="(item, index) in topArtist.slice(0, 5)"
                            :key="item.id"
                            class="group relative h-80 cursor-pointer overflow-hidden rounded-2xl duration-300 ease-in-out hover:scale-105"
                            @click="
                                useView.selectItem(item);
                                useView.setComponent('ArtistPage');
                                useView.setArtistData(item);
                            "
                        >
                            <img
                                class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                                :src="item.avatar_path"
                                alt=""
                                @error="
                                    (event) =>
                                        (event.target.src = defaultImgage)
                                "
                            />
                            <div
                                class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
                            ></div>
                            <div
                                class="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#FFE5D6] text-lg font-bold text-zinc-900 shadow-lg"
                            >
                                {{ index + 1 }}
                            </div>
                            <div class="absolute bottom-0 left-0 right-0 p-4">
                                <p class="mb-1 text-lg font-bold text-white">
                                    {{ item.name }}
                                </p>
                                <p class="text-sm text-white/80">
                                    {{ item.followers.toLocaleString() }} người
                                    theo dõi
                                </p>
                            </div>
                        </div>
                        <div
                            v-for="i in isLoading && topArtist.length === 0
                                ? 5
                                : 0"
                            :key="'artist-top-skeleton-' + i"
                            class="relative h-80 overflow-hidden rounded-2xl"
                        >
                            <div class="shimmer h-full w-full"></div>
                        </div>
                    </div>
                    <div class="relative">
                        <div
                            class="scrollbar-style flex space-x-4 overflow-x-auto pr-8"
                        >
                            <div class="flex w-max gap-4 space-x-4 px-1 py-2">
                                <div
                                    v-for="item in topArtist.slice(5)"
                                    :key="item.id"
                                    class="w-48 flex-shrink-0 cursor-pointer rounded-lg px-2 duration-200 ease-in-out hover:scale-105 hover:brightness-105"
                                    @click="
                                        useView.selectItem(item);
                                        useView.setComponent('ArtistPage');
                                        useView.setArtistData(item);
                                    "
                                >
                                    <div
                                        class="mb-2 h-48 w-48 rounded-full bg-zinc-700"
                                    >
                                        <img
                                            class="h-48 w-48 rounded-full object-cover"
                                            :src="item.avatar_path"
                                            alt=""
                                            @error="
                                                (event) =>
                                                    (event.target.src =
                                                        defaultImgage)
                                            "
                                        />
                                    </div>
                                    <p class="font-medium">{{ item.name }}</p>
                                    <p class="text-sm">
                                        {{ item.followers }} người theo dõi
                                    </p>
                                </div>
                                <div
                                    v-for="i in isLoading ? 5 : 0"
                                    :key="'artist-skeleton-' + i"
                                    class="w-48 flex-shrink-0 rounded-lg px-2"
                                >
                                    <div
                                        class="shimmer mb-2 h-48 w-48 rounded-full"
                                    ></div>
                                    <div
                                        class="shimmer my-2 h-5 w-24 rounded"
                                    ></div>
                                    <div
                                        class="shimmer my-2 h-5 w-28 rounded"
                                    ></div>
                                </div>
                            </div>
                        </div>
                        <div
                            class="pointer-events-none absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-[#1D1512] to-transparent"
                        ></div>
                    </div>
                </div>
            </template>

            <template v-else-if="section === 'topSong'">
                <div class="mb-8 pt-4 text-[#FFE5D6]">
                    <h2 class="mb-1 text-2xl font-semibold">
                        Bài hát có nhiều lượt nghe
                    </h2>
                    <div class="relative">
                        <div
                            class="scrollbar-style flex space-x-4 overflow-x-auto"
                        >
                            <div class="flex w-max space-x-4 px-1 py-2">
                                <div
                                    v-for="item in topSong.slice(0, 6)"
                                    :key="item.id"
                                    class="w-48 flex-shrink-0 cursor-pointer rounded-lg px-2 duration-200 ease-in-out hover:scale-105 hover:brightness-105"
                                    @click="useSong.playOrPauseThisSong(item)"
                                >
                                    <div
                                        class="mb-2 h-40 w-40 rounded-full bg-zinc-700"
                                    >
                                        <img
                                            class="h-40 w-40 rounded-full object-cover"
                                            :src="item.thumbnail_path"
                                            alt=""
                                            :class="{
                                                'animate-spin':
                                                    currentTrack.id ==
                                                        item.id && isPlaying,
                                            }"
                                            style="animation-duration: 5s"
                                            @error="
                                                (event) =>
                                                    (event.target.src =
                                                        defaultImgage)
                                            "
                                        />
                                    </div>
                                    <div class="flex justify-between">
                                        <div>
                                            <p class="font-medium">
                                                {{ item.name }}
                                            </p>
                                            <p class="text-sm">
                                                {{ item.total_played }} lượt
                                                nghe
                                            </p>
                                        </div>
                                        <button
                                            @click.stop="
                                                useSong.addSongToWaitlist(item)
                                            "
                                            class="mr-4 rounded p-1 text-[#FFE5D6]/50 hover:bg-white/5"
                                        >
                                            <Icon
                                                icon="material-symbols:home-storage-outline"
                                                class="text-2xl"
                                            />
                                        </button>
                                    </div>
                                </div>
                                <div
                                    v-for="i in isLoading ? 6 : 0"
                                    :key="'song-circle-skeleton-' + i"
                                    class="w-48 flex-shrink-0 rounded-lg px-2"
                                >
                                    <div
                                        class="shimmer mb-2 h-40 w-40 rounded-full"
                                    ></div>
                                    <div class="flex justify-between">
                                        <div>
                                            <div
                                                class="shimmer my-2 h-5 w-24 rounded"
                                            ></div>
                                            <div
                                                class="shimmer my-2 h-5 w-28 rounded"
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                            class="pointer-events-none absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-[#1D1512] to-transparent"
                        ></div>
                    </div>
                    <div class="mt-4 space-y-2">
                        <div
                            v-for="item in topSong.slice(6, 16)"
                            :key="item.id"
                            class="flex cursor-pointer items-center rounded-lg p-3 duration-200 ease-in-out hover:bg-white/5"
                            @click="useSong.playOrPauseThisSong(item)"
                        >
                            <img
                                class="h-14 w-14 object-cover transition-all duration-300"
                                :class="{
                                    'animate-spin rounded-full':
                                        currentTrack.id == item.id && isPlaying,
                                    'rounded-md': !(
                                        currentTrack.id == item.id && isPlaying
                                    ),
                                }"
                                :src="item.thumbnail_path"
                                alt=""
                                style="animation-duration: 5s"
                                @error="
                                    (event) =>
                                        (event.target.src = defaultImgage)
                                "
                            />
                            <div class="ml-4 flex-1">
                                <p class="font-medium">{{ item.name }}</p>
                                <p class="text-sm text-[#FFE5D6]/70">
                                    {{ item.total_played }} lượt nghe
                                </p>
                            </div>
                            <div class="flex items-center justify-center">
                                <div class="mx-5 text-xs text-gray-400">
                                    {{
                                        caculateTrackTime(
                                            item.song_path,
                                            item.id,
                                        )
                                    }}
                                </div>
                                <button
                                    @click.stop="
                                        useSong.addSongToWaitlist(item)
                                    "
                                    class="rounded p-2 text-[#FFE5D6]/50 hover:bg-white/5"
                                >
                                    <Icon
                                        icon="material-symbols:home-storage-outline"
                                        class="text-2xl"
                                    />
                                </button>
                            </div>
                        </div>
                        <div
                            v-for="i in isLoading ? 10 : 0"
                            :key="'song-list-skeleton-' + i"
                            class="flex items-center rounded-lg p-3"
                        >
                            <div class="shimmer h-14 w-14 rounded-md"></div>
                            <div class="ml-4 flex-1">
                                <div
                                    class="shimmer mb-2 h-5 w-32 rounded"
                                ></div>
                                <div class="shimmer h-4 w-24 rounded"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </div>
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
    background: linear-gradient(
        90deg,
        rgba(255, 255, 255, 0.05) 0%,
        rgba(255, 255, 255, 0.1) 20%,
        rgba(255, 255, 255, 0.15) 40%,
        rgba(255, 255, 255, 0.1) 60%,
        rgba(255, 255, 255, 0.05) 100%
    );
    background-size: 1000px 100%;
    animation: shimmer 2s infinite linear;
}
</style>
