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
        this.comments.push(newComment);
      } catch (error) {
        console.error("댓글 등록 실패:", error);
      }
    },

    async removeComment(commentId: number) {
      try {
        const success = await useCommentActions().deleteComment(commentId);
        if (success) {
          const target = this.comments.find(c => c.comment_id === commentId);
          if (target) target.content = "메세지가 삭제되었습니다.";
          if (target) target.is_deleted = true;
        }
      } catch (error) {
        console.error("댓글 삭제 실패:", error);
      }
    }
  }
});