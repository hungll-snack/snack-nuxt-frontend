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
                   @click="navigateTo(menu.route)">
                {{ menu.label }}
            </v-btn>
        </div>

        <v-spacer></v-spacer>

        <!-- ✅ 오른쪽 버튼 -->
        <v-btn class="nav-btn download-btn">앱 다운로드</v-btn>

        <template v-if="!isAuthenticated">
            <v-btn icon @click="signIn" class="auth-btn">
                <v-icon>mdi-login</v-icon>
            </v-btn>
        </template>
        <template v-else>
            <v-btn icon @click="signOut" class="auth-btn">
                <v-icon>mdi-logout</v-icon>
            </v-btn>
            <v-btn class="nav-btn" @click="goToMyPage">마이페이지</v-btn>
        </template>
    </v-app-bar>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useKakaoAuthenticationStore } from "~/kakaoAuthentication/stores/kakaoAuthenticationStore";
import { useNaverAuthenticationStore } from "~/naverAuthentication/stores/naverAuthenticationStore";

const router = useRouter();
const route = useRoute();
const kakaoAuthentication = useKakaoAuthenticationStore();
const naverAuthentication = useNaverAuthenticationStore();

const menus = ref([
    { label: "맛집 찾기", route: "/find-food" },
    { label: "밥 친구 찾기", route: "/find-friend" },
]);

const activeMenu = ref("맛집 찾기");
const isAuthenticated = computed(() => kakaoAuthentication.isAuthenticated || naverAuthentication.isAuthenticated);

const navigateTo = (path: string) => {
    activeMenu.value = menus.value.find(menu => menu.route === path)?.label || "맛집 찾기";
    router.push(path);
};

const goToHome = () => {
    router.push("/");
};

const goToMyPage = () => {
    router.push("/account/myPage");
};

const signIn = () => {
    router.push("/account/login");
};

const signOut = () => {
    const userToken = localStorage.getItem("userToken");
    if (userToken) {
    if (userToken.startsWith("kakao-")) {
      console.log("🟡 카카오 로그아웃 실행");
      kakaoAuthentication.requestLogout(userToken);
    } else if (userToken.startsWith("naver-")) {
      console.log("🟢 네이버 로그아웃 실행");
      naverAuthentication.requestLogout(userToken);
    } else {
      console.log("❌ 알 수 없는 userToken 형식");
    }
  } else {
    console.log('⚠️ userToken이 없습니다.');
  }
    kakaoAuthentication.isAuthenticated = false;
    naverAuthentication.isAuthenticated = false;
    router.push("/");
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

/* ✅ 로고 스타일 */
.logo-container {
    display: flex;
    align-items: center;
}

.logo {
    max-width: 120px;
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
    color: #757575;
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
