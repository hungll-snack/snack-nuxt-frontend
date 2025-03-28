<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useBoardStore } from '~/board/stores/list/BoardListStore';
import { useBoardDeleteStore } from '~/board/stores/delete/BoardDeleteStore';
import { useAccountStore } from '~/account/stores/accountStore';

const router = useRouter();
const boardStore = useBoardStore();
const deleteStore = useBoardDeleteStore();
const accountStore = useAccountStore();

const searchTitle = ref('');
const searchAuthor = ref('');
const s_date = ref('');
const e_date = ref('');
const menu1 = ref(false);
const menu2 = ref(false);
const sortOrder = ref('최신순');
const statusFilter = ref('전체');

const boardList = computed(() => boardStore.boardList || []);

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
  const userId = accountStore.accountProfile?.account_id || Number(localStorage.getItem("account_id"));

  if (!userId) {
    alert('로그인이 필요합니다.');
    return;
  }

  const confirmed = confirm('정말 삭제하시겠습니까?');
  if (!confirmed) return;

  try {
    await deleteStore.requestDeleteBoard(Number(boardId), userId);
    await fetchBoardList();
  } catch (error) {
    console.error('❌ 삭제 실패:', error);
    alert('삭제 중 오류가 발생했습니다.');
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

onMounted(async () => {
  console.log('🌀 onMounted 진입');

  const userToken = localStorage.getItem("userToken");

  if (userToken && accountStore.accountProfile?.account_id) {
    console.log('✅ 로그인 상태, 프로필 정보 요청');
    await accountStore.getProfile();
  } else {
    console.log('⛔ 비로그인 상태 or 프로필 이미 존재');
  }

  console.log('📌 accountProfile:', accountStore.accountProfile);
  await fetchBoardList();
});

</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="3">
        <v-card class="pa-4">
          <v-card-title class="text-h6">맛모임 검색</v-card-title>

          <v-text-field
            v-model="searchTitle"
            label="제목 검색"
            outlined dense hide-details
            append-inner-icon="mdi-magnify"
            @click:append-inner="fetchBoardList"
          />
          <v-text-field
            v-model="searchAuthor"
            label="작성자 검색"
            outlined dense hide-details
            append-inner-icon="mdi-magnify"
            @click:append-inner="fetchBoardList"
          />

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
              <v-date-picker v-model="s_date" @input="menu1 = false" />
            </v-dialog>
            <v-text-field
              label="종료 날짜"
              prepend-icon="mdi-calendar"
              readonly
              :value="e_date"
              @click="menu2 = true"
            />
            <v-dialog v-model="menu2" width="290px">
              <v-date-picker v-model="e_date" @input="menu2 = false" />
            </v-dialog>

            <v-btn color="primary" block class="mt-2" @click="fetchBoardList">
              <v-icon left>mdi-magnify</v-icon> 검색
            </v-btn>
            <v-btn color="grey" block class="mt-2" @click="resetDateFilter">초기화</v-btn>
          </v-card>

          <v-btn color="primary" block class="mt-2" @click="router.push('/board/create')">모임 등록</v-btn>
        </v-card>
      </v-col>

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

                <v-list-item-action>
                  <span class="text-grey">{{ board.author_nickname }}</span>
                </v-list-item-action>

                <!-- 삭제 버튼 조건: 로그인된 본인만 노출 -->
                <v-list-item-action
                  v-if="board.author_id === accountStore.accountProfile?.account_id"
                  class="d-flex flex-column align-end mr-4"
                >
                  <v-btn color="red darken-1" x-small @click.stop="deleteBoard(board.board_id)">
                    삭제
                  </v-btn>
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

<style scoped>
.clickable {
  cursor: pointer;
}
.greyed-out {
  filter: grayscale(100%);
  opacity: 0.7;
}
</style>
