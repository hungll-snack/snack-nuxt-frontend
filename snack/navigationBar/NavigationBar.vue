<template>
    <v-app-bar app color="white" elevation="0" class="nav-bar">
        <!-- ✅ 로고 -->
        <v-btn @click="goToHome" plain class="logo-container">
            <img src="/assets/images/logo/logo_pont_web.png" alt="로고" class="logo">
        </v-btn>
  
        <!-- ✅ 네비게이션 메뉴 (중앙 정렬) -->
        <div class="nav-center">
            <v-btn v-for="(menu, index) in menus" :key="index"
                   class="nav-btn"
                   :class="{ active: activeMenu === menu.label }"
                   @click="setActiveMenu(menu.label)">
                {{ menu.label }}
            </v-btn>
        </div>
  
        <v-spacer></v-spacer>
  
        <!-- ✅ 오른쪽 버튼 -->
        <!-- <v-btn class="download-btn">앱 다운로드</v-btn> -->
  
        <template v-if="!kakaoAuthentication.isAuthenticated && !naverAuthentication.isAuthenticated">
            <v-btn icon @click="signIn" class="auth-btn">
                <v-icon>mdi-login</v-icon>
            </v-btn>
        </template>
        <template v-else>
            <v-btn icon @click="signOut" class="auth-btn">
                <v-icon>mdi-logout</v-icon>
            </v-btn>
        </template>
    </v-app-bar>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useKakaoAuthenticationStore } from '~/kakaoAuthentication/stores/kakaoAuthenticationStore';
  import { useNaverAuthenticationStore } from '~/naverAuthentication/stores/naverAuthenticationStore';
  
  const router = useRouter();
  const kakaoAuthentication = useKakaoAuthenticationStore();
  const naverAuthentication = useNaverAuthenticationStore();
  
  const menus = ref([
      { label: "맛집 찾기", route: "/find-food" },
      { label: "밥 친구 찾기", route: "/find-friend" },
  ]);
  
  const activeMenu = ref("맛집 찾기");
  
  const setActiveMenu = (menu: string) => {
      activeMenu.value = menu;
  };
  
  const goToHome = () => {
      router.push('/');
  };
  
  const signIn = () => {
      router.push('/account/login');
  };
  
  const signOut = () => {
      localStorage.removeItem('userToken');
      kakaoAuthentication.isAuthenticated = false;
      naverAuthentication.isAuthenticated = false;
      router.push('/');
  };
  </script>
  
  <style scoped>
  /* ✅ 네비게이션 바 스타일 */
  .nav-bar {
      display: flex;
      align-items: center;
      height: 64px;
      padding: 0 16px;
      position: relative;
  }
  
  /* ✅ 로고 스타일 (너무 길지 않게 조정) */
  .logo-container {
      display: flex;
      align-items: center;
  }
  
  .logo {
      max-width: 120px; /* 로고 크기 제한 */
      height: auto;
  }
  
  /* ✅ 네비게이션 메뉴 중앙 정렬 */
  .nav-center {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 30px;
  }
  
  /* ✅ 네비게이션 버튼 스타일 */
  .nav-btn {
      font-size: 16px;
      color: #757575; /* 기본 회색 */
      font-weight: 500;
      background-color: transparent;
      text-transform: none;
      padding: 10px 16px;
  }
  
  /* ✅ 활성화된 메뉴 */
  .nav-btn.active {
      color: black;
      font-weight: bold;
  }
  
  /* ✅ 앱 다운로드 버튼 */
  .download-btn {
      background-color: #FF6F00;
      color: white;
      font-weight: bold;
      padding: 8px 16px;
      border-radius: 8px;
  }
  
  /* ✅ 로그인/로그아웃 버튼 */
  .auth-btn {
      color: black;
  }
  </style>
  