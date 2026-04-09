<script setup>
import apiHelper from '@/helpers/apiHelper';
import { onMounted, ref, watch, toRefs, computed } from 'vue';
import { useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/stores/auth';
import { useViewStore } from '@/stores/view';
import { useSongStore } from '@/stores/song';
import { useModalStore } from '@/stores/modal';
import { useActivityStore } from '@/stores/activity';
import defaultImgage from '@/assets/default.jpg';
import Loading from '@/components/Loading.vue';

const useView = useViewStore();
const authStore = useAuthStore();
const useSong = useSongStore();
const useModal = useModalStore();
const useActivity = useActivityStore();
const { isPlaylist } = storeToRefs(useActivity);
const isLoading = ref(true);

async function sendEmail() {
    try {
        const res = await apiHelper.get(`/email/send-appreciation?id=${useActivity.downloadBill.id}`, {
            headers: {
                Authorization: 'Bearer ' + authStore.user.token,
            },
        });
        console.log(res);
    } catch (err) {
        console.error(err);
    }
}
async function updateBill() {
    try {
        const res = await apiHelper.get(`/payment/update-status/${useActivity.downloadBill.id}`, {
            headers: {
                Authorization: 'Bearer ' + authStore.user.token,
            },
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
        class="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-gradient-to-b from-emerald-100 via-green-50 to-white p-6 font-sans dark:bg-[#0A0A0A] dark:bg-none">
        <!-- Surrounding Effects -->
        <div class="pointer-events-none absolute inset-0">
            <!-- Meteor Shower -->
            <div class="meteor" style="left: 10%; top: 20%; animation-delay: 0s"></div>
            <div class="meteor" style="left: 70%; top: 30%; animation-delay: 1.5s"></div>
            <div class="meteor" style="left: 30%; top: 70%; animation-delay: 3s"></div>
            <!-- Bokeh Lights -->
            <div class="bokeh" style="left: 15%; top: 15%"></div>
            <div class="bokeh" style="left: 75%; top: 25%"></div>
            <div class="bokeh" style="left: 40%; top: 60%"></div>
            <!-- Firework Effects -->
            <div class="firework" style="left: 20%; top: 10%; animation-delay: 0s"></div>
            <div class="firework" style="left: 80%; top: 40%; animation-delay: 2s"></div>
            <!-- Kaleidoscope Effect -->
            <div class="kaleidoscope"></div>
            <!-- Fog Effect -->
            <div class="fog"></div>
        </div>
        <!-- Main Content -->
        <div
            class="hover:shadow-3xl relative z-10 w-full max-w-3xl transform overflow-hidden rounded-3xl bg-gradient-to-br from-[#1DB954]/80 to-[#168740]/80 text-[#FFFFFF] shadow-2xl transition-all duration-500 hover:-translate-y-2">
            <!-- Background Gradient Overlay with 3D Animation -->
            <div class="animate-gradient-3d absolute inset-0 bg-gradient-to-br from-[#1DB954]/20 to-[#168740]/20"></div>
            <div class="relative p-16 text-center">
                <!-- Circle with Premium Effects -->
                <div
                    class="relative mx-auto flex h-56 w-56 items-center justify-center rounded-full border-4 border-[#1DB954]/40 bg-white/80 shadow-[0_0_20px_rgba(29,185,84,0.6),_0_0_40px_rgba(29,185,84,0.3)] transition-all duration-500 hover:shadow-[0_0_30px_rgba(29,185,84,0.8),_0_0_60px_rgba(29,185,84,0.5)] dark:bg-[#121212]">
                    <!-- Neon Glow -->
                    <div
                        class="animate-neon-glow absolute inset-0 rounded-full bg-gradient-to-r from-[#1DB954]/50 to-[#168740]/50 blur-sm filter">
                    </div>
                    <!-- Bloom Effect -->
                    <div
                        class="animate-bloom absolute inset-0 rounded-full bg-gradient-to-r from-[#1DB954]/40 to-[#168740]/40 blur-md filter">
                    </div>
                    <!-- Lens Flare Effect -->
                    <div class="animate-flare absolute inset-0 rounded-full">
                        <div class="absolute left-8 top-8 h-20 w-20 rounded-full bg-[#1DB954]/50 blur-2xl"></div>
                    </div>
                    <!-- Light Rays Effect -->
                    <div class="absolute inset-0 rounded-full">
                        <div class="ray ray-1"></div>
                        <div class="ray ray-2"></div>
                        <div class="ray ray-3"></div>
                        <div class="ray ray-4"></div>
                    </div>
                    <!-- Particle Layers -->
                    <div class="absolute inset-0 overflow-hidden rounded-full">
                        <div class="particle particle-1"></div>
                        <div class="particle particle-2"></div>
                        <div class="particle particle-3"></div>
                        <div class="particle particle-4"></div>
                        <div class="particle particle-5"></div>
                        <div class="particle particle-6"></div>
                    </div>
                    <!-- Ripple Effect -->
                    <div class="absolute inset-0 rounded-full">
                        <div class="ripple"></div>
                        <div class="ripple" style="animation-delay: 0.5s"></div>
                        <div class="ripple" style="animation-delay: 1s"></div>
                    </div>
                    <!-- SVG Checkmark (Static) -->
                    <svg class="animate-scale-in h-24 w-24 text-[#1DB954]" viewBox="0 0 24 24" fill="none">
                        <path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="3" stroke-linecap="round"
                            stroke-linejoin="round" />
                    </svg>
                </div>
                <!-- Enhanced Sound Wave Visualizer -->
                <div class="relative mt-6 flex items-center justify-center space-x-2">
                    <div v-for="i in 9" :key="i"
                        class="animate-wave w-1 rounded-full bg-gradient-to-b from-[#1DB954]/90 to-[#168740]/90" :style="{
                            animationDelay: `${i * 0.08}s`,
                            height: `${10 + i * 4}px`,
                        }"></div>
                </div>
                <!-- Snowfall Effect -->
                <div class="pointer-events-none absolute inset-0 overflow-hidden">
                    <div class="snowflake" style="left: 10%; top: 10%"></div>
                    <div class="snowflake" style="left: 30%; top: 20%"></div>
                    <div class="snowflake" style="left: 50%; top: 5%"></div>
                    <div class="snowflake" style="left: 70%; top: 15%"></div>
                    <div class="snowflake" style="left: 90%; top: 25%"></div>
                </div>
                <!-- Title with Hover Effect -->
                <div class="flex flex-col items-center justify-center">
                    <h1
                        class="animate-pulse-slow cursor-pointer bg-gradient-to-r from-[#FFFFFF] to-[#1DB954] bg-clip-text text-5xl font-black leading-loose tracking-tight text-transparent transition-all duration-500">
                        Thanh toán thành công, thông tin sẽ được gửi vào email
                        của bạn!
                    </h1>
                    <div class="flex gap-4 text-xl">
                        <RouterLink to="/"
                            class="cursor-pointer underline opacity-75 transition-all duration-300 hover:opacity-50">
                            Nhấn vào đây để quay trở lại trang chủ
                        </RouterLink>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Font Setup */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');

.font-sans {
    font-family: 'Inter', sans-serif;
}

/* Gradient 3D Animation for Background */
.animate-gradient-3d {
    animation: gradient-3d 12s infinite ease-in-out;
    background-size: 200% 200%;
}

@keyframes gradient-3d {
    0% {
        background-position: 0% 0%;
    }

    50% {
        background-position: 100% 100%;
    }

    100% {
        background-position: 0% 0%;
    }
}

/* Particle Animation */
.particle {
    position: absolute;
    background: rgba(29, 185, 84, 0.9);
    border-radius: 50%;
    box-shadow:
        0 0 12px rgba(29, 185, 84, 0.8),
        0 0 24px rgba(29, 185, 84, 0.4);
}

.particle-1 {
    width: 3px;
    height: 3px;
    top: 15%;
    left: 25%;
    animation: orbit 5s infinite ease-in-out;
}

.particle-2 {
    width: 4px;
    height: 4px;
    top: 35%;
    left: 65%;
    animation: orbit 4s infinite ease-in-out reverse;
}

.particle-3 {
    width: 5px;
    height: 5px;
    top: 55%;
    left: 20%;
    animation: orbit 6s infinite ease-in-out;
}

.particle-4 {
    width: 4px;
    height: 4px;
    top: 45%;
    left: 75%;
    animation: orbit 5s infinite ease-in-out reverse;
}

.particle-5 {
    width: 6px;
    height: 6px;
    top: 25%;
    left: 40%;
    animation: orbit 7s infinite ease-in-out;
}

.particle-6 {
    width: 5px;
    height: 5px;
    top: 60%;
    left: 60%;
    animation: orbit 6s infinite ease-in-out reverse;
}

@keyframes orbit {
    0% {
        transform: translate(0, 0) rotate(0deg) scale(1);
        opacity: 0.8;
    }

    25% {
        transform: translate(30px, -30px) rotate(90deg) scale(1.3);
        opacity: 1;
    }

    50% {
        transform: translate(0, -60px) rotate(180deg) scale(1);
        opacity: 0.8;
    }

    75% {
        transform: translate(-30px, -30px) rotate(270deg) scale(1.3);
        opacity: 1;
    }

    100% {
        transform: translate(0, 0) rotate(360deg) scale(1);
        opacity: 0.8;
    }
}

/* Bloom Animation */
.animate-bloom {
    animation: bloom 4s infinite ease-in-out;
}

@keyframes bloom {

    0%,
    100% {
        opacity: 0.5;
    }

    50% {
        opacity: 0.8;
    }
}

/* Neon Glow Animation */
.animate-neon-glow {
    animation: neon-glow 3s infinite alternate;
}

@keyframes neon-glow {
    0% {
        box-shadow:
            0 0 10px rgba(29, 185, 84, 0.7),
            0 0 20px rgba(29, 185, 84, 0.4);
    }

    100% {
        box-shadow:
            0 0 20px rgba(29, 185, 84, 0.9),
            0 0 40px rgba(29, 185, 84, 0.6);
    }
}

/* Glow Animation */
.animate-glow {
    animation: glow 3s infinite ease-in-out;
}

@keyframes glow {

    0%,
    100% {
        box-shadow:
            0 0 25px rgba(29, 185, 84, 0.5),
            0 0 50px rgba(29, 185, 84, 0.3);
    }

    50% {
        box-shadow:
            0 0 40px rgba(29, 185, 84, 0.7),
            0 0 80px rgba(29, 185, 84, 0.4);
    }
}

/* Lens Flare Animation */
.animate-flare {
    animation: flare 6s infinite ease-in-out;
}

@keyframes flare {

    0%,
    100% {
        opacity: 0.4;
    }

    50% {
        opacity: 0.7;
    }
}

/* Scale-In Animation for Checkmark */
.animate-scale-in {
    animation: scale-in 1s ease-out forwards;
}

@keyframes scale-in {
    0% {
        transform: scale(0);
        opacity: 0;
    }

    80% {
        transform: scale(1.15);
        opacity: 1;
    }

    100% {
        transform: scale(1);
        opacity: 1;
    }
}

/* Pulse Animation for Title */
.animate-pulse-slow {
    animation: pulse 2s infinite cubic-bezier(0.4, 0, 0.6, 1);
}

@keyframes pulse {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0.9;
    }
}

/* Fade-In Animation for Subtitle */
.animate-fade-in {
    animation: fade-in 1.8s ease-out forwards;
}

@keyframes fade-in {
    0% {
        opacity: 0;
        transform: translateY(15px);
    }

    100% {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Sound Wave Animation */
.animate-wave {
    animation: wave 1s infinite ease-in-out;
}

@keyframes wave {

    0%,
    100% {
        transform: scaleY(0.4);
    }

    50% {
        transform: scaleY(1.2);
    }
}

/* Light Rays Animation */
.ray {
    position: absolute;
    width: 1px;
    height: 100%;
    background: linear-gradient(to bottom,
            rgba(29, 185, 84, 0.2),
            rgba(29, 185, 84, 0.6));
    transform-origin: center;
}

.ray-1 {
    top: 0;
    left: 50%;
    transform: rotate(45deg);
    animation: ray-pulse 3s infinite ease-in-out;
}

.ray-2 {
    top: 0;
    left: 50%;
    transform: rotate(-45deg);
    animation: ray-pulse 3.5s infinite ease-in-out;
}

.ray-3 {
    top: 0;
    left: 50%;
    transform: rotate(135deg);
    animation: ray-pulse 4s infinite ease-in-out;
}

.ray-4 {
    top: 0;
    left: 50%;
    transform: rotate(-135deg);
    animation: ray-pulse 4.5s infinite ease-in-out;
}

@keyframes ray-pulse {

    0%,
    100% {
        height: 50%;
        opacity: 0.3;
    }

    50% {
        height: 100%;
        opacity: 0.7;
    }
}

/* Ripple Effect Animation */
.ripple {
    position: absolute;
    width: 100%;
    height: 100%;
    border: 1px solid rgba(29, 185, 84, 0.3);
    border-radius: 50%;
    animation: ripple 2s infinite;
}

@keyframes ripple {
    0% {
        transform: scale(0);
        opacity: 0.5;
    }

    100% {
        transform: scale(2);
        opacity: 0;
    }
}

/* Snowfall Effect Animation */
.snowflake {
    position: absolute;
    width: 3px;
    height: 3px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    animation: fall 5s infinite linear;
}

@keyframes fall {
    0% {
        transform: translateY(-100%) rotate(0deg);
        opacity: 0.3;
    }

    50% {
        opacity: 0.5;
    }

    100% {
        transform: translateY(100vh) rotate(360deg);
        opacity: 0;
    }
}

/* Meteor Shower Animation */
.meteor {
    position: absolute;
    width: 2px;
    height: 50px;
    background: linear-gradient(to bottom,
            rgba(255, 255, 255, 0.8),
            rgba(255, 255, 255, 0));
    transform: rotate(-45deg);
    animation: meteor-shower 2s infinite linear;
}

@keyframes meteor-shower {
    0% {
        transform: translate(0, -100vh) rotate(-45deg);
        opacity: 1;
    }

    100% {
        transform: translate(100vw, 100vh) rotate(-45deg);
        opacity: 0;
    }
}

/* Bokeh Lights Animation */
.bokeh {
    position: absolute;
    width: 10px;
    height: 10px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    filter: blur(5px);
    animation: bokeh-pulse 3s infinite ease-in-out;
}

@keyframes bokeh-pulse {

    0%,
    100% {
        transform: scale(1);
        opacity: 0.2;
    }

    50% {
        transform: scale(1.5);
        opacity: 0.4;
    }
}

/* Firework Effect Animation */
.firework {
    position: absolute;
    width: 2px;
    height: 2px;
    background: rgba(29, 185, 84, 0.8);
    border-radius: 50%;
    animation: firework-explode 2s infinite;
}

@keyframes firework-explode {
    0% {
        transform: scale(0);
        opacity: 0.8;
    }

    50% {
        transform: scale(20);
        opacity: 0;
    }

    100% {
        transform: scale(0);
        opacity: 0;
    }
}

/* Kaleidoscope Effect Animation */
.kaleidoscope {
    position: absolute;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle,
            rgba(29, 185, 84, 0.1) 0%,
            rgba(10, 10, 10, 0) 70%);
    animation: kaleidoscope-spin 20s infinite linear;
}

@keyframes kaleidoscope-spin {
    0% {
        transform: rotate(0deg) scale(1);
    }

    50% {
        transform: rotate(180deg) scale(1.1);
    }

    100% {
        transform: rotate(360deg) scale(1);
    }
}

/* Fog Effect Animation */
.fog {
    position: absolute;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle,
            rgba(29, 185, 84, 0.05) 0%,
            rgba(10, 10, 10, 0.8) 70%);
    animation: fog-move 15s infinite linear;
}

@keyframes fog-move {
    0% {
        transform: translate(-50%, -50%) scale(1);
    }

    100% {
        transform: translate(50%, 50%) scale(1.1);
    }
}
</style>
