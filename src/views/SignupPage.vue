<script setup>
import apiHelper from '@/helpers/apiHelper';
import SigninMethods from '@/components/SigninMethods.vue';
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useViewStore } from '@/stores/view';
import MyLogo from '@/assets/MyLogo.svg';

const router = useRouter();
const authStore = useAuthStore();
const useView = useViewStore();
const email = ref('');
const password = ref('');
const rePassword = ref('');

const signup = async () => {
    if (rePassword.value !== '' && password.value !== rePassword.value) {
        alert('Mật khẩu không khớp!');
        return;
    }
    try {
        const res = await apiHelper.post('/signup', {
            email: email.value,
            password: password.value,
        });
        if (res.data.code == 200) {
            alert('Đăng Kí Thành Công!!!');
            authStore.setUser(res.data.data);
            router.push('/verify');
        }
        if (res.data.code == 500) {
            alert('Địa chỉ Email tồn tại');
        }
    } catch (e) {
        console.log(e);
        alert('Call API thất bại');
    }
};
</script>
<template>
    <div
        class="flex min-h-screen items-center justify-center bg-gradient-to-b from-orange-100 via-amber-50 to-white px-4 py-8 dark:from-[#292929] dark:via-[#171717] dark:to-black"
    >
        <div class="flex w-96 flex-col items-center">
            <!-- Start signup header -->
            <RouterLink to="/">
                <img :src="MyLogo" alt=""
                    class="duration-400 my-[-40px] h-[160px] w-[160px] transition hover:opacity-90 sm:my-[-50px] sm:h-[190px] sm:w-[190px] lg:my-[-60px] lg:h-[200px] lg:w-[200px] dark:invert" />
            </RouterLink>
            <h1 class="text-center text-4xl font-bold text-zinc-900 sm:text-5xl dark:text-white">Đăng ký</h1>
            <!-- End signup header -->

            <!-- Start signup form -->
            <form @submit.prevent="signup" class="flex w-full max-w-[350px] flex-col py-8">
                <label class="pb-1 text-lg font-medium text-zinc-900 dark:text-white">Địa chỉ Email</label>
                <input type="email" placeholder="name@domain.com" v-model="email"
                    class="rounded-md border border-zinc-300 bg-white p-3 text-zinc-900 placeholder:text-sm placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none dark:border-gray-500 dark:bg-transparent dark:text-white" />
                <label class="mt-2 pb-1 text-lg font-medium text-zinc-900 dark:text-white">Mật khẩu</label>
                <input type="password" placeholder="Mật khẩu" v-model="password"
                    class="rounded-md border border-zinc-300 bg-white p-3 text-zinc-900 placeholder:text-sm placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none dark:border-gray-500 dark:bg-transparent dark:text-white" />
                <label class="mt-2 pb-1 text-lg font-medium text-zinc-900 dark:text-white">Nhập lại mật khẩu</label>
                <input type="password" placeholder="Nhập lại mật khẩu" v-model="rePassword"
                    class="rounded-md border border-zinc-300 bg-white p-3 text-zinc-900 placeholder:text-sm placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none dark:border-gray-500 dark:bg-transparent dark:text-white" />
                <button type="submit"
                    class="mt-6 rounded-full p-4 font-bold text-black transition ease-in hover:scale-105" :style="{ backgroundColor: useView.currentColor }">
                    Đăng Ký
                </button>
            </form>
            <!-- End signup form -->

            <div class="flex items-center justify-center gap-4">
                <hr class="w-[120px] border-zinc-300 sm:w-[150px] dark:border-gray-500" />
                <span class="text-zinc-700 dark:text-white">hoặc</span>
                <hr class="w-[120px] border-zinc-300 sm:w-[150px] dark:border-gray-500" />
            </div>

            <!-- Start signup methods -->
            <SigninMethods />
            <!-- End signup methods -->

            <div class="w-full px-[18px] pb-8">
                <hr class="border-zinc-300 dark:border-gray-500" />
            </div>

            <!-- Start login link -->
            <div class="flex flex-row items-center">
                <p class="text-zinc-500 dark:text-[#aeaeae]">Bạn đã có tài khoản?</p>
                <RouterLink to="/login"
                    class="pl-4 font-semibold underline underline-offset-2 transition"
                    :style="{ color: useView.currentColor }"
                    href="#">Đăng nhập</RouterLink>
            </div>
            <!-- End login link -->
        </div>
    </div>
</template>
