import { useAuthStore } from '@/stores/auth';
import Index from '@/views/index.vue';
import Login from '@/views/login.vue';
import Signup from '@/views/signup.vue';
import Verify from '@/views/verify.vue';
import Payfail from '@/views/payfail.vue';
import Paysuccess from '@/views/paysuccess.vue';
import VerifyDone from '@/views/verify-done.vue';
import InterestGerne from '@/views/interest-gerne.vue';
import HomePage from '@/components/HomePage.vue';
import PlaylistPage from '@/components/PlaylistPage.vue';
import UserPage from '@/components/UserPage.vue';
import SearchPage from '@/components/SearchPage.vue';
import ArtistPage from '@/components/ArtistPage.vue';
import CategoriesPage from '@/components/CategoriesPage.vue';
import CategoriesSongPage from '@/components/CategoriesSongPage.vue';
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
            children: [
                {
                    path: '',
                    name: 'index-home',
                    component: HomePage,
                },
                {
                    path: 'search',
                    name: 'index-search',
                    component: SearchPage,
                },
                {
                    path: 'categories',
                    name: 'index-categories',
                    component: CategoriesPage,
                },
                {
                    path: 'categories-song',
                    name: 'index-categories-song',
                    component: CategoriesSongPage,
                },
                {
                    path: 'playlist',
                    name: 'index-playlist',
                    component: PlaylistPage,
                },
                {
                    path: 'artist',
                    name: 'index-artist',
                    component: ArtistPage,
                },
                {
                    path: 'user',
                    name: 'index-user',
                    component: UserPage,
                },
            ],
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
