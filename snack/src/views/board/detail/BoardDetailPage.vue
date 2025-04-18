<template>
    <v-container>
      <v-row>
        <v-col cols="12" md="3">
  <v-card class="pa-4">
    <v-img
      :src="board?.image_url || '/default-thumbnail.jpg'"
      cover
      height="200"
      width="100%"
      class="rounded"
      :aspect-ratio="1.5"
    />

    <v-list dense>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="font-weight-bold">✨ 모임 제목</v-list-item-title>
          <v-list-item-subtitle>{{ board?.title }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="font-weight-bold">📅 모임 날짜</v-list-item-title>
          <v-list-item-subtitle>{{ formattedDate }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="font-weight-bold">👤 작성자</v-list-item-title>
          <v-list-item-subtitle>{{ board?.author_nickname }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-card>
</v-col>

        <!-- 오른쪽 모임 소개 -->
        <v-col cols="12" md="9">
          <v-card class="pa-4">
            <v-card-title class="text-h5 font-weight-bold">모임 소개</v-card-title>
            <v-card-text>{{ board?.content }}</v-card-text>
          </v-card>
        </v-col>
      </v-row>
  
      <div v-if="isLoading" class="mt-4 text-center">⏳ 로딩 중...</div>
      <div v-else-if="errorMessage" class="mt-4 text-center red--text">❌ {{ errorMessage }}</div>
    </v-container>
  </template>
  
  <script setup lang="ts">
  import { onMounted, computed } from 'vue'
  import { useRoute } from 'vue-router'
  import { useBoardDetailStore } from '@/store/board/boardDetailStore'
  import { storeToRefs } from 'pinia'
  
  const route = useRoute()
  const boardDetailStore = useBoardDetailStore()
  const { board, isLoading, errorMessage } = storeToRefs(boardDetailStore)
  
  const formattedDate = computed(() => {
    const raw = board.value?.end_time
    return raw ? new Date(raw).toLocaleString('ko-KR', { dateStyle: 'full', timeStyle: 'short' }) : ''
  })
  
  onMounted(() => {
    const id = Number(route.params.id)
    if (id) boardDetailStore.requestDetailBoard(id)
  })
  </script>
  
  <style scoped>
  .text-center {
    text-align: center;
  }
  </style>
  