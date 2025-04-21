<template>
  <div class="board-list-wrapper">
    <div class="board-list-header">
      <h2>📋 밥친구 모집 리스트</h2>

      <div class="dropdown-group">
        <div class="dropdown" ref="statusDropdown" @click="toggleStatus">
          <span>{{ selectedStatus }}</span>
          <ul v-if="statusOpen" class="dropdown-menu">
            <li v-for="status in statusOptions" :key="status" @click.stop="selectStatus(status)">
              {{ status }}
            </li>
          </ul>
        </div>

        <div class="dropdown" ref="sortDropdown" @click="toggleSort">
          <span>{{ selectedSort }}</span>
          <ul v-if="sortOpen" class="dropdown-menu">
            <li v-for="sort in sortOptions" :key="sort" @click.stop="selectSort(sort)">
              {{ sort }}
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div v-if="reactiveBoardList.length === 0" class="no-data">
      😢 등록된 밥모임이 없습니다
    </div>

    <div v-else class="board-list">
      <div
        v-for="board in reactiveBoardList"
        :key="board.board_id"
        class="board-item"
        @click="goToDetail(board.board_id)"
      >
      <img :src="board.image_url || defaultThumbnail" alt="헝글" />
      <div class="details">
          <h3>{{ board.title }}</h3>
          <p>
            👤 {{ board.author_nickname }} |
            📅 {{ board.end_time?.slice(0, 10) || '미정' }} |
            📌 {{ board.status === 'ongoing' ? '모집중' : '모집종료' }}
          </p>
        </div>
      </div>
    </div>

    <v-pagination
      v-model="boardStore.currentPage"
      :length="boardStore.totalPages"
      @update:modelValue="fetchBoardList"
      color="orange"
      class="mt-6"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useBoardListStore } from '@/store/board/boardListStore'
import defaultThumbnail from '@/assets/images/logo/hungle_korean_center.png'

// props 추가
const props = defineProps<{
  title: string
  author: string
  start_date: string
  end_date: string
}>()

const router = useRouter()
const boardStore = useBoardListStore()

const selectedStatus = ref('전체')
const selectedSort = ref('최신순')

const statusOptions = ['전체', '모집중', '모집종료']
const sortOptions = ['최신순', '마감순']

const statusOpen = ref(false)
const sortOpen = ref(false)

const statusDropdown = ref<HTMLElement | null>(null)
const sortDropdown = ref<HTMLElement | null>(null)

const reactiveBoardList = computed(() => boardStore.boardList)

// ✅ 한글 → 영문 변환 맵핑
const statusMap: Record<string, string> = {
  모집중: 'ongoing',
  모집종료: 'closed',
}

const sortMap: Record<string, string> = {
  최신순: 'latest',
  마감순: 'end_date',
}

watch(
  () => [props.title, props.author, props.start_date, props.end_date],
  () => {
    boardStore.currentPage = 1
    fetchBoardList()
  }
)

// fetchBoardList 수정
const fetchBoardList = async () => {
  await boardStore.fetchBoardList({
    page: boardStore.currentPage,
    perPage: 10,
    status: selectedStatus.value === '전체' ? undefined : statusMap[selectedStatus.value],
    sort: sortMap[selectedSort.value],
    title: props.title,
    author: props.author,
    start_date: props.start_date,
    end_date: props.end_date,
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
}

const selectSort = (val: string) => {
  selectedSort.value = val
}

watch([selectedStatus, selectedSort], () => {
  boardStore.currentPage = 1
  fetchBoardList()
})

watch(() => boardStore.currentPage, () => {
  fetchBoardList()
})

const goToDetail = (id: number) => {
  router.push(`/board/detail/${id}`)
}

const closeAllDropdowns = (e: MouseEvent) => {
  const target = e.target as Node
  if (
    !statusDropdown.value?.contains(target) &&
    !sortDropdown.value?.contains(target)
  ) {
    statusOpen.value = false
    sortOpen.value = false
  }
}

onMounted(() => {
  fetchBoardList()
  window.addEventListener('click', closeAllDropdowns)
})

onBeforeUnmount(() => {
  window.removeEventListener('click', closeAllDropdowns)
})
</script>



<style scoped>
.board-list-wrapper {
  padding: 24px;
}

.board-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.dropdown-group {
  display: flex;
  gap: 12px;
}

.dropdown {
  position: relative;
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 6px 14px;
  font-size: 14px;
  cursor: pointer;
  backdrop-filter: blur(6px);
  transition: 0.2s ease;
  min-width: 100px;
}

.dropdown:hover {
  border-color: #ff7043;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 8px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
  z-index: 999;
  padding: 6px 0;
  animation: fadeIn 0.2s ease;
  width: 100%;
  list-style: none;
}

.dropdown-menu li {
  padding: 8px 14px;
  font-size: 14px;
  color: #333;
  cursor: pointer;
}

.dropdown-menu li:hover {
  background: #ffece5;
  color: #ff7043;
}

.board-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.board-item {
  display: flex;
  gap: 16px;
  padding: 16px;
  background: white;
  border-radius: 16px;
  border: 1px solid #f0f0f0;
  transition: all 0.2s ease;
  cursor: pointer;
}

.board-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.board-item img {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 12px;
  background: #f9f9f9;
}

.details {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.details h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 6px;
  color: #222;
}

.details p {
  font-size: 14px;
  color: #666;
}

.no-data {
  text-align: center;
  padding: 40px;
  color: #aaa;
  font-size: 15px;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
