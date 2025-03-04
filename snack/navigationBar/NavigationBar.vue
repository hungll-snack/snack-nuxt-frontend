<template>
  <v-app-bar app color="white" elevation="0" class="nav-bar">
      <!-- 로그인 페이지에서는 로고 중앙 정렬, 다른 페이지에서는 기존 네비바 유지 -->
      <div v-if="isLoginPage" class="logo-container">
          <v-btn @click="goToHome" plain>
              <img src="/assets/images/logo/logo_pont_web.png" alt="로고" class="logo">
          </v-btn>
      </div>
      <template v-else>
          <v-btn @click="goToHome" plain>
              <img src="/assets/images/logo/logo_pont_web.png" alt="로고" class="logo">
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn class="nav-btn download-btn">앱 다운로드</v-btn>
          <v-btn class="nav-btn">맛집 찾기</v-btn>
          <v-btn class="nav-btn">밥 친구 찾기</v-btn>
          <template v-if="!kakaoAuthentication.isAuthenticated && !naverAuthentication.isAuthenticated">
              <v-btn icon @click="signIn" :style="{ color: '#E76200' }">
                  <v-icon>mdi-login</v-icon>
              </v-btn>
          </template>
          <template v-else>
              <v-btn icon @click="signOut">
                  <v-icon>mdi-logout</v-icon>
              </v-btn>
          </template>
      </template>
  </v-app-bar>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useKakaoAuthenticationStore } from '~/kakaoAuthentication/stores/kakaoAuthenticationStore';
import { useNaverAuthenticationStore } from '~/naverAuthentication/stores/naverAuthenticationStore';

const router = useRouter();
const route = useRoute();
const kakaoAuthentication = useKakaoAuthenticationStore();
const naverAuthentication = useNaverAuthenticationStore();

const isLoginPage = computed(() => route.path === '/account/login');

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
.nav-bar {
  display: flex;
  align-items: center;
  height: 64px;
  padding: 0 16px;
}

.logo-container {
  display: flex;
  justify-content: center;
  width: 100%;
}

.logo {
  height: 60px;
}

.nav-btn {
  font-size: 1rem;
  color: #d35400;
  text-transform: none;
  background-color: #f5ebe0;
  border-radius: 8px;
  padding: 8px 16px;
  margin: 0 8px;
}

.download-btn {
  background-color: #e1f5c4;
}
</style>