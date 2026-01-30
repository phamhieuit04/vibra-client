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
    <img :src="currentTrack.thumbnail_path" class="absolute inset-0 h-full w-full object-cover opacity-40 blur-md"
        @error="(event) => (event.target.src = defaultImgage)" />

    <div class="relative z-10 flex h-screen items-center justify-center">
        <div v-if="!currentTrack.list_lyric || currentTrack.list_lyric.length <= 0 || !currentTrack.list_lyric[0]"
            class="mb-[90px] flex items-center justify-center">

            <div class="relative flex items-center justify-center pr-32">
                <div class="relative z-10">
                    <img :src="currentTrack.thumbnail_path"
                        class="h-[500px] w-[500px] rounded-xl object-cover shadow-2xl"
                        @error="(event) => (event.target.src = defaultImgage)" />
                </div>

                <div
                    class="absolute top-1/2 left-1/2 h-[500px] w-[250px] -translate-y-1/2 translate-x-[184px] overflow-hidden">
                    <div class="vinyl-container absolute right-0 top-1/2 h-[500px] w-[500px] -translate-y-1/2"
                        style="perspective: 1000px;">
                        <div class="absolute inset-0 flex items-center justify-center" :class="{ spinning: isPlaying }">
                            <div class="vinyl-disc relative h-[400px] w-[400px] rounded-full
                           bg-gradient-to-br from-gray-900 via-black to-gray-800
                           shadow-2xl" style="transform-style: preserve-3d;">
                                <div v-for="i in 40" :key="i"
                                    class="absolute inset-0 rounded-full border border-gray-700/20" :style="{
                                        width: `${100 - i * 2}%`,
                                        height: `${100 - i * 2}%`,
                                        top: `${i}%`,
                                        left: `${i}%`
                                    }"></div>

                                <div class="absolute left-1/2 top-1/2 h-32 w-32
                               -translate-x-1/2 -translate-y-1/2
                               rounded-full bg-gradient-to-br
                               from-red-900 via-red-800 to-red-950 shadow-lg">
                                    <div class="flex h-full w-full items-center justify-center">
                                        <img :src="currentTrack.thumbnail_path"
                                            class="h-24 w-24 rounded-full object-cover"
                                            @error="(event) => (event.target.src = defaultImgage)" />
                                    </div>
                                </div>

                                <div class="absolute left-1/2 top-1/2 h-4 w-4
                               -translate-x-1/2 -translate-y-1/2
                               rounded-full bg-black shadow-inner"></div>

                                <div class="absolute inset-0 rounded-full
                               bg-gradient-to-tr from-transparent via-white/5 to-transparent"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-else class="mb-[90px] flex w-full items-center">
            <div class="flex w-1/2 justify-end">
                <img :src="currentTrack.thumbnail_path" class="h-[500px] w-[500px] rounded-xl object-cover shadow-2xl"
                    @error="(event) => (event.target.src = defaultImgage)" />
            </div>
            <div class="flex w-1/2 justify-start pl-8">
                <div ref="scrollArea"
                    class="h-[500px] w-[70%] space-y-4 overflow-y-auto leading-relaxed text-gray-300 scrollbar-none">
                    <div v-for="(lyricLine, index) in currentTrack.list_lyric" :key="index">
                        <h1 class="text-3xl text-white">
                            {{ lyricLine }}
                        </h1>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.spinning .vinyl-disc {
    animation: spin 3s linear infinite;
}

.vinyl-disc {
    animation-play-state: running;
}

@keyframes spin {
    from {
        transform: rotateZ(0deg);
    }

    to {
        transform: rotateZ(360deg);
    }
}

.vinyl-container {
    transition: transform 0.3s ease;
}
</style>