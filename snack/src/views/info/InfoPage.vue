<template>
  <div class="info-page">
    <!-- ✅ 흐릿한 로고 10개 (색상 그대로, 투명도만 다르게) -->
    <div class="background-logos">
      <img
        v-for="n in 10"
        :key="n"
        src="@/assets/images/logo/hungle_full_big.png"
        class="bg-logo"
        :style="generateRandomStyle(n)"
        alt="배경 로고"
      />
    </div>

    <!-- ✅ 섹션 -->
    <div ref="introSectionRef">
      <IntroSection @next="scrollToTeam" />
    </div>
    <div ref="teamSectionRef">
      <TeamSection />
    </div>

    <!-- 스크롤 화살표 -->
    <div class="scroll-arrow" @click="toggleScroll">
      <span v-if="sectionIndex === 0">⬇️</span>
      <span v-else>⬆️</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import IntroSection from '@/views/info/IntroSection.vue'
import TeamSection from '@/views/info/TeamSection.vue'

const sectionIndex = ref(0)
const introSectionRef = ref<HTMLElement | null>(null)
const teamSectionRef = ref<HTMLElement | null>(null)

const scrollToIntro = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
  sectionIndex.value = 0
}
const scrollToTeam = () => {
  teamSectionRef.value?.scrollIntoView({ behavior: 'smooth' })
  sectionIndex.value = 1
}
const toggleScroll = () => {
  sectionIndex.value === 0 ? scrollToTeam() : scrollToIntro()
}

// ✅ 랜덤 위치/크기/회전/투명도 스타일
const generateRandomStyle = (index: number) => {
  const top = Math.random() * 100
  const left = Math.random() * 100
  const size = Math.random() * 15 + 20 // 20~35vw
  const rotate = Math.random() * 360
  const duration = Math.random() * 5 + 5
  const opacity = (Math.random() * 0.04 + 0.02).toFixed(2) 

  return {
    top: `${top}%`,
    left: `${left}%`,
    width: `${size}vw`,
    transform: `translate(-50%, -50%) rotate(${rotate}deg)`,
    animationDuration: `${duration}s`,
    opacity,
  }
}

onMounted(() => {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (entry.target === introSectionRef.value) {
            sectionIndex.value = 0
          } else if (entry.target === teamSectionRef.value) {
            sectionIndex.value = 1
          }
        }
      })
    },
    { threshold: 0.6 }
  )

  if (introSectionRef.value) observer.observe(introSectionRef.value)
  if (teamSectionRef.value) observer.observe(teamSectionRef.value)
})
</script>

<style scoped>
.info-page {
  position: relative;
  padding: 120px 20px 200px;
  z-index: 1;
  overflow-x: hidden;
}

/* ✅ 배경 로고 애니메이션 */
.background-logos {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}
.bg-logo {
  position: absolute;
  animation: floatMove ease-in-out infinite;
}

/* 부드러운 움직임 효과 */
@keyframes floatMove {
  0% {
    transform: translate(-50%, -50%) scale(0.5);
  }
  50% {
    transform: translate(-48%, -52%) scale(1.2);
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
  }
}

/* 스크롤 화살표 */
.scroll-arrow {
  position: fixed;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 32px;
  cursor: pointer;
  z-index: 10;
  animation: bounce 1.5s infinite;
  user-select: none;
}
@keyframes bounce {
  0%, 100% {
    transform: translate(-50%, 0);
  }
  50% {
    transform: translate(-50%, -10px);
  }
}
</style>
