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
          <v-btn v-if="boardStore.board?.is_author" color="primary" class="mt-4" @click="goToModify">✏️ 수정</v-btn>
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

      <!-- 오른쪽: 댓글 영역 -->
      <v-col cols="12" md="4">
        <v-card class="pa-4 comment-box">
          <v-card-title class="text-h6 font-weight-bold">💬 댓글</v-card-title>

          <v-textarea
            v-model="newComment"
            label="댓글을 입력해주세요"
            outlined
            dense
            rows="2"
            class="text-sm"
          />
          <div class="d-flex justify-end">
            <v-btn color="orange" size="x-small" variant="text" @click="submitComment">등록</v-btn>
          </div>

          <v-divider class="my-3" />

          <v-list v-if="groupedComments.length">
            <Comment
              v-for="comment in groupedComments"
              :key="comment.comment_id"
              :comment="comment"
              :level="0"
              @delete="deleteComment"
              @like="toggleLike"
              @reply="submitReply"
            />
          </v-list>
          <p v-else class="grey--text">댓글이 없습니다.</p>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useBoardDetailStore } from '~/board/stores/detail/BoardDetailStore';
import * as axiosUtility from '~/utility/axiosInstance';
import Comment from '~/comment/pages/Comment.vue';

const route = useRoute();
const router = useRouter();
const boardStore = useBoardDetailStore();
const boardId = route.params.id;

const newComment = ref('');
const comments = ref([]);
const accountId = Number(localStorage.getItem('account_id'));
const token = localStorage.getItem('userToken');

// ✅ 대댓글 트리 구성 함수
function buildCommentTree(flatComments) {
  const map = {};
  const tree = [];

  flatComments.forEach(c => {
    c.children = [];
    c.is_author = c.author_account_id === accountId;
    map[c.comment_id] = c;
  });

  flatComments.forEach(c => {
    if (c.parent_id) {
      map[c.parent_id]?.children.push(c);
    } else {
      tree.push(c);
    }
  });

  return tree;
}

// ✅ 댓글 가져오기
const fetchComments = async () => {
  try {
    const { djangoAxiosInstance } = axiosUtility.createAxiosInstances();
    const res = await djangoAxiosInstance.get(`/comment/board/${boardId}/`);
    const flat = res.data.comments;
    comments.value = buildCommentTree(flat);
  } catch (err) {
    console.error('❌ 댓글 조회 실패:', err);
  }
};

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

const goToModify = () => router.push(`/board/modify/${boardId}`);

const groupedComments = computed(() => comments.value);

// ✅ 댓글 등록
const submitComment = async () => {
  if (!newComment.value.trim() || !token || !accountId) return;
  try {
    const { djangoAxiosInstance } = axiosUtility.createAxiosInstances();
    await djangoAxiosInstance.post('/comment/create/', {
      board_id: boardId,
      author_id: accountId,
      content: newComment.value,
    }, { headers: { Authorization: `Bearer ${token}` } });

    newComment.value = '';
    await fetchComments();
  } catch (error) {
    console.error('❌ 댓글 등록 실패:', error);
  }
};

// ✅ 대댓글 등록
const submitReply = async ({ parentId, content }) => {
  if (!content.trim() || !token || !accountId) return;
  try {
    const { djangoAxiosInstance } = axiosUtility.createAxiosInstances();
    await djangoAxiosInstance.post('/comment/createReply/', {
      board_id: boardId,
      author_id: accountId,
      content,
      parent_id: parentId
    }, { headers: { Authorization: `Bearer ${token}` } });

    await fetchComments();
  } catch (error) {
    console.error('❌ 대댓글 등록 실패:', error);
  }
};

// ✅ 댓글 삭제
const deleteComment = async (commentId) => {
  if (!confirm('정말로 삭제하시겠습니까?')) return;
  try {
    const { djangoAxiosInstance } = axiosUtility.createAxiosInstances();
    await djangoAxiosInstance.delete(`/comment/delete/${commentId}/`, {
      data: { user_id: accountId },
      headers: { Authorization: `Bearer ${token}` },
    });

    await fetchComments();
  } catch (error) {
    console.error('❌ 댓글 삭제 실패:', error);
  }
};

// ✅ 좋아요 토글 (추후 서버 연동 필요 시 POST /comment/like/)
const toggleLike = async (commentId) => {
  try {
    // 예: await axios.post('/comment/like/', { comment_id, user_id });
    console.log('좋아요 토글:', commentId);
    // 서버 동기화 후 다시 fetch
    await fetchComments();
  } catch (err) {
    console.error('❌ 좋아요 실패:', err);
  }
};
</script>
