<template>
  <v-container fluid class="d-flex justify-center align-center fill-height pa-0">
    <v-row justify="center" align="center" class="fill-height ma-0">
      <v-col cols="12" sm="8" md="6" class="text-center">
        <!-- 연한 회색 테두리 박스 -->
        <div class="login-container">
          <!-- 말풍선 -->
          <div class="speech-bubble">
            ⚡ 3초만에 빠른 회원가입
          </div>

          <!-- 카카오 로그인 버튼 -->
          <v-btn class="kakao-login-btn" @click="handleKakaoLogin">
            <v-img 
              src="/assets/images/fixed/btn_kakao_login.png" 
              class="login-btn" 
              alt="카카오 로그인 버튼"
            />
          </v-btn>

          <!-- 네이버 로그인 버튼 -->
          <v-btn class="naver-login-btn" @click="handleNaverLogin">
            <v-img 
              src="/assets/images/fixed/btn_naver_login.png" 
              class="login-btn" 
              alt="네이버 로그인 버튼"
            />
          </v-btn>

          <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

          <!-- 로그인 문제 텍스트 -->
          <p class="login-issue-text">로그인에 문제가 있으신가요?</p>
        </div>

        <!-- 박스 아래 버튼들 -->
        <div class="bottom-buttons">
          <v-btn class="app-download-btn">앱 다운로드</v-btn>
          <p class="back-text" @click="goToHome">돌아가기</p>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useKakaoAuthenticationStore } from '@/kakaoAuthentication/stores/kakaoAuthenticationStore';
import { useNaverAuthenticationStore } from '@/naverAuthentication/stores/naverAuthenticationStore';
import { ref } from "vue";

const router = useRouter();
const kakaoAuthentication = useKakaoAuthenticationStore();
const naverAuthentication = useNaverAuthenticationStore();
const errorMessage = ref("");
const redirectLoginPath = ref("");

const handleKakaoLogin = async () => {
  try {
    const response = await kakaoAuthentication.requestKakaoLoginToDjango();
    
    console.log("📌 원본 응답:", response);

    // ✅ 응답 데이터를 `JSON` 형태로 변환 (Axios의 경우 자동으로 `data` 속성을 사용해야 함)
    const data = response.data || response;

    console.log("📌 변환된 응답:", data);

    if (!data.success && data.error_message) {
      console.warn("🚨 로그인 차단됨:", data.error_message);
      errorMessage.value = data.error_message;
      redirectLoginPath.value = "네이버"; // 기존 가입된 경로 표시
      return;  // 🚨 로그인 중단 (여기가 중요!)
    }

    // ✅ 로그인 성공 시 홈으로 이동
    errorMessage.value = "";
    router.push("/home");
  } catch (error) {
    console.error("🔥 로그인 중 오류 발생:", error);

    // 🚨 Axios 요청이 실패할 경우, `error.response` 값이 있는지 확인 후 처리
    if (error.response) {
      console.warn("❗ 서버 응답 오류:", error.response.data);
      errorMessage.value = error.response.data.error_message || "로그인 중 오류가 발생했습니다.";
    } else {
      errorMessage.value = "네트워크 오류 또는 서버 문제로 인해 로그인에 실패했습니다.";
    }
  }
};

const handleNaverLogin = async () => {
  try {
    const response = await naverAuthentication.requestNaverLoginToDjango();
    
    console.log("📌 원본 응답:", response);

    // ✅ 응답 데이터를 `JSON` 형태로 변환 (Axios의 경우 자동으로 `data` 속성을 사용해야 함)
    const data = response.data || response;

    console.log("📌 변환된 응답:", data);

    if (!data.success && data.error_message) {
      console.warn("🚨 로그인 차단됨:", data.error_message);
      errorMessage.value = data.error_message;
      redirectLoginPath.value = "카카오"; // 기존 가입된 경로 표시
      return;  // 🚨 로그인 중단 (여기가 중요!)
    }

    // ✅ 로그인 성공 시 홈으로 이동
    errorMessage.value = "";
    router.push("/home");
  } catch (error) {
    console.error("🔥 로그인 중 오류 발생:", error);

    if (error.response) {
      console.warn("❗ 서버 응답 오류:", error.response.data);
      errorMessage.value = error.response.data.error_message || "로그인 중 오류가 발생했습니다.";
    } else {
      errorMessage.value = "네트워크 오류 또는 서버 문제로 인해 로그인에 실패했습니다.";
    }
  }
};
</script>

<style scoped>
/* 전체 로그인 박스 스타일 */
.login-container {
  background: white;
  padding: 20px;
  height: 220px;
  border: 1px solid #E0E0E0;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  text-align: center;
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: auto;
  margin: 30px auto; /* 버튼 간격 조정 */
}

/* 말풍선 스타일 */
.speech-bubble {
  display: inline-block;
  background: white;
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: bold;
  color: #333;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
  margin-bottom: 20px;
}

.speech-bubble::after {
  content: "";
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  border-width: 10px;
  border-style: solid;
  border-color: white transparent transparent transparent;
}

/* 로그인 버튼 */
.login-btn {
  width: 200px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  box-shadow: none;
  border: none;
  padding: 0;
  overflow: hidden;
  margin: 0 auto; /* 중앙 정렬 */
  margin-bottom: 16px;
}

/* 이미지 크기 맞추기 */
.login-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  margin: 0 auto; /* 중앙 정렬 */
  margin-bottom: 50px; /* 버튼 크기에 맞게 이미지 조정 */
}


/* 로그인 문제 텍스트 */
.login-issue-text {
  color: #B0B0B0;
  font-size: 14px;
  margin-top: 10px;
}

/* 박스 아래 버튼 컨테이너 */
.bottom-buttons {
  margin-top: 30px;
  text-align: center;
}

/* 앱 다운로드 버튼 */
.app-download-btn {
  background: #FFB08E;
  color: white;
  font-size: 16px;
  font-weight: bold;
  border-radius: 12px;
  padding: 12px 30px;
  margin-bottom: 10px;
}

/* 돌아가기 텍스트 (클릭 가능) */
.back-text {
  font-size: 14px;
  color: #666;
  cursor: pointer;
  text-decoration: underline;
  transition: color 0.2s;
}

.back-text:hover {
  color: #333;
}



</style>