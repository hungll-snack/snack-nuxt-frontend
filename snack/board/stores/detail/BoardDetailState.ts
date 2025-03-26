import type { BoardDetail } from "./BoardDetailType"; 


export const boardDetailState = () => ({
    board: null as BoardDetail | null, 
    isLoading: false, 
    isSuccess: false, 
    errorMessage: null as string | null, 
  });
  