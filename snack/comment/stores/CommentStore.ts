import { defineStore } from "pinia";
import { commentState } from "./CommentState";
import { useCommentActions } from "./CommentActions";

export const useCommentStore = defineStore("commentStore", {
  state: commentState,
  actions: {
    async loadComments(boardId: number) {
      this.isLoading = true;
      try {
        this.comments = await useCommentActions().fetchCommentsByBoard(boardId);
        this.isSuccess = true;
      } catch (error) {
        this.errorMessage = "댓글 불러오기 실패";
        this.isSuccess = false;
      } finally {
        this.isLoading = false;
      }
    },

    async addComment(payload: { board_id: number; content: string }) {
      try {
        const newComment = await useCommentActions().createComment(payload);
        await this.loadComments(payload.board_id); // 트리 구조 위해 전체 리로드
      } catch (error) {
        console.error("댓글 등록 실패:", error);
      }
    },

    async addReply(payload: { board_id: number; content: string; parent_id: number }) {
      try {
        const newReply = await useCommentActions().createReply(payload);
        await this.loadComments(payload.board_id); // 대댓글도 트리 갱신 위해 전체 fetch
      } catch (error) {
        console.error("답글 등록 실패:", error);
      }
    },

    async removeComment(commentId: number) {
      try {
        const success = await useCommentActions().deleteComment(commentId);
        if (success) {
          this.comments = this.comments.map(c =>
            c.comment_id === commentId
              ? { ...c, content: "메세지가 삭제되었습니다.", is_deleted: true }
              : c
          );
        }
      } catch (error) {
        console.error("댓글 삭제 실패:", error);
      }
    }
  }
});
