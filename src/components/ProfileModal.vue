<script setup>
import apiHelper from '@/helpers/apiHelper';
import { onMounted, ref } from 'vue';
import { useViewStore } from '@/stores/view';
import { useAuthStore } from '@/stores/auth';
import { useModalStore } from '@/stores/modal';
import { Icon } from '@iconify/vue';
import { storeToRefs } from 'pinia';
import defaultImgage from '@/assets/default.jpg';
import { useActivityStore } from '@/stores/activity';

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);
const useModal = useModalStore();
const { openEditProfile } = storeToRefs(useModal);
const useActivity = useActivityStore();
const { allCategories } = storeToRefs(useActivity);
const useView = useViewStore();

const previewImg = ref(null);
const fileInput = ref(null);
const profileName = ref(user.value.name);
const profileDescrip = ref(user.value.description);
const profileGender = ref(
    user.value.gender ? user.value.gender : 'Giới tính khác',
);
const profileBirth = ref(user.value.birth ? user.value.birth : '2000/10/10');
const avatar = ref(null);

function onImgChoosed(event) {
    const file = event.target.files[0];
    if (file) {
        avatar.value = file;
        previewImg.value = URL.createObjectURL(file);
    }
}
function chooseImg() {
    fileInput.value?.click();
}

const saveProfile = async () => {
    if (!profileName.value || !profileDescrip.value || !profileGender.value) {
        useActivity.addNotify(true, 'Vui lòng điền đủ thông tin!');
        return;
    }
    const formData = new FormData();
    formData.append('name', profileName.value);
    formData.append('description', profileDescrip.value);
    formData.append('gender', profileGender.value);
    formData.append('birth', profileBirth.value);
    if (avatar.value) {
        formData.append('avatar', avatar.value);
    }

    try {
        const res = await apiHelper.post('/profile/update', formData, {
            headers: {
                Authorization: 'Bearer ' + user.value.token,
            },
        });
        const fetchUser = await apiHelper.get('/profile/show', {
            headers: {
                Authorization: 'Bearer ' + user.value.token,
            },
        });
        fetchUser.data.data.token = user.value.token;
        authStore.setUser(fetchUser.data.data);
        useActivity.addNotify(false, 'Chỉnh sửa thông tin thành công!');
        useActivity.syncGdrive('avatars', user.value.id);
    } catch (e) {
        console.log(e);
        useActivity.addNotify(true, 'Call Api thất bại!');
    }
    openEditProfile.value = false;
};
</script>
<template>
    <div class="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 dark:bg-black/60">
        <div class="relative w-[700px] rounded-xl bg-[#F5F5F4] p-6 text-[#1A1A1A]
                   dark:bg-[#1D1512] dark:text-white">
            <button class="absolute right-4 top-4 text-gray-600 hover:text-red-500
                       dark:text-white" @click="openEditProfile = false">
                ✕
            </button>

            <h2 class="mb-6 text-2xl font-bold" :style="{ color: useView.currentColor }">
                Chi tiết hồ sơ
            </h2>

            <div class="mb-3 flex gap-3">
                <div class="group relative flex h-80 w-80 shrink-0 cursor-pointer
                           items-center justify-center rounded-xl
                           bg-gray-200 dark:bg-zinc-700">
                    <img class="h-full w-full rounded-xl object-cover" :src="previewImg ? previewImg : user.avatar_path"
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
                    <input v-model="profileName" class="mb-3 w-full rounded-lg
                               bg-white px-4 py-3 text-[#1A1A1A]
                               placeholder-gray-400
                               focus:outline-none
                               dark:bg-[#25211F] dark:text-white dark:placeholder-gray-400" placeholder="Tên hồ sơ" />
                    <textarea v-model="profileDescrip" rows="5" class="mb-3 w-full rounded-lg
                               bg-white px-4 py-3 text-[#1A1A1A]
                               placeholder-gray-400
                               focus:outline-none
                               dark:bg-[#25211F] dark:text-white dark:placeholder-gray-400"
                        placeholder="Mô tả bản thân..."></textarea>
                    <select v-model="profileGender" class="mb-3 w-full rounded-lg
                               bg-white px-4 py-3 text-[#1A1A1A]
                               focus:outline-none
                               dark:bg-[#25211F] dark:text-white">
                        <option disabled value="-- Chọn giới tính --">
                            -- Chọn giới tính --
                        </option>
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                        <option value="Giới tính khác">Khác</option>
                    </select>
                    <input type="date" v-model="profileBirth" class="mb-3 w-full rounded-lg
                               bg-white px-4 py-3 text-[#1A1A1A]
                               focus:outline-none
                               dark:bg-[#25211F] dark:text-white" />
                </div>
            </div>

            <div class="float-end">
                <button class="rounded-3xl bg-gray-300 px-7 py-2 font-semibold
                           text-[#1A1A1A] transition hover:bg-gray-400
                           dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500" @click="openEditProfile = false">
                    Hủy
                </button>
                <button class="ml-4 rounded-3xl px-7 py-2 font-semibold text-white
                           transition hover:brightness-110" :style="{ backgroundColor: useView.currentColor }"
                    @click="saveProfile">
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
