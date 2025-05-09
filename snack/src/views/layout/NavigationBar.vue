<template>
  <header class="responsive-nav" ref="navRef">
    <div class="logo" @click="goHome">
      <img :src="hungllLogo" alt="로고" />
    </div>

    <div class="desktop-menu">
      <button @click="navigateTo('/restaurants/all')">맛집 찾기</button>
      <button @click="navigateTo('/board/all')">밥 친구 찾기</button>
      <button @click="showAppDownloadModal = true">앱 다운로드</button>
    </div>

    <div class="menu-toggle" @click="toggleMenu">
      <span></span>
      <span></span>
      <span></span>
    </div>

    <transition name="fade">
      <div v-if="showMenu" ref="dropdownRef" class="dropdown-menu">
        <div class="auth-icon dropdown-auth" @click="handleAuthClick">
          <v-icon class="gradient-icon">
            {{ isAuthenticated ? 'mdi-account-circle' : 'mdi-account-circle-outline' }}
          </v-icon>
        </div>
        <button @click="navigateTo('/restaurants/all')">맛집 찾기</button>
        <button @click="navigateTo('/board/all')">밥 친구 찾기</button>
        <button @click="showAppDownloadModal = true">앱 다운로드</button>
      </div>
    </transition>

    <div class="auth-icon desktop-auth" @click="handleAuthClick">
      <v-icon class="gradient-icon">
        {{ isAuthenticated ? 'mdi-account-circle' : 'mdi-account-circle-outline' }}
      </v-icon>
    </div>

    <AppDownloadModal :show="showAppDownloadModal" @update:show="showAppDownloadModal = $event" />
    <UserModal :show="showUserModal" @update:show="showUserModal = $event" @logout="confirmLogout" />
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import AppDownloadModal from '@/views/appdown/AppDownloadModal.vue'
import UserModal from '@/views/layout/userModal/userModal.vue'
import { useAuthStore } from '@/store/auth/authStore'
import hungllLogo from '@/assets/images/logo/hungle_full_big.png'

const router = useRouter()
const authStore = useAuthStore()

const isAuthenticated = computed(() => authStore.isAuthenticated)
const showAppDownloadModal = ref(false)
const showUserModal = ref(false)
const showMenu = ref(false)

const goHome = () => router.push('/')
const toggleMenu = () => (showMenu.value = !showMenu.value)
const navigateTo = (path: string) => {
  showMenu.value = false
  router.push(path)
}

const handleAuthClick = () => {
  showMenu.value = false
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

const dropdownRef = ref<HTMLElement | null>(null)
const navRef = ref<HTMLElement | null>(null)

const handleClickOutside = (e: MouseEvent) => {
  if (
    dropdownRef.value &&
    !dropdownRef.value.contains(e.target as Node) &&
    !navRef.value?.contains(e.target as Node)
  ) {
    showMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.responsive-nav {
  position: fixed;
  top: 0;
  width: 100%;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(8px);
  padding: 0 20px;
  z-index: 9999;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.logo img {
  cursor: pointer;
  width: 100px;
  height: auto;
}

.desktop-menu {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 50px;
}

.desktop-menu button {
  font-weight: 600;
  font-size: 16px;
  background: transparent;
  border: none;
  color: #e65100;
  cursor: pointer;
  transition: color 0.2s ease, transform 0.2s ease;
}
.desktop-menu button:hover {
  color: #ff6f00;
  transform: scale(1.05);
}

.menu-toggle {
  display: none;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  margin-left: auto;
  cursor: pointer;
}
.menu-toggle span {
  background: linear-gradient(90deg, #ff9800, #ff5722);
  border-radius: 2px;
}
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

.dropdown-menu {
  position: absolute;
  top: 64px;
  right: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
  padding: 10px 0;
  width: 200px;
  display: flex;
  flex-direction: column;
  z-index: 9999;
}
.dropdown-menu button {
  padding: 12px;
  font-weight: 600;
  background: transparent;
  color: #5d4037;
  border: none;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
}
.dropdown-menu button:hover {
  background-color: #ff6f0014;
  color: #ff6f00;
  transform: scale(1.03);
}


.auth-icon {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
}
.auth-icon:hover {
  transform: scale(1.12);
}
.gradient-icon {
  font-size: 28px;
  background: linear-gradient(135deg, #ff9800, #ff5722);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.dropdown-auth {
  display: flex;
  justify-content: center;
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.desktop-auth {
  margin-left: auto;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@media (max-width: 1024px) {
  .desktop-menu,
  .desktop-auth {
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
