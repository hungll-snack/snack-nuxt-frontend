<template>
  <div class="popup-wrapper" v-if="showPopup">
    <div class="popup-card">
      <h3>🎁 헝글 설문조사 이벤트</h3>
      <p>
        헝글 사용자 설문에 참여해 주세요!<br />
        추첨을 통해 <strong>커피 기프티콘</strong>을 드립니다 ☕
      </p>
      <a class="survey-link" href="https://forms.gle/s1jEmkEfZwyLbvKr5" target="_blank">
        👉 설문 참여하러 가기
      </a>
      <div class="btn-group">
        <button class="plain-btn" @click="closeToday">오늘 하루 그만 보기</button>
        <button class="plain-btn" @click="showPopup = false">닫기</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const showPopup = ref(false)

onMounted(() => {
  console.log('✅ SurveyPopup mounted')
  const today = new Date().toISOString().split('T')[0] // 'YYYY-MM-DD'
  const hideDate = localStorage.getItem('survey-popup-hide-date')

  if (hideDate !== today) {
    showPopup.value = true
  }
})

function closeToday() {
  const today = new Date().toISOString().split('T')[0]
  localStorage.setItem('survey-popup-hide-date', today)
  showPopup.value = false
}
</script>

<style scoped>
.popup-wrapper {
  position: fixed;
  top: 100px;
  left: 40px;
  z-index: 9999;
}

.popup-card {
  width: 280px;
  background-color: #fff8e1;
  border: 1px solid #ffa500;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
  padding: 20px;
  font-family: sans-serif;
  color: #333;
}

.popup-card h3 {
  margin-top: 0;
  font-size: 18px;
  color: #ff6600;
}

.popup-card p {
  font-size: 14px;
  margin-bottom: 16px;
  line-height: 1.4;
}

.survey-link {
  display: block;
  background-color: #ff6600;
  color: white;
  text-align: center;
  padding: 8px 12px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: bold;
  margin-bottom: 12px;
}

.btn-group {
  display: flex;
  justify-content: space-between;
}

.plain-btn {
  background: transparent;
  border: none;
  color: #888;
  font-size: 13px;
  cursor: pointer;
  text-decoration: underline;
}
</style>
