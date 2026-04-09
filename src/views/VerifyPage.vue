<script setup>
import apiHelper from '@/helpers/apiHelper';
import { onMounted, ref, watch, toRefs, computed } from 'vue';
import { Icon } from '@iconify/vue';
import { useAuthStore } from '@/stores/auth';
import { useViewStore } from '@/stores/view';
import { useSongStore } from '@/stores/song';
import { useModalStore } from '@/stores/modal';
import { useActivityStore } from '@/stores/activity';

const useView = useViewStore();
const authStore = useAuthStore();
const useSong = useSongStore();
const useModal = useModalStore();
const useActivity = useActivityStore();

const hash = ref('');
const isLoading = ref(true);

async function sendVerify() {
    try {
        hash.value = '';
        isLoading.value = true;
        const res = await apiHelper.get(`/email/verify?id=${authStore.user.id}`);
        console.log(res);
        isLoading.value = false;
    } catch (e) {
        console.log(e);
        isLoading.value = false;
    }
}

onMounted(() => {
    sendVerify();
});
</script>
<template>
    <div class="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-60" v-if="isLoading">
        <Icon icon="svg-spinners:180-ring" class="text-[200px] text-[#BC4D15]" />
    </div>
    <div class="container mx-auto flex h-screen flex-col items-center justify-center gap-6 text-white">
        <h1 class="text-center text-5xl">
            Chúng tôi vừa gửi tới email của bạn một mã xác thực, vui lòng kiểm
            tra email để xác thực tài khoản hiện tại!
        </h1>
        <RouterLink to="/login" class="text-3xl text-[#BC4D15] underline hover:opacity-75">
            Xác nhận
        </RouterLink>
    </div>
</template>
