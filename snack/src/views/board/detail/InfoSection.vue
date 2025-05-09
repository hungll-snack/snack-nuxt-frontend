<script setup lang="ts">
import { computed } from 'vue'
import { useAccountStore } from '@/store/account/accountStore'
import { useRouter, useRoute } from 'vue-router'
import defaultThumbnail from '@/assets/images/logo/hungle_korean_center.png'

const props = defineProps<{
  board: {
    image_url?: string
    title?: string
    author_nickname?: string
    author_account_id?: number
    end_time?: string
  }
  formattedDate: string
}>()

const accountStore = useAccountStore()
const router = useRouter()
const route = useRoute()

const isAdmin = computed(() => {
  return localStorage.getItem('isAdmin') === 'true'
})

const goToModify = () => {
  const id = Number(route.params.id)
  if (!id) return
  router.push(`/board/modify/${id}`)
}

const goToDelete = () => {
  const id = Number(route.params.id)
  if (!id) return
  if (confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
    router.push(`/board/delete/${id}`) // 필요시 삭제 핸들링 라우트로 수정
  }
}
</script>

<template>
  <v-card class="info-card fill-height">
    <div class="thumbnail-info-wrapper">
      <div class="desktop-layout">
        <div class="thumbnail-wrapper">
          <v-img
            :src="board?.image_url || defaultThumbnail"
            class="thumbnail-img"
            cover
          />
        </div>
        <div class="info-body">
          <div class="info-block">
            <span class="info-label">✨ 모임 제목</span>
            <div class="info-value">{{ board?.title }}</div>
          </div>
          <div class="info-block">
            <span class="info-label">📅 모임 날짜</span>
            <div class="info-value">{{ formattedDate }}</div>
          </div>
          <div class="info-block">
            <span class="info-label">👤 작성자</span>
            <div class="info-value">{{ board?.author_nickname }}</div>
          </div>

          <!-- ✅ 수정 및 삭제 버튼: 작성자 바로 하다 -->
          <div
            class="button-group"
            v-if="isAdmin || String(board.author_account_id) === String(accountStore.accountId)"
          >
            <button class="btn-modify" @click="goToModify">✏ 수정</button>
            <button class="btn-delete" @click="goToDelete">🗑 삭제</button>
          </div>
        </div>
      </div>
    </div>
  </v-card>
</template>

<style scoped>
.info-card {
  border: 1px solid #e0e0e0;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  height: 100%;
  max-height: 560px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  padding-top: 50px;
}

.thumbnail-info-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.desktop-layout .thumbnail-wrapper {
  margin-top: -12px;
}

.desktop-layout {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.thumbnail-img {
  width: 200px;
  min-width: 150px;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
}

.info-body {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  flex: 1;
  min-width: 0;
}

.info-block {
  margin-bottom: 12px;
}

.info-label {
  font-size: 13px;
  font-weight: 500;
  color: #888;
  margin-bottom: 4px;
  display: block;
  margin-left: 10px;
}

.info-value {
  font-size: 15px;
  font-weight: 600;
  margin-left: 10px;
  color: #333;
}

.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 8px;
}

.btn-modify {
  background-color: #ffd180;
  color: #222;
  border: none;
  padding: 6px 14px;
  font-size: 13px;
  border-radius: 10px;
  cursor: pointer;
  transition: 0.2s;
}

.btn-modify:hover {
  background-color: #ffb74d;
}

.btn-delete {
  background-color: #ff7043;
  color: white;
  border: none;
  padding: 6px 14px;
  font-size: 13px;
  border-radius: 10px;
  cursor: pointer;
  transition: 0.2s;
}

.btn-delete:hover {
  background-color: #ff5722;
}

@media (max-width: 576px) {
  .info-label {
    font-size: 12px;
    margin-left: 10px;
  }
  .info-value {
    font-size: 14px;
    margin-left: 10px;
  }
  .thumbnail-img {
    width: 200px;
    height: 100%;
    object-fit: cover;
    border-radius: 10px;
  }
}
</style>
