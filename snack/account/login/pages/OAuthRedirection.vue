<template>
    <div></div>
</template>

<script setup>
import { onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthenticationStore } from "../stores/authenticationStore";

const router = useRouter();
const route = useRoute();
const authenticationStore = useAuthenticationStore();

const setRedirectAuthData = async () => {
    const code = route.query.code;
    const provider = route.path.includes("kakao") ? "kakao" : "naver";

    try {
        const userToken = await authenticationStore.requestAccessToken(provider, code);
        localStorage.setItem("userToken", userToken);
        authenticationStore.isAuthenticated = true;
        router.push("/");
    } catch (error) {
        console.error(`${provider} OAuth 로그인 중 오류 발생`, error);
        router.push("/account/login"); // 실패 시 로그인 페이지로 이동
    }
};

onMounted(setRedirectAuthData);
</script>
