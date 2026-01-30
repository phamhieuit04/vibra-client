<script setup>
import { onMounted, ref, watch, toRefs, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useViewStore } from '@/stores/view';
import { useActivityStore } from '@/stores/activity';

const useView = useViewStore();
const useActivity = useActivityStore();
const { allCategories } = storeToRefs(useActivity);

const x = ref(0);
const y = ref(0);
const listWrapper = ref(null);

function updateMouse(e) {
    const rect = listWrapper.value.getBoundingClientRect();
    x.value = e.clientX - rect.left;
    y.value = e.clientY - rect.top;
}
</script>

<template>
    <div
        class="h-[83.4%] space-y-10 rounded-[24px] bg-transparent py-14 text-zinc-900 scrollbar-none dark:bg-transparent dark:text-white">
        <div class="scrollbar-style h-[calc(100vh-230px)] w-full overflow-y-auto px-6">
            <h2 class="mb-5 text-2xl font-semibold text-zinc-900 dark:text-white">
                Thể loại
            </h2>

            <div class="relative flex flex-wrap gap-3 p-2 px-3" @mousemove="updateMouse" ref="listWrapper">
                <div class="pointer-events-none absolute inset-0 z-0 rounded-xl opacity-60 transition-opacity dark:opacity-100"
                    :style="{
                        background: `radial-gradient(
                            1000px circle at ${x}px ${y}px,
                            ${useView.currentColor},
                            transparent
                        )`,
                    }"></div>

                <div v-for="item in allCategories" :key="item.id"
                    class="relative z-10 m-1 h-48 w-[320px] cursor-pointer rounded-xl bg-white p-8 shadow-md transition-all duration-200 ease-in-out hover:scale-105 dark:bg-zinc-700 dark:shadow-none"
                    @click="
                        useView.selectItem(item);
                    useView.setComponent('CategoriesSongPage');
                    useView.setCategoriesData(item);
                    ">
                    <p class="text-xl font-semibold text-zinc-900 dark:text-white">
                        {{ item.name }}
                    </p>

                    <img :src="item.thumbnail_path"
                        class="absolute bottom-6 right-6 h-32 w-32 rotate-12 drop-shadow-lg" />
                </div>
            </div>
        </div>
    </div>
</template>
