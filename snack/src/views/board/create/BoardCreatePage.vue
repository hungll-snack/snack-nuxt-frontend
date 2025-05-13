<template>
  <v-container fluid>
    <v-row>
      <!-- 좌측: 업로드 섹션 -->
      <v-col cols="12" md="3" class="upload-col">
        <UploadSection :board-store="boardStore" />
      </v-col>

      <!-- 우측: 콘텐츠 작성 섹션 -->
      <v-col cols="12" md="9" class="content-col">
        <ContentSection />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import UploadSection from './UploadSection.vue'
import ContentSection from './ContentSection.vue'
import { useBoardCreateStore } from '@/store/board/boardCreateStore'

const boardStore = useBoardCreateStore()
</script>

<style scoped>
.upload-col {
  padding-right: 8px;
}

.content-col {
  padding-left: 8px;
}
</style>
