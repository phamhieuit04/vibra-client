<script setup>
import { onMounted, ref } from 'vue'
import apiHelper from '@/helpers/apiHelper'
import { Icon } from '@iconify/vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useViewStore } from '@/stores/view';
import defaultImgage from '@/assets/default.jpg';

const authStore = useAuthStore()
const useView = useViewStore();
const router = useRouter()

// step
const step = ref(1)

// data
const categories = ref([])
const hobbies = ref([])

// selected
const selectedCategories = ref([])
const selectedHobbies = ref([])

const loading = ref(true)
const isSubmitting = ref(false)

function toggleSelect(list, item) {
    const idx = list.indexOf(item)
    idx === -1 ? list.push(item) : list.splice(idx, 1)
}

function nextStep() {
    if (step.value === 1 && selectedCategories.value.length > 0) {
        step.value = 2
    }
}

function prevStep() {
    step.value = 1
}

async function submitAll() {
    isSubmitting.value = true

    const cateIds = selectedCategories.value.map(i => i.id).join(',')
    const hobbyIds = selectedHobbies.value.map(i => i.id).join(',')

    try {
        await apiHelper.get(
            `/home/save-interested?category_id=${cateIds}&hobby_id=${hobbyIds}`,
            {
                headers: {
                    Authorization: 'Bearer ' + authStore.user.token,
                },
            }
        )
        router.push('/')
    } catch (e) {
        console.log(e)
    } finally {
        isSubmitting.value = false
    }
}

async function getAllCategories() {
    const res = await apiHelper.get('/category/index', {
        headers: { Authorization: 'Bearer ' + authStore.user.token },
    })
    categories.value = res.data.data
}

async function getAllHobby() {
    const res = await apiHelper.get('/home/list-hobby', {
        headers: { Authorization: 'Bearer ' + authStore.user.token },
    })
    hobbies.value = res.data.data
}

onMounted(async () => {
    await Promise.all([getAllCategories(), getAllHobby()])
    loading.value = false
})
</script>

<template>
    <div v-if="isSubmitting" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60">
        <Icon icon="svg-spinners:180-ring" class="text-[120px]" :style="{ color: useView.currentColor }" />
    </div>

    <div class="flex min-h-screen items-center justify-center bg-gradient-to-b px-4 py-6 dark:from-[#292929] dark:via-[#171717] dark:to-black">
        <div class="flex h-[780px] w-full max-w-[760px] flex-col items-center rounded-2xl bg-white px-5 py-8 shadow-2xl sm:px-10 md:px-16 md:py-10 dark:bg-[#121212] dark:shadow-none">
            <div class="mt-4 flex gap-3 w-full">
                <div class="h-1.5 w-full rounded-full" :class="step === 1 ? '' : 'bg-gray-600'"
                    :style="step === 1 ? { backgroundColor: useView.currentColor } : {}" />
                <div class="h-1.5 w-full rounded-full" :class="step === 2 ? '' : 'bg-gray-600'"
                    :style="step === 2 ? { backgroundColor: useView.currentColor } : {}" />
            </div>

            <h1 class="mt-16 text-center text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl dark:text-white">
                {{ step === 1 ? 'Chọn thể loại bạn thích' : 'Chọn sở thích của bạn' }}
            </h1>

            <p class="mt-2 text-sm text-zinc-500 dark:text-gray-400">
                {{ step === 1
                    ? 'Bạn có thể chọn nhiều thể loại'
                    : 'Điều này giúp cá nhân hoá trải nghiệm của bạn' }}
            </p>

            <div v-show="step === 1" class="relative w-full">
                <div v-if="loading"
                    class="relative z-10 mt-10 pb-24 grid h-[460px] w-full grid-cols-3 gap-5 overflow-hidden">
                    <div v-for="i in 9" :key="'skeleton-' + i"
                        class="relative h-[160px] w-full overflow-hidden rounded-xl border border-transparent bg-zinc-200 dark:bg-[#1a1a1a]">
                        <div class="absolute inset-0 shimmer"></div>
                        <div
                            class="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-black/60 to-transparent px-3 py-2">
                            <div class="h-3 w-2/3 rounded bg-black/30 shimmer"></div>
                        </div>
                    </div>
                </div>
                <div v-else
                    class="relative z-10 mt-10 pb-24 grid h-[460px] w-full grid-cols-2 gap-4 overflow-y-scroll scrollbar-none sm:grid-cols-3 sm:gap-5">
                    <div v-for="item in categories" :key="item.id" @click="toggleSelect(selectedCategories, item)"
                        class="group relative cursor-pointer rounded-xl border transition-colors" :class="selectedCategories.includes(item)
                            ? ''
                            : 'border-transparent hover:brightness-75'">
                        <img :src="item.thumbnail_path" class="h-full w-full aspect-square object-cover"
                            draggable="false" @error="(event) => (event.target.src = defaultImgage)" />

                        <div class="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 via-black/30 to-transparent p-3"
                            :class="selectedCategories.includes(item) ? 'ring-2' : ''"
                            :style="selectedCategories.includes(item) ? { '--tw-ring-color': useView.currentColor } : {}">
                            <span class="text-sm font-semibold text-white drop-shadow">
                                {{ item.name }}
                            </span>
                        </div>

                        <div v-if="selectedCategories.includes(item)"
                            class="absolute right-2 top-2 rounded-full px-2 py-0.5 text-xs font-medium text-black"
                            :style="{ backgroundColor: useView.currentColor }">
                            Chọn
                        </div>
                    </div>
                </div>
                <div v-show="step === 1 && !loading"
                    class="pointer-events-none absolute bottom-0 left-0 z-20 h-24 w-full bg-gradient-to-t from-white to-transparent dark:from-[#121212]">
                </div>
            </div>

            <div v-show="step === 2 && !loading"
                class="relative mt-10 w-full">
                
                <div class="relative z-10 grid h-[460px] w-full grid-cols-2 gap-4 overflow-y-scroll pb-24 scrollbar-none sm:grid-cols-3 sm:gap-5">
                    <div v-for="item in hobbies" :key="item.id"
                        @click="toggleSelect(selectedHobbies, item)"
                        class="group relative cursor-pointer overflow-hidden rounded-xl transition-all duration-200"
                        :class="selectedHobbies.includes(item)
                            ? 'border-2'
                            : 'border border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-500'"
                        :style="selectedHobbies.includes(item)
                            ? { borderColor: useView.currentColor }
                            : {}">

                        <div class="flex h-full w-full items-center justify-center bg-white dark:bg-[#1a1a1a]">
                            <span class="text-center text-sm font-medium text-zinc-800 dark:text-zinc-200 px-3">
                                {{ item.name }}
                            </span>
                        </div>

                        <div v-if="selectedHobbies.includes(item)"
                            class="absolute right-2 top-2 rounded-full px-2 py-0.5 text-xs font-medium text-black"
                            :style="{ backgroundColor: useView.currentColor }">
                            Chọn
                        </div>
                    </div>
                </div>

                <div
                    class="pointer-events-none absolute bottom-0 left-0 z-20 h-24 w-full bg-gradient-to-t from-white to-transparent dark:from-[#121212]">
                </div>

                <p class="mt-3 text-center text-xs text-zinc-400 dark:text-zinc-600">
                    {{ selectedHobbies.length > 0
                        ? `Đã chọn ${selectedHobbies.length} sở thích`
                        : 'Chọn ít nhất một sở thích để tiếp tục' }}
                </p>
            </div>

            <div class="mt-auto flex justify-end gap-3 pt-6 w-full">
                <button v-if="step === 2" @click="prevStep"
                    class="rounded-full px-6 py-2 text-sm text-zinc-700 hover:bg-zinc-200 dark:text-gray-300 dark:hover:bg-[#1f1f1f]">
                    Quay lại
                </button>

                <button v-if="step === 1" @click="nextStep" :disabled="selectedCategories.length === 0"
                    class="rounded-full px-8 py-2 text-sm font-medium text-black disabled:opacity-40"
                    :style="{ backgroundColor: useView.currentColor }">
                    Tiếp tục
                </button>

                <button v-if="step === 2" @click="submitAll" :disabled="selectedHobbies.length === 0"
                    class="rounded-full px-8 py-2 text-sm font-medium text-black disabled:opacity-40"
                    :style="{ backgroundColor: useView.currentColor }">
                    Hoàn thành
                </button>
            </div>
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
    background: linear-gradient(90deg,
            rgba(0, 0, 0, 0.05) 0%,
            rgba(0, 0, 0, 0.1) 20%,
            rgba(0, 0, 0, 0.15) 40%,
            rgba(0, 0, 0, 0.1) 60%,
            rgba(0, 0, 0, 0.05) 100%);
    background-size: 1000px 100%;
    animation: shimmer 2s infinite linear;
}

.dark .shimmer {
    background: linear-gradient(90deg,
            rgba(255, 255, 255, 0.05) 0%,
            rgba(255, 255, 255, 0.1) 20%,
            rgba(255, 255, 255, 0.15) 40%,
            rgba(255, 255, 255, 0.1) 60%,
            rgba(255, 255, 255, 0.05) 100%);
    background-size: 1000px 100%;
    animation: shimmer 2s infinite linear;
}
</style>