<script setup>
import apiHelper from '@/helpers/apiHelper';
import SigninMethods from '@/components/SigninMethods.vue';
import { Icon } from '@iconify/vue';
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useViewStore } from '@/stores/view';
import MyLogo from '@/assets/MyLogo.svg';

const authStore = useAuthStore();
const useView = useViewStore();
const router = useRouter();

const email = ref('');
const password = ref('');
const isLoading = ref(false);

const login = async () => {
    if (email.value == '' || password.value == '') {
        alert('Vui lòng nhập đầy đủ thông tin!');
        return;
    }
    try {
        isLoading.value = true;
        const res = await apiHelper.post(
            '/login',
            {
                email: email.value,
                password: password.value,
            },
        );
        if (res.data.code == 200) {
            authStore.setIsLoggedIn(true);
            authStore.setUser(res.data.data);
            if (authStore.user.email_verified_at == null) {
                console.log('Chưa verify');
                router.push('/verify');
            } else {
                router.push('/interest-gerne');
                sendGreeting();
            }
            isLoading.value = false;
        }
        if (res.data.code == 204) {
            alert('Saiii!!!!!!!!');
            isLoading.value = false;
        }
    } catch (e) {
        console.log(e);
        alert('Call API thất bại');
    }
};

async function sendGreeting() {
    try {
        const res = await apiHelper.get('/email/send-greeting', {
            headers: {
                Authorization: 'Bearer ' + authStore.user.token,
            },
        },
        );
    } catch (e) {
        console.log(e);
    }
}
</script>
<template>
    <div class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60" v-if="isLoading">
        <Icon icon="svg-spinners:180-ring" class="text-[200px]" :style="{ color: useView.currentColor }" />
    </div>
    <div
        class="flex min-h-screen items-center justify-center bg-gradient-to-b px-4 py-8 dark:from-[#292929] dark:via-[#171717] dark:to-black"
    >
        <div
            class="flex h-auto w-full max-w-[734px] flex-col items-center rounded-2xl bg-white px-6 py-8 shadow-2xl sm:px-12 lg:h-[740px] lg:px-24 dark:bg-[#121212] dark:shadow-none"
        >
            <!-- Start Spotify logo -->
            <RouterLink to="/">
                <img :src="MyLogo" alt=""
                    class="duration-400 my-[-40px] h-[160px] w-[160px] transition hover:opacity-90 sm:my-[-50px] sm:h-[190px] sm:w-[190px] lg:my-[-60px] lg:h-[200px] lg:w-[200px] dark:invert" />
            </RouterLink>
            <!-- End Sportfy logo -->

            <!-- Start login header -->
            <h1 class="pt-2 text-center text-3xl font-bold text-zinc-900 sm:text-4xl dark:text-white">
                Đăng nhập vào Website
            </h1>
            <!-- End login header -->

            <!-- Start login methods -->
            <SigninMethods />
            <!-- End login methods -->

            <hr class="w-full border-zinc-200 dark:border-zinc-700" />

            <!-- Start login form -->
            <form @submit.prevent="login" class="flex w-full max-w-[350px] flex-col py-8">
                <label class="pb-1 text-lg font-bold text-zinc-900 dark:text-white">Địa chỉ Email</label>
                <input type="email" placeholder="Email" v-model="email"
                    class="rounded-md border border-zinc-300 bg-white p-3 text-zinc-900 placeholder:text-sm placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none dark:border-gray-500 dark:bg-transparent dark:text-white" />
                <label class="mt-2 pb-1 text-lg font-bold text-zinc-900 dark:text-white">Mật khẩu</label>
                <input type="password" placeholder="Password" v-model="password"
                    class="rounded-md border border-zinc-300 bg-white p-3 text-zinc-900 placeholder:text-sm placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none dark:border-gray-500 dark:bg-transparent dark:text-white" />
                <button type="submit"
                    class="mt-6 rounded-full p-4 font-bold text-black transition ease-in hover:scale-105" :style="{ backgroundColor: useView.currentColor }">
                    Continue
                </button>
            </form>
            <!-- End login form -->

            <!-- Start sign up link -->
            <div class="flex flex-row items-center">
                <p class="text-zinc-500 dark:text-[#aeaeae]">Bạn chưa có tài khoản?</p>
                <RouterLink to="/signup"
                    class="pl-4 font-semibold underline underline-offset-2 transition"
                    :style="{ color: useView.currentColor }">
                    Đăng ký</RouterLink>
            </div>
            <!-- End sign up link -->
        </div>
    </div>
</template>
