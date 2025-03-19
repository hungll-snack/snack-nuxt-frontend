import * as axiosUtility from "../../../utility/axiosInstance";
import type { BoardModify } from "./BoardModifyType";
import { useBoardModifyStore } from "./BoardModifyStore"; 

export const boardModifyAction = {
  async requestModifyBoard(boardId: number, boardDetails: BoardModify) {
    const store = useBoardModifyStore(); 

    try {
      const { djangoAxiosInstance } = axiosUtility.createAxiosInstances();
      store.isLoading = true; 

      const res = await djangoAxiosInstance.put(`board/update/${boardId}/`, {
        user_id: boardDetails.user_id,
        title: boardDetails.title,
        content: boardDetails.content,
        image: boardDetails.image,
        end_time: boardDetails.end_time,
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
