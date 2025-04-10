<template>
    <div :class="`pl-${level * 6}`" class="mt-2">
      <v-list-item class="py-1 px-0">
        <v-list-item-content class="pa-0">
          <!-- 닉네임 / 시간 -->
          <div class="d-flex justify-space-between align-center mb-1">
            <span class="font-weight-bold text-orange text-sm">{{ comment.author_nickname }}</span>
            <span class="grey--text text-sm">{{ comment.created_at }}</span>
          </div>
  
          <!-- 댓글 내용 -->
          <div>
            <span v-if="comment.deleted" class="grey--text font-italic text-sm">메세지가 삭제되었습니다</span>
            <span v-else class="text-sm">{{ comment.content }}</span>
          </div>
  
          <!-- 버튼들 -->
          <div class="d-flex align-center gap-1 mt-1">
            <v-icon size="16" color="red" class="cursor-pointer" @click="toggleLike">
              {{ liked ? 'mdi-heart' : 'mdi-heart-outline' }}
            </v-icon>
            <span class="text-sm">{{ likeCount }}</span>
  
            <v-icon
              v-if="comment.is_author && !comment.deleted"
              size="16"
              color="red"
              class="cursor-pointer"
              @click="$emit('delete', comment.comment_id)"
            >
              mdi-delete
            </v-icon>
  
            <v-icon size="16" class="cursor-pointer" @click="toggleReply">mdi-reply</v-icon>
            <span class="cursor-pointer text-sm grey--text" @click="toggleExpand">
              {{ isExpanded ? '접기' : '펼치기' }}
            </span>
          </div>
  
          <!-- 답글 입력창 -->
          <div v-if="showReplyInput" class="mt-2">
            <v-textarea
              v-model="replyContent"
              rows="2"
              density="compact"
              class="text-sm"
              label="답글을 입력해주세요"
            />
            <div class="d-flex justify-end">
              <v-btn
                color="orange"
                density="compact"
                variant="text"
                size="x-small"
                class="mt-1"
                @click="submitReply"
              >답글 등록</v-btn>
            </div>
          </div>
        </v-list-item-content>
      </v-list-item>
  
      <!-- 대댓글 재귀 렌더링 -->
      <Comment
        v-for="child in comment.children"
        v-if="isExpanded"
        :key="child.comment_id"
        :comment="child"
        :level="level + 1"
        @delete="$emit('delete', $event)"
        @like="$emit('like', $event)"
        @reply="$emit('reply', $event)"
      />
    </div>
  </template>
  
  <script setup>
  import { ref, defineProps, defineEmits, watch } from 'vue';
  
  const props = defineProps({
    comment: Object,
    level: {
      type: Number,
      default: 0
    }
  });
  const emit = defineEmits(['delete', 'like', 'reply']);
  
  const isExpanded = ref(true);
  const showReplyInput = ref(false);
  const replyContent = ref('');
  const liked = ref(props.comment.is_liked || false);
  const likeCount = ref(props.comment.like_count || 0);
  
  const toggleExpand = () => {
    isExpanded.value = !isExpanded.value;
  };
  
  const toggleReply = () => {
    showReplyInput.value = !showReplyInput.value;
  };
  
  const submitReply = () => {
    if (!replyContent.value.trim()) return;
    emit('reply', { parentId: props.comment.comment_id, content: replyContent.value });
    replyContent.value = '';
    showReplyInput.value = false;
  };
  
  const toggleLike = () => {
    liked.value = !liked.value;
    likeCount.value += liked.value ? 1 : -1;
    emit('like', props.comment.comment_id);
  };
  
  // props 변경 시 업데이트
  watch(() => props.comment.is_liked, val => liked.value = val);
  watch(() => props.comment.like_count, val => likeCount.value = val);
  </script>
  
  <style scoped>
  .text-sm {
    font-size: 0.85rem;
  }
  .cursor-pointer {
    cursor: pointer;
  }
  .gap-1 {
    gap: 4px;
  }
  </style>
  