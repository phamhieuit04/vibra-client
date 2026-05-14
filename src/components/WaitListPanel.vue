<script setup>
import { onMounted, ref, watch, toRefs, computed } from 'vue';
import { Icon } from '@iconify/vue';
import { storeToRefs } from 'pinia';
import { useSongStore } from '@/stores/song';
import defaultImgage from '@/assets/default.jpg';

const useSong = useSongStore();
const { currentTrack, currentWaitlist, isPlaying } = storeToRefs(useSong);

let isTrackTime = ref(null);

onMounted(() => {
    const audio = new Audio(currentTrack.value.song_path);
    audio.addEventListener('loadedmetadata', function () {
        const duration = audio.duration;
        const minutes = Math.floor(duration / 60);
        const seconds = Math.floor(duration % 60);
        isTrackTime.value = minutes + ':' + seconds.toString().padStart(2, '0');
    });
});
</script>
<template>
    <div class="relative h-[600px] w-full bg-white text-gray-900 dark:bg-[#1D1512] dark:text-[#FFE5D6]">
        <div class="mx-4 my-4">
            <h2 class="mb-1 text-2xl font-semibold">Bài hát đang phát</h2>
            <div
                class="flex cursor-pointer items-center justify-between rounded-md p-3 hover:bg-gray-100 dark:hover:bg-[#2A2929]">
                <div class="flex w-full items-center justify-between py-1.5">
                    <div class="flex">
                        <div class="relative ml-0 h-12 w-12 rounded-full bg-gray-300 shadow-2xl hover:scale-105 dark:bg-zinc-700"
                            @click="useSong.playOrPauseSong">
                            <img class="aspect-square rounded-full object-cover" :src="currentTrack.thumbnail_path"
                                alt="" :class="{ 'animate-spin': isPlaying }" style="animation-duration: 5s" @error="
                                    (event) =>
                                        (event.target.src = defaultImgage)
                                " />
                        </div>
                        <div class="ml-5">
                            <div class="font-semibold">
                                {{ currentTrack.name }}
                            </div>
                            <span class="text-sm font-semibold text-gray-600 dark:text-gray-400">{{
                                currentTrack.author.name
                            }}</span>
                        </div>
                    </div>

                    <Icon v-if="isPlaying" icon="svg-spinners:bars-scale-middle"
                        class="text-gray-700 dark:text-white" />
                    <Icon v-else icon="majesticons:barcode-2-line" class="text-gray-700 dark:text-white" />
                </div>
            </div>
        </div>
        <div class="mx-4 my-4 h-full overflow-y-auto scrollbar-none">
            <div class="flex justify-between">
                <h2 class="mb-1 text-2xl font-semibold">Bài hát tiếp theo</h2>
                <button @click="useSong.deleteAllFromWaitlist"
                    class="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">Xóa tất
                    cả</button>
            </div>
            <div
                v-for="(track, index) in currentWaitlist"
                :key="track?.id"
                @click="useSong.playThisSongInWaitlist(track)"
                class="flex cursor-pointer items-center justify-between rounded-md p-3 hover:bg-gray-100 dark:hover:bg-[#2A2929]"
                :class="{
                    'bg-gray-100 dark:bg-[#2A2929]': currentTrack?.id === track?.id
                }"
            >
                <div class="flex w-full items-center py-1.5">
                    <div>
                        <div class="font-semibold">
                            {{ track?.name }}
                        </div>
                        <span class="text-sm font-semibold text-gray-600 dark:text-gray-400">{{
                            track?.author?.name
                        }}</span>
                    </div>
                </div>
                <div class="flex items-center">
                    <button @click.stop="useSong.deleteSongFromWaitlist(track)"
                        class="mr-4 rounded p-1 text-gray-600 hover:bg-gray-200 dark:text-[#FFE5D6]/50 dark:hover:bg-white/5">
                        <Icon icon="material-symbols:delete-rounded" class="text-2xl" />
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>