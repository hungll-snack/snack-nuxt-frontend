<template>
  <section class="board-intro-section">
    <div class="card-container">
      <transition-group name="fade-slide" tag="div" class="card-list">
        <div
          v-for="(card, i) in cards"
          :key="i"
          :class="['intro-card', i % 2 === 0 ? 'left' : 'right']"
          :style="{
            animationDelay: `${i * 0.6}s`,
            animationName: i % 2 === 0 ? 'slideFromLeft' : 'slideFromRight'
          }"
          @mouseenter="showPopup(card.image)"
          @mouseleave="hidePopup"
        >
          <div class="card-interactive-content" :class="i === 1 ? 'reverse' : ''">
            <img class="intro-image" :src="card.image" alt="intro" />
            <div class="intro-text">
              <h3 class="card-title">{{ card.title }}</h3>
              <p>{{ card.description }}</p>
            </div>
          </div>
        </div>
      </transition-group>
    </div>

    <div v-if="popupImage" class="popup-image-overlay">
      <img :src="popupImage" class="popup-image" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import image1 from '@/assets/images/intro/1.jpg'
import image2 from '@/assets/images/intro/2.jpg'
import image3 from '@/assets/images/intro/3.png'


const popupImage = ref<string | null>(null)

const showPopup = (img: string) => {
  popupImage.value = img
}

const hidePopup = () => {
  popupImage.value = null
}

const cards = [
  {
    title: '헝글챗 🧠, 취향까지 캐치합니다.',
    description: '말 한 마디면 충분해요. 헝글챗이 내 스타일에 딱 맞는 맛집과 밥친구를 추천해드려요.',
    image: image1,
  },
  {
    title: '마음 맞는 사람과 맛집 탐방! ',
    description: '모비슷한 취향의 사람들과 헝글에서 새로운 밥모임을 시작해보세요.',
    image: image2,
  },
  {
    title: '서울 맛집, 믿고 보는 헝글픽',
    description: '서울의 진짜 맛집만 골라서. 리뷰도, 인증도, 헝글이 먼저 확인했어요.😎',
    image: image3,
  }
]
</script>

<style scoped>
.board-intro-section {
  padding: 120px 20px;
  display: flex;
  justify-content: center;
  min-height: 1000px;
  background-color: rgba(0, 0, 0, 0);
}

.card-container {
  width: 100%;
  max-width: 720px;
}

.card-list {
  display: flex;
  flex-direction: column;
  gap: 80px;
}

.intro-card {
  width: 77%;
  background: white;
  border-radius: 16px;
  padding: 40px 20px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  animation-duration: 1.2s;
  animation-fill-mode: forwards;
  transition: transform 0.3s ease, width 0.6s ease;
  overflow: hidden;
  cursor: pointer;
}
.intro-card:hover {
  transform: scale(1.1);
}
.intro-card.left {
  align-self: flex-start;
}
.intro-card.right {
  align-self: flex-end;
}

.card-interactive-content {
  display: flex;
  align-items: center;
  gap: 24px;
}

/* reverse for desktop */
.card-interactive-content.reverse {
  flex-direction: row-reverse;
}

@media (max-width: 768px) {
  .intro-card {
    width: 100% !important;
  }

  .intro-card:nth-child(3) .card-interactive-content {
    flex-direction: column !important;
    text-align: center;
  }

  .intro-card:nth-child(3) .intro-image {
    width: 100%;
    height: auto;
  }

  .intro-card:nth-child(3) .intro-text {
    margin-top: 16px;
  }

  .card-title {
    font-size: clamp(18px, 4vw, 24px);
  }

  .intro-text p {
    font-size: clamp(14px, 3.5vw, 16px);
  }
}


.intro-image {
  flex: 1;
  height: 200px;
  border-radius: 12px;
  object-fit: cover;
  transition: transform 0.5s ease, box-shadow 0.5s ease;
}

.popup-image-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  pointer-events: none;
  animation: fadeIn 0.3s ease;
  opacity: 90%;
}

.popup-image {
  max-width: 80vw;
  max-height: 80vh;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
  animation: popupZoom 0.5s ease forwards;
}

/* 텍스트 */
.card-title {
  font-size: clamp(20px, 2.5vw, 28px);
  font-weight: bold;
  margin: 0;
  transition: transform 0.3s ease, font-weight 0.3s ease;
}

.intro-card:hover .card-title {
  transform: scale(1.05);
  font-weight: 900;
  color: #111;
}

.intro-text {
  flex: 2;
}

.intro-text p {
  margin-top: 12px;
  font-size: clamp(14px, 1.5vw, 16px);
  color: #555;
}

/* 애니메이션 */
@keyframes slideFromLeft {
  from {
    opacity: 0;
    transform: translateX(-80px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideFromRight {
  from {
    opacity: 0;
    transform: translateX(80px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(40px);
}
.fade-slide-enter-to {
  opacity: 1;
  transform: translateY(0);
}
.fade-slide-enter-active {
  transition: all 1s ease;
}

@keyframes fadeIn {
  from {
    background-color: rgba(0, 0, 0, 0);
  }
  to {
    background-color: rgba(0, 0, 0, 0);
  }
}

@keyframes popupZoom {
  from {
    transform: scale(0.8) translateY(30px);
    opacity: 0;
  }
  to {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
}
</style>

