<template>
    <section class="why-section" ref="sectionRef">
      <!-- 제목 -->
      <h2 class="why-title">
        똑똑한 추천을 위해,<br />
        <span class="highlight">왜 <span class="highlight-marker">헝글(HUNGLL)</span>이어야 할까요?</span>
      </h2>
  
      <!-- 점선 아이콘 -->
      <svg class="ellipsis" width="6" height="38" viewBox="0 0 6 38" fill="none">
        <circle cx="3" cy="3" r="3" />
        <circle cx="3" cy="19" r="3" />
        <circle cx="3" cy="35" r="3" />
      </svg>
  
      <!-- 메시지 -->
      <div class="why-content">
        <p class="why-label slide-up" :class="{ visible: isVisible[0] }">WHY</p>
        <p class="why-heading slide-up" :class="{ visible: isVisible[1] }">
          맛집 추천과 밥친구 연결,<br />우리는 취향을 이해합니다.
        </p>
        <br />
        <br />
        <p class="why-sub slide-up" :class="{ visible: isVisible[2] }">
          사용자 개개인의 취향을 분석하여<br />
          <span class="underline-highlight">정확한 맛집 추천</span>은 물론,<br />
          <span class="underline-highlight">잘 맞는 밥친구까지 연결</span>하는<br />
          AI 기반의 스마트한 서비스, 바로 헝글입니다.
        </p>
      </div>

            <!-- 점선 아이콘 -->
            <svg class="ellipsis" width="6" height="38" viewBox="0 0 6 38" fill="none">
        <circle cx="3" cy="3" r="3" />
        <circle cx="3" cy="19" r="3" />
        <circle cx="3" cy="35" r="3" />
      </svg>
    </section>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue'  
  const sectionRef = ref<HTMLElement | null>(null)
  const isVisible = ref([false, false, false]) // WHY, heading, sub 순서
  
  onMounted(() => {
    const targets = sectionRef.value?.querySelectorAll('.slide-up')
    if (!targets) return
  
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          const index = Array.from(targets).indexOf(entry.target as HTMLElement)
          if (entry.isIntersecting && index !== -1) {
            isVisible.value[index] = true
          }
        })
      },
      {
        threshold: 0.5,
      }
    )
  
    targets.forEach(el => observer.observe(el))
  })
  </script>
  
  <style scoped>
  .why-section {
    padding: 120px 20px;
    position: relative;
    text-align: center;
    overflow: hidden;
  }
  
  .why-title {
    font-size: 50px;
    font-weight: 800;
    line-height: 1.5;
    margin-bottom: 24px;
    word-break: keep-all;
  }
  .highlight {
    display: inline-block;
  }
  .highlight-marker {
    background: linear-gradient(90deg, #ff9800, #f44336);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: 900;
  }
  
  .ellipsis {
    margin: 24px auto;
    display: block;
    fill: #ccc;
  }
  
  .why-content {
    max-width: 720px;
    margin: 0 auto 48px;
    font-size: 16px;
    line-height: 1.8;
  }
  .why-label {
    font-weight: bold;
    color: #ff6f00;
    font-size: 16px;
    margin-bottom: 6px;
  }
  .why-heading {
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 14px;
  }
  .why-sub {
    color: #444;
    font-size: 16px;
  }
  .underline-highlight {
    position: relative;
    font-weight: bold;
  }
  .underline-highlight::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 2px;
    width: 100%;
    height: 10px;
    background: rgba(255, 153, 0, 0.3);
    z-index: -1;
  }
  
  /* 슬라이드 등장 */
  .slide-up {
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.6s ease;
  }
  .slide-up.visible {
    opacity: 1;
    transform: translateY(0);
  }
  </style>
  