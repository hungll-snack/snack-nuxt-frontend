import * as axiosUtility from "../../../utility/axiosInstance";
import type { BoardModify } from "./BoardModifyType";
import { useBoardModifyStore } from "./BoardModifyStore";

export const boardModifyAction = {
  async requestModifyBoard(boardId: number, boardDetails: BoardModify) {
    const store = useBoardModifyStore(); 

    try {
      const { djangoAxiosInstance } = axiosUtility.createAxiosInstances();
      store.isLoading = true; 

      if (!boardDetails.title?.trim() || !boardDetails.content?.trim() || !boardDetails.end_time) {
        throw new Error("제목, 내용, 종료일은 필수입니다.");
      }

      const formData = new FormData();
      formData.append("title", boardDetails.title);
      formData.append("content", boardDetails.content);
      formData.append("end_time", boardDetails.end_time);

      if (boardDetails.restaurant_id) {
        formData.append("restaurant", boardDetails.restaurant_id.toString());
      }

      if (boardDetails.image) {
        if (boardDetails.image instanceof File) {
          formData.append("image", boardDetails.image);
        } else if (boardDetails.image === null) {
          formData.append("image", "");  // ✅ 삭제 의도
        }
      }
      

      console.log("📤 수정 요청 데이터:", Object.fromEntries(formData.entries()));

      const res = await djangoAxiosInstance.put(`board/update/${boardId}/`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      });
      
      console.log("게시글 수정 성공:", res.data);

      store.board = res.data; 
      store.isSuccess = true;
      store.errorMessage = null;
    } catch (error) {
      console.error("게시글 수정 요청 중 에러 발생:", error);
      store.isSuccess = false;
      store.errorMessage = "게시글 수정 실패";
      throw error;
    } finally {
      store.isLoading = false; 
    }
  },
};