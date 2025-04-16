<template>
  <div class="info-page">
    <!-- 배경 흐릿한 로고 -->
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

    <!-- 순서 변경된 섹션 -->
    <div ref="introSectionRef">
      <IntroSection @next="scrollToHungll" />
    </div>
    <div ref="hungllSectionRef">
      <HungllIntroSection />
    </div>
    <div ref="whySectionRef">
      <WhySection />
    </div>
    <div ref="teamSectionRef">
      <TeamSection />
    </div>

    <!-- 🔽 그라데이션 화살표 -->
    <div
      class="gradient-arrow"
      :class="{ up: sectionIndex === 3 }"
      @click="toggleScroll"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import IntroSection from '@/views/info/IntroSection.vue'
import HungllIntroSection from '@/views/info/HungllIntroSection.vue'
import WhySection from '@/views/info/WhySection.vue'
import TeamSection from '@/views/info/TeamSection.vue'

const sectionIndex = ref(0)
const introSectionRef = ref<HTMLElement | null>(null)
const hungllSectionRef = ref<HTMLElement | null>(null)
const whySectionRef = ref<HTMLElement | null>(null)
const teamSectionRef = ref<HTMLElement | null>(null)

const scrollTo = (refEl: HTMLElement | null, index: number) => {
  if (!refEl) return
  refEl.scrollIntoView({ behavior: 'smooth' })
  sectionIndex.value = index
}

const scrollToIntro = () => window.scrollTo({ top: 0, behavior: 'smooth' })
const scrollToHungll = () => scrollTo(hungllSectionRef.value, 1)
const scrollToWhy = () => scrollTo(whySectionRef.value, 2)
const scrollToTeam = () => scrollTo(teamSectionRef.value, 3)

const toggleScroll = () => {
  if (sectionIndex.value === 0) scrollToHungll()
  else if (sectionIndex.value === 1) scrollToWhy()
  else if (sectionIndex.value === 2) scrollToTeam()
  else scrollToIntro()
}

const generateRandomStyle = (index: number) => {
  const top = Math.random() * 100
  const left = Math.random() * 100
  const size = Math.random() * 15 + 20
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
          if (entry.target === introSectionRef.value) sectionIndex.value = 0
          else if (entry.target === hungllSectionRef.value) sectionIndex.value = 1
          else if (entry.target === whySectionRef.value) sectionIndex.value = 2
          else if (entry.target === teamSectionRef.value) sectionIndex.value = 3
        }
      })
    },
    { threshold: 0.6 }
  )

  if (introSectionRef.value) observer.observe(introSectionRef.value)
  if (hungllSectionRef.value) observer.observe(hungllSectionRef.value)
  if (whySectionRef.value) observer.observe(whySectionRef.value)
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

/* 배경 로고 */
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
.gradient-arrow {
  width: 28px;
  height: 28px;
  position: fixed;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  cursor: pointer;
  z-index: 10;

  /* ▼ 아래 화살표 (기본) */
  clip-path: polygon(50% 100%, 0% 0%, 100% 0%);
  background: linear-gradient(to bottom, #ff9800, #ff5722);
  animation: bounce 1.5s infinite;
  transition: transform 0.3s ease, clip-path 0.3s ease;
}

.gradient-arrow:hover {
  transform: translateX(-50%) scale(1.6);
}

.gradient-arrow.up {
  /* ▲ 위 화살표 */
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  background: linear-gradient(to top, #ff9800, #ff5722);
}

/* 뽀용뽀용 효과 */
@keyframes bounce {
  0%, 100% {
    transform: translate(-50%, 0);
  }
  50% {
    transform: translate(-50%, -10px);
  }
}

</style>
