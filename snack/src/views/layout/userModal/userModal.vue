<template>
  <v-dialog :model-value="show" @update:model-value="closeModal" width="350" height="270">
    <v-card class="user-modal-card">
      <v-card-text class="user-modal-content">
        <div v-if="isLoading" class="spinner-wrapper">
          <div class="loading-spinner" />
        </div>
        <template v-else>
          <div class="emoji">😊</div>
          <div class="nickname-msg">
            안녕하세요 <strong>{{ nickname || '사용자' }}</strong>님 ❤️
          </div>
          <div class="user-actions">
            <v-btn class="mypage-btn" flat @click="goToMypage">마이페이지</v-btn>
            <v-btn class="logout-btn" flat @click="handleLogout">로그아웃</v-btn>
          </div>
        </template>
      </v-card-text>
      <div class="close-x" @click="closeModal">X</div>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed, watch, ref } from 'vue'
import { useRouter } from 'vue-router' 
import { useAccountStore } from '@/store/account/accountStore'
import { useAuthStore } from '@/store/auth/authStore'

const props = defineProps<{ show: boolean }>()
const emit = defineEmits(['update:show', 'logout'])

const router = useRouter()
const accountStore = useAccountStore()
const authStore = useAuthStore()

const isLoading = ref(false)
const nickname = computed(() => accountStore.nickname)

const closeModal = () => emit('update:show', false)

const handleLogout = () => {
  authStore.logout()
  emit('logout')
  closeModal()
}

const goToMypage = () => {
  closeModal()
  router.push('/mypage')
}

watch(
  () => props.show,
  async (newVal) => {
    if (newVal) {
      isLoading.value = true
      try {
        await accountStore.getAccount()
      } catch (error) {
        console.error('🔴 사용자 정보 불러오기 실패:', error)
      } finally {
        isLoading.value = false
      }
    }
  }
)
</script>

<style scoped>
.user-modal-card {
  width: 350px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  border-radius: 16px;
  padding: 24px;
}

.user-modal-content {
  width: 350px;
  text-align: center;
}

.emoji {
  font-size: 40px;
  margin-bottom: 16px;
}

.nickname-msg {
  font-size: 18px;
  font-weight: bold;
  animation: shake 0.8s infinite alternate;
  margin-bottom: 28px;
}

@keyframes shake {
  0% {
    transform: rotate(-2deg);
  }
  100% {
    transform: rotate(2deg);
  }
}

.user-actions {
  display: flex;
  justify-content: center;
  gap: 40px;
}

.mypage-btn {
  background-color: #ffe0b2;
  font-weight: bold;
  box-shadow: none;
  font-size: 14px;
  padding: 8px 16px;
}

.logout-btn {
  background-color: #e0e0e0;
  font-weight: bold;
  box-shadow: none;
  font-size: 14px;
  padding: 8px 16px;
}

.close-x {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  color: #aaa;
  font-weight: bold;
  font-size: 14px;
  cursor: pointer;
}

/* 로딩 스피너 스타일 */
.spinner-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 150px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 6px solid transparent;
  border-top: 6px solid #ff7043; /* 오렌지 */
  border-right: 6px solid #f44336; /* 빨강 */
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
