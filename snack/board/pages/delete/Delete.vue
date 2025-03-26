<template>
  <v-btn color="error" icon @click="deleteBoard">
    <v-icon>mdi-delete</v-icon>
  </v-btn>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import { useBoardDeleteStore } from '~/board/stores/delete/BoardDeleteStore';

const props = defineProps<{ boardId: number }>();
const store = useBoardDeleteStore();

const deleteBoard = async () => {
  const userId = localStorage.getItem("account_id");
  if (!userId) {
    alert("로그인이 필요합니다.");
    return;
  }

  try {
    const confirmed = confirm("삭제하시겠습니까?");
    if (!confirmed) return;

    await store.requestDeleteBoard(props.boardId, Number(userId));
    alert("삭제되었습니다.");
    window.location.reload();
  } catch (error) {
    console.error("❌ 삭제 실패", error);
    alert("삭제 중 오류 발생");
  }
};
</script>
