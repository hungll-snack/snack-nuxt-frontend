<template>
  <div class="section-card">
    <h2 class="section-title">📝 모임 소개 수정</h2>

    <!-- 제목 입력 -->
    <div class="input-wrapper">
      <label class="input-label">모임 제목</label>
      <input v-model="localBoard.title" class="search-input" placeholder="제목을 입력하세요" />
    </div>

    <!-- 소개 입력 -->
    <div class="input-wrapper">
      <label class="input-label">모임 소개</label>
      <textarea
        v-model="localBoard.content"
        class="search-input"
        placeholder="내용을 입력하세요"
        rows="6"
      ></textarea>
    </div>

    <div class="divider" />

    <!-- 수정 버튼 -->
    <div class="button-flex-wrapper">
      <button class="btn primary" @click="submitModify">
        수정 완료
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import { useBoardModifyStore } from '@/store/board/boardModifyStore'
import { useRouter } from 'vue-router'

const boardStore = useBoardModifyStore()
const router = useRouter()

// 🔧 1. 로컬 상태 생성
const localBoard = reactive({
  title: '',
  content: '',
})

// 🔧 2. boardStore.board가 변경되면 localBoard에 복사
watch(
  () => boardStore.board,
  (newBoard) => {
    localBoard.title = newBoard.title
    localBoard.content = newBoard.content
  },
  { immediate: true, deep: true }
)

// 🔧 3. 수정 버튼 클릭 시 반영 후 저장
const submitModify = async () => {
  boardStore.board.title = localBoard.title
  boardStore.board.content = localBoard.content

  const success = await boardStore.updateBoard()
  if (success) {
    alert('게시글이 수정되었습니다.')
    router.push(`/board/detail/${boardStore.board.board_id}`)
    console.log('✅ board_id for redirection:', boardStore.board.board_id)
  } else {
    alert('게시글 수정 실패')
  }
}
</script>

<style scoped>
.section-card {
  width: 100%;
  padding: 24px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.06);
  border: 1px solid #f2f2f2;
}

.section-title {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 16px;
  color: #ff7043;
}

.input-wrapper {
  margin-bottom: 16px;
}

.input-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 6px;
}

.search-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
}

.divider {
  border-top: 1px solid #f2f2f2;
  margin: 20px 0;
}

.button-flex-wrapper {
  display: flex;
  justify-content: flex-end;
}

.btn.primary {
  background-color: #ff7043;
  color: white;
  padding: 12px;
  border-radius: 12px;
  font-weight: 600;
}
</style>
