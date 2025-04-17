<template>
    <section class="board-intro-section" ref="sectionRef">
      <div class="card-container">
        <transition-group name="fade-slide" tag="div" class="card-list">
          <div
            v-for="(card, i) in visibleCards"
            :key="i"
            :class="['intro-card', i % 2 === 0 ? 'left' : 'right']"
            :style="{ animationDelay: `${i * 0.3}s` }"
          >
            <h3 class="card-title">{{ card.title }}</h3>
          </div>
        </transition-group>
      </div>
    </section>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  
  const sectionRef = ref<HTMLElement | null>(null)
  const visibleCards = ref<{ title: string }[]>([])
  const allCards = [
    { title: '1' },
    { title: '2' },
    { title: '3' },
  ]
  
  const trigger = ref(false)
  
  const animateCards = () => {
    if (trigger.value) return
    trigger.value = true
    let i = 0
    const interval = setInterval(() => {
      if (i < allCards.length) {
        visibleCards.value.push(allCards[i])
        i++
      } else {
        clearInterval(interval)
      }
    }, 600)
  }
  
  onMounted(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) animateCards()
        })
      },
      { threshold: 0.5 }
    )
    if (sectionRef.value) observer.observe(sectionRef.value)
  })
  </script>
  
  <style scoped>
  .board-intro-section {
    padding: 120px 20px;
    display: flex;
    justify-content: center;
    min-height: 700px;
  }
  
  .card-container {
    width: 100%;
    max-width: 720px;
  }
  
  .card-list {
    display: flex;
    flex-direction: column;
    gap: 48px;
  }
  
  /* 카드 공통 스타일 */
  .intro-card {
    width: 70%;
    background: white;
    border-radius: 16px;
    padding: 40px 20px;
    font-size: 32px;
    font-weight: bold;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
    animation: slideUp 0.6s ease forwards;
    opacity: 0;
    transform: translateY(20px);
  }
  
  /* 좌우 위치 조정 */
  .intro-card.left {
    align-self: flex-start;
  }
  .intro-card.right {
    align-self: flex-end;
  }
  
  /* 애니메이션 */
  @keyframes slideUp {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .fade-slide-enter-from {
    opacity: 0;
    transform: translateY(20px);
  }
  .fade-slide-enter-to {
    opacity: 1;
    transform: translateY(0);
  }
  .fade-slide-enter-active {
    transition: all 0.6s ease;
  }
  </style>
  