<template>
    <div
        class="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#0A0A0A] p-6 font-sans"
    >
        <!-- Surrounding Effects -->
        <div class="pointer-events-none absolute inset-0">
            <!-- Dark Fog Effect -->
            <div class="dark-fog"></div>
            <!-- Raindrop Effect -->
            <div
                class="raindrop"
                style="left: 15%; top: 10%; animation-delay: 0s"
            ></div>
            <div
                class="raindrop"
                style="left: 35%; top: 20%; animation-delay: 0.5s"
            ></div>
            <div
                class="raindrop"
                style="left: 70%; top: 30%; animation-delay: 1s"
            ></div>
        </div>
        <!-- Main Content -->
        <div
            class="relative z-10 w-full max-w-3xl transform overflow-hidden rounded-3xl bg-gradient-to-br from-[#8B0000]/80 to-[#4A0000]/80 text-[#FFFFFF] shadow-2xl transition-all duration-500 hover:-translate-y-1 hover:shadow-xl"
        >
            <!-- Background Gradient Overlay with Dark Animation -->
            <div
                class="animate-dark-gradient absolute inset-0 bg-gradient-to-br from-[#8B0000]/20 to-[#4A0000]/20"
            ></div>
            <div class="relative p-16 text-center">
                <!-- Circle with Failure Effects -->
                <div
                    class="animate-shake relative mx-auto flex h-56 w-56 items-center justify-center rounded-full border-4 border-[#8B0000]/40 bg-[#1A1A1A] shadow-[0_0_15px_rgba(139,0,0,0.5),_0_0_30px_rgba(74,0,0,0.3)] transition-all duration-500 hover:shadow-[0_0_20px_rgba(139,0,0,0.7)]"
                >
                    <!-- Dark Glow -->
                    <div
                        class="animate-dark-glow absolute inset-0 rounded-full bg-gradient-to-r from-[#8B0000]/30 to-[#4A0000]/30 blur-sm filter"
                    ></div>
                    <!-- Particle Layers (Fading) -->
                    <div class="absolute inset-0 overflow-hidden rounded-full">
                        <div class="particle particle-1"></div>
                        <div class="particle particle-2"></div>
                        <div class="particle particle-3"></div>
                    </div>
                    <!-- SVG Cross Mark (Static) -->
                    <svg
                        class="animate-scale-in h-24 w-24 text-[#8B0000]"
                        viewBox="0 0 24 24"
                        fill="none"
                    >
                        <path
                            d="M6 6L18 18M18 6L6 18"
                            stroke="currentColor"
                            stroke-width="3"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                    </svg>
                </div>
                <!-- Sound Wave Visualizer (Fading) -->
                <div
                    class="relative mt-6 flex items-center justify-center space-x-2"
                >
                    <div
                        v-for="i in 6"
                        :key="i"
                        class="animate-fade-wave w-1 rounded-full bg-gradient-to-b from-[#8B0000]/70 to-[#4A0000]/70"
                        :style="{
                            animationDelay: `${i * 0.12}s`,
                            height: `${8 + i * 3}px`,
                        }"
                    ></div>
                </div>
                <!-- Title with Hover Effect -->
                <div class="flex flex-col items-center justify-center">
                    <h1
                        class="animate-pulse-slow cursor-pointer bg-gradient-to-r from-[#FFFFFF] to-[#1DB954] bg-clip-text text-5xl font-black leading-loose tracking-tight text-transparent transition-all duration-500"
                    >
                        Thanh toán thất bại!
                    </h1>
                    <RouterLink
                        to="/"
                        class="cursor-pointer text-xl underline opacity-75 transition-all duration-300 hover:opacity-50"
                    >
                        Nhấn vào đây để quay trở lại trang chủ
                    </RouterLink>
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

/* Dark Gradient Animation for Background */
.animate-dark-gradient {
    animation: dark-gradient 10s infinite ease-in-out;
    background-size: 200% 200%;
}

@keyframes dark-gradient {
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

/* Particle Animation (Fading) */
.particle {
    position: absolute;
    background: rgba(139, 0, 0, 0.6);
    border-radius: 50%;
    box-shadow:
        0 0 10px rgba(139, 0, 0, 0.4),
        0 0 20px rgba(74, 0, 0, 0.2);
}

.particle-1 {
    width: 3px;
    height: 3px;
    top: 20%;
    left: 30%;
    animation: fade-orbit 4s infinite ease-in-out;
}

.particle-2 {
    width: 4px;
    height: 4px;
    top: 40%;
    left: 70%;
    animation: fade-orbit 5s infinite ease-in-out reverse;
}

.particle-3 {
    width: 3px;
    height: 3px;
    top: 60%;
    left: 25%;
    animation: fade-orbit 6s infinite ease-in-out;
}

@keyframes fade-orbit {
    0% {
        transform: translate(0, 0) scale(1);
        opacity: 0.6;
    }

    50% {
        transform: translate(20px, -20px) scale(1.2);
        opacity: 0.3;
    }

    100% {
        transform: translate(0, 0) scale(1);
        opacity: 0.6;
    }
}

/* Dark Glow Animation */
.animate-dark-glow {
    animation: dark-glow 3s infinite alternate;
}

@keyframes dark-glow {
    0% {
        box-shadow:
            0 0 15px rgba(139, 0, 0, 0.5),
            0 0 30px rgba(74, 0, 0, 0.3);
    }

    100% {
        box-shadow:
            0 0 25px rgba(139, 0, 0, 0.7),
            0 0 50px rgba(74, 0, 0, 0.5);
    }
}

/* Shake Animation for Circle */
.animate-shake {
    animation: shake 1.5s infinite ease-in-out;
}

@keyframes shake {
    0%,
    100% {
        transform: translate(0, 0);
    }

    25% {
        transform: translate(-5px, 0);
    }

    50% {
        transform: translate(5px, 0);
    }

    75% {
        transform: translate(-5px, 0);
    }
}

/* Scale-In Animation for Cross Mark */
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

/* Fade Wave Animation for Sound Wave */
.animate-fade-wave {
    animation: fade-wave 1s infinite ease-in-out;
}

@keyframes fade-wave {
    0%,
    100% {
        transform: scaleY(0.4);
        opacity: 0.7;
    }

    50% {
        transform: scaleY(1.2);
        opacity: 0.4;
    }
}

/* Dark Fog Animation */
.dark-fog {
    position: absolute;
    width: 200%;
    height: 200%;
    background: radial-gradient(
        circle,
        rgba(74, 0, 0, 0.1) 0%,
        rgba(10, 10, 10, 0.9) 70%
    );
    animation: fog-move 12s infinite linear;
}

@keyframes fog-move {
    0% {
        transform: translate(-50%, -50%) scale(1);
    }

    100% {
        transform: translate(50%, 50%) scale(1.2);
    }
}

/* Raindrop Animation */
.raindrop {
    position: absolute;
    width: 2px;
    height: 20px;
    background: rgba(255, 255, 255, 0.3);
    animation: raindrop-fall 2s infinite linear;
}

@keyframes raindrop-fall {
    0% {
        transform: translateY(-100%);
        opacity: 0.8;
    }

    100% {
        transform: translateY(100vh);
        opacity: 0;
    }
}
</style>
