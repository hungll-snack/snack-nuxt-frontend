<template>
  <div class="board-list-card">
    <div class="header">
      <h2 class="header-title">📋 밥친구 모집 리스트</h2>

      <div class="select-wrapper">
        <div class="dropdown" ref="statusDropdown">
          <label class="dropdown-label">상태</label>
          <div class="custom-dropdown" @click.stop="toggleStatus">
            <div class="selected-option">{{ selectedStatus }}</div>
            <ul v-if="statusOpen" class="dropdown-options">
              <li @click.stop="selectStatus('전체')">전체</li>
              <li @click.stop="selectStatus('모집중')">모집중</li>
              <li @click.stop="selectStatus('모집종료')">모집종료</li>
            </ul>
          </div>
        </div>

        <div class="dropdown" ref="sortDropdown">
          <label class="dropdown-label">정렬</label>
          <div class="custom-dropdown" @click.stop="toggleSort">
            <div class="selected-option">{{ selectedSort }}</div>
            <ul v-if="sortOpen" class="dropdown-options">
              <li @click.stop="selectSort('최신순')">최신순</li>
              <li @click.stop="selectSort('마감순')">마감순</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <v-divider class="mb-4" />

    <div class="list-section">
      <div v-if="boardStore.boardList.length === 0" class="no-data-card">
        <span class="no-data-text">😢 등록된 밥모임이 없습니다</span>
      </div>

<!-- 게시글 리스트 -->
<div
  v-else
  class="board-card"
  v-for="board in boardStore.boardList"
  :key="board.board_id"
  @click="goToDetail(board.board_id)"
>
  <img class="board-image" :src="board.image_url" alt="썸네일" />
  <div class="board-info">
    <h3 class="board-title">{{ board.title }}</h3>
    <p class="board-meta">
      👤 {{ board.author_nickname }} |
      📅 {{ board.end_time?.slice(0, 10) || '미정' }} |
      📌 {{ board.status === 'ongoing' ? '모집중' : '모집종료' }}
    </p>
  </div>
</div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useBoardListStore } from '@/store/board/boardListStore'
import { useRouter } from 'vue-router'
const router = useRouter()

const goToDetail = (boardId: number) => {
  router.push(`/board/detail/${boardId}`)
}

const selectedStatus = ref('전체')
const selectedSort = ref('최신순')
const statusOpen = ref(false)
const sortOpen = ref(false)

const boardStore = useBoardListStore()

const fetchBoardList = async () => {
  await boardStore.fetchBoardList({
    page: boardStore.currentPage,
    perPage: 10,
    status: selectedStatus.value,
    sort: selectedSort.value,
  })
}

const toggleStatus = () => {
  statusOpen.value = !statusOpen.value
  sortOpen.value = false
}

const toggleSort = () => {
  sortOpen.value = !sortOpen.value
  statusOpen.value = false
}

const selectStatus = (val: string) => {
  selectedStatus.value = val
  statusOpen.value = false
  fetchBoardList()
}

const selectSort = (val: string) => {
  selectedSort.value = val
  sortOpen.value = false
  fetchBoardList()
}

const closeAllDropdowns = (e: MouseEvent) => {
  const target = e.target as Node
  if (!statusDropdown.value?.contains(target) && !sortDropdown.value?.contains(target)) {
    statusOpen.value = false
    sortOpen.value = false
  }
}

const statusDropdown = ref<HTMLElement | null>(null)
const sortDropdown = ref<HTMLElement | null>(null)

onMounted(() => {
  window.addEventListener('click', closeAllDropdowns)
  fetchBoardList()
})

onBeforeUnmount(() => {
  window.removeEventListener('click', closeAllDropdowns)
})
</script>

<style scoped>
.board-list-card {
  padding: 24px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.06);
  border: 1px solid #f2f2f2;
  height: 100%;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 16px;
}
.header-title {
  font-size: 22px;
  font-weight: 700;
  color: #ff7043;
  margin: auto 0;
}
.select-wrapper {
  display: flex;
  flex-direction: row;
  gap: 16px;
  flex-wrap: wrap;
  width: 100%;
}
.dropdown {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  min-width: 120px;
}
.dropdown-label {
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 4px;
  color: #444;
  margin-left: 4px;
}
.custom-dropdown {
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 8px 12px;
  cursor: pointer;
  position: relative;
}
.selected-option {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}
.dropdown-options {
  position: absolute;
  top: 100%;
  left: 0;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-top: 4px;
  width: 100%;
  z-index: 9999;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}
.dropdown-options li {
  padding: 10px 12px;
  font-size: 14px;
  color: #333;
  cursor: pointer;
}
.dropdown-options li:hover {
  background-color: #ffece5;
  color: #ff7043;
}
.list-section {
  margin-top: 24px;
}
.board-card {
  display: flex;
  gap: 16px;
  padding: 16px;
  background: #fff8f4;
  border: 1px solid #ffece5;
  border-radius: 12px;
  margin-bottom: 16px;
}
.board-image {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 12px;
}
.board-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.board-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 6px;
}
.board-meta {
  font-size: 14px;
  color: #666;
}
.no-data-card {
  padding: 40px;
  text-align: center;
  background-color: #fff8f4;
  border: 1.5px dashed #ff7043;
  border-radius: 16px;
  color: #ff7043;
  font-weight: 600;
  font-size: 16px;
  box-shadow: 0 4px 12px rgba(255, 112, 67, 0.1);
}
@media (max-width: 768px) {
  .select-wrapper {
    flex-direction: column;
  }
  .dropdown {
    width: 100%;
  }
}
</style>
