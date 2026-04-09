<script setup>
import apiHelper from '@/helpers/apiHelper';
import SigninMethods from '@/components/signinMethods.vue';
import { Icon } from '@iconify/vue';
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import MyLogo from '@/assets/MyLogo.svg';

const authStore = useAuthStore();
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
    <div class="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-60" v-if="isLoading">
        <Icon icon="svg-spinners:180-ring" class="text-[200px] text-[#BC4D15]" />
    </div>
    <div class="flex h-screen items-center justify-center bg-gradient-to-b from-[#292929] from-10% to-black to-80%">
        <div class="flex h-[740px] w-[734px] flex-col items-center rounded-2xl bg-[#121212] px-24 py-8">
            <!-- Start Spotify logo -->
            <RouterLink to="/">
                <img :src="MyLogo" alt=""
                    class="duration-400 my-[-60px] h-[200px] w-[200px] text-[#FFE5D6] invert transition hover:text-white" />
            </RouterLink>
            <!-- End Sportfy logo -->

            <!-- Start login header -->
            <h1 class="pt-2 text-4xl font-bold text-white">
                Đăng nhập vào Website
            </h1>
            <!-- End login header -->

            <!-- Start login methods -->
            <SigninMethods />
            <!-- End login methods -->

            <hr class="w-full text-gray-500 opacity-15" />

            <!-- Start login form -->
            <form @submit.prevent="login" class="flex w-[350px] flex-col py-8">
                <label class="pb-1 text-lg font-bold text-white">Địa chỉ Email</label>
                <input type="email" placeholder="Email" v-model="email"
                    class="rounded-md border border-gray-500 bg-transparent p-3 text-white placeholder:text-sm" />
                <label class="mt-2 pb-1 text-lg font-bold text-white">Mật khẩu</label>
                <input type="password" placeholder="Password" v-model="password"
                    class="rounded-md border border-gray-500 bg-transparent p-3 text-white placeholder:text-sm" />
                <button type="submit"
                    class="mt-6 rounded-full bg-[#BC4D15] p-4 font-bold text-black transition ease-in hover:scale-105 hover:bg-[#b36b47]">
                    Continue
                </button>
            </form>
            <!-- End login form -->

            <!-- Start sign up link -->
            <div class="flex flex-row items-center">
                <p class="text-[#aeaeae]">Bạn chưa có tài khoản?</p>
                <RouterLink to="/signup"
                    class="pl-4 font-semibold text-white underline underline-offset-2 transition hover:text-[#BC4D15]">
                    Đăng ký</RouterLink>
            </div>
            <!-- End sign up link -->
        </div>
    </div>
</template>
