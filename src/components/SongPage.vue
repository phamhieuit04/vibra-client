<script setup>
import { useSongStore } from '@/stores/song';
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';
import { onMounted, onUnmounted, ref, watch, computed, nextTick } from 'vue';
import defaultImgage from '@/assets/default.jpg';

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

const useSong = useSongStore();
const { currentTrack, isPlaying } = storeToRefs(useSong);

const scrollArea = ref(null);
const lyricRefs = ref([]);
const activeLyricIndex = ref(-1);
let rafId = null;
let scrollAnimId = null;

const rawLyrics = computed(() => {
    const list = currentTrack.value?.list_lyric;
    if (!list || !Array.isArray(list) || list.length === 0) return [];
    const filtered = list.filter((l) => typeof l === 'string' && l.trim() !== '');
    return filtered;
});

const isSynced = computed(() => {
    if (rawLyrics.value.length === 0) return false;
    return rawLyrics.value.some((line) => /^\[\d{2}:\d{2}[.:]\d+\]/.test(line));
});

const parsedLyrics = computed(() => {
    if (rawLyrics.value.length === 0) return [];

    if (isSynced.value) {
        return rawLyrics.value
            .map((line) => {
                const match = line.match(/^\[(\d{2}):(\d{2}[.:]\d+)\](.*)/);
                if (!match) return null;
                const minutes = parseInt(match[1], 10);
                const seconds = parseFloat(match[2].replace(':', '.'));
                const time = minutes * 60 + seconds;
                const text = match[3].trim();
                return { time, text };
            })
            .filter((line) => line !== null);
    }

    return rawLyrics.value.map((line) => ({ time: null, text: line.trim() }));
});

const hasLyrics = computed(() => parsedLyrics.value.length > 0);

function getActiveLyricIndex(currentTime) {
    let index = -1;
    for (let i = 0; i < parsedLyrics.value.length; i++) {
        if (parsedLyrics.value[i].time <= currentTime) {
            if (parsedLyrics.value[i].text !== '') index = i;
        } else {
            break;
        }
    }
    return index;
}

function cancelScroll() {
    if (scrollAnimId) {
        cancelAnimationFrame(scrollAnimId);
        scrollAnimId = null;
    }
}

function smoothScrollTo(container, targetScrollTop, duration = 350) {
    cancelScroll();
    const start = container.scrollTop;
    const distance = targetScrollTop - start;
    if (Math.abs(distance) < 2) return;

    const startTime = performance.now();
    function ease(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }
    function step(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        container.scrollTop = start + distance * ease(progress);
        if (progress < 1) {
            scrollAnimId = requestAnimationFrame(step);
        } else {
            scrollAnimId = null;
        }
    }
    scrollAnimId = requestAnimationFrame(step);
}

function scrollToActiveLyric(index) {
    if (!scrollArea.value || index < 0) return;
    const el = lyricRefs.value[index];
    if (!el) return;
    const container = scrollArea.value;
    const containerRect = container.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    const targetScrollTop =
        container.scrollTop +
        elRect.top -
        containerRect.top -
        container.clientHeight / 2 +
        el.clientHeight / 2;
    smoothScrollTo(container, targetScrollTop);
}

function tick() {
    if (isSynced.value && useSong.audio) {
        const currentTime = useSong.audio.currentTime;
        const newIndex = getActiveLyricIndex(currentTime);
        if (newIndex !== activeLyricIndex.value) {
            activeLyricIndex.value = newIndex;
            nextTick(() => scrollToActiveLyric(newIndex));
        }
    }
    rafId = requestAnimationFrame(tick);
}

watch(
    () => currentTrack.value?.id,
    () => {
        cancelScroll();
        activeLyricIndex.value = -1;
        nextTick(() => {
            if (scrollArea.value) scrollArea.value.scrollTop = 0;
        });
    },
);

onMounted(() => {
    rafId = requestAnimationFrame(tick);
});

onUnmounted(() => {
    if (rafId) cancelAnimationFrame(rafId);
    cancelScroll();
});
</script>

<template>
    <img
        :src="currentTrack.thumbnail_path"
        class="absolute inset-0 h-full w-full object-cover opacity-40 blur-md"
        @error="(event) => (event.target.src = defaultImgage)"
    />

    <div class="relative z-10 flex h-screen items-center justify-center">

        <div v-if="!hasLyrics" class="mb-[90px] flex items-center justify-center">
            <div class="relative flex items-center justify-center pr-32">
                <div class="relative z-10">
                    <img
                        :src="currentTrack.thumbnail_path"
                        class="h-[500px] w-[500px] rounded-xl object-cover shadow-2xl"
                        @error="(event) => (event.target.src = defaultImgage)"
                    />
                </div>

                <div class="absolute top-1/2 left-1/2 h-[500px] w-[250px] -translate-y-1/2 translate-x-[184px] overflow-hidden">
                    <div class="vinyl-container absolute right-0 top-1/2 h-[500px] w-[500px] -translate-y-1/2" style="perspective: 1000px">
                        <div class="absolute inset-0 flex items-center justify-center" :class="{ spinning: isPlaying }">
                            <div
                                class="vinyl-disc relative h-[400px] w-[400px] rounded-full bg-gradient-to-br from-gray-900 via-black to-gray-800 shadow-2xl"
                                style="transform-style: preserve-3d"
                            >
                                <div
                                    v-for="i in 40"
                                    :key="i"
                                    class="absolute inset-0 rounded-full border border-gray-700/20"
                                    :style="{
                                        width: `${100 - i * 2}%`,
                                        height: `${100 - i * 2}%`,
                                        top: `${i}%`,
                                        left: `${i}%`,
                                    }"
                                ></div>

                                <div class="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-red-900 via-red-800 to-red-950 shadow-lg">
                                    <div class="flex h-full w-full items-center justify-center">
                                        <img
                                            :src="currentTrack.thumbnail_path"
                                            class="h-24 w-24 rounded-full object-cover"
                                            @error="(event) => (event.target.src = defaultImgage)"
                                        />
                                    </div>
                                </div>

                                <div class="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black shadow-inner"></div>
                                <div class="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/5 to-transparent"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-else class="mb-[90px] flex w-full items-center">
            <div class="flex w-1/2 justify-end">
                <img
                    :src="currentTrack.thumbnail_path"
                    class="h-[500px] w-[500px] rounded-xl object-cover shadow-2xl"
                    @error="(event) => (event.target.src = defaultImgage)"
                />
            </div>

            <div class="flex w-1/2 justify-start pl-8">
                <div
                    ref="scrollArea"
                    class="lyrics-scroll-area h-[500px] w-[70%] overflow-y-auto scrollbar-none"
                    style="mask-image: linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)"
                >
                    <div :class="isSynced ? 'py-[200px] space-y-6' : 'py-8 space-y-4'">
                        <div
                            v-for="(line, index) in parsedLyrics"
                            :key="index"
                            :ref="(el) => (lyricRefs[index] = el)"
                            class="lyric-line"
                        >
                            <p
                                class="font-semibold leading-snug transition-all duration-500"
                                :class="isSynced ? {
                                    'text-2xl text-white scale-105 origin-left drop-shadow-[0_0_12px_rgba(255,255,255,0.6)]': index === activeLyricIndex,
                                    'text-2xl text-white/35': index !== activeLyricIndex && line.text !== '',
                                    'text-base text-white/15': line.text === '',
                                } : 'text-xl text-white/80'"
                            >
                                <template v-if="isSynced">{{ line.text || '•' }}</template>
                                <template v-else>{{ line.text }}</template>
                            </p>
                        </div>
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

@keyframes spin {
    from { transform: rotateZ(0deg); }
    to { transform: rotateZ(360deg); }
}

.vinyl-container {
    transition: transform 0.3s ease;
}

.lyrics-scroll-area {
    overflow-y: auto;
}

.lyric-line {
    cursor: default;
    user-select: none;
}
</style>