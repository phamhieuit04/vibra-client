<script setup>
import { api } from '@/api/axios';
import { onMounted, ref } from 'vue';
import { useViewStore } from '@/stores/view';
import { useAuthStore } from '@/stores/auth';
import { useModalStore } from '@/stores/modal';
import { useActivityStore } from '@/stores/activity';
import { Icon } from '@iconify/vue';
import { storeToRefs } from 'pinia';
import defaultImgage from '@/assets/default.jpg';

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);
const useModal = useModalStore();
const { openUploadSong } = storeToRefs(useModal);
const useActivity = useActivityStore();
const { allCategories, myAlbumList } = storeToRefs(useActivity);
const useView = useViewStore();

const previewImg = ref(null);
const fileInput = ref(null);
const songDescrip = ref(null);
const songPrice = ref(null);
const songAvt = ref(null);

const showCateDropdown = ref(false);
const selectedCategoryId = ref(null);
const selectedCategoryName = ref('');

const showAlbumDropdown = ref(false);
const selectedAlbumId = ref(null);
const selectedAlbumName = ref('');

const txtInput = ref(null);
const selectedTxtFile = ref(null);

const songInput = ref(null);
const selectedSongFile = ref(null);

function chooseSong() {
    songInput.value?.click();
}

function onSongChoosed(event) {
    const file = event.target.files[0];
    if (file) {
        selectedSongFile.value = file;
    }
}

function chooseTxt() {
    txtInput.value?.click();
}

function onTxtChoosed(event) {
    const file = event.target.files[0];
    if (file) {
        selectedTxtFile.value = file;
    }
}

function toggleCateDropdown() {
    showCateDropdown.value = !showCateDropdown.value;
}
function toggleAlbumDropdown() {
    showAlbumDropdown.value = !showAlbumDropdown.value;
}

function selectCategory(cate) {
    selectedCategoryId.value = cate.id;
    selectedCategoryName.value = cate.name;
    showCateDropdown.value = false;
}
function selectAlbum(album) {
    selectedAlbumId.value = album.id;
    selectedAlbumName.value = album.name;
    showAlbumDropdown.value = false;
}

function onImgChoosed(event) {
    const file = event.target.files[0];
    if (file) {
        songAvt.value = file;
        previewImg.value = URL.createObjectURL(file);
    }
}
function chooseImg() {
    fileInput.value?.click();
}

async function songNotify(artistId, songId) {
    try {
        const res = await api.get(`/firebase/notify-new-song?artist_id=${artistId}&song_id=${songId}`, {
            headers: {
                Authorization: 'Bearer ' + authStore.user.token,
            },
        });
    } catch (e) {
        console.log(e);
    }
}

const uploadSong = async () => {
    if (
        !songAvt.value ||
        !selectedTxtFile.value ||
        !selectedSongFile.value ||
        !selectedAlbumId.value ||
        !songPrice.value
    ) {
        useActivity.addNotify(true, 'Vui lòng điền đủ thông tin!');
        return;
    }
    if (songPrice.value < 2000) {
        useActivity.addNotify(true, 'Giá bài hát tối thiểu là 2000đ!');
        return;
    }
    const formData = new FormData();
    formData.append('category-id', selectedCategoryId.value);
    formData.append('description', songDescrip.value);
    formData.append('playlist-id', selectedAlbumId.value);
    formData.append('price', songPrice.value);
    if (songAvt.value && selectedTxtFile.value && selectedSongFile.value) {
        formData.append('song', selectedSongFile.value);
        formData.append('lyric', selectedTxtFile.value);
        formData.append('thumbnail', songAvt.value);
    }

    try {
        const res = await api.post('/profile/upload-song', formData, {
            headers: {
                Authorization: 'Bearer ' + user.value.token,
            },
        });
        console.log(res.data.data);
        if (res.data.code == 200) {
            useActivity.fetchUserData();
            useActivity.addNotify(false, 'Đăng tải bài hát thành công!');
            useActivity.syncGdrive('songs', res.data.data.id);
            songNotify(user.value.id, res.data.data.id);
        }
    } catch (e) {
        console.log(e);
        useActivity.addNotify(true, 'Call Api thất bại!');
    }
    openUploadSong.value = false;
};

onMounted(() => {
    console.log('UpLoadddddddddddddd');
});
</script>
<template>
    <div class="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 dark:bg-black/60">
        <div class="relative w-[900px] rounded-xl
                   bg-[#F5F5F4] p-6 text-[#1A1A1A]
                   dark:bg-[#1D1512] dark:text-white">
            <button class="absolute right-4 top-4 text-gray-600 hover:text-red-500
                       dark:text-white" @click="openUploadSong = false">
                ✕
            </button>

            <h2 class="mb-6 text-2xl font-bold" :style="{ color: useView.currentColor }">
                Đăng tải bài hát
            </h2>

            <div class="mb-3 flex gap-3">
                <div class="group relative flex h-80 w-80 shrink-0 cursor-pointer
                           items-center justify-center rounded-xl
                           bg-gray-200 dark:bg-zinc-700">
                    <img class="h-full w-full rounded-xl object-cover" :src="previewImg ? previewImg : defaultImgage"
                        @error="(event) => (event.target.src = defaultImgage)" alt="" />
                    <div class="absolute inset-0 flex items-center justify-center
                               rounded-xl bg-black/40 opacity-0 transition
                               group-hover:opacity-100" @click="chooseImg">
                        <Icon icon="material-symbols:edit-rounded" class="text-white" />
                        <input type="file" accept="image/*" ref="fileInput" style="display: none"
                            @change="onImgChoosed" />
                    </div>
                </div>

                <div class="flex-1">
                    <button @click="chooseSong" class="mb-3 w-full rounded-lg
                               bg-white px-4 py-3 text-[#1A1A1A]
                               transition hover:bg-gray-200
                               dark:bg-[#25211F] dark:text-white dark:hover:bg-[#2e2a28]">
                        {{
                            selectedSongFile
                                ? selectedSongFile.name
                                : 'Chọn file Nhạc'
                        }}
                    </button>
                    <input type="file" ref="songInput" accept="audio/*" @change="onSongChoosed" class="hidden" />

                    <textarea v-model="songDescrip" rows="5" class="mb-3 w-full rounded-lg
                               bg-white px-4 py-3 text-[#1A1A1A]
                               placeholder-gray-400
                               focus:outline-none
                               dark:bg-[#25211F] dark:text-white dark:placeholder-gray-400"
                        placeholder="Mô tả bài hát..."></textarea>

                    <input v-model="songPrice" type="number" class="mb-3 w-full rounded-lg
                               bg-white px-4 py-3 text-[#1A1A1A]
                               placeholder-gray-400
                               focus:outline-none
                               dark:bg-[#25211F] dark:text-white dark:placeholder-gray-400"
                        placeholder="Giá bài hát" />

                    <div class="mb-3 grid grid-cols-3 gap-4">
                        <div class="relative">
                            <button @click="toggleCateDropdown" class="mb-3 w-full rounded-lg
                                       bg-white px-4 py-3 text-[#1A1A1A]
                                       transition hover:bg-gray-200
                                       dark:bg-[#25211F] dark:text-white dark:hover:bg-[#2e2a28]">
                                {{ selectedCategoryName || 'Chọn thể loại' }}
                            </button>
                            <ul v-if="showCateDropdown" class="scrollbar-style absolute z-10 mt-1 max-h-72 w-full
                                       overflow-auto rounded-lg border
                                       border-gray-300 bg-white
                                       dark:border-gray-600 dark:bg-[#25211F]">
                                <li v-for="cate in allCategories" :key="cate.id" @click="selectCategory(cate)" class="cursor-pointer rounded-lg px-4 py-3
                                           hover:bg-gray-200
                                           dark:hover:bg-[#3a3533]">
                                    {{ cate.name }}
                                </li>
                            </ul>
                        </div>

                        <div class="relative">
                            <button @click="toggleAlbumDropdown" class="mb-3 w-full rounded-lg
                                       bg-white px-4 py-3 text-[#1A1A1A]
                                       transition hover:bg-gray-200
                                       dark:bg-[#25211F] dark:text-white dark:hover:bg-[#2e2a28]">
                                {{ selectedAlbumName || 'Chọn album' }}
                            </button>
                            <ul v-if="showAlbumDropdown" class="scrollbar-style absolute z-10 mt-1 max-h-72 w-full
                                       overflow-auto rounded-lg border
                                       border-gray-300 bg-white
                                       dark:border-gray-600 dark:bg-[#25211F]">
                                <li v-for="album in myAlbumList" :key="album.id" @click="selectAlbum(album)" class="cursor-pointer rounded-lg px-4 py-3
                                           hover:bg-gray-200
                                           dark:hover:bg-[#3a3533]">
                                    {{ album.name }}
                                </li>
                            </ul>
                        </div>

                        <button @click="chooseTxt" class="mb-3 w-full rounded-lg
                                   bg-white px-4 py-3 text-[#1A1A1A]
                                   transition hover:bg-gray-200
                                   dark:bg-[#25211F] dark:text-white dark:hover:bg-[#2e2a28]">
                            {{
                                selectedTxtFile
                                    ? selectedTxtFile.name
                                    : 'Chọn file Lyric'
                            }}
                        </button>
                        <input type="file" ref="txtInput" accept=".txt" @change="onTxtChoosed" class="hidden" />
                    </div>

                    <div class="mt-4 flex justify-end space-x-4">
                        <button class="rounded-3xl bg-gray-300 px-7 py-2 font-semibold
                                   text-[#1A1A1A] transition hover:bg-gray-400
                                   dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
                            @click="openUploadSong = false">
                            Hủy
                        </button>
                        <button class="rounded-3xl px-7 py-2 font-semibold text-white
                                   transition hover:brightness-110" :style="{ backgroundColor: useView.currentColor }"
                            @click="uploadSong">
                            Lưu
                        </button>
                    </div>
                </div>
            </div>

            <p class="mt-4 text-xs text-gray-500 dark:text-gray-400">
                Bằng cách tiếp tục, bạn đồng ý cho phép TÔI truy cập vào hình
                ảnh bạn đã chọn để tải lên. Vui lòng đảm bảo bạn có quyền tải
                lên hình ảnh.
            </p>
        </div>
    </div>
</template>
