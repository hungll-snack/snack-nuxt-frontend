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
          <v-img v-if="previewImage" :src="previewImage" class="thumbnail-preview mt-2"></v-img>

          <!-- 날짜 선택 -->
          <v-card class="mt-3 pa-2">
            <v-card-title class="text-subtitle1">날짜 선택 (선택사항)</v-card-title>
            <v-text-field
              v-model="selectedDate"
              label="날짜 선택"
              prepend-icon="mdi-calendar"
              readonly
              @click="menu = true"
            ></v-text-field>

            <v-dialog v-model="menu" max-width="340px">
              <v-card>
                <v-card-title class="d-flex justify-space-between">
                  날짜 선택
                  <v-btn icon @click="menu = false">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </v-card-title>
                <v-date-picker v-model="selectedDate"></v-date-picker>
                <v-card-actions>
                  <v-btn text color="primary" @click="menu = false">확인</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-card>

          <!-- 등록 버튼 -->
          <v-btn color="primary" block class="mt-2" @click="submitBoard">등록</v-btn>
        </v-card>
      </v-col>

      <!-- 오른쪽 패널 -->
      <v-col cols="12" md="8">
        <v-card class="pa-4">
          <v-text-field v-model="title" label="모임 제목" outlined dense hide-details></v-text-field>
          <v-textarea v-model="content" label="모임 소개" outlined dense hide-details rows="6"></v-textarea>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useBoardStore } from '~/board/stores/create/BoardCreateStore';

const router = useRouter();
const boardStore = useBoardStore();

const title = ref('');
const content = ref('');
const thumbnail = ref<File | null>(null);
const previewImage = ref('');
const selectedDate = ref(null);
const menu = ref(false);

const handleImageUpload = (file: File | File[]) => {
  const realFile = Array.isArray(file) ? file[0] : file
  if (!realFile) return

  thumbnail.value = realFile

  const reader = new FileReader()
  reader.onload = (e) => {
    previewImage.value = e.target?.result as string
  }
  reader.readAsDataURL(realFile)
}

const submitBoard = async () => {
  console.log("📦 전송 전 확인");
  console.log("🟢 title:", title.value);
  console.log("🟢 content:", content.value);
  console.log("🟢 end_time:", selectedDate.value);

  try {
    await boardStore.requestCreateBoard({
      title: title.value,
      content: content.value,
      image: thumbnail.value,
      end_time: selectedDate.value || new Date().toISOString().slice(0, 10),
      author_id: localStorage.getItem("account_id"),
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
</style>
