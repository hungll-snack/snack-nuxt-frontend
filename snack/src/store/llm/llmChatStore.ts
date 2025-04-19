// src/store/llm/llmChatStore.ts

import { defineStore } from 'pinia'

export type SenderType = 'user' | 'bot'

export interface ChatMessage {
  sender: SenderType
  text: string
  timestamp: string
}

export const useLLMChatStore = defineStore('llmChat', {
  state: () => ({
    modalOpen: false,
    chatHistory: [] as ChatMessage[],
  }),

  actions: {
    openModal() {
      this.modalOpen = true
    },
    closeModal() {
      this.modalOpen = false
    },
    addChat(sender: SenderType, text: string) {
      const timestamp = new Date().toISOString()
      this.chatHistory.push({ sender, text, timestamp })
    },
    clearChat() {
      this.chatHistory = []
    }
  }
})
