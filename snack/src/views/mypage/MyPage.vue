<template>
  <div class="mypage-container">
    <!-- 프로필 영역 -->
    <div class="profile-section">
      <div class="avatar-wrapper">
        <div class="avatar-circle">😊</div>
        <v-btn icon class="upload-btn" size="x-small" flat>
          <v-icon size="18">mdi-plus-circle</v-icon>
        </v-btn>
      </div>
      <p class="greeting-text">안녕하세요 <strong>{{ accountStore.nickname }}</strong>님!</p>
      <v-btn class="edit-btn" flat @click="alertServiceReady">내 정보 수정</v-btn>
      <v-btn class="withdraw-btn" flat @click="handleWithdraw">회원 탈퇴</v-btn>
    </div>

    <!-- 기능 카드 영역 -->
    <section class="card-list">
      <div class="feature-card">
        <h3>🍽️ 리뷰 관리</h3>
        <p>내가 남긴 식당 리뷰를 한눈에!</p>
        <button class="card-btn" @click="alertServiceReady">리뷰 보러가기</button>
      </div>
      <div class="feature-card">
        <h3>❤️ 찜한 목록</h3>
        <p>관심 있는 맛집과 게시글을 모아봤어요</p>
        <button class="card-btn" @click="alertServiceReady">찜 목록 보기</button>
      </div>
      <div class="feature-card">
        <h3>📝 내 게시글 관리</h3>
        <p>밥친구 찾기 게시글을 수정하거나 삭제할 수 있어요</p>
        <button class="card-btn" @click="alertServiceReady">게시글 관리</button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAccountStore } from '@/store/account/accountStore'
import { useAuthStore } from '@/store/auth/authStore'
import { useRouter } from 'vue-router'

const accountStore = useAccountStore()
const authStore = useAuthStore()
const router = useRouter()

// ✅ 닉네임 불러오기
onMounted(async () => {
  try {
    await accountStore.getAccount()
  } catch (error) {
    console.error('🔴 닉네임 불러오기 실패:', error)
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
</script>


<style scoped>
.mypage-container {
  display: flex;
  flex-wrap: wrap;
  gap: 40px;
  padding: 40px 24px;
  max-width: 1200px;
  margin: 0 auto;
  justify-content: center;
}

.profile-section {
  background-color: #ffffff;
  border-radius: 20px;
  padding: 24px;
  width: 260px;
  min-height: 420px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06);
}

.avatar-wrapper {
  position: relative;
  margin-bottom: 16px;
}
.avatar-circle {
  width: 80px;
  height: 80px;
  background-color: #fff8ee;
  border-radius: 50%;
  font-size: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(255, 102, 0, 0.2);
}
.upload-btn {
  position: absolute;
  top: -4px;
  right: -4px;
  background-color: white;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
  padding: 2px;
  border-radius: 50%;
}

.greeting-text {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
  color: #333;
}

.edit-btn {
  background: linear-gradient(135deg, #ff9800, #ff5722);
  color: white;
  border-radius: 999px;
  padding: 6px 16px;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 16px;
  transition: transform 0.2s ease, opacity 0.2s ease;
}
.edit-btn:hover {
  transform: scale(1.05);
  opacity: 0.95;
}

.withdraw-btn {
  margin-top: auto;
  background-color: #f2f2f2;
  color: #c62828;
  font-weight: 600;
  border-radius: 10px;
  padding: 10px;
  transition: background-color 0.2s ease;
}
.withdraw-btn:hover {
  background-color: #e0e0e0;
}

.card-list {
  flex: 1 1 640px;
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  justify-content: center;
}

.feature-card {
  flex: 1 1 280px;
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 6px 20px rgba(255, 102, 0, 0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 160px;
}

.feature-card h3 {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 8px;
  color: #e65100;
}
.feature-card p {
  font-size: 14px;
  color: #666;
  margin-bottom: 16px;
}
.feature-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 24px rgba(255, 102, 0, 0.15);
}

.card-btn {
  align-self: flex-start;
  padding: 8px 16px;
  border: none;
  border-radius: 999px;
  background: linear-gradient(135deg, #ff9800, #ff5722);
  color: white;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: transform 0.2s ease, opacity 0.2s ease;
}
.card-btn:hover {
  transform: scale(1.05);
  opacity: 0.9;
}

@media (max-width: 768px) {
  .mypage-container {
    flex-direction: column;
    align-items: center;
  }

  .profile-section,
  .card-list,
  .feature-card {
    width: 100%;
    max-width: 360px;
  }

  .profile-section {
    min-height: 360px;
  }
}
</style>
