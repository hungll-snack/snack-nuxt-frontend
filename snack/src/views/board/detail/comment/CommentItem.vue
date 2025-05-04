<template>
  <div :class="`pl-${level * 4}`" class="comment-text">
    <div class="comment-content">
      <span v-if="comment.is_deleted" class="text-gray-400 italic">메세지가 삭제되었습니다</span>
      <span v-else-if="!isEditing">{{ comment.content }}</span>
      <textarea v-else v-model="editContent" rows="2" class="edit-textarea" />
    </div>

    <div class="comment-meta">
      <span class="comment-writer">{{ comment.author_nickname }}</span>
      ·
      <span class="comment-time">{{ comment.created_at }}</span>
    </div>

    <div class="action-buttons">
      <button v-if="(comment.is_author || comment.is_admin) && !comment.is_deleted" class="action-btn edit-btn" @click="startEdit">수정</button>
      <button v-if="(comment.is_author || comment.is_admin) && !comment.is_deleted" class="action-btn delete-btn" @click="confirmDelete">삭제</button>
      <button v-if="!comment.is_deleted && !comment.parent_id" class="action-btn reply-btn" @click="toggleReply">답글</button>
    </div>

    <div v-if="isEditing" class="edit-action">
      <button @click="submitEdit" class="submit-btn">수정 완료</button>
    </div>

    <div v-if="showReplyInput" class="reply-input-wrapper">
      <textarea v-model="replyContent" rows="2" class="reply-textarea" placeholder="답글을 입력해주세요" />
      <div class="reply-action">
        <button @click="submitReply" class="submit-btn">답글 등록</button>
      </div>
    </div>

    <!-- 대댓글 리스트 -->
    <CommentItem
      v-for="reply in visibleReplies"
      :key="reply.comment_id"
      :comment="reply"
      :level="level + 1"
      @reply="$emit('reply', $event)"
      @delete="$emit('delete', $event)"
      @edit="$emit('edit', $event)"
    />

    <!-- 답글 더보기/접기 버튼 -->
    <div v-if="comment.replies?.length > 0" @click="toggleReplies" class="toggle-replies">
      <template v-if="!showReplies">답글 더보기 ({{ comment.replies.length }})</template>
      <template v-else-if="replyLimitState < comment.replies.length">답글 더보기</template>
      <template v-else>답글 접기</template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, defineEmits } from 'vue'

const props = defineProps<{ comment: any; level: number }>()
const emit = defineEmits(['reply', 'delete', 'edit'])


const showReplyInput = ref(false)
const replyContent = ref('')
const isEditing = ref(false)
const editContent = ref(props.comment.content)

const replyLimit = 5
const replyLimitState = ref(replyLimit)
const showReplies = ref(false);


const visibleReplies = computed(() => {
  return showReplies.value
    ? (props.comment.replies || []).slice(0, replyLimitState.value)
    : [];
})

const toggleReply = () => {
  showReplyInput.value = !showReplyInput.value
}

const submitReply = () => {
  if (!replyContent.value.trim()) return
  emit('reply', { parentId: props.comment.comment_id, content: replyContent.value })
  replyContent.value = ''
  showReplyInput.value = false
}

const confirmDelete = () => {
  if (confirm('정말로 삭제하시겠습니까?')) {
    emit('delete', props.comment.comment_id)
  }
}

const startEdit = () => {
  isEditing.value = true
  editContent.value = props.comment.content
}

const submitEdit = () => {
  if (!editContent.value.trim()) return
  emit('edit', { commentId: props.comment.comment_id, newContent: editContent.value })
  isEditing.value = false
}

const toggleReplies = () => {
  const totalReplies = props.comment.replies?.length || 0;

  // 답글을 접은 상태 → 5개로 시작
  if (!showReplies.value) {
    showReplies.value = true;
    replyLimitState.value = Math.min(replyLimit, totalReplies);
    return;
  }

  // 다 안 보여졌으면 5개씩 추가
  if (replyLimitState.value < totalReplies) {
    replyLimitState.value = Math.min(replyLimitState.value + 5, totalReplies);
    return;
  }

  // 다 보여졌으면 접기
  showReplies.value = false;
  replyLimitState.value = replyLimit;
};

</script>

<style scoped>
.comment-text {
  font-size: 14px;
  color: #555;
  line-height: 1.4;
  padding: 8px 0;
  margin-top: 10px;
}

.comment-content {
  margin-bottom: 4px;
}

.edit-textarea, .reply-textarea {
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 8px;
  font-size: 14px;
  resize: vertical;
}

.comment-meta {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

.comment-writer {
  font-weight: 500;
}

.action-buttons {
  display: flex;
  gap: 8px;
  margin-top: 6px;
}

.action-btn {
  font-size: 12px;
  cursor: pointer;
  background: none;
  border: none;
  padding: 2px 6px;
  border-radius: 4px;
}

.edit-btn {
  color: #1976d2;
}

.delete-btn {
  color: #e53935;
}

.reply-btn {
  color: #ff8e53;
}

.edit-action, .reply-action {
  margin-top: 4px;
}

.submit-btn {
  background: linear-gradient(to right, #ff6b6b, #ff8e53);
  color: white;
  font-size: 12px;
  padding: 4px 12px;
  border-radius: 999px;
  border: none;
  cursor: pointer;
}

.reply-input-wrapper {
  margin-top: 6px;
}

.toggle-replies {
  font-size: 12px;
  color: #ff8e53;
  cursor: pointer;
  margin-top: 6px;
}
</style>
