<template>
    <transition name="slide-up">
      <section
        v-if="chatStore.modalOpen"
        class="hungll-chat-section"
        @click.self="chatStore.closeModal()"
      >
        <div class="chat-card visible">
          <!-- ✅ 채팅 리스트 -->
          <div class="chat-wrapper">
            <transition-group name="chat" tag="div" class="chat-list">
              <div
                v-for="(msg, i) in chatStore.chatHistory"
                :key="i"
                :class="['chat-bubble-wrapper', msg.sender]"
              >
                <div :class="['chat-bubble', msg.sender]">
                  <span>{{ msg.text }}</span>
                </div>
              </div>
            </transition-group>
          </div>
  
          <!-- ✅ 입력창 -->
          <div class="chat-input-wrapper">
            <input
              v-model="message"
              type="text"
              class="chat-input"
              placeholder="헝글에게 추천받아보세요 ✨"
              @keyup.enter="sendMessage"
            />
          </div>
        </div>
      </section>
    </transition>
  </template>
  
  <script setup lang="ts">
  import { ref, watch } from 'vue'
  import { useLLMChatStore } from '@/store/llm/llmChatStore'
  import { useAccountStore } from '@/store/account/accountStore'
  import { createFastAPIAxiosInstance } from '@/common/utils/axiosInstance'
import { accountRepository } from '~/repository/account/accountRepository'
  
  const chatStore = useLLMChatStore()
  const accountStore = useAccountStore()
  const message = ref('')
  const nickname = ref('')
  
  /**
   * ✅ 모달 열릴 때:
   * - 닉네임 없으면 getAccount()
   * - 인사 메시지 추가
   */
  watch(
    () => chatStore.modalOpen,
    async (isOpen) => {
      if (!isOpen) return
  
      console.log('💡 chat modal opened!')
  
      // 1. 사용자 정보 없으면 가져오기
      if (!accountStore.nickname) {
        console.log('👀 닉네임 없음 → getAccount 실행')
        await accountRepository.getProfileInfo()
      }
  
      // 2. 인사 메시지 추가
      if (chatStore.chatHistory.length === 0 && accountStore.nickname) {
        nickname.value = accountStore.nickname
        const greeting = `안녕하세요 ${nickname.value}님! 무엇을 도와드릴까요? ✨`
        chatStore.addChat('bot', greeting)
        console.log('👋 인사 메시지 출력 완료')
      }
    }
  )
  
  /**
   * ✅ 메시지 전송
   */
  const sendMessage = async () => {
    if (!message.value.trim()) return
  
    const userMsg = message.value
    message.value = ''
    chatStore.addChat('user', userMsg)
  
    const token = localStorage.getItem('userToken') || ''
    const accountId = localStorage.getItem('account_id') || ''
    const axios = createFastAPIAxiosInstance(token, accountId)
  
    try {
      const res = await axios.post('/llm/search', { query: userMsg, 'account-id': accountId })
      const botMsg = res.data?.response || '응답이 없습니다'
      chatStore.addChat('bot', botMsg)
  
      await axios.post('/chat-history/save', {
        user_message: userMsg,
        bot_response: botMsg,
      })
    } catch (e) {
      console.error('❌ LLM API 실패', e)
      chatStore.addChat('bot', '오류가 발생했습니다. 다시 시도해주세요.')
    }
  }
  </script>
  
  
  
  <style scoped>
  .hungll-chat-section {
    position: fixed;
    inset: 0;
    z-index: 9999;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    background-color: rgba(0, 0, 0, 0.4);
    padding: 40px 20px;
  }
  
  .chat-card {
  background: white;
  border-radius: 24px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  max-width: 680px;
  width: 100%;
  height: 500px; /* ⬅️ 고정 높이 또는 max-height 로 조절 */
  padding: 40px 24px;
  display: flex;
  flex-direction: column;
  transform: translateY(100px);
  opacity: 0;
  transition: all 0.8s ease;
}
.chat-card.visible {
  transform: translateY(0);
  opacity: 1;
}

  
  .chat-wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    overflow-y: auto;
  }
  .chat-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  
  .chat-bubble-wrapper {
    display: flex;
  }
  .chat-bubble-wrapper.user {
    justify-content: flex-end;
  }
  .chat-bubble-wrapper.bot {
    justify-content: flex-start;
  }
  
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
  
  /* 슬라이드 모달 애니메이션 */
  .slide-up-enter-active,
  .slide-up-leave-active {
    transition: transform 0.3s ease;
  }
  .slide-up-enter-from,
  .slide-up-leave-to {
    transform: translateY(100%);
  }
  </style>
  