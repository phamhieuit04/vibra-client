<script setup>
import { useSongStore } from '@/stores/song';
import { useAuthStore } from '@/stores/auth';
import { Icon } from '@iconify/vue';
import { storeToRefs } from 'pinia';
import { onMounted, ref, watch } from 'vue';
import axios from 'axios';
import defaultImgage from '@/assets/default.jpg';

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

const useSong = useSongStore();
const { currentTrack, isPlaying } = storeToRefs(useSong);

const lyric = ref(null);

const scrollArea = ref(null);

function autoScroll() {
    const el = scrollArea.value;
    if (!el) return;

    const speed = 0.1;
    const interval = setInterval(() => {
        if (el.scrollTop + el.clientHeight >= el.scrollHeight) {
            clearInterval(interval);
        } else {
            el.scrollTop += speed;
        }
    }, 10);
}
watch(
    () => currentTrack.value,
    () => {
        autoScroll();
    },
);

onMounted(() => {
    autoScroll();
});
</script>

<template>
    <img
        :src="currentTrack['thumbnail_path']"
        class="absolute inset-0 h-full w-full object-cover opacity-40 blur-lg"
        @error="(event) => (event.target.src = defaultImgage)"
    />
    <div class="relative z-10 flex h-screen">
        <div
            v-if="
                !currentTrack.list_lyric ||
                currentTrack.list_lyric.length <= 0 ||
                !currentTrack.list_lyric[0]
            "
            class="mb-[90px] flex w-full items-center justify-center"
        >
            <img
                :src="currentTrack['thumbnail_path']"
                alt="Album"
                class="h-[500px] w-[500px] rounded-xl object-cover"
                @error="(event) => (event.target.src = defaultImgage)"
            />
        </div>

        <div
            v-if="
                currentTrack.list_lyric &&
                currentTrack.list_lyric.length > 0 &&
                currentTrack.list_lyric[0]
            "
            class="mb-[90px] flex w-1/2 items-center justify-end"
        >
            <img
                :src="currentTrack['thumbnail_path']"
                alt="Album"
                class="h-[500px] w-[500px] rounded-xl object-cover"
                @error="(event) => (event.target.src = defaultImgage)"
            />
        </div>

        <div
            v-if="
                currentTrack.list_lyric &&
                currentTrack.list_lyric.length > 0 &&
                currentTrack.list_lyric[0]
            "
            class="mb-[90px] flex w-1/2 items-center justify-start pl-8"
        >
            <div
                ref="scrollArea"
                class="h-[500px] w-[70%] space-y-4 overflow-y-auto leading-relaxed text-gray-300 scrollbar-none"
            >
                <div
                    v-for="(lyricLine, index) in currentTrack.list_lyric"
                    :key="index"
                >
                    <h1 class="text-3xl text-white">{{ lyricLine }}</h1>
                </div>
            </div>
        </div>
    </div>
</template>
