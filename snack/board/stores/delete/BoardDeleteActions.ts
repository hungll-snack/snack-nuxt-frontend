import * as axiosUtility from "../../../utility/axiosInstance";
import { useBoardDeleteStore } from "./BoardDeleteStore";

export const boardDeleteAction = {
    async requestDeleteBoard(boardId: number, passedUserId?: number) {
        const store = useBoardDeleteStore();
        const userId = passedUserId || Number(localStorage.getItem("account_id"));
      
        try {
            if (!userId) {
              console.error("❌ 사용자 정보 누락 (user_id)");
              throw new Error("삭제 요청에 사용자 정보가 필요합니다.");
            }
      
            const { djangoAxiosInstance } = axiosUtility.createAxiosInstances();
            store.isDeleting = true;
      
            const response = await djangoAxiosInstance.delete(`board/delete/${boardId}/`, {
              data: { user_id: userId },
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