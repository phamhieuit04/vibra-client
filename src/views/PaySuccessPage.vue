<script setup>
import apiHelper from '@/helpers/apiHelper';
import { onMounted, ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useActivityStore } from '@/stores/activity';
import { useViewStore } from '@/stores/view';
import Loading from '@/components/Loading.vue';

const authStore = useAuthStore();
const useActivity = useActivityStore();
const useView = useViewStore();
const isLoading = ref(true);

async function sendEmail() {
    try {
        await apiHelper.get(`/email/send-appreciation?id=${useActivity.downloadBill.id}`, {
            headers: { Authorization: 'Bearer ' + authStore.user.token },
        });
    } catch (err) {
        console.error(err);
    }
}

async function updateBill() {
    try {
        await apiHelper.get(`/payment/update-status/${useActivity.downloadBill.id}`, {
            headers: { Authorization: 'Bearer ' + authStore.user.token },
        });
    } catch (err) {
        console.error(err);
    }
}

onMounted(async () => {
    isLoading.value = true;
    await sendEmail();
    await updateBill();
    isLoading.value = false;
});
</script>

<template>
    <Loading v-if="isLoading" />
    <div
        class="flex min-h-screen items-center justify-center bg-gradient-to-b px-4 py-8 dark:from-[#292929] dark:via-[#171717] dark:to-black"
    >
        <div
            class="flex h-auto w-full max-w-[734px] flex-col items-center rounded-2xl bg-white px-6 py-12 shadow-2xl sm:px-12 lg:px-24 dark:bg-[#121212] dark:shadow-none"
        >
            <div
                class="mb-6 flex h-24 w-24 items-center justify-center rounded-full border-2"
                :style="{ borderColor: `${useView.currentColor}66`, backgroundColor: `${useView.currentColor}1A` }"
            >
                <svg class="h-12 w-12" :style="{ color: useView.currentColor }" viewBox="0 0 24 24" fill="none">
                    <path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
            </div>

            <h1 class="text-center text-3xl font-bold text-zinc-900 sm:text-4xl dark:text-white">
                Thanh toán thành công!
            </h1>

            <p class="mt-4 text-center text-base text-zinc-500 dark:text-[#aeaeae]">
                Cảm ơn bạn đã tin tưởng. Thông tin chi tiết đã được gửi vào email của bạn.
            </p>

            <hr class="my-8 w-full border-zinc-200 dark:border-zinc-700" />

            <RouterLink
                to="/"
                class="w-full max-w-[350px] rounded-full py-4 text-center font-bold text-black transition ease-in hover:scale-105"
                :style="{ backgroundColor: useView.currentColor }"
            >
                Quay về trang chủ
            </RouterLink>

            <p class="mt-4 text-sm text-zinc-400 dark:text-zinc-400">
                Gặp sự cố?
                <a
                    href="mailto:support@example.com"
                    class="underline underline-offset-2 text-zinc-500 transition dark:text-[#aeaeae]"
                    :style="{ textDecorationColor: useView.currentColor }"
                >
                    Liên hệ hỗ trợ
                </a>
            </p>
        </div>
    </div>
</template>