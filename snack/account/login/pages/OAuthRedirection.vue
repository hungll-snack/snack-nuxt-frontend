<template>
    <div></div>
  </template>
  
  <script setup>
  import { onMounted } from "vue";
  import { useRouter, useRoute } from "vue-router";
  import { useAuthenticationStore } from "../stores/authenticationStore";
  import { accountAction } from "~/account/stores/accountActions"; // ✅ 계정 정보 가져오기용 추가
  
  const router = useRouter();
  const route = useRoute();
  const authenticationStore = useAuthenticationStore();
  
  const setRedirectAuthData = async () => {
    const code = route.query.code;
    const provider = route.path.includes("kakao") ? "kakao" : "naver";
  
    try {
      // ✅ 1. 백엔드에서 userToken 받아오기
      const userToken = await authenticationStore.requestAccessToken(provider, code);
  
      // ✅ 2. 토큰 저장 + 로그인 상태 설정
      localStorage.setItem("userToken", userToken);
      authenticationStore.isAuthenticated = true;
  
      // ✅ 3. 저장한 토큰을 다시 꺼내서 전달 (확실하게 보장)
      const savedToken = localStorage.getItem("userToken");
  
      if (savedToken) {
        console.log("🟢 저장된 userToken으로 계정 정보 요청:", savedToken);
        await accountAction.getAccountAndProfile(savedToken);
      } else {
        console.error("❌ 저장된 userToken이 존재하지 않습니다!");
      }
  
      // ✅ 4. 메인 페이지로 이동
      router.push("/");
    } catch (error) {
      console.error(`${provider} OAuth 로그인 중 오류 발생`, error);
      router.push("/account/login"); // 실패 시 로그인 페이지로 이동
    }
  };
  
  onMounted(setRedirectAuthData);
  </script>
  