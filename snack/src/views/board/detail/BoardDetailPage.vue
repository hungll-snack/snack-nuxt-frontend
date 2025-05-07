<template>
  <v-container>
    <!-- Top layout for large screens -->
    <v-row class="top-layout" v-if="board">
      <v-col cols="12" md="4" lg="3">
        <InfoSection :board="board" :formattedDate="formattedDate" />
      </v-col>

      <v-col cols="12" md="8" lg="9">
        <ContentSection :content="board.content ?? ''" />
        <CommentSection
          :comments="commentStore.comments"
          :total="commentStore.total"
          :on-add-comment="handleAddComment"
          :on-reply="handleReply"
          :on-delete="handleDelete"
          @edit="handleEdit" 
          @pageChange="handlePageChange"
        />
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col cols="12" class="text-center">
        <v-progress-circular indeterminate color="primary" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useBoardDetailStore } from '@/store/board/boardDetailStore'
import { useCommentStore } from '~/store/board/boardCommentStore'

import InfoSection from './InfoSection.vue'
import ContentSection from './ContentSection.vue'
import CommentSection from './comment/CommentSection.vue'

const route = useRoute()
const boardDetailStore = useBoardDetailStore()
const commentStore = useCommentStore()

const { board } = storeToRefs(boardDetailStore)

const formattedDate = computed(() => {
  const raw = board.value?.end_time
  return raw ? new Date(raw).toLocaleString('ko-KR', { dateStyle: 'full', timeStyle: 'short' }) : ''
})

// 댓글 작성
const handleAddComment = (content: string) => {
  const id = Number(route.params.id)
  if (!id) return
  commentStore.addComment(id, content)
}

// 답글 작성
const handleReply = ({ parentId, content }: { parentId: number; content: string }) => {
  const id = Number(route.params.id)
  if (!id) return
  commentStore.addReply(id, parentId, content).then(() => {
    commentStore.loadComments(id)
  })
}

// 삭제
const handleDelete = (commentId: number) => {
  const id = Number(route.params.id)
  if (!id) return
  commentStore.deleteComment(commentId, id)
}

// 수정
const handleEdit = ({ commentId, newContent }: { commentId: number; newContent: string }) => {
  const id = Number(route.params.id);
  if (!id) return;
  commentStore.updateComment(commentId, newContent, id);
}

const handlePageChange = (page: number) => {
  const id = Number(route.params.id)
  if (!id) return
  commentStore.loadComments(id, page)
}

onMounted(() => {
  const id = Number(route.params.id)
  if (id) {
    boardDetailStore.requestDetailBoard(id)
    commentStore.loadComments(id)
  }
})
</script>

<style scoped>
.top-layout {
  margin-bottom: 24px;
}
</style>
