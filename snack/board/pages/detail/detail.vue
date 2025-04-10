<template>
  <v-container>
    <v-row>
      <!-- 왼쪽 패널: 이미지와 기본 정보 표시 -->
      <v-col cols="12" md="4">
        <v-card class="pa-4">
          <v-img :src="boardStore.board?.image_url" class="thumbnail-preview" />

          <v-list>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title class="headline">모임 제목</v-list-item-title>
                <v-list-item-subtitle>{{ boardStore.board?.title }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>모임 날짜</v-list-item-title>
                <v-list-item-subtitle>{{ formattedDate }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>맛집 장소</v-list-item-title>
                <v-list-item-subtitle>{{ boardStore.board?.restaurant }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>

          <!-- ✅ 작성자만 수정 버튼 노출 -->
          <v-btn
            v-if="boardStore.board?.is_author"
            color="primary"
            class="mt-4"
            @click="goToModify"
          >
            수정
          </v-btn>
        </v-card>
      </v-col>

      <!-- 오른쪽 패널: 모임 소개 -->
      <v-col cols="12" md="8">
        <v-card class="pa-4">
          <v-card-title class="text-h5">모임 소개</v-card-title>
          <v-card-text>{{ boardStore.board?.content }}</v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useBoardDetailStore } from '~/board/stores/detail/BoardDetailStore';

const route = useRoute();
const router = useRouter();
const boardStore = useBoardDetailStore();

onMounted(async () => {
  const boardId = route.params.id;
  await boardStore.requestDetailBoard(Number(boardId));
});

const formattedDate = computed(() => {
  const dateStr = boardStore.board?.end_time;
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
});

const goToModify = () => {
  router.push(`/board/modify/${route.params.id}`);
};
</script>

<style scoped>
.thumbnail-preview {
  width: 100%;
  height: 200px;
  object-fit: cover;
}
</style>