<script setup>
import apiHelper from '@/helpers/apiHelper';
import SigninMethods from '@/components/signinMethods.vue';
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import MyLogo from '@/assets/MyLogo.svg';

const router = useRouter();
const authStore = useAuthStore();
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
    <div class="flex h-screen items-center justify-center bg-[#121212]">
        <div class="flex w-96 flex-col items-center">
            <!-- Start signup header -->
            <RouterLink to="/">
                <img :src="MyLogo" alt=""
                    class="duration-400 my-[-60px] h-[200px] w-[200px] text-[#FFE5D6] invert transition hover:text-white" />
            </RouterLink>
            <h1 class="text-center text-5xl font-bold text-white">Đăng ký</h1>
            <!-- End signup header -->

            <!-- Start signup form -->
            <form @submit.prevent="signup" class="flex w-[350px] flex-col py-8">
                <label class="pb-1 text-lg font-medium text-white">Địa chỉ Email</label>
                <input type="email" placeholder="name@domain.com" v-model="email"
                    class="rounded-md border border-gray-500 bg-transparent p-3 text-white placeholder:text-sm" />
                <label class="mt-2 pb-1 text-lg font-medium text-white">Mật khẩu</label>
                <input type="password" placeholder="Mật khẩu" v-model="password"
                    class="rounded-md border border-gray-500 bg-transparent p-3 text-white placeholder:text-sm" />
                <label class="mt-2 pb-1 text-lg font-medium text-white">Nhập lại mật khẩu</label>
                <input type="password" placeholder="Nhập lại mật khẩu" v-model="rePassword"
                    class="rounded-md border border-gray-500 bg-transparent p-3 text-white placeholder:text-sm" />
                <button type="submit"
                    class="mt-6 rounded-full bg-[#BC4D15] p-4 font-bold text-black transition ease-in hover:scale-105 hover:bg-[#b36b47]">
                    Đăng Ký
                </button>
            </form>
            <!-- End signup form -->

            <div class="flex items-center justify-center gap-4">
                <hr class="w-[150px] text-gray-500 opacity-15" />
                <span class="text-white">hoặc</span>
                <hr class="w-[150px] text-gray-500 opacity-15" />
            </div>

            <!-- Start signup methods -->
            <SigninMethods />
            <!-- End signup methods -->

            <div class="w-full px-[18px] pb-8">
                <hr class="text-gray-500 opacity-15" />
            </div>

            <!-- Start login link -->
            <div class="flex flex-row items-center">
                <p class="text-[#aeaeae]">Bạn đã có tài khoản?</p>
                <RouterLink to="/login"
                    class="pl-4 font-semibold text-white underline underline-offset-2 transition hover:text-[#BC4D15]"
                    href="#">Đăng nhập</RouterLink>
            </div>
            <!-- End login link -->
        </div>
    </div>
</template>
