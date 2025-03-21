import * as axiosUtility from "../../../utility/axiosInstance";
import { useBoardDeleteStore } from "./BoardDeleteStore";

export const boardDeleteAction = {
    async requestDeleteBoard(boardId: number, userId: number) {
        const store = useBoardDeleteStore();
      
        try {
          const { djangoAxiosInstance } = axiosUtility.createAxiosInstances();
          store.isDeleting = true;
      
          const response = await djangoAxiosInstance.delete(`board/delete/${boardId}/`, { 
            data: { user_id: userId } // 
          });
      
          console.log("✅ 게시글 삭제 성공:", response.data);
          store.isDeleteSuccess = true;
          store.deleteError = null;
        } catch (error) {
          console.error("❌ 게시글 삭제 요청 중 에러 발생:", error);
          store.isDeleteSuccess = false;
          store.deleteError = "게시글 삭제 실패";
          throw error;
        } finally {
          store.isDeleting = false;
        }
      }
    }      