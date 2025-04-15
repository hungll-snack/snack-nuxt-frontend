<template>
    <div class="prefer-wrapper">
      <div class="question-box">
        <h2 class="question-title">{{ questions[currentIndex].question }}</h2>
      </div>
  
      <div class="card-row">
        <div
          v-for="(option, idx) in questions[currentIndex].options"
          :key="idx"
          class="option-card"
          :class="{ selected: selectedOption === idx }"
          @click="handleSelect(idx)"
        >
          <div class="card-front">{{ option }}</div>
          <div class="card-back">
            <span>선택 완료</span>
            <div class="check-circle">✔</div>
          </div>
        </div>
      </div>
  
      <div v-if="currentIndex === questions.length - 1 && selectedOption !== null" class="submit-wrapper">
        <button class="submit-btn" @click="handleSubmit">제출 완료</button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  
  const questions = [
    { question: '맵기 선호도는?', options: ['순한 맛', '보통', '매운 맛'] },
    { question: '혼밥 자주 하시나요?', options: ['자주', '가끔', '거의 안 해요'] },
    { question: '선호하는 음식 타입?', options: ['한식', '양식', '일식'] },
    { question: '밥 먹는 시간대는?', options: ['아침', '점심', '저녁'] },
    { question: '가성비 vs 분위기?', options: ['가성비', '중간', '분위기'] },
    { question: '디저트는 필수인가요?', options: ['항상', '가끔', '잘 안 먹어요'] },
    { question: '실내 / 실외?', options: ['실내', '상관없음', '야외'] },
    { question: '해산물 선호도는?', options: ['좋아함', '보통', '싫어함'] },
    { question: '함께 식사할 사람은?', options: ['혼자', '연인', '친구들'] },
    { question: '선호하는 분위기?', options: ['조용한', '일반적인', '활기찬'] },
  ]
  
  const currentIndex = ref(0)
  const selectedOption = ref<number | null>(null)
  const answers = ref<string[]>([])
  
  const handleSelect = (idx: number) => {
    if (selectedOption.value !== null) return
    selectedOption.value = idx
    answers.value.push(questions[currentIndex.value].options[idx])
  
    setTimeout(() => {
      if (currentIndex.value < questions.length - 1) {
        currentIndex.value++
        selectedOption.value = null
      }
    }, 1000)
  }
  
  const handleSubmit = () => {
    alert('제출이 완료되었습니다!')
    console.log('📝 사용자 응답:', answers.value)
    router.push('/')
  }
  </script>
  
  <style scoped>
  .prefer-wrapper {
    padding: 40px 20px;
    max-width: 600px;
    margin: 0 auto;
    min-height: 500px;
    text-align: center;
  }
  
  .question-box {
    margin-bottom: 24px;
  }
  
  .question-title {
    font-size: 20px;
    font-weight: 700;
    color: #ff6f00;
    font-family: 'Noto Sans KR', sans-serif;
  }
  
  .card-row {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 20px;
  }
  
  .option-card {
    position: relative;
    width: 100px;
    height: 120px;
    background-color: #fff;
    border: 2px solid #ffcc80;
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.05);
    cursor: pointer;
    transition: transform 0.4s, box-shadow 0.3s;
    transform-style: preserve-3d;
    perspective: 1000px;
  }
  
  .option-card:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 16px rgba(255, 111, 0, 0.3);
  }
  
  .option-card.selected {
    transform: rotateY(180deg);
  }
  
  .card-front,
  .card-back {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    backface-visibility: hidden;
    font-weight: bold;
    font-size: 14px;
    padding: 8px;
    color: #333;
    font-family: 'Noto Sans KR', sans-serif;
  }
  
  .card-front {
    background-color: #fffaf2;
  }
  
  .card-back {
    background-color: #ffe0b2;
    transform: rotateY(180deg);
    flex-direction: column;
    font-size: 13px;
  }
  
  .check-circle {
    margin-top: 6px;
    width: 24px;
    height: 24px;
    background-color: #4caf50;
    color: white;
    border-radius: 50%;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .submit-wrapper {
    margin-top: 40px;
  }
  
  .submit-btn {
    background-color: #ffaa00;
    color: white;
    padding: 12px 28px;
    border: none;
    border-radius: 8px;
    font-weight: bold;
    font-size: 16px;
    transition: background-color 0.3s;
  }
  
  .submit-btn:hover {
    background-color: #ff9900;
  }
  </style>
  