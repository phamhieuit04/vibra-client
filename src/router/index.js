import { useAuthStore } from '@/stores/auth';
import Index from '@/views/index.vue';
import Login from '@/views/login.vue';
import Signup from '@/views/signup.vue';
import Verify from '@/views/verify.vue';
import Payfail from '@/views/payfail.vue';
import Paysuccess from '@/views/paysuccess.vue';
import VerifyDone from '@/views/verify-done.vue';
import InterestGerne from '@/views/interest-gerne.vue';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/login',
            name: 'login',
            component: Login,
        },
        {
            path: '/signup',
            name: 'signup',
            component: Signup,
        },
        {
            path: '/',
            name: 'index',
            component: Index,
            meta: {
                requiresAuth: true,
            },
        },
        {
            path: '/verify',
            name: 'verify',
            component: Verify,
        },
        {
            path: '/payfail',
            name: 'payfail',
            component: Payfail,
        },
        {
            path: '/paysuccess',
            name: 'paysuccess',
            component: Paysuccess,
        },
        {
            path: '/verify-done',
            name: 'verify-done',
            component: VerifyDone,
        },
        {
            path: '/interest-gerne',
            name: 'interest-gerne',
            component: InterestGerne,
        }
    ],
});

router.beforeEach((to, from) => {
    const authStore = useAuthStore();
    if (to.meta.requiresAuth && !authStore.isLoggedIn) {
        return {
            path: '/login',
        };
    }
});

export default router;
