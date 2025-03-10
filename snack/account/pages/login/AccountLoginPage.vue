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
          <v-btn class="kakao-login-btn" @click="goToKakaoLogin">
            <v-img 
              src="/assets/images/fixed/btn_kakao_login.png" 
              class="login-btn" 
              alt="카카오 로그인 버튼"
            />
          </v-btn>

          <!-- 네이버 로그인 버튼 -->
          <v-btn class="naver-login-btn" @click="goToNaverLogin">
            <v-img 
              src="/assets/images/fixed/btnG_완성형.png" 
              class="login-btn" 
              alt="네이버 로그인 버튼"
            />
          </v-btn>

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

const router = useRouter();
const kakaoAuthentication = useKakaoAuthenticationStore();
const naverAuthentication = useNaverAuthenticationStore();

// 카카오 로그인 함수
const goToKakaoLogin = async () => {
  await kakaoAuthentication.requestKakaoLoginToDjango();
};

// 네이버 로그인 함수
const goToNaverLogin = async () => {
  await naverAuthentication.requestNaverLoginToDjango();
};

// 홈으로 이동
const goToHome = () => {
  router.push('/');
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