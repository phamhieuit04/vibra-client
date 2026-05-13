<script setup>
import { ref, watch, onMounted } from 'vue';
import { Icon } from '@iconify/vue';
import { useSongStore } from '@/stores/song';
import { useViewStore } from '@/stores/view';
import { storeToRefs } from 'pinia';

const useSong = useSongStore();
const useView = useViewStore();
const { audio, vol, currentWaitlist } = storeToRefs(useSong);
const { isFullscreen } = storeToRefs(useView);

let isHover = ref(false);
let volume = ref(null);

watch(
    () => audio.value,
    (newVal, oldVal) => {
        audio.value.volume = vol.value / 100;
    },
);

onMounted(() => {
    volume.value.addEventListener('input', (e) => {
        audio.value.volume = e.currentTarget.value / 100;
        useSong.setVolume(e.currentTarget.value);
    });
    useView.listenFullscreenChange();
});
</script>

<template>
    <Icon icon="ic:round-volume-off" v-if="vol == 0" class="size-7"
        :class="isFullscreen ? 'text-white' : 'text-black dark:text-white'" />
    <Icon icon="ic:round-volume-up" v-else class="size-7"
        :class="isFullscreen ? 'text-white' : 'text-black dark:text-white'" />
    <div class="relative mb-[23px] ml-2 mt-2 flex w-[150px] items-center" @mouseenter="isHover = true"
        @mouseleave="isHover = false">
        <input v-model="vol" ref="volume" type="range"
            class="absolute z-40 my-2 mt-[24px] h-0 w-full appearance-none rounded-full focus:outline-none" :class="isFullscreen
                ? 'accent-white'
                : 'accent-black dark:accent-white'" />
        <div class="pointer-events-none absolute inset-y-0 left-0 z-10 mt-[6px] h-[4px]" :style="`width: ${vol}%;`"
            :class="isFullscreen ? 'bg-white' : 'bg-black dark:bg-white'"></div>
        <div class="absolute inset-y-0 left-0 mt-[6px] h-[4px] w-full rounded-full bg-gray-300 dark:bg-gray-500"></div>
    </div>

    <div class="ml-4">
        <div v-if="!isFullscreen" class="relative flex">
            <Icon icon="material-symbols:home-storage-outline"
                v-if="!useView.showSidePanel || useView.sidePanelState !== 'waitlist'"
                class="mr-3 size-7 cursor-pointer" :class="isFullscreen ? 'text-white' : 'text-black dark:text-white'"
                @click="
                    useView.showSidePanel = true;
                useView.sidePanelState = 'waitlist';
                " />

            <Icon icon="material-symbols:home-storage"
                v-if="useView.showSidePanel && useView.sidePanelState == 'waitlist'" class="mr-3 size-7 cursor-pointer"
                :class="isFullscreen ? 'text-white' : 'text-black dark:text-white'" @click="
                    useView.showSidePanel = false;
                useView.sidePanelState = '';
                " />

            <h1 class="absolute right-9 top-0 mt-[-6px] text-[10px]"
                :class="isFullscreen ? 'text-white' : 'text-black dark:text-white'">
            </h1>

            <Icon icon="ri:video-line" v-if="!useView.showSidePanel || useView.sidePanelState !== 'data'"
                class="size-7 cursor-pointer" :class="isFullscreen ? 'text-white' : 'text-black dark:text-white'"
                @click="
                    useView.showSidePanel = true;
                useView.sidePanelState = 'data';
                " />

            <Icon icon="ri:video-fill" v-if="useView.showSidePanel && useView.sidePanelState == 'data'"
                class="size-7 cursor-pointer" :class="isFullscreen ? 'text-white' : 'text-black dark:text-white'"
                @click="
                    useView.showSidePanel = false;
                useView.sidePanelState = '';
                " />
        </div>
    </div>

    <div class="ml-4">
        <Icon icon="fa6-solid:compress" v-if="useView.isFullscreen" class="size-6 cursor-pointer"
            :class="isFullscreen ? 'text-white' : 'text-black dark:text-white'" @click="useView.toggleFullscreen" />

        <Icon icon="fa6-solid:expand" v-else class="size-6 cursor-pointer"
            :class="isFullscreen ? 'text-white' : 'text-black dark:text-white'" @click="useView.toggleFullscreen" />
    </div>
</template>
