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

const props = defineProps({
    item: Object,
});

const { item } = toRefs(props);
const { currentTrack } = storeToRefs(useSong);
const notHaveSong = ref(false);
const thisPlaylistListSong = ref([]);
const emit = defineEmits(['userPress']);

async function getListSong() {
    try {
        const res = await api.get(`/library/list-playlist-song/${item.value.id}`, {
            headers: {
                Authorization: 'Bearer ' + authStore.user.token,
            },
        });
        if (res.data.code == 200) {
            thisPlaylistListSong.value = res.data.data;
            notHaveSong.value = true;
            thisPlaylistListSong.value.forEach((song) => {
                if (song.song_id === currentTrack.value.id) {
                    notHaveSong.value = false;
                }
            });
        }
    } catch (e) {
        console.log(e);
        useActivity.addNotify(true, 'Call Api thất bại!');
    }
}

async function addSongToPlaylist() {
    try {
        const res = await api.get(`/song/add-song-to-playlist?song_id=${currentTrack.value.id}&playlist_id=${item.value.id}`, {
            headers: {
                Authorization: 'Bearer ' + authStore.user.token,
            },
        });
        if (res.data.code == 200) {
            useActivity.fetchData();
            getListSong();
            emit('userPress');
            useView.setComponent('HomePage');
            useActivity.addNotify(false, 'Đã thêm bài hát vào Playlist!');
        }
    } catch (e) {
        console.log(e);
        useActivity.addNotify(true, 'Call Api thất bại!');
    }
}

watch(() => currentTrack.value, () => {
    getListSong();
    notHaveSong.value = true;
    thisPlaylistListSong.value.forEach((song) => {
        if (song.song_id === currentTrack.value.id) {
            notHaveSong.value = false;
        }
    });
});

onMounted(() => {
    getListSong();
});
</script>
<template>
    <div v-if="notHaveSong"
        class="my-1 flex cursor-pointer justify-between text-nowrap text-xl dark:hover:bg-[#3E3D3D] hover:bg-gray-100"
        @click="addSongToPlaylist">
        <div class="px-3 py-2 text-xs">
            {{ item.name }}
        </div>
        <div class="px-3 py-2 text-[10px]">Thêm vào danh sách phát</div>
    </div>
</template>
