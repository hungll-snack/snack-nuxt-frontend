import { djangoAxiosInstance } from "~/utility/axiosInstance";
import type { Comment } from "./CommentType";

export const useCommentActions = () => {
  const fetchCommentsByBoard = async (boardId: number): Promise<Comment[]> => {
    const response = await djangoAxiosInstance?.get(`/comment/board/${boardId}/`);
    return response?.data.comments || [];
  };

  const createComment = async (payload: { board_id: number; content: string }): Promise<Comment> => {
    const response = await djangoAxiosInstance?.post(`/comment/create/`, payload);
    return response?.data;
  };

  const deleteComment = async (commentId: number): Promise<boolean> => {
    const response = await djangoAxiosInstance?.delete(`/comment/delete/${commentId}/`);
    return response?.data.success === true;
  };

  return { fetchCommentsByBoard, createComment, deleteComment };
};