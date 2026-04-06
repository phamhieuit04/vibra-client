<script setup>
import apiHelper from '@/helpers/apiHelper';
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
const useView = useViewStore();
const { openEditAlbum, playlistEditData } = storeToRefs(useModal);
const useActivity = useActivityStore();

const previewImg = ref(null);
const fileInput = ref(null);

const albumName = ref(playlistEditData.value.name);
const albumDescrip = ref(playlistEditData.value.description);
const albumPrice = ref(playlistEditData.value.price);

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
    if (!albumName.value || !albumDescrip.value || !albumPrice.value) {
        useActivity.addNotify(true, 'Vui lòng điền đầy đủ thông tin!');
        return;
    }
    if (albumPrice.value < 4000) {
        useActivity.addNotify(true, 'Giá Album tối thiểu là 4000đ!');
        return;
    }
    const formData = new FormData();
    formData.append('name', albumName.value);
    formData.append('description', albumDescrip.value);
    formData.append('price', albumPrice.value);
    if (thumbnail.value) {
        formData.append('thumbnail', thumbnail.value);
    }

    try {
        const res = await apiHelper.post(`/profile/update-album/${playlistEditData.value.id}`,
            formData, {
            headers: {
                Authorization: 'Bearer ' + authStore.user.token,
            },
        });
        if (res.data.code == 200) {
            useActivity.fetchData();
            useActivity.fetchUserData();
            useActivity.addNotify(false, 'Chỉnh sửa thành công!');
            useActivity.syncGdrive('thumbnails', playlistEditData.value.id);
        }
    } catch (e) {
        console.log(e);
        useActivity.addNotify(true, 'Chỉnh sửa thất bại!');
    }
    openEditAlbum.value = false;
};

onMounted(() => {
    console.log(playlistEditData.value);
});
</script>
<template>
    <div class="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 dark:bg-black/60">
        <div class="relative w-[700px] rounded-lg bg-white p-6 text-black dark:bg-[#1D1512] dark:text-white">
            <button class="absolute right-4 top-4 text-black hover:text-red-500 dark:text-white"
                @click="openEditAlbum = false">
                ✕
            </button>

            <h2 class="mb-6 text-2xl font-bold" :style="{ color: useView.currentColor }">
                Chỉnh sửa Album
            </h2>

            <div class="mb-3 flex gap-1">
                <div
                    class="group relative flex h-64 w-64 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-zinc-200 dark:bg-zinc-700">
                    <img class="h-full w-full rounded-xl object-cover"
                        :src="previewImg ? previewImg : playlistEditData.thumbnail_path"
                        @error="(event) => (event.target.src = defaultImgage)" alt="" />
                    <div class="absolute inset-0 flex items-center justify-center rounded-xl bg-black/50 opacity-0 transition group-hover:opacity-100"
                        @click="chooseImg">
                        <Icon icon="material-symbols:edit-rounded text-black" />
                        <input type="file" accept="image/*" ref="fileInput" style="display: none"
                            @change="onImgChoosed" />
                    </div>
                </div>

                <div class="ml-2 flex-1">
                    <input v-model="albumName"
                        class="mb-3 w-full rounded-lg bg-zinc-100 px-4 py-3 text-black dark:bg-[#25211F] dark:text-white"
                        placeholder="Tên Album" />

                    <textarea v-model="albumDescrip" rows="5"
                        class="mb-3 w-full rounded-lg bg-zinc-100 px-4 py-3 text-black dark:bg-[#25211F] dark:text-white"
                        placeholder="Mô tả Album..."></textarea>

                    <input v-model="albumPrice" type="number"
                        class="mb-3 w-full rounded-lg bg-zinc-100 px-4 py-3 text-black dark:bg-[#25211F] dark:text-white"
                        placeholder="Giá" />
                </div>
            </div>

            <div class="float-end">
                <button
                    class="rounded-3xl bg-gray-300 px-7 py-2 font-semibold text-black transition hover:bg-gray-400 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
                    @click="openEditAlbum = false">
                    Hủy
                </button>
                <button class="ml-4 rounded-3xl px-7 py-2 font-semibold text-white transition hover:brightness-125"
                    :style="{ backgroundColor: useView.currentColor }" @click="saveProfile">
                    Lưu
                </button>
            </div>

            <p class="mt-16 text-xs text-gray-500 dark:text-gray-400">
                Bằng cách tiếp tục, bạn đồng ý cho phép TÔI truy cập vào hình
                ảnh bạn đã chọn để tải lên. Vui lòng đảm bảo bạn có quyền tải
                lên hình ảnh.
            </p>
        </div>
    </div>
</template>
