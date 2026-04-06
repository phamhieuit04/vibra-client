import apiHelper from '@/helpers/apiHelper';
import { defineStore } from 'pinia';
import defaultImgage from '@/assets/default.jpg';
import defaultSong from '@/assets/DefaultSong.mp3';
import { useAuthStore } from './auth';
import { useActivityStore } from './activity';

export const useSongStore = defineStore('song', {
    state: () => ({
        isPlaying: false,
        audio: null,
        currentPlaylist: null,
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
        currentWaitlist: [],
        prevList: [],
        isShuffle: true,
        currentDownload: '',
        audioVersion: 0,
    }),
    actions: {
        playThisSong(track) {
            this.currentTrack = track;

            if (this.audio && typeof this.audio.pause === 'function') {
                this.audio.pause();
                this.audio.src = '';
            }
            this.audio = null;
            this.isPlaying = false;

            this.audio = new Audio(track.song_path);
            this.audio.volume = this.vol / 100;
            this.audioVersion++;

            if (!track.song_path) {
                console.warn('Nguồn không tồn tại hoặc bài hát bị lỗi định dạng');
                return;
            }

            try {
                const authStore = useAuthStore();
                apiHelper.get(`/song/update/${track.id}`, {
                    headers: {
                        Authorization: 'Bearer ' + authStore.user.token,
                    },
                });
            } catch (e) {
                console.log(e);
            }

            this.audio.addEventListener('canplay', () => {
                this.audio.play()
                    .then(() => {
                        this.isPlaying = true;
                    })
                    .catch((err) => {
                        console.warn('play() bị chặn:', err.message);
                        this.isPlaying = false;
                    });
            }, { once: true });

            this.audio.addEventListener('ended', () => {
                this.nextSongs();
            }, { once: true });
        },

        addSongToWaitlist(track) {
            track.index = this.currentWaitlist.length;
            this.currentWaitlist.push(track);
            this.fetchIndex();
            useActivityStore().addNotify(false, 'Đã thêm bài hát vào hàng chờ!');
        },

        addPlaylistToWaitlist(playlist) {
            if (!playlist || playlist.length === 0) return;
            for (let i = playlist.length - 1; i >= 0; i--) {
                this.currentWaitlist.unshift(playlist[i]);
            }
            this.fetchIndex();
            useActivityStore().addNotify(false, 'Đã thêm danh sách phát này vào hàng chờ!');
        },

        addAndPlayThisPlaylist(playlist) {
            if (!playlist || playlist.length === 0) return;
            for (let i = playlist.length - 1; i > 0; i--) {
                this.currentWaitlist.unshift(playlist[i]);
            }
            this.playThisSong(playlist[0]);
            this.fetchIndex();
            useActivityStore().addNotify(false, 'Đã thêm danh sách phát này vào hàng chờ!');
        },

        deleteSongFromWaitlist(track) {
            this.currentWaitlist.splice(track.index, 1);
            this.fetchIndex();
        },

        fetchIndex() {
            for (let i = 0; i < this.currentWaitlist.length; i++) {
                this.currentWaitlist[i].index = i;
            }
        },

        nextSongs() {
            if (this.currentWaitlist.length > 0) {
                if (this.isShuffle === false) {
                    this.prevList.unshift(this.currentTrack);
                    const nextSong = this.currentWaitlist.shift();
                    this.playThisSong(nextSong);
                    this.fetchIndex();
                } else {
                    const tmpTrack = this.currentWaitlist[
                        Math.floor(Math.random() * this.currentWaitlist.length)
                    ];
                    this.playThisSongInWaitlist(tmpTrack);
                }
            } else {
                this.playThisSong(this.currentTrack);
                this.fetchIndex();
            }
        },

        prevSongs() {
            if (this.prevList.length > 0) {
                const prevSong = this.prevList.shift();
                this.currentWaitlist.unshift(this.currentTrack);
                this.playThisSong(prevSong);
                this.fetchIndex();
            }
        },

        playOrPauseThisSong(track) {
            if (!this.audio || !this.audio.src || this.currentTrack.id !== track.id) {
                this.playThisSong(track);
                return;
            }
            this.playOrPauseSong();
        },

        playOrPauseSong() {
            if (!this.audio) return;
            if (this.audio.paused) {
                this.audio.play()
                    .then(() => { this.isPlaying = true; })
                    .catch((err) => { console.warn('play() bị chặn:', err.message); });
            } else {
                this.audio.pause();
                this.isPlaying = false;
            }
        },

        playThisSongInWaitlist(track) {
            this.prevList.unshift(this.currentTrack);
            this.playThisSong(track);
            this.deleteSongFromWaitlist(track);
        },

        setPlaylist(playlist) {
            this.currentPlaylist = playlist;
        },

        setDownload(download) {
            this.currentDownload = download;
        },

        setVolume(range) {
            this.vol = range;
            if (this.audio) this.audio.volume = range / 100;
        },

        setSongTime(time) {
            this.songTime = time;
            if (this.audio) this.audio.currentTime = time;
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
        pick: ['currentTrack', 'currentWaitlist', 'prevList', 'isShuffle', 'vol', 'currentPlaylist', 'currentDownload', 'audioVersion'],
    },
});