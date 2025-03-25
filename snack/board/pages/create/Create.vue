<template>
  <v-container>
    <v-row>
      <!-- 왼쪽 패널 -->
      <v-col cols="12" md="4">
        <v-card class="pa-4">
          <v-card-title class="text-h6">맛모임 등록</v-card-title>

          <!-- 썸네일 이미지 업로드 -->
          <v-file-input
            v-model="thumbnail"
            label="썸네일"
            accept="image/*"
            outlined
            dense
            @update:modelValue="handleImageUpload"
          ></v-file-input>

          <!-- 이미지 미리보기 + 삭제 버튼 -->
          <div v-if="previewImage" class="relative-container mt-2">
            <v-img :src="previewImage" class="thumbnail-preview" />
            <v-btn
              icon
              small
              color="red"
              style="position: absolute; top: 5px; right: 5px; z-index: 1"
              @click="removeImage"
            >
              <v-icon small>mdi-close</v-icon>
            </v-btn>
          </div>

          <!-- 날짜 + 시간 선택기 -->
          <v-card class="mt-3 pa-2">
            <v-card-title class="text-subtitle1">모임 날짜 및 시간</v-card-title>
            <Datepicker
              v-model="datetime"
              locale="ko"
              :enable-time-picker="true"
              format="yyyy-MM-dd HH:mm"
              :clearable="true"
              auto-apply
              :teleport="true"
              placeholder="날짜와 시간을 선택하세요"
              :min-date="new Date()"
              class="mt-2"
            />
          </v-card>

          <!-- 맛집 선택 -->
          <v-autocomplete
            v-model="selectedRestaurant"
            :items="restaurantList"
            item-text="name"
            item-value="id"
            label="맛집 장소 검색"
            outlined
            dense
            hide-details
            clearable
            :loading="loadingRestaurants"
            @update:search-input="onSearchRestaurant"
            class="mt-4"
          />

          <!-- 등록 / 취소 버튼 -->
          <v-btn color="primary" block class="mt-4" @click="submitBoard">등록</v-btn>
          <v-btn color="grey" block class="mt-2" @click="router.push('/board')">취소</v-btn>
        </v-card>
      </v-col>

      <!-- 오른쪽 패널 -->
      <v-col cols="12" md="8">
        <v-card class="pa-4">
          <v-text-field v-model="title" label="모임 제목" outlined dense hide-details class="mb-4"></v-text-field>
          <v-textarea v-model="content" label="모임 소개" outlined dense hide-details rows="6"></v-textarea>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useBoardStore } from '~/board/stores/create/BoardCreateStore';
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import * as axiosUtility from '~/utility/axiosInstance';

const router = useRouter();
const boardStore = useBoardStore();

const title = ref('');
const content = ref('');
const thumbnail = ref<File | null>(null);
const previewImage = ref('');
const datetime = ref<Date | null>(null);
const selectedRestaurant = ref(null);
const restaurantList = ref([]);
const loadingRestaurants = ref(false);

onMounted(() => {
  datetime.value = new Date();
});

const handleImageUpload = (file: File | File[]) => {
  const realFile = Array.isArray(file) ? file[0] : file;
  if (!realFile) return;

  thumbnail.value = realFile;

  const reader = new FileReader();
  reader.onload = (e) => {
    previewImage.value = e.target?.result as string;
  };
  reader.readAsDataURL(realFile);
};

const removeImage = () => {
  thumbnail.value = null;
  previewImage.value = '';
};

const onSearchRestaurant = async (searchText: string) => {
  if (!searchText) return;
  loadingRestaurants.value = true;
  try {
    const { djangoAxiosInstance } = axiosUtility.createAxiosInstances();
    const res = await djangoAxiosInstance.get('/restaurants/search/', {
      params: { keyword: searchText },
    });
    restaurantList.value = res.data.results || [];
  } catch (error) {
    console.error('❌ 맛집 검색 실패:', error);
  } finally {
    loadingRestaurants.value = false;
  }
};

const submitBoard = async () => {
  console.log("📦 전송 전 확인");
  console.log("🟢 title:", title.value);
  console.log("🟢 content:", content.value);
  console.log("🟢 end_time:", datetime.value?.toISOString());
  console.log("🟢 restaurant_id:", selectedRestaurant.value);

  try {
    await boardStore.requestCreateBoard({
      title: title.value,
      content: content.value,
      image: thumbnail.value,
      end_time: datetime.value?.toISOString() || new Date().toISOString(),
      author_id: localStorage.getItem("account_id"),
      restaurant_id: selectedRestaurant.value,
    });

    console.log("✅ 게시글 등록 성공");
    router.push('/board/all');
  } catch (error) {
    console.error("❌ 게시글 등록 실패", error);
  }
};
</script>

<style scoped>
.thumbnail-preview {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
}
.relative-container {
  position: relative;
}
</style>
