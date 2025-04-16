<template>
  <section class="intro-section">
    <!-- 상단 로고 -->
    <div class="logo-wrapper">
      <img src="@/assets/images/logo/hungle_full_big.png" alt="HUNGLL 로고" class="logo" />
    </div>
    <br>
    <br>
    <!-- 타이핑 텍스트 -->
    <h1 class="hook-text">
      {{ typedText }}<span class="cursor">|</span>
    </h1>

    <!-- 설명 문단 -->
    <p class="description gradient-text">
      서울의 인증된 맛집을 취향 기반으로 추천하고,<br />
      나와 맞는 밥친구까지 연결해주는 트렌디한 AI 서비스, <strong>HUNGLL</strong>
    </p>

    <!-- 네온카드 버튼 -->
    <div class="flip-card-button" @click="copyEmail">
      <div class="flip-card-inner" :class="{ flipped: isHovered }" @mouseenter="isHovered = true" @mouseleave="isHovered = false">
        <div class="flip-card-front">헝글 팀에 문의하기</div>
        <div class="flip-card-back">
          <span>📩 이메일 복사</span>
        </div>
      </div>
    </div>

    <!-- 복사되었을 때 팝업 -->
    <div v-if="copied" class="copy-popup">✅ 복사되었습니다</div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const messages = [
  '똑똑한 AI 취향 분석으로 정확한 추천!',
  '지금 당신에게 꼭 맞는 맛집을 찾아드립니다.',
  '서울의 인증 맛집, HUNGLL이 추천해요.',
  '당신의 취향을 기억하는 스마트 추천!',
  '밥친구까지 연결해주는 AI 서비스',
]

const typedText = ref('')
const currentMessageIndex = ref(0)
const typingSpeed = 80
const eraseSpeed = 40
const delayBetween = 1500

const typeLoop = async () => {
  const message = messages[currentMessageIndex.value]
  for (let i = 0; i <= message.length; i++) {
    typedText.value = message.slice(0, i)
    await new Promise(resolve => setTimeout(resolve, typingSpeed))
  }
  await new Promise(resolve => setTimeout(resolve, delayBetween))
  for (let i = message.length; i >= 0; i--) {
    typedText.value = message.slice(0, i)
    await new Promise(resolve => setTimeout(resolve, eraseSpeed))
  }
  currentMessageIndex.value = (currentMessageIndex.value + 1) % messages.length
  typeLoop()
}

onMounted(() => {
  typeLoop()
})

const copied = ref(false)
const isHovered = ref(false)

const copyEmail = async () => {
  try {
    await navigator.clipboard.writeText('hungll.snack@gmail.com')
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  } catch (e) {
    console.error('복사 실패:', e)
  }
}
</script>

<style scoped>
.intro-section {
  position: relative;
  text-align: center;
  padding: 60px 20px 80px;
  overflow: hidden;
}

.logo-wrapper {
  margin-bottom: 32px;
}
.logo {
  width: 160px;
  max-width: 80%;
}

.hook-text {
  font-size: 50px;
  font-weight: 700;
  min-height: 40px;
  margin-bottom: 24px;
  color: #ff6f00;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}

.cursor {
  animation: blink 1s step-start infinite;
  color: #ff6f00;
}
@keyframes blink {
  50% {
    opacity: 0;
  }
}

.description {
  font-size: 17px;
  line-height: 1.7;
  margin-bottom: 36px;
  color: #444;
}
.gradient-text {
  background: linear-gradient(to bottom, #ff9800, #ff5722);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* 🎯 Flip 애니메이션 */
.flip-card-button {
  width: 240px;
  height: 60px;
  margin: 0 auto;
  perspective: 1000px;
  animation: bounce-scale 2s infinite;
}

@keyframes bounce-scale {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.6s;
  transform-style: preserve-3d;
  cursor: pointer;
}

.flip-card-inner.flipped {
  transform: rotateY(180deg);
}

.flip-card-front,
.flip-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  backface-visibility: hidden;
  font-size: 16px;
}

.flip-card-front {
  background-color: #ff6f00;
  color: white;
  z-index: 2;
}

.flip-card-back {
  transform: rotateY(180deg);
  background-color: white;
  color: #ff6f00;
  border-image: linear-gradient(45deg, #ff6f00, #ff1744) 1;
  box-shadow: 0 0 12px #ff572266;
}

/* ✅ 복사 팝업 */
.copy-popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #000000dd;
  padding: 14px 28px;
  border-radius: 8px;
  color: #fff;
  font-size: 14px;
  opacity: 0.9;
  animation: fadeOut 2s ease-out forwards;
  z-index: 100;
}
@keyframes fadeOut {
  0% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.8);
  }
}
</style>
