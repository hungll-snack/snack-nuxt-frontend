<template>
  <header class="responsive-nav">
    <!-- ✅ 로고 -->
    <div class="logo" @click="goHome">
      <img src="/images/logo/hungllhomelogo.png" alt="로고" />
    </div>

    <!-- ✅ PC 화면용 메뉴 -->
    <div class="desktop-menu">
      <button @click="navigateTo('/restaurants/all')">맛집 찾기</button>
      <button @click="navigateTo('/board/all')">밥 친구 찾기</button>
      <button @click="showAppDownloadModal = true">앱 다운로드</button>
    </div>

    <!-- ✅ 햄버거 버튼 (중간/작은 화면 전용, 중앙 정렬) -->
    <div class="menu-toggle" @click="toggleMenu">
      <span></span>
      <span></span>
      <span></span>
    </div>

    <!-- ✅ 드롭다운 메뉴 (중간/작은 화면 전용) -->
    <transition name="fade">
      <div v-if="showMenu" class="dropdown-menu">
        <button @click="navigateTo('/restaurants/all')">맛집 찾기</button>
        <button @click="navigateTo('/board/all')">밥 친구 찾기</button>
        <button @click="showAppDownloadModal = true">앱 다운로드</button>
      </div>
    </transition>

    <!-- ✅ 로그인 아이콘 -->
    <div class="auth-icon" @click="handleAuthClick">
      <v-icon :style="{ color: '#FF6F00' }">
        {{ isAuthenticated ? 'mdi-account-circle' : 'mdi-account-circle-outline' }}
      </v-icon>
    </div>

    <!-- ✅ 모달 -->
    <AppDownloadModal :show="showAppDownloadModal" @update:show="showAppDownloadModal = $event" />
    <UserModal :show="showUserModal" @update:show="showUserModal = $event" @logout="confirmLogout" />
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import AppDownloadModal from '@/views/appdown/AppDownloadModal.vue'
import UserModal from '@/views/layout/userModal/userModal.vue'
import { useAuthStore } from '@/store/auth/authStore'

const router = useRouter()
const authStore = useAuthStore()

const isAuthenticated = computed(() => authStore.isAuthenticated)
const showAppDownloadModal = ref(false)
const showUserModal = ref(false)
const showMenu = ref(false)

const goHome = () => router.push('/')

const toggleMenu = () => {
  showMenu.value = !showMenu.value
}

const navigateTo = (path: string) => {
  router.push(path)
  showMenu.value = false
}

const handleAuthClick = () => {
  if (isAuthenticated.value) {
    showUserModal.value = true
  } else {
    router.push('/policy/privacy')
  }
}

const confirmLogout = () => {
  if (confirm('로그아웃하시겠습니까?')) {
    authStore.logout()
    showUserModal.value = false
    router.push('/')
  }
}
</script>

<style scoped>
.responsive-nav {
  position: relative;
  width: 100%;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: white;
  padding: 0 20px;
  border-bottom: 1px solid #eee;
}

/* ✅ 로고 */
.logo img {
  height: 48px;
  cursor: pointer;
}

/* ✅ 데스크탑 메뉴 */
.desktop-menu {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 50px;
}
.desktop-menu button {
  font-weight: bold;
  font-size: 16px;
  background: transparent;
  border: none;
  color: #757575;
  cursor: pointer;
  transition: color 0.2s;
  margin:  0px 20px;
}
.desktop-menu button:hover {
  color: #ff8a00;
  font-size: 18px;
}

/* ✅ 햄버거 버튼 (작은 화면용) */
.menu-toggle {
  display: none;
  flex-direction: column;
  align-items: center; /* 👈 가운데 정렬 */
  gap: 4px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  cursor: pointer;
}

/* ✅ 역삼각형 형태 (가운데로 좁아지는 느낌) */
.menu-toggle span:nth-child(1) {
  width: 28px;
  height: 4px;
}
.menu-toggle span:nth-child(2) {
  width: 20px;
  height: 4px;
}
.menu-toggle span:nth-child(3) {
  width: 14px;
  height: 4px;
}
.menu-toggle span {
  background: linear-gradient(90deg, #ff9800, #ff5722);
  border-radius: 2px;
}


/* ✅ 드롭다운 메뉴 */
.dropdown-menu {
  position: absolute;
  top: 64px;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  border: 1px solid #ddd;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-radius: 10px;
  padding: 10px 0;
  width: 200px;
  z-index: 100;
  display: flex;
  flex-direction: column;
}
.dropdown-menu button {
  padding: 12px;
  font-weight: 600;
  background: transparent;
  color: #4e342e; /* 진한 브라운 계열 – 차분하고 고급스럽게 */
  border: none;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
}

.dropdown-menu button:hover {
  background-color: #ff6f0017; /* 부드러운 살구톤 배경 */
  color: #ff6f00; /* 톤다운된 딥오렌지 포인트 */
}


/* ✅ 로그인 아이콘 */
.auth-icon {
  position: relative;
  z-index: 1;
  margin-left: auto;
  cursor: pointer;
}

/* ✅ 드롭다운 애니메이션 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}

/* ✅ 반응형 처리 */
@media (max-width: 1024px) {
  .desktop-menu {
    display: none;
  }
  .menu-toggle {
    display: flex;
  }
}
@media (min-width: 1025px) {
  .dropdown-menu {
    display: none !important;
  }
}
</style>
