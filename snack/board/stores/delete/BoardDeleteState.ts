export const boardDeleteState = () => ({
    isDeleting: false, // 삭제 요청 진행 여부
    isDeleteSuccess: false, // 삭제 성공 여부
    deleteError: null as string | null, // 삭제 실패 시 에러 메시지
  });
  