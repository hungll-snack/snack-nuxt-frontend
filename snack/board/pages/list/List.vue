<template>
    <v-container>
      <v-row>
        <!-- 검색 필터 -->
        <v-col cols="12" md="3">
          <v-card class="pa-4">
            <v-card-title class="text-h6">맛모임 검색</v-card-title>
  
            <v-text-field
              v-model="searchTitle"
              label="제목 검색"
              outlined
              dense
              hide-details
              append-inner-icon="mdi-magnify"
              @click:append-inner="fetchBoardListByTitle"
            />
  
            <v-text-field
              v-model="searchAuthor"
              label="작성자 검색"
              outlined
              dense
              hide-details
              append-inner-icon="mdi-magnify"
              @click:append-inner="fetchBoardListByAuthor"
            />
  
            <!-- 날짜 검색 -->
            <v-card class="mt-3 pa-2">
              <v-card-title class="text-subtitle1">날짜 검색</v-card-title>
  
              <v-text-field
                label="시작 날짜"
                prepend-icon="mdi-calendar"
                readonly
                :value="s_date"
                @click="menu1 = true"
              />
  
              <v-dialog v-model="menu1" width="290px">
                <v-date-picker
                  v-model="s_date"
                  @input="menu1 = false"
                ></v-date-picker>
              </v-dialog>
  
              <v-text-field
                label="종료 날짜"
                prepend-icon="mdi-calendar"
                readonly
                :value="e_date"
                @click="menu2 = true"
              />
  
              <v-dialog v-model="menu2" width="290px">
                <v-date-picker
                  v-model="e_date"
                  @input="menu2 = false"
                ></v-date-picker>
              </v-dialog>
  
              <v-btn color="primary" block class="mt-2" @click="fetchBoardListByDate">
                <v-icon left>mdi-magnify</v-icon> 검색
              </v-btn>
  
              <v-btn color="grey" block class="mt-2" @click="resetDateFilter">
                초기화
              </v-btn>
            </v-card>
  
            <v-btn color="primary" block class="mt-2" @click="router.push('/board/create')">
              모임 등록
            </v-btn>
          </v-card>
        </v-col>
  
        <!-- 게시글 리스트 -->
        <v-col cols="12" md="9">
        <v-card>
          <v-card-title class="d-flex justify-space-between align-center">
            <span>보드 리스트 UI</span>
            <div class="d-flex align-center gap-2">
              <v-select
                v-model="statusFilter"
                :items="['전체', '모집중', '모집종료']"
                dense hide-details outlined style="max-width: 120px"
              />
              <v-select
                v-model="sortOrder"
                :items="['최신순', '마감순']"
                dense hide-details outlined style="max-width: 120px"
              />
            </div>
          </v-card-title>
          <v-card-text>
            <v-alert v-if="boardList.length === 0" type="info">게시글이 없습니다.</v-alert>

            <v-list v-else>
              <v-list-item
                v-for="board in filteredAndSortedBoards"
                :key="board.board_id"
                @click="goToDetail(board.board_id)"
                class="clickable"
                :class="{ 'greyed-out': isClosed(board.end_time) }"
              >
                <v-list-item-avatar>
                  <v-img :src="board.image_url || '/default-thumbnail.jpg'" cover height="80" width="80" />
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title>
                    ⭐<strong>{{ board.title }}</strong>⭐
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    <span :style="{ color: isClosed(board.end_time) ? 'red' : 'green' }">
                      {{ isClosed(board.end_time) ? '모집종료' : '모집중' }}
                    </span>
                    | {{ formatDate(board.end_time) }} | {{ formatTime(board.end_time) }}
                  </v-list-item-subtitle>
                </v-list-item-content>

                <v-list-item-action class="d-flex flex-column align-end mr-4">
                  <v-btn color="red darken-1" x-small @click.stop="deleteBoard(board.board_id)">삭제</v-btn>
                </v-list-item-action>

                <v-list-item-action>
                  <span class="text-grey">{{ board.author_nickname }}</span>
                </v-list-item-action>
              </v-list-item>
            </v-list>

            <v-pagination v-model="currentPage" :length="totalPages" class="mt-3" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useBoardStore } from '~/board/stores/list/BoardListStore';
import { useBoardDeleteStore } from '~/board/stores/delete/BoardDeleteStore';

const router = useRouter();
const boardStore = useBoardStore();
const deleteStore = useBoardDeleteStore();

const searchTitle = ref('');
const searchAuthor = ref('');
const s_date = ref(new Date().toISOString().substr(0, 10));
const e_date = ref(new Date().toISOString().substr(0, 10));
const menu1 = ref(false);
const menu2 = ref(false);
const sortOrder = ref('최신순');
const statusFilter = ref('전체');

const boardList = computed(() => boardStore.boardList);

const isClosed = (endTime) => {
  return new Date(endTime) < new Date();
};

const filteredAndSortedBoards = computed(() => {
  let list = [...boardList.value];

  if (statusFilter.value !== '전체') {
    const statusKey = statusFilter.value === '모집중' ? false : true;
    list = list.filter(board => isClosed(board.end_time) === statusKey);
  }

  if (sortOrder.value === '최신순') {
    return list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  } else {
    return list.sort((a, b) => new Date(a.end_time) - new Date(b.end_time));
  }
});

const currentPage = computed({
  get: () => boardStore.currentPage,
  set: (page) => { boardStore.currentPage = page; },
});

const totalPages = computed(() => boardStore.totalPages);

const fetchBoardList = async () => {
  await boardStore.requestBoardList({
    page: currentPage.value,
    perPage: 10,
    title: searchTitle.value,
    author: searchAuthor.value,
    start_date: s_date.value,
    end_date: e_date.value,
  });
};

const goToDetail = (boardId) => {
  router.push(`/board/${boardId}`);
};

const deleteBoard = async (boardId) => {
  const userId = localStorage.getItem('account_id');
  try {
    await deleteStore.requestDeleteBoard(Number(boardId), Number(userId));
  } catch (error) {
    console.error("❌ 삭제 실패:", error);
  }
};



const formatDate = (datetimeStr) => {
  return datetimeStr?.split(' ')[0] || '';
};

const formatTime = (datetimeStr) => {
  const timePart = datetimeStr?.split(' ')[1] || '';
  const [hour, minute] = timePart.split(':');
  return `${parseInt(hour)}시 ${minute}분`;
};

onMounted(fetchBoardList);
watch(currentPage, fetchBoardList);
</script>

<style scoped>
.clickable {
  cursor: pointer;
}
.greyed-out {
  filter: grayscale(100%);
  opacity: 0.7;
}
</style>