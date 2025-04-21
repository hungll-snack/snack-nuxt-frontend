<template>
  <div class="mypage-container">
    <!-- 왼쪽 프로필 영역 -->
    <ProfileView />

    <!-- 오른쪽 콘텐츠 영역 -->
    <HistoryManageView />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAccountStore } from '@/store/account/accountStore'

import ProfileView from '@/views/mypage/profile/ProfileView.vue'
import HistoryManageView from '@/views/mypage/history/HistoryManageView.vue'

const accountStore = useAccountStore()

onMounted(async () => {
  try {
    await accountStore.getAccount()
  } catch (error) {
    console.error('❌ 마이페이지 진입 시 계정 정보 불러오기 실패:', error)
  }
})
</script>

<style scoped>
.mypage-container {
  display: flex;
  gap: 24px;
  padding: 32px;
}
</style>
