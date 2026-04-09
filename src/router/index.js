import { useAuthStore } from '@/stores/auth';
import IndexPage from '@/views/IndexPage.vue';
import LoginPage from '@/views/LoginPage.vue';
import SignupPage from '@/views/SignupPage.vue';
import VerifyPage from '@/views/VerifyPage.vue';
import PayFailPage from '@/views/PayFailPage.vue';
import PaySuccessPage from '@/views/PaySuccessPage.vue';
import VerifyDonePage from '@/views/VerifyDonePage.vue';
import InterestGenrePage from '@/views/InterestGenrePage.vue';
import HomePage from '@/views/HomePage.vue';
import PlaylistPage from '@/views/PlaylistPage.vue';
import UserPage from '@/views/UserPage.vue';
import SearchPage from '@/views/SearchPage.vue';
import ArtistPage from '@/views/ArtistPage.vue';
import CategoriesPage from '@/views/CategoriesPage.vue';
import CategoriesSongPage from '@/views/CategoriesSongPage.vue';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/login',
            name: 'login',
            component: LoginPage,
        },
        {
            path: '/signup',
            name: 'signup',
            component: SignupPage,
        },
        {
            path: '/',
            name: 'index',
            component: IndexPage,
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
            component: VerifyPage,
        },
        {
            path: '/payfail',
            name: 'payfail',
            component: PayFailPage,
        },
        {
            path: '/paysuccess',
            name: 'paysuccess',
            component: PaySuccessPage,
        },
        {
            path: '/verify-done',
            name: 'verify-done',
            component: VerifyDonePage,
        },
        {
            path: '/interest-gerne',
            name: 'interest-gerne',
            component: InterestGenrePage,
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
