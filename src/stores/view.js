import { defineStore } from 'pinia';
export const useViewStore = defineStore('view', {
    state: () => ({
        currentColor: null,
        selected: null,
        page: null,
        isFullscreen: false,
        showSidePanel: false,
        sidePanelState: '',
        showWaitlistPanel: false,
        categoriesData: null,

        playlistData: null,
        artistData: null,
        userData: null,
    }),

    actions: {
        selectItem(item) {
            this.selected = item;
        },

        setPlaylistData(playlist) {
            this.playlistData = playlist;
        },

        setArtistData(artist) {
            this.artistData = artist;
        },

        setCategoriesData(categories) {
            this.categoriesData = categories;
        },

        toggleFullscreen() {
            const el = this.page;
            if (!document.fullscreenElement) {
                el.requestFullscreen();
                this.isFullscreen = true;
            } else {
                document.exitFullscreen();
                this.isFullscreen = false;
            }
        },

        toggleSidePanel() {
            this.showSidePanel = !this.showSidePanel;
        },

        toggleWaitlistPanel() {
            this.showWaitlistPanel = !this.showWaitlistPanel;
        },

        setFullscreenPage(page) {
            this.page = page;
        },

        listenFullscreenChange() {
            document.addEventListener('fullscreenchange', () => {
                this.isFullscreen = !!document.fullscreenElement;
            });
        },
        setCurrentColor(color) {
            this.currentColor = color;
        },
    },
    persist: true,
});
