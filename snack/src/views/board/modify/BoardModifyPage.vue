<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" md="3" class="upload-col">
        <UploadSection />
      </v-col>
      <v-col cols="12" md="9" class="content-col">
        <ContentSection />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import UploadSection from './UploadSection.vue'
import ContentSection from './ContentSection.vue'

import { useRoute } from 'vue-router'
import { useBoardModifyStore } from '@/store/board/boardModifyStore'
import { onMounted } from 'vue'

const route = useRoute()
const boardModifyStore = useBoardModifyStore()

const boardId = Number(route.params.boardId || route.params.id)

onMounted(async () => {
  if (!isNaN(boardId)) {
    await boardModifyStore.fetchBoard(boardId)
  } else {
    alert('잘못된 게시글 ID입니다.')
  }
})
</script>

<style scoped>
.upload-col {
  padding-right: 8px;
}

.content-col {
  padding-left: 8px;
}
</style>
