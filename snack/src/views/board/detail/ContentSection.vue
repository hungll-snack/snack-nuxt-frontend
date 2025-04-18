<template>
    <v-card class="content-card fill-height">
      <v-card-title class="section-title">📝 모임 소개</v-card-title>
      <v-card-text class="scrollable-content">
        {{ content }}
      </v-card-text>
  
      <v-divider class="my-4" />
  
      <v-card-title class="section-title">💬 댓글</v-card-title>
  
      <div class="comment-input-wrapper">
        <input
          v-model="model"
          maxlength="50"
          placeholder="댓글을 입력하세요"
          class="comment-input"
          @keyup.enter="submitComment"
        />
        <v-btn class="submit-btn" @click="submitComment">등록</v-btn>
      </div>
  
      <v-divider class="my-3" />
  
      <div class="comment-section always-scroll">
        <v-list v-if="comments.length">
          <v-list-item
            v-for="(comment, index) in comments"
            :key="comment.id"
          >
            <v-list-item-content>
              <div class="comment-text">
                <div class="comment-content">{{ comment.content }}</div>
                <div class="comment-meta">
                  <span :class="['comment-writer', comment?.writer === '익명' ? 'highlight-writer' : '']">{{ comment.writer ?? '익명' }}</span>
                  ·
                  <span class="comment-time">{{ comment.timestamp ?? '--:--' }}</span>
                </div>
              </div>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <div v-else class="no-comments">댓글이 없습니다.</div>
      </div>
    </v-card>
  </template>
  
  <script setup lang="ts">
  const props = defineProps<{
    content: string
    comments: { id: number; content: string; writer : string ;timestamp:number; }[]
    newComment: string
  }>()
  
  const emit = defineEmits(['update:comments', 'update:newComment'])
  
  const model = defineModel('newComment', { type: String })
  
  const submitComment = () => {
    if (model.value?.trim()) {
      const newEntry = {
        id: Date.now(),
        content: model.value,
      }
      emit('update:comments', [newEntry, ...props.comments])
      model.value = ''
    }
  }
  </script>
  
  <style scoped>
  .content-card {
    border: 1px solid #e0e0e0;
    border-radius: 14px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
    padding: 24px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    min-height: 500px;
  }
  
  .scrollable-content {
    font-size: 15px;
    color: #444;
    line-height: 1.6;
    min-height: 250px;
  }
  
  .section-title {
    font-size: 16px;
    font-weight: bold;
    color: #e65100;
    margin-bottom: 12px;
  }
  
  .comment-input-wrapper {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
    max-height: 250px;
  }
  
  .comment-input {
    flex: 1;
    padding: 10px 16px;
    border: 1px solid #ddd;
    border-radius: 999px;
    font-size: 14px;
    color: #333;
    background: #fff;
    box-shadow: 0 2px 6px rgba(255, 107, 107, 0.05);
    outline: none;
    transition: border-color 0.2s ease;
    height: 40px;
  }
  
  .comment-input::placeholder {
    color: #bbb;
  }
  
  .comment-input:focus {
    border-color: #ff6b6b;
  }
  
  .submit-btn {
    background: linear-gradient(to right, #ff6b6b, #ff8e53);
    color: white;
    font-weight: 500;
    font-size: 13px;
    padding: 6px 18px;
    border-radius: 999px;
    transition: all 0.3s ease;
    min-width: 70px;
    box-shadow: 0 2px 8px rgba(255, 107, 107, 0.2);
  }
  
  .submit-btn:hover {
    opacity: 0.9;
  }
  
  .comment-section {
    flex-grow: 0.6;
    max-height: 150px;
    overflow-y: scroll;
    margin-top: 10px;
    scrollbar-width: thin;
    scrollbar-color: #ff6b6b #fff;
    scroll-behavior:initial;
  }
  
  .comment-section::-webkit-scrollbar {
    width: 8px;
  }
  
  .comment-section::-webkit-scrollbar-thumb {
    background: linear-gradient(to bottom, #ff6b6b, #ff8e53);
    border-radius: 4px;
  }
  
  .comment-section::-webkit-scrollbar-track {
    background: transparent;
  }
  
  .comment-text {
    font-size: 13px;
    color: #555;
    line-height: 1.4;
    padding: 6px 0;
  }
  
  .comment-content {
    margin-bottom: 4px;
  }
  
  .comment-meta {
    font-size: 12px;
    color: #999;
  }
  
  .comment-writer {
    font-weight: 500;
  }
  
  .highlight-writer {
    color: #ff6b6b;
  }
  
  .no-comments {
    font-size: 13px;
    color: #aaa;
    text-align: center;
    margin-top: 8px;
  }
  
  @media (max-width: 768px) {
    .section-title {
      font-size: 15px;
      text-align: left;
    }
    .submit-btn {
      width: auto;
    }
  }
  </style>