<template>
    <v-container>
        <v-row>
            <!-- 검색 필터 -->
            <v-col cols="12" md="3">
                <v-card class="pa-4">
                    <v-card-title class="text-h6">맛모임 검색</v-card-title>
                    
                    <!-- 제목 검색 -->
                    <v-text-field
                        v-model="searchTitle"
                        label="제목 검색"
                        outlined
                        dense
                        hide-details
                        append-inner-icon="mdi-magnify"
                        @click:append-inner="fetchBoardListByTitle"
                    />
                    
                    <!-- 작성자 검색 -->
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

                        <!-- 시작 날짜 -->
                        <v-text-field
                            v-model="s_date"
                            label="시작 날짜"
                            prepend-icon="mdi-calendar"
                            readonly
                            @click="menu1 = true"
                        ></v-text-field>

                        <!-- 종료 날짜 -->
                        <v-text-field
                            v-model="e_date"
                            label="종료 날짜"
                            prepend-icon="mdi-calendar"
                            readonly
                            @click="menu2 = true"
                        ></v-text-field>

                        <!-- 시작 날짜 달력 -->
                        <v-dialog v-model="menu1" width="340px">
                            <v-card>
                                <v-card-title class="d-flex justify-space-between">
                                    시작 날짜 선택
                                    <v-btn icon @click="menu1 = false">
                                        <v-icon>mdi-close</v-icon>
                                    </v-btn>
                                </v-card-title>
                                <v-date-picker v-model="s_date" :max="e_date"></v-date-picker>
                                <v-card-actions>
                                    <v-btn color="primary" block @click="menu1 = false">확인</v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>

                        <!-- 종료 날짜 달력 -->
                        <v-dialog v-model="menu2" width="340px">
                            <v-card>
                                <v-card-title class="d-flex justify-space-between">
                                    종료 날짜 선택
                                    <v-btn icon @click="menu2 = false">
                                        <v-icon>mdi-close</v-icon>
                                    </v-btn>
                                </v-card-title>
                                <v-date-picker v-model="e_date" :min="s_date"></v-date-picker>
                                <v-card-actions>
                                    <v-btn color="primary" block @click="menu2 = false">확인</v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>

                        <!-- 검색 버튼 -->
                        <v-btn color="primary" block class="mt-2" @click="fetchBoardListByDate">
                            <v-icon left>mdi-magnify</v-icon> 검색
                        </v-btn>

                        <!-- 초기화 버튼 -->
                        <v-btn color="grey" block class="mt-2" @click="resetDateFilter">
                            초기화
                        </v-btn>
                    </v-card>

                    <!-- 모임 등록 버튼 -->
                    <v-btn color="primary" block class="mt-2" @click="router.push('/board/create')">모임 등록</v-btn>
                </v-card>
            </v-col>

            <!-- 게시글 리스트 -->
            <v-col cols="12" md="9">
                <v-card>
                    <v-card-title>보드 리스트 UI</v-card-title>
                    <v-card-text>
                        <div v-if="boardList.length === 0">
                            <v-alert type="info">
                                등록한 게시글이 없습니다.
                                <v-btn color="primary" small class="ml-2" @click="router.push('/board/create')">
                                    모임 등록하기
                                </v-btn>
                            </v-alert>
                        </div>

                        <v-list v-else>
                            <v-list-item
                                v-for="board in boardList"
                                :key="board.boardId"
                                @click="goToDetail(board.boardId)"
                                class="clickable"
                            >
                                <v-list-item-avatar>
                                    <v-img :src="board.image"></v-img>
                                </v-list-item-avatar>
                                <v-list-item-content>
                                    <v-list-item-title>
                                        ⭐<strong>{{ board.title }}</strong>⭐
                                    </v-list-item-title>
                                    <v-list-item-subtitle>
                                        <span :class="{ 'text-grey': !board.active }">{{ board.status }}</span>
                                        | {{ formatDate(board.createDate) }} | {{ board.time }}
                                    </v-list-item-subtitle>
                                </v-list-item-content>
                                <v-list-item-action>
                                    <span class="text-grey">{{ board.nickname }}</span>
                                </v-list-item-action>
                            </v-list-item>
                        </v-list>

                        <v-pagination v-model="currentPage" :length="totalPages" class="mt-3"></v-pagination>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useBoardStore } from '~/board/stores/list/BoardListStore'; 

const router = useRouter();
const boardStore = useBoardStore();

const searchTitle = ref('');
const searchAuthor = ref('');
const date = ref(new Date().toISOString().substr(0, 10));  // 오늘 날짜
const s_date = ref(new Date().toISOString().substr(0, 10));  // 시작 날짜
const e_date = ref(new Date().toISOString().substr(0, 10));  // 종료 날짜
const menu1 = ref(false);
const menu2 = ref(false);

const boardList = computed(() => boardStore.boardList);
const currentPage = computed({
    get: () => boardStore.currentPage,
    set: (page) => {
        boardStore.currentPage = page;
    },
});
const totalPages = computed(() => boardStore.totalPages);

// 제목 검색 실행
const fetchBoardListByTitle = async () => {
    boardStore.currentPage = 1;
    await boardStore.requestBoardList({
        page: boardStore.currentPage,
        perPage: 10,
        title: searchTitle.value,
    });
};

// 작성자 검색 실행
const fetchBoardListByAuthor = async () => {
    boardStore.currentPage = 1;
    await boardStore.requestBoardList({
        page: boardStore.currentPage,
        perPage: 10,
        author: searchAuthor.value,
    });
};

// 날짜 검색 실행
const fetchBoardListByDate = async () => {
    await boardStore.requestBoardList({
        page: boardStore.currentPage,
        perPage: 10,
        start_date: s_date.value,
        end_date: e_date.value,
    });
};

// 검색 초기화
const resetDateFilter = () => {
    s_date.value = date.value;
    e_date.value = date.value;
};

onMounted(() => fetchBoardListByTitle());

watch(currentPage, fetchBoardListByTitle);
</script>

<style scoped>
.clickable {
    cursor: pointer;
}
</style>
