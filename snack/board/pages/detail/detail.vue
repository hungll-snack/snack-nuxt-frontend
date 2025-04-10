<template>
  <v-container>
    <v-row>
      <!-- 왼쪽: 썸네일 및 기본 정보 -->
      <v-col cols="12" md="4">
        <v-card class="pa-4">
          <v-img :src="boardStore.board?.image_url" class="thumbnail-preview" />

          <v-list>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title class="text-subtitle-1 font-weight-bold">✨ 모임 제목</v-list-item-title>
                <v-list-item-subtitle class="text-h6 orange--text">{{ boardStore.board?.title }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-list-item>
              <v-list-item-content>
                <v-list-item-title class="text-subtitle-1 font-weight-bold">📅 모임 날짜</v-list-item-title>
                <v-list-item-subtitle>{{ formattedDate }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-list-item>
              <v-list-item-content>
                <v-list-item-title class="text-subtitle-1 font-weight-bold">📍 맛집 장소</v-list-item-title>
                <v-list-item-subtitle>{{ boardStore.board?.restaurant }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>

          <v-btn v-if="boardStore.board?.is_author" color="primary" class="mt-4" @click="goToModify">
            ✏️ 수정
          </v-btn>

          <v-btn class="mt-2" color="grey" @click="router.back()">⬅️ 이전 페이지</v-btn>
        </v-card>
      </v-col>

      <!-- 가운데: 소개 내용 -->
      <v-col cols="12" md="4">
        <v-card class="pa-4">
          <v-card-title class="text-h5 font-weight-bold">모임 소개</v-card-title>
          <v-card-text>{{ boardStore.board?.content }}</v-card-text>
        </v-card>
      </v-col>

      <!-- 오른쪽: 댓글 -->
      <v-col cols="12" md="4">
        <v-card class="pa-4" style="height: 100%; overflow-y: auto;">
          <v-card-title class="text-h6 font-weight-bold">💬 댓글</v-card-title>

          <!-- 댓글 입력 -->
          <v-textarea v-model="newComment" label="댓글을 입력해주세요" outlined dense rows="2" />
          <v-btn color="orange" class="mt-2" @click="submitComment">등록</v-btn>

          <v-divider class="my-4" />

          <!-- 댓글 목록 -->
          <v-list v-if="comments.length">
            <v-list-item
              v-for="comment in comments"
              :key="comment.comment_id"
              class="d-flex justify-space-between"
            >
              <v-list-item-content>
                <div class="d-flex flex-column">
                  <span class="font-weight-bold text-orange">{{ comment.author_nickname }}</span>
                  <span class="grey--text text--darken-1 text-sm">{{ comment.created_at }}</span>
                  <span v-if="comment.deleted" class="grey--text mt-1 font-italic">메세지가 삭제되었습니다</span>
                  <span v-else class="mt-1">{{ comment.content }}</span>
                </div>
              </v-list-item-content>

              <v-btn
                icon
                v-if="comment.is_author && !comment.deleted"
                @click="deleteComment(comment.comment_id)"
              >
                <v-icon color="red">mdi-delete</v-icon>
              </v-btn>
            </v-list-item>
          </v-list>

          <p v-else class="grey--text">댓글이 없습니다.</p>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useBoardDetailStore } from '~/board/stores/detail/BoardDetailStore';
import * as axiosUtility from '~/utility/axiosInstance';

const route = useRoute();
const router = useRouter();
const boardStore = useBoardDetailStore();
const boardId = route.params.id;

const newComment = ref('');
const comments = ref([]);

// 게시글 불러오기
onMounted(async () => {
  await boardStore.requestDetailBoard(Number(boardId));
  await fetchComments();
});

const formattedDate = computed(() => {
  const dateStr = boardStore.board?.end_time;
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
});

const goToModify = () => {
  router.push(`/board/modify/${boardId}`);
};

const fetchComments = async () => {
  try {
    const { djangoAxiosInstance } = axiosUtility.createAxiosInstances();
    const res = await djangoAxiosInstance.get(`/comment/board/${boardId}/`);
    comments.value = res.data.comments.map(comment => ({
      ...comment,
      deleted: comment.content === null,
      is_author: checkIfCommentAuthor(comment),
    }));
  } catch (error) {
    console.error('❌ 댓글 조회 실패:', error);
  }
};

const submitComment = async () => {
  const token = localStorage.getItem('userToken');
  const account_id = localStorage.getItem('account_id');

  if (!newComment.value.trim()) return;
  if (!token || !account_id) {
    alert('로그인 후 이용해주세요');
    return;
  }

  try {
    const { djangoAxiosInstance } = axiosUtility.createAxiosInstances();
    await djangoAxiosInstance.post('/comment/create/', {
      board_id: boardId,
      author_id: Number(account_id),
      content: newComment.value,
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    newComment.value = '';
    await fetchComments();
  } catch (error) {
    console.error('❌ 댓글 등록 실패:', error);
  }
};

const deleteComment = async (commentId) => {
  const token = localStorage.getItem('userToken');
  const account_id = localStorage.getItem('account_id');

  try {
    const { djangoAxiosInstance } = axiosUtility.createAxiosInstances();
    await djangoAxiosInstance.delete(`/comment/delete/${commentId}/`, {
      data: { user_id: Number(account_id) },
      headers: { Authorization: `Bearer ${token}` },
    });

    await fetchComments();
  } catch (error) {
    console.error('❌ 댓글 삭제 실패:', error);
  }
};

const checkIfCommentAuthor = (comment) => {
  const account_id = localStorage.getItem('account_id');
  return Number(account_id) === comment.author_account_id;
};
</script>

<style scoped>
.thumbnail-preview {
  width: 100%;
  height: 200px;
  object-fit: cover;
}
</style>
