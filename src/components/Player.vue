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
import MyLogo from '@/assets/MyLogo.svg';
import PlayerFunc from './PlayerFunc.vue';
import PlaylistOptionRow from './PlaylistOptionRow.vue';

const useView = useViewStore();
const authStore = useAuthStore();
const useSong = useSongStore();
const useModal = useModalStore();
const useActivity = useActivityStore();
const { isFullscreen } = storeToRefs(useView);
const { isPlaying, audio, currentPlaylist, currentTrack, isShuffle } =
    storeToRefs(useSong);
const { favSongList, myPlaylistList, isPlaylist } = storeToRefs(useActivity);

let isHover = ref(false);
let isTrackTimeCurrent = ref(null);
let isTrackTimeTotal = ref(null);
let seeker = ref(null);
let seekerContainer = ref(null);
let range = ref(0);

const isLoved = ref(false);

const openMenu = ref(false);

async function loveThisSong() {
    try {
        const res = await api.get(`/song/store/${currentTrack.value.id}`, {
            headers: {
                Authorization: 'Bearer ' + authStore.user.token,
            },
        });

        if (res.data.code == 200) {
            useActivity.fetchData();
            isLoved.value = !isLoved.value;
            useActivity.addNotify(
                false,
                'Đã thêm bài hát vào danh sách yêu thích!',
            );
        }
    } catch (e) {
        console.log(e);
        useActivity.addNotify(true, 'Call Api thất bại!');
    }
}
async function unloveThisSong() {
    try {
        const res = await api.get(`/library/destroy-favorite-song/${currentTrack.value.id}`, {
            headers: {
                Authorization: 'Bearer ' + authStore.user.token,
            },
        });

        if (res.data.code == 200) {
            useActivity.fetchData();
            isLoved.value = !isLoved.value;
            useActivity.addNotify(false, 'Đã bỏ yêu thích bài hát!');
        }
    } catch (e) {
        console.log(e);
        useActivity.addNotify(true, 'Call Api thất bại!');
    }
}

async function downloadThisSong() {
    if (!currentTrack.value.id) return;
    try {
        const res = await api.get(`/payment/create-bill?song_id=${currentTrack.value.id}`, {
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

onMounted(() => {
    isPlaying.value = false;
    if (!currentTrack.value) return;

    useSong.playThisSong(currentTrack.value);

    if (audio.value) {
        setTimeout(() => {
            timeupdate();
            loadmetadata();
            audio.value.pause();
            isPlaying.value = false;
        }, 300);
    }
    if (currentTrack.value) {
        seeker.value.addEventListener('change', function () {
            const time = audio.value.duration * (seeker.value.value / 100);
            audio.value.currentTime = time;
        });

        seeker.value.addEventListener('mousedown', function () {
            audio.value.pause();
            isPlaying.value = false;
        });

        seeker.value.addEventListener('mouseup', function () {
            audio.value.play();
            isPlaying.value = true;
        });

        seekerContainer.value.addEventListener('click', function (e) {
            const clickPosition =
                (e.pageX - seekerContainer.value.offsetLeft) /
                seekerContainer.value.offsetWidth;
            const time = audio.value.duration * clickPosition;
            audio.value.currentTime = time;
            seeker.value.value =
                (100 / audio.value.duration) * audio.value.currentTime;
        });
    }
});

function onUserPress() {
    openMenu.value = false;
}

const timeupdate = () => {
    if (!audio.value) return;
    audio.value.addEventListener('timeupdate', function () {
        var minutes = Math.floor(audio.value.currentTime / 60);
        var seconds = Math.floor(audio.value.currentTime - minutes * 60);
        isTrackTimeCurrent.value =
            minutes + ':' + seconds.toString().padStart(2, '0');
        const value = (100 / audio.value.duration) * audio.value.currentTime;
        range.value = value;
        seeker.value.value = value;
    });
};

const loadmetadata = () => {
    audio.value.addEventListener('loadedmetadata', function () {
        const duration = audio.value.duration;
        const minutes = Math.floor(duration / 60);
        const seconds = Math.floor(duration % 60);
        isTrackTimeTotal.value =
            minutes + ':' + seconds.toString().padStart(2, '0');
    });
};

watch(() => favSongList.value.songs, () => {
    isLoved.value = false;
    favSongList.value.songs.forEach((song) => {
        if (song.id === currentTrack.value.id) {
            isLoved.value = true;
        }
    });
});

watch(() => currentTrack.value, () => {
    openMenu.value = false;
    isLoved.value = false;
    favSongList.value.songs.forEach((song) => {
        if (song.id === currentTrack.value.id) {
            isLoved.value = true;
        }
    });
});

watch(() => audio.value, () => {
    if (!currentTrack.value) return;
    timeupdate();
    loadmetadata();
});

watch(() => isTrackTimeCurrent.value, (time) => {
    if (!currentTrack.value) return;
    if (time && time == isTrackTimeTotal.value) {
        useSong.nextSongs();
    }
});
</script>

<template>
    <div id="MusicPlayer" class="fixed bottom-0 z-50 flex h-[9.4%] w-full items-center justify-between
               border-t border-zinc-300 bg-white
               dark:border-t-[#272727] dark:bg-[#181413]">
        <div class="flex w-1/4 items-center">
            <div class="ml-4 flex items-center">
                <img class="aspect-square rounded-full object-cover shadow-2xl" width="55"
                    :src="currentTrack['thumbnail_path']" @error="(event) => (event.target.src = defaultImgage)" />
                <div class="ml-4">
                    <div style="font-family: 'Montserrat', sans-serif" class="cursor-pointer text-[17px] font-bold
                               text-zinc-900 hover:underline
                               dark:text-[#FFE5D6]">
                        {{ currentTrack ? currentTrack['name'] : 'Bài hát' }}
                    </div>
                    <div style="font-family: 'Montserrat', sans-serif" class="cursor-pointer text-[13px] font-medium
                               text-zinc-500 hover:text-zinc-900 hover:underline
                               dark:text-[#FFE5D6]/30 dark:hover:text-white">
                        {{ currentTrack ? currentTrack.author.name : 'Tác giả' }}
                    </div>
                </div>
            </div>

            <div class="ml-8 flex items-center">
                <Icon v-if="!isLoved" @click="loveThisSong" icon="solar:heart-linear" class="cursor-pointer text-[23px]
                           text-zinc-700 hover:scale-110
                           dark:text-[#FFE5D6]" />
                <Icon v-else @click="unloveThisSong" icon="solar:heart-bold" class="cursor-pointer text-[23px]
                           text-zinc-700 hover:scale-110
                           dark:text-[#FFE5D6]" />
                <Icon @click="openMenu = !openMenu" icon="material-symbols:add-circle-outline" class="ml-5 cursor-pointer text-[23px]
                           text-zinc-700 hover:scale-110
                           dark:text-[#FFE5D6]" />
                <a>
                    <Icon @click="
                        useSong.setDownload('song');
                    downloadThisSong();
                    " icon="material-symbols:arrow-circle-down-outline-rounded" class="ml-5 cursor-pointer text-[23px]
                               text-zinc-700 hover:scale-110
                               dark:text-[#FFE5D6]" />
                </a>
            </div>

            <span v-if="openMenu" class="absolute bottom-[68px] left-[250px] z-20
                       bg-white p-1 text-zinc-800
                       dark:bg-[#282828] dark:text-gray-200">
                <div class="font-semibold">
                    <PlaylistOptionRow v-for="item in myPlaylistList" :key="item.id" :item="item"
                        @user-press="onUserPress" />
                </div>
            </span>
        </div>

        <div class="mx-auto w-2/4 max-w-[35%]">
            <div class="flex-col items-center justify-center">
                <div class="flex h-[30px] items-center justify-center">
                    <button v-if="isShuffle" class="mx-2" @click="isShuffle = false">
                        <Icon icon="mdi:shuffle" class="size-5 text-zinc-700 dark:text-[#FFE5D6]" />
                    </button>
                    <button v-else class="mx-2" @click="isShuffle = true">
                        <Icon icon="mdi:shuffle-disabled" class="size-5 text-zinc-700 dark:text-[#FFE5D6]" />
                    </button>

                    <button class="mx-2" @click="useSong.prevSongs">
                        <Icon icon="fa6-solid:backward-step" class="size-7 text-zinc-700 dark:text-[#FFE5D6]" />
                    </button>

                    <button class="mx-3 rounded-full p-1" @click="useSong.playOrPauseThisSong(currentTrack)">
                        <Icon icon="material-symbols:play-circle-rounded" v-if="!isPlaying"
                            class="size-12 text-zinc-900 dark:text-white" />
                        <Icon icon="material-symbols:pause-circle" v-else
                            class="size-12 text-zinc-900 dark:text-white" />
                    </button>

                    <button class="mx-2" @click="useSong.nextSongs()">
                        <Icon icon="fa6-solid:forward-step" class="size-7 text-zinc-700 dark:text-[#FFE5D6]" />
                    </button>

                    <img :src="MyLogo" alt="" class="mx-[-18px] h-[80px] w-[80px] transition
                               invert-0 dark:invert" />
                </div>
            </div>

            <div class="flex h-[25px] items-center">
                <div class="pr-2 pt-[11px] text-[12px] text-zinc-700 dark:text-white">
                    {{ isTrackTimeCurrent ? isTrackTimeCurrent : '00' }}
                </div>

                <div ref="seekerContainer" class="relative mb-3 mt-2 w-full" @mouseenter="isHover = true"
                    @mouseleave="isHover = false">
                    <input v-model="range" ref="seeker" type="range" class="absolute z-40 my-2 h-0 w-full cursor-pointer
                               appearance-none rounded-full
                               accent-zinc-900 dark:accent-white
                               focus:outline-none" />
                    <div class="pointer-events-none absolute inset-y-0 left-0 z-10 mt-[6px] h-[4px] bg-zinc-900 dark:bg-white"
                        :style="`width: ${range}%;`"></div>
                    <div class="absolute inset-y-0 left-0 mt-[6px] h-[4px] w-full rounded-full
                               bg-zinc-300 dark:bg-gray-500"></div>
                </div>

                <div class="pl-2 pt-[11px] text-[12px] text-zinc-700 dark:text-white">
                    {{ isTrackTimeTotal ? isTrackTimeTotal : '00' }}
                </div>
            </div>
        </div>

        <div class="flex w-1/4 items-center justify-end pr-10">
            <PlayerFunc />
        </div>
    </div>
</template>
