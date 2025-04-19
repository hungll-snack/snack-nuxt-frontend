<!-- views/llm/LLMChatFloatingButton.vue -->
<template>
    <button class="floating-btn" @click="openChatModal">
      <v-icon size="24">mdi-chat</v-icon>
    </button>
  </template>
  
  <script setup lang="ts">
  import { useLLMChatStore } from '@/store/llm/llmChatStore'
  
  const chatStore = useLLMChatStore()
  const openChatModal = () => {
    chatStore.openModal()
  }
  </script>
  
  <style scoped>
  .floating-btn {
    position: fixed;
    bottom: 24px;
    right: 24px;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background-color: #E76200; /* 헝글 오렌지 */
    color: white;
    border: none;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 9999;
    transition: transform 0.2s ease;
  }
  
  .floating-btn:hover {
    transform: scale(1.1);
  }
  </style>
  