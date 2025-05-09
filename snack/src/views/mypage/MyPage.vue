<template>
  <div class="mypage-container">
    <aside class="profile-menu">
      <div class="profile-top">
        <div class="avatar-circle">😊</div>
        <p class="nickname"><strong>{{ accountStore.nickname }}</strong> 님</p>
      </div>

      <div class="menu-list">
        <button 
          class="menu-btn pill" 
          :class="{ active: selectedMenu === 'profile' }" 
          @click="selectedMenu = 'profile'"
        >나의 프로필</button>

        <button 
          class="menu-btn pill" 
          :class="{ active: selectedMenu === 'scrap' }" 
          @click="selectedMenu = 'scrap'"
        >나의 찜 목록</button>
      </div>
    </aside>

    <main class="content-area">
      <div v-if="selectedMenu === 'profile'" class="profile-wrapper">
        <div class="scrap-header">나의 프로필</div>
        <ul class="info-list">
          <li><span class="label">닉네임</span><span>{{ accountStore.nickname }}</span></li>
          <li><span class="label">이메일</span><span>{{ accountStore.email || '이메일 없음' }}</span></li>
        </ul>
        <div class="profile-footer">
          <v-btn class="edit-btn" flat @click="alertServiceReady">수정하기</v-btn>
        </div>
      </div>

      <div v-if="selectedMenu === 'scrap'" class="scrap-wrapper">
        <div class="scrap-header">나의 찜 목록</div>
        <div class="scrap-content centered">
          <p class="empty-message">현재 찜한 목록이 없습니다.<br />더 많은 식당을 담아보세요!</p>
          <button class="card-btn" @click="goToRestaurantAll">맛집 찾기</button>
        </div>
      </div>
    </main>
  </div>

  <div class="withdraw">
    <v-btn class="withdraw-btn" flat @click="handleWithdraw">회원 탈퇴</v-btn>
  </div> 

  <div class="admin-entry" @click="openAdminModal">관리자 페이지로 이동하기</div>

  <template v-if="showAdminModal">
    <div class="modal-backdrop" @click.self="closeAdminModal">
      <div class="admin-modal">
        <h3>관리자 코드 입력</h3>
        <input
          v-model="adminCode"
          type="password"
          class="admin-input"
          placeholder="관리자 코드를 입력하세요"
        />
        <div class="modal-buttons">
          <button class="card-btn" @click="submitAdminCode">확인</button>
          <button class="cancel-btn" @click="closeAdminModal">취소</button>
        </div>
      </div>
    </div>
  </template>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAccountStore } from '@/store/account/accountStore'
import { useAuthStore } from '@/store/auth/authStore'
import { useAdminStore } from '@/store/admin/adminStore'

const accountStore = useAccountStore()
const authStore = useAuthStore()
const adminStore = useAdminStore()
const router = useRouter()

const selectedMenu = ref<'profile' | 'scrap'>('profile')

// 관리자 모달 상태
const showAdminModal = ref(false)
const adminCode = ref('')

const openAdminModal = () => {
  showAdminModal.value = true
}
const closeAdminModal = () => {
  showAdminModal.value = false
  adminCode.value = ''
}

const submitAdminCode = async () => {
  const resultMessage = await adminStore.checkAdminCode(adminCode.value)
  alert(resultMessage)
  closeAdminModal()
  if (resultMessage === '관리자 권한이 부여되었습니다.') {
    router.push('/admin')
  }
}

onMounted(async () => {
  try {
    await accountStore.getAccount()
  } catch (error) {
    console.error('🔴 계정 정보 불러오기 실패:', error)
  }
})

const alertServiceReady = () => {
  alert('서비스 준비중입니다. 잠시만 기다려주세요.')
}

const handleWithdraw = async () => {
  if (confirm('회원 탈퇴하시겠습니까?')) {
    await authStore.withdrawAccount()
    router.push('/')
  }
}

const goToRestaurantAll = () => {
  router.push('/restaurants/all')
}
</script>

<style scoped>
.mypage-container {
  display: flex;
  gap: 32px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 24px;
  min-height: calc(100vh - 200px);
  box-sizing: border-box;
  align-items: stretch;
}

.profile-menu {
  width: 260px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06);
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.profile-top {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-bottom: 32px;
}

.avatar-circle {
  width: 80px;
  height: 80px;
  background: #fff8ee;
  border-radius: 50%;
  font-size: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 2px 8px rgba(255, 102, 0, 0.2);
}

.nickname {
  font-size: 16px;
  font-weight: bold;
}

.menu-list {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: auto;
}

.menu-btn {
  width: 100%;
  padding: 16px 12px;
  background: #f4f4f4;
  font-weight: 600;
  text-align: center;
  font-size: 14px;
  transition: 0.2s ease;
  cursor: pointer;
}
.menu-btn.pill {
  border-radius: 999px;
}
.menu-btn.active {
  background: linear-gradient(135deg, #ff9800, #ff5722);
  color: white;
}

.edit-btn {
  background: linear-gradient(135deg, #ff9800, #ff5722);
  color: white;
  border-radius: 999px;
  padding: 10px 24px;
  font-size: 13px;
  font-weight: 600;
}

.profile-footer {
  margin-top: auto;
  display: flex;
  justify-content: center;
}

.withdraw-btn {
  background: #f2f2f2;
  color: #c62828;
  font-weight: 600;
  border-radius: 10px;
  width: 150px;
  margin-top: 32px;
}

.content-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: stretch;
}

.profile-wrapper,
.scrap-wrapper {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 6px 20px rgba(255, 102, 0, 0.08);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.scrap-header {
  font-size: 18px;
  font-weight: 700;
  padding-bottom: 12px;
  border-bottom: 1px solid #eee;
  margin-bottom: 16px;
  color: #e65100;
}

.scrap-content.centered {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  gap: 16px;
}

.empty-message {
  color: #666;
  line-height: 1.6;
}

.card-btn {
  padding: 10px 24px;
  border-radius: 999px;
  background: linear-gradient(135deg, #ff9800, #ff5722);
  color: white;
  font-weight: 600;
  font-size: 15px;
}

.info-list {
  width: 100%;
  margin-top: 16px;
  font-size: 14px;
  color: #444;
}
.info-list li {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}
.label {
  font-weight: 600;
  color: #888;
}

.admin-entry {
  text-align: center;
  margin-top: 40px;
  font-size: 12px;
  color: #bbb;
  cursor: pointer;
  user-select: none;
}
.admin-entry:hover {
  color: #999;
}

.withdraw {
  display: flex;
  justify-content: center;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.admin-modal {
  background: white;
  padding: 24px;
  border-radius: 16px;
  width: 90%;
  max-width: 320px;
  text-align: center;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.admin-modal h3 {
  margin-bottom: 16px;
  font-size: 18px;
}

.admin-input {
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
  margin-bottom: 16px;
}

.modal-buttons {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.cancel-btn {
  background: #eee;
  color: #444;
  border-radius: 999px;
  padding: 10px 16px;
  font-size: 14px;
}

@media (max-width: 700px) {
  .mypage-container {
    flex-direction: column;
    padding: 24px 16px;
  }

  .profile-menu {
    width: 100%;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    gap: 16px;
  }

  .profile-top {
    gap: 12px;
    margin-bottom: 0;
  }

  .menu-list {
    gap: 8px;
    margin-bottom: 0;
  }

  .withdraw-btn {
    width: auto;
    margin-top: 0;
  }

  .content-area {
    width: 100%;
  }
}
</style>
