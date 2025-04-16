<template>
  <section class="team-section" ref="sectionRef">
    <h2 class="section-title">
      <span class="normal-text">ABOUT </span>

      <span class="gradient-text">SNACK TEAM</span>
</h2>



    <div class="about-description">
      <p
        v-for="(line, i) in descriptionLines"
        :key="i"
        class="line fade-line"
        :style="{ animationDelay: `${i * 0.4}s` }"
      >
        <span class="gradient-line" v-html="line" />
      </p>
    </div>

    <!-- 팀원 카드 -->
    <div class="team-grid">
      <div
        v-for="(member, index) in teamMembers"
        :key="index"
        class="flip-card"
        :class="{ 'fade-in': visibleCards[index] }"
      >
        <div class="flip-card-inner">
          <div class="flip-card-front">
            <img :src="member.image" :alt="member.name" />
            <p class="member-name">
              <span v-if="member.role === '팀장'" class="team-leader">[팀장]</span> {{ member.name }}
            </p>
          </div>
          <div class="flip-card-back">
            <p>GitHub</p>
            <a :href="member.github" target="_blank">
              👉 {{ member.github.replace('https://github.com/', '@') }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import jena from '@/assets/images/team/jena.jpg'
import junhee from '@/assets/images/team/jena.jpg'
import seungil from '@/assets/images/team/jena.jpg'
import goeun from '@/assets/images/team/goeun.jpg'
import hyeonseo from '@/assets/images/team/hyeonseo.jpeg'

const sectionRef = ref<HTMLElement | null>(null)
const visibleCards = ref<boolean[]>([])

onMounted(() => {
  visibleCards.value = teamMembers.map(() => false)

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        const index = Number((entry.target as HTMLElement).dataset.index)
        if (entry.isIntersecting) {
          visibleCards.value[index] = true
        } else {
          visibleCards.value[index] = false
        }
      })
    },
    { threshold: 0.6 }
  )

  setTimeout(() => {
    const cards = document.querySelectorAll('.flip-card')
    cards.forEach((el, i) => {
      el.setAttribute('data-index', i.toString())
      observer.observe(el)
    })
  }, 300)
})

const teamMembers = [
  { name: '유제나', role: '팀장', image: jena, github: 'https://github.com/jenaRyu' },
  { name: '조준희', role: '팀원', image: junhee, github: 'https://github.com/jojunhee' },
  { name: '손승일', role: '팀원', image: seungil, github: 'https://github.com/seungilson' },
  { name: '주고은', role: '팀원', image: goeun, github: 'https://github.com/goeunjoo' },
  { name: '정현서', role: '팀원', image: hyeonseo, github: 'https://github.com/hyunseojeong' },
]

const descriptionLines = [
  '우리는 <strong>AI 기반의 대화형 맛집 추천 시스템</strong>과',
  '<strong>밥친구 매칭 기능</strong>을 제공하는 <span class="highlight">헝글(HUNGLL)</span> 서비스를 만들고 있습니다.',
  '단순한 검색을 넘어서 <span class="highlight">개인의 취향 기반 추천</span>으로',
  '더욱 정확하고 즐거운 식사 경험을 연결해드립니다.',
]
</script>

<style scoped>
/* 헤드라인 */
.section-title {
  font-size: 40px;
  font-weight: 900;
  margin-bottom: 36px;
  text-align: center;
  /* opacity: 0; */
  animation: fadeInUp 1s ease forwards;
  color: #222; /* ⭐ 기본색 지정 안 해주면 안 보일 수 있음 */
}
.gradient-text {
  background: linear-gradient(to right, #ff6f00, #ff1744);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* 문단 */
.about-description {
  text-align: center;
  max-width: 720px;
  margin: 0 auto 48px;
  font-size: 17px;
  line-height: 1.9;
}
.gradient-line {
  display: inline-block;
  background: linear-gradient(to bottom, #ffc020, #f44336);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* 문단 줄별 fade 효과 */
.fade-line {
  opacity: 0;
  transform: translateY(10px);
  animation: fadeUp 0.6s ease forwards;
}
@keyframes fadeUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 팀 그리드 */
.team-section {
  text-align: center;
  padding: 120px 20px 64px;
}
.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 20px;
  justify-content: center;
  justify-items: center;
  padding: 0 16px;
}

@media (min-width: 1024px) {
  .team-grid {
    grid-template-columns: repeat(5, 1fr);
  }
}
@media (min-width: 768px) and (max-width: 1023px) {
  .team-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  .team-grid > :nth-child(n+4) {
    grid-column: span 1;
    justify-self: center;
  }
}
@media (max-width: 767px) {
  .team-grid {
    grid-template-columns: 1fr;
  }
}

/* 카드 */
.flip-card {
  width: 140px;
  height: 240px;
  perspective: 1000px;
  opacity: 0;
}
.fade-in {
  animation: fadeWave 0.6s ease forwards;
}
@keyframes fadeWave {
  0% {
    transform: translateY(30px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}
.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.6s;
  transform-style: preserve-3d;
}
.flip-card:hover .flip-card-inner {
  transform: rotateY(180deg);
}
.flip-card-front,
.flip-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
}
.flip-card-front {
  background: #fff;
}
.flip-card-front img {
  width: 100%;
  height: 180px;
  object-fit: cover;
}
.member-name {
  margin-top: 8px;
  font-size: 14px;
  font-weight: 500;
}
.team-leader {
  color: red;
  font-weight: bold;
}
.flip-card-back {
  background-color: #ff9800;
  color: #fff;
  transform: rotateY(180deg);
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.flip-card-back p {
  font-weight: bold;
  margin-bottom: 8px;
}
.flip-card-back a {
  color: white;
  font-size: 13px;
  font-weight: bold;
  text-decoration: underline;
}
.flip-card-back a:hover {
  color: #f5f5f5;
}
</style>
