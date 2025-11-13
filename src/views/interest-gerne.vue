<script setup>
import { onMounted, ref, watch, toRefs, computed } from 'vue';
import { api } from '@/api/axios';
import { Icon } from '@iconify/vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import MyLogo from '@/assets/MyLogo.svg';

const authStore = useAuthStore();
const router = useRouter();

let categories = ref([]);
const selectedCategories = ref([]);

const loading = ref(true)

function toggleSelect(item) {
  const index = selectedCategories.value.indexOf(item)
  if (index === -1) {
    selectedCategories.value.push(item)
  } else {
    selectedCategories.value.splice(index, 1)
  }
}

function HandleSubmit(){
    console.log(selectedCategories.value); 
    router.push("/");
}

async function getAllCategories() {
    try {
        const res = await api.get('/category/index', {
            headers: {
                Authorization: 'Bearer ' + authStore.user.token,
            },
        });

        if (res.data.code === 200) {
            categories = res.data.data;
            loading.value = false;
        }
    } catch (e) {
        console.log(e);
    }
}

onMounted(() => {
    getAllCategories();
})

</script>

<template>
    <div class="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-60" v-if="isLoading">
        <Icon icon="svg-spinners:180-ring" class="text-[200px] text-[#BC4D15]" />
    </div>
    <div class="flex h-screen items-center justify-center bg-gradient-to-b from-[#292929] from-10% to-black to-80%">
        <div class="flex h-[740px] w-[734px] flex-col items-center rounded-2xl bg-[#121212] px-24 py-8">
            <img :src="MyLogo" alt=""
                class="duration-400 my-[-60px] h-[200px] w-[200px] text-[#FFE5D6] invert transition hover:text-white" />
            <h1 class="pt-2 text-4xl font-bold text-white">
                Chọn thể loại nhạc bạn mong muốn
            </h1>

            <hr class="w-full text-gray-500 mt-10 opacity-15" />

            <div v-if="!loading" class="w-full h-96 items-start justify-start flex flex-wrap p-2 gap-5 overflow-y-auto scrollbar-none">
                <div v-for="item in categories" :key="item.id" class="w-40 h-10">
                    <div
                        class="cursor-pointer select-none rounded-xl border p-4 text-center" @click="toggleSelect(item)" :class="selectedCategories.includes(item) 
                            ? 'bg-[#BC4D15] text-white border-[#BC4D15] shadow-lg scale-105'
                            : 'bg-white text-gray-800 hover:bg-gray-100 border-gray-300' "> 
                        {{ item.name }} 
                    </div>
                </div>
            </div>

            <button
                @click="HandleSubmit()"
                class="mt-6 rounded-full w-80 bg-[#BC4D15] p-4 font-bold text-black transition ease-in hover:scale-105 hover:bg-[#b36b47]">
                Xác nhận
            </button>
        </div>
    </div>
</template>