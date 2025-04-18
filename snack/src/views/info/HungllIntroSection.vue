<template>
  <section class="hungll-chat-section" ref="sectionRef">
    <div class="chat-card" :class="{ 'visible': cardVisible }">
      <div class="chat-wrapper">
        <transition-group name="chat" tag="div" class="chat-list">
          <div
            v-for="(msg, i) in visibleMessages"
            :key="i"
            :class="['chat-bubble-wrapper', msg.sender]"
          >
            <div :class="['chat-bubble', msg.sender]">
              <span>{{ msg.text }}</span>
            </div>
          </div>
        </transition-group>
      </div>

      <div class="chat-input-wrapper">
        <input
          v-model="inputValue"
          type="text"
          class="chat-input"
          placeholder="헝글에게 추천받아보세요 ✨"
          @keyup.enter="handleSubmit"
        />
      </div>
    </div>

    <HungllIntroModal v-if="showModal" @close="handleCloseModal" @confirm="handleConfirmModal" />
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import HungllIntroModal from './HungllIntroModal.vue'

const sectionRef = ref<HTMLElement | null>(null)
const visibleMessages = ref<{ sender: string; text: string }[]>([])
const triggered = ref(false)
const inputValue = ref('')
const showModal = ref(false)
const router = useRouter()
const cardVisible = ref(false)

const messages = [
  { sender: 'bot', text: '안녕하세요 JENA님! 무엇을 도와드릴까요?' },
  { sender: 'user', text: '오늘 날씨도 꿀꿀한데 뭐 먹을까? .. 😫😫' },
  { sender: 'bot', text: '현재 서울은 흐리고, 저녁 시간이네요.' },
  { sender: 'bot', text: '🍶 막걸리에 파전 한 판 어때요?' },
  { sender: 'bot', text: '🍗 아니면 치킨에 시원한 맥주도 추천해요!' },
  { sender: 'bot', text: '현재 주변 헝글 친구들은 치맥을 가장 많이 검색하고있어요 👌' },
]

const playChatAnimation = () => {
  if (triggered.value) return
  triggered.value = true
  let i = 0
  const interval = setInterval(() => {
    if (i < messages.length) {
      visibleMessages.value.push(messages[i])
      i++
    } else {
      clearInterval(interval)
    }
  }, 1200)
}

const handleSubmit = () => {
  if (!inputValue.value.trim()) return
  inputValue.value = ''
  showModal.value = true
}

const handleCloseModal = () => {
  showModal.value = false
}

const handleConfirmModal = () => {
  showModal.value = false
  router.push('/policy/privacy')
}

onMounted(() => {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          cardVisible.value = true     
          playChatAnimation()
        }
      })
    },
    { threshold: 0.5 }
  )
  if (sectionRef.value) observer.observe(sectionRef.value)
})

</script>


<style scoped>
.hungll-chat-section {
  padding: 100px 20px;
  background: transparent;
  display: flex;
  justify-content: center;
}

.chat-card {
  background: white;
  border-radius: 24px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  border: 1px solid #eee;
  max-width: 680px;
  width: 100%;
  padding: 40px 24px;
  display: flex;
  flex-direction: column;
  min-height: 550px;
  transform: translateY(100px);
  opacity: 0;
  transition: all 0.8s ease;

}
.chat-card.visible {
  transform: translateY(0);
  opacity: 1;
}
/* 채팅 리스트 */
.chat-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.chat-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 정렬 */
.chat-bubble-wrapper {
  display: flex;
}
.chat-bubble-wrapper.user {
  justify-content: flex-end;
}
.chat-bubble-wrapper.bot {
  justify-content: flex-start;
}

/* 말풍선 */
.chat-bubble {
  position: relative;
  padding: 14px 20px;
  border-radius: 20px;
  max-width: 80%;
  animation: fadeSlideUp 0.6s ease forwards;
  opacity: 0;
  transform: translateY(20px);
  word-break: break-word;
}
.chat-bubble.user {
  background: linear-gradient(135deg, #ff9800, #ff5722);
  color: white;
  border-bottom-right-radius: 4px;
}
.chat-bubble.bot {
  background-color: #f0f0f0;
  color: #333;
  border-bottom-left-radius: 4px;
}

/* 애니메이션 */
@keyframes fadeSlideUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.chat-enter-active {
  transition: all 0.6s ease;
}
.chat-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.chat-enter-to {
  opacity: 1;
  transform: translateY(0);
}

/* 입력창 */
.chat-input-wrapper {
  margin-top: 24px;
  width: 100%;
}
.chat-input {
  width: 100%;
  padding: 14px 20px;
  border-radius: 30px;
  border: 2px solid transparent;
  background: transparent;
  outline: none;
  color: #222;
  font-size: 16px;
  font-weight: 500;
  background-color: rgba(255, 255, 255, 0.5);
  box-shadow: 0 0 8px rgba(255, 102, 0, 0.4);
  transition: 0.3s ease;
}
.chat-input::placeholder {
  color: #aaa;
}
.chat-input:focus {
  border-color: #ff6f00;
  box-shadow: 0 0 12px #ff6f00;
}
</style>
