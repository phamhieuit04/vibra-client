import apiHelper from '@/helpers/apiHelper';
import { defineStore } from 'pinia';
import defaultImgage from '@/assets/default.jpg';
import defaultSong from '@/assets/DefaultSong.mp3';
import { useAuthStore } from './auth';
import socket from '@/services/socket';

export const useSongStore = defineStore('song', {

    state: () => ({

        isPlaying: false,

        audio: null,

        currentPlaylist: null,

        currentWaitlist: [],

        songTime: 0,

        vol: 80,

        currentTrack: {

            id: 0,

            name: 'Bài hát chào người mới',

            thumbnail_path: defaultImgage,

            author: {
                name: 'Duy',
            },

            song_path: defaultSong,
        },

        isShuffle: false,

        currentDownload: '',

        audioVersion: 0,

        isStateBound: false,

    }),

    actions: {

        initializeSocket() {

            if (this.isStateBound) return;

            this.isStateBound = true;

            const authStore = useAuthStore();

            socket.emit('join', {

                userId: authStore.user.id

            });

            socket.on('state', async (state) => {

                await this.syncState(state);

            });

        },

        async syncState(state) {

            const queue = state.queue;
            const player = state.player;

            const currentSongId =
                queue.songIds?.[queue.currentIndex];
            if (!currentSongId) return;
            const authStore = useAuthStore();
            const res = await apiHelper.get('/song/show/' + currentSongId, {
                headers: {
                    Authorization: 'Bearer ' + authStore.user.token,
                },
            });
            const song = res.data.data;


            const songs = await Promise.all(
                queue.songIds.map(async songId => {
                    const res = await apiHelper.get('/song/show/' + songId, {
                        headers: {
                            Authorization: 'Bearer ' + authStore.user.token,
                        },
                    });
                    
                    return res.data.data;
                })
            );
            this.currentWaitlist.length = 0;
            this.currentWaitlist.push(...songs);


            this.isShuffle = state.player.isShuffleEnabled;

            console.log(this.isShuffle);

            if (!song) return;

            // đổi bài
            if (
                !this.currentTrack ||
                Number(this.currentTrack.id) !== Number(song.id)
            ) {
                console.log("state song changed");
                await this.loadTrack(song);

            }

            if (!this.audio) return;

            // sync play/pause
            if (player.isPlaying) {

                if (this.audio.paused) {

                    this.audio.play()
                        .catch(() => { });

                }

            } else {

                this.audio.pause();

            }

            // realtime position
            let positionMs =
                player.currentPosition || 0;

            if (
                player.isPlaying &&
                player.startedAt
            ) {

                positionMs +=
                    Date.now() -
                    player.startedAt;

            }

            const position =
                positionMs / 1000;

            const diff =
                Math.abs(
                    this.audio.currentTime - position
                );

            // tránh giật
            if (diff > 1.5) {

                this.audio.currentTime =
                    position;

            }

            this.isPlaying =
                player.isPlaying;

            this.songTime =
                this.audio.currentTime;

        },

        // async loadSongFromId(id){
        //     const authStore = useAuthStore();
        //     const res = await apiHelper.get('/song/show/' + id, {
        //         headers: {
        //             Authorization: 'Bearer ' + authStore.user.token,
        //         },
        //     });
        //     const song = res.data.data;
        //     this.currentTrack = song;
        //     this.loadTrack(song);
        // },

        async loadTrack(track) {

            this.currentTrack = track;

            // destroy audio cũ
            if (this.audio) {

                this.audio.pause();

                this.audio.src = '';

            }

            this.audio =
                new Audio(track.song_path);

            this.audio.volume =
                this.vol / 100;

            this.audioVersion++;

            this.isPlaying = false;

            if (!track.song_path) {

                console.warn(
                    'Nguồn không tồn tại hoặc bài hát bị lỗi định dạng'
                );

                return;

            }

            try {

                const authStore =
                    useAuthStore();

                apiHelper.get(

                    `/song/update/${track.id}`,

                    {
                        headers: {
                            Authorization:
                                'Bearer ' +
                                authStore.user.token,
                        },
                    }

                );

            } catch (e) {

                console.log(e);

            }

            this.bindAudioEvents();

        },

        bindAudioEvents() {

            if (!this.audio) return;

            this.audio.addEventListener(
                'ended',
                () => {

                    socket.emit('trackEnded', {

                        userId:
                            useAuthStore().user.id

                    });

                }
            );

        },

        playThisSong(track) {

            socket.emit('play', {

                userId:
                    useAuthStore().user.id,

                songId:
                    Number(track.id)

            });

        },

        nextSongs() {

            socket.emit('next', {

                userId:
                    useAuthStore().user.id

            });

        },

        prevSongs() {

            socket.emit('previous', {

                userId:
                    useAuthStore().user.id

            });

        },

        playOrPauseSong() {

            const authStore =
                useAuthStore();

            if (this.isPlaying) {

                socket.emit('pause', {

                    userId:
                        authStore.user.id

                });

            } else {

                socket.emit('play', {

                    userId:
                        authStore.user.id

                });

            }

        },

        playOrPauseThisSong(track) {

            if (
                !this.currentTrack ||
                Number(this.currentTrack.id) !== Number(track.id)
            ) {

                this.playThisSong(track);

                return;

            }

            this.playOrPauseSong();

        },

        setPlaylist(playlist) {

            this.currentPlaylist =
                playlist;

        },

        addSongToWaitlist(track){
            console.log("add song to waitlist");
            socket.emit('queue:add', {
                userId:
                    useAuthStore().user.id,
                songIds:
                    [track.id]
            });
        },

        playThisSongInWaitlist(track){
            this.playThisSong(track);
            this.loadTrack(track);
        },

        setDownload(download) {

            this.currentDownload =
                download;

        },

        setVolume(range) {

            this.vol = range;

            if (this.audio) {

                this.audio.volume =
                    range / 100;

            }

        },

        seekTo(percent) {

            if (!this.audio) return;

            const time =

                this.audio.duration *
                (percent / 100);

            socket.emit('seek', {

                userId:
                    useAuthStore().user.id,

                positionMs:
                    time * 1000

            });

        },

        toggleShuffle() {

            this.isShuffle =
                !this.isShuffle;

            socket.emit('shuffle', {

                userId:
                    useAuthStore().user.id,

                isShuffleEnabled:
                    this.isShuffle

            });

        },

        resetState() {

            if (this.audio) {

                this.audio.pause();

                this.audio.src = '';

            }

            this.isPlaying = false;

            this.audio = null;

            this.currentPlaylist = null;

            this.currentTrack = null;

        },

    },

    persist: {

        pick: [

            'currentTrack',

            'isShuffle',

            'vol',

            'currentPlaylist',

            'currentDownload',

        ],

    },

});