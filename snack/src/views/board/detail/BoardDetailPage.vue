<template>
  <v-container>
    <!-- Top layout for large screens -->
    <v-row class="top-layout" v-if="board">
      <!-- Info Section -->
      <v-col cols="12" md="4" lg="3">
        <InfoSection :board="board" :formattedDate="formattedDate" />
      </v-col>

      <!-- Content Section (includes comments) -->
      <v-col cols="12" md="8" lg="9">
        <ContentSection
          :content="board.content ?? ''"
          v-model:comments="comments"
          v-model:newComment="newComment"
        />
      </v-col>
    </v-row>

    <!-- 로딩 중 또는 오류 대응 -->
    <v-row v-else>
      <v-col cols="12" class="text-center">
        <v-progress-circular indeterminate color="primary" />
      </v-col>
    </v-row>
  </v-container>
</template>


<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useBoardDetailStore } from '@/store/board/boardDetailStore'
import { storeToRefs } from 'pinia'
import InfoSection from './InfoSection.vue'
import ContentSection from './ContentSection.vue'

const route = useRoute()
const boardDetailStore = useBoardDetailStore()
const { board } = storeToRefs(boardDetailStore)

const newComment = ref('')
const comments = ref<{ id: number; content: string; writer : string ;timestamp:number; }[]>([])

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
.top-layout {
  margin-bottom: 24px;
}
</style>
