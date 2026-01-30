<script setup>
import { ref, onMounted } from 'vue';
import Header from '@/components/Header.vue';
import Sidebar from '@/components/Sidebar.vue';
import Player from '@/components/Player.vue';
import HomePage from '@/components/HomePage.vue';
import PlaylistPage from '@/components/PlaylistPage.vue';
import UserPage from '@/components/UserPage.vue';
import SearchPage from '@/components/SearchPage.vue';
import SongPage from '@/components/SongPage.vue';
import ArtistPage from '@/components/ArtistPage.vue';
import SidePanel from '@/components/SidePanel.vue';
import WaitListPanel from '@/components/WaitListPanel.vue';
import CategoriesSongPage from '@/components/CategoriesSongPage.vue';
import Notify from '@/components/Notify.vue';

import ProfileModal from '@/components/ProfileModal.vue';
import PlaylistModal from '@/components/PlaylistModal.vue';
import AlbumModal from '@/components/AlbumModal.vue';
import SongModal from '@/components/SongModal.vue';
import Loading from '@/components/Loading.vue';

import { useSongStore } from '@/stores/song';
import { useViewStore } from '@/stores/view';
import { storeToRefs } from 'pinia';
import CategoriesPage from '@/components/CategoriesPage.vue';
import { useModalStore } from '@/stores/modal';
import { useActivityStore } from '@/stores/activity';

const useSong = useSongStore();
const { currentTrack } = storeToRefs(useSong);

const useView = useViewStore();
const { currentComponent, isFullscreen, showSidePanel, showWaitlistPanel } =
    storeToRefs(useView);

const useModal = useModalStore();
const {
    openEditProfile,
    openEditPlaylist,
    openUploadSong,
    openEditAlbum,
    loading,
} = storeToRefs(useModal);

const useActivity = useActivityStore();
const { notifyList } = storeToRefs(useActivity);

const player = ref(null);

const components = {
    HomePage,
    PlaylistPage,
    UserPage,
    SearchPage,
    CategoriesPage,
    ArtistPage,
    CategoriesSongPage,
};

onMounted(() => {
    useView.setFullscreenPage(player.value);
});
</script>
<template>
    <div class="relative bg-black">
        <Header />
        <Sidebar />
        <div :class="[
            'fixed top-[64px] h-[83.4%] rounded-[24px] bg-white dark:bg-[#1D1512] shadow-xl',
            showSidePanel ? 'left-[23%] w-[57.4%]' : 'left-[23%] w-[76.6%]',
        ]">
            <component :is="components[currentComponent]" />
        </div>
        <div v-if="showSidePanel"
            class="fixed left-[80.7%] top-[64px] h-[83.4%] w-[19%] overflow-auto rounded-[24px] bg-white dark:bg-[#1D1512] scrollbar-none">
            <WaitListPanel v-if="useView.sidePanelState == 'waitlist'" />
            <SidePanel v-else />
        </div>
        <div ref="player">
            <SongPage v-if="isFullscreen" />
            <Player />
        </div>

        <div class="absolute right-4 top-4 z-[150]">
            <Notify v-for="item in notifyList" :key="item.message" :index="item.index" :is-error="item.isError"
                :message="item.message" />
        </div>

        <Loading v-if="loading" />
        <AlbumModal v-if="openEditAlbum" />
        <SongModal v-if="openUploadSong" />
        <ProfileModal v-if="openEditProfile" />
        <PlaylistModal v-if="openEditPlaylist" />
    </div>
</template>
