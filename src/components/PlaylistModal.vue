<script setup>
import { api } from '@/api/axios';
import { onMounted, ref } from 'vue';
import { useModalStore } from '@/stores/modal';
import { useAuthStore } from '@/stores/auth';
import { Icon } from '@iconify/vue';
import { storeToRefs } from 'pinia';
import defaultImgage from '@/assets/default.jpg';
import { useActivityStore } from '@/stores/activity';
import { useViewStore } from '@/stores/view';

const authStore = useAuthStore();
const useModal = useModalStore();
const { openEditPlaylist, playlistEditData } = storeToRefs(useModal);
const useActivity = useActivityStore();
const useView = useViewStore();

const previewImg = ref(null);
const fileInput = ref(null);
const playlistName = ref(playlistEditData.value.name);
const thumbnail = ref(null);

function onImgChoosed(event) {
    const file = event.target.files[0];
    if (file) {
        thumbnail.value = file;
        previewImg.value = URL.createObjectURL(file);
    }
}
function chooseImg() {
    fileInput.value?.click();
}

const saveProfile = async () => {
    if (!playlistName.value) {
        useActivity.addNotify(true, 'Vui lòng điền đủ thông tin!');
        return;
    }
    const formData = new FormData();
    formData.append('name', playlistName.value);
    if (thumbnail.value) {
        formData.append('thumbnail', thumbnail.value);
    }

    try {
        const res = await api.post(`/library/update-playlist/${playlistEditData.value.id}`,
            formData, {
            headers: {
                Authorization: 'Bearer ' + authStore.user.token,
            },
        });
        if (res.data.code == 200) {
            useActivity.fetchData();
            useActivity.addNotify(false, 'Chỉnh sửa thành công!');
            useActivity.syncGdrive('thumbnails', playlistEditData.value.id);
        }
    } catch (e) {
        console.log(e);
        useActivity.addNotify(true, 'Call Api thất bại!');
    }
    openEditPlaylist.value = false;
};

onMounted(() => {
    console.log(playlistEditData.value);
});
</script>
<template>
    <div class="fixed inset-0 z-[100] flex items-center justify-center
               bg-black/40 dark:bg-black/60">
        <div class="relative w-[550px] rounded-xl
                   bg-[#f5f5f5] text-gray-900
                   dark:bg-[#1D1512] dark:text-white
                   p-6">
            <button class="absolute right-4 top-4
                       text-gray-600 hover:text-red-500
                       dark:text-white" @click="openEditPlaylist = false">
                ✕
            </button>

            <h2 class="mb-6 text-2xl font-bold" :style="{ color: useView.currentColor }">
                Chỉnh sửa Playlist
            </h2>

            <div class="mb-3 flex gap-1">
                <div class="group relative flex h-44 w-48 shrink-0 cursor-pointer
                           items-center justify-center rounded-xl
                           bg-[#e0e0e0] dark:bg-zinc-700">
                    <img class="h-full w-full rounded-xl object-cover" :src="previewImg
                        ? previewImg
                        : playlistEditData.thumbnail_path" @error="(event) => (event.target.src = defaultImgage)"
                        alt="" />
                    <div class="absolute inset-0 flex items-center justify-center
                               rounded-xl bg-black/40 opacity-0 transition
                               group-hover:opacity-100" @click="chooseImg">
                        <Icon icon="material-symbols:edit-rounded" class="text-white" />
                        <input type="file" accept="image/*" ref="fileInput" style="display: none"
                            @change="onImgChoosed" />
                    </div>
                </div>

                <div class="ml-2 flex-1">
                    <input v-model="playlistName" class="mb-3 w-full rounded-lg
                               bg-white text-gray-900
                               placeholder-gray-400
                               px-4 py-3 outline-none
                               dark:bg-[#25211F] dark:text-white
                               dark:placeholder-gray-500" placeholder="Tên Playlist" />
                </div>
            </div>

            <div class="float-end">
                <button class="rounded-3xl px-7 py-2 font-semibold transition
                           bg-gray-300 text-gray-800 hover:bg-gray-400
                           dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500" @click="openEditPlaylist = false">
                    Hủy
                </button>

                <button class="ml-4 rounded-3xl px-7 py-2 font-semibold
                           text-white transition hover:brightness-110"
                    :style="{ backgroundColor: useView.currentColor }" @click="saveProfile">
                    Lưu
                </button>
            </div>

            <p class="mt-16 text-xs
                      text-gray-500
                      dark:text-gray-400">
                Bằng cách tiếp tục, bạn đồng ý cho phép TÔI truy cập vào hình
                ảnh bạn đã chọn để tải lên. Vui lòng đảm bảo bạn có quyền tải
                lên hình ảnh.
            </p>
        </div>
    </div>
</template>
