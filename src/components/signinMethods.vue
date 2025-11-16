<script setup>
import { api } from '@/api/axios';
import { Icon } from '@iconify/vue';
import {
    getAuth,
    GoogleAuthProvider,
    FacebookAuthProvider,
    signInWithPopup,
} from 'firebase/auth';
import { getMessaging, getToken } from 'firebase/messaging';
import { useAuthStore } from '@/stores/auth';

</script>

<template>
    <ul class="py-8">
        <li class="mb-2">
            <button v-on:click="
                (getDeviceToken(), firebaseSignInPopup(googleProvider))
                "
                class="flex h-[52px] w-[350px] items-center rounded-full border border-gray-500 pl-9 transition duration-300 hover:border-white">
                <Icon icon="devicon:google" class="size-6" />
                <p class="pl-9 text-lg font-bold text-white">
                    Đăng nhập với Google
                </p>
            </button>
        </li>
        <li class="mb-2">
            <button v-on:click="
                (getDeviceToken(), firebaseSignInPopup(facebookProvider))
                "
                class="flex h-[52px] w-[350px] items-center rounded-full border border-gray-500 pl-9 transition duration-300 hover:border-white">
                <Icon icon="logos:facebook" class="size-6" />
                <p class="pl-9 text-lg font-bold text-white">
                    Đăng nhập với Facebook
                </p>
            </button>
        </li>
    </ul>
</template>

<script>
export default {
    data() {
        return {
            googleProvider: new GoogleAuthProvider(),
            facebookProvider: new FacebookAuthProvider(),
            firebaseAuth: new getAuth(),
            messaging: new getMessaging(),
            deviceToken: '',
        };
    },
    created() {
        this.googleProvider.setCustomParameters({
            prompt: 'select_account',
        });
    },
    computed: {
        authStore() {
            return useAuthStore();
        }
    },
    methods: {
        firebaseSignInPopup(provider) {
            signInWithPopup(this.firebaseAuth, provider)
                .then((authRes) => {
                    this.auth(authRes);
                })
                .catch((authError) => {
                    console.log(authError);
                });
        },
        async auth(authRes) {
            await api.get('/firebase/auth', {
                params: {
                    email: authRes.user.email,
                    device_token: this.deviceToken,
                },
            }).then((apiRes) => {
                if (apiRes.data.code === 200) {
                    this.authStore.setIsLoggedIn(true);
                    this.authStore.setUser(apiRes.data.data);
                    this.sendGreeting();
                    this.$router.push('/interest-gerne');
                }
            }).catch((apiError) => {
                console.log(apiError);
                alert('Call API thất bại');
            });
        },
        async sendGreeting() {
            await api.get('/email/send-greeting', {
                headers: {
                    Authorization: 'Bearer ' + this.authStore.user.token,
                },
            });
        },
        getDeviceToken() {
            getToken(this.messaging, { vapidKey: import.meta.env.VITE_FCM_KEY_PAIR })
                .then((currentToken) => {
                    if (currentToken) {
                        this.deviceToken = currentToken;
                    } else {
                        console.log('No registration token available. Request permission to generate one.');
                    }
                }).catch((error) => {
                    alert('Can not get fcm device token', error);
                });
        },
    },
};
</script>
