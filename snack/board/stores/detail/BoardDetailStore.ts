import { defineStore } from "pinia";
import { boardDetailState } from "./BoardDetailState";
import { useBoardDeleteActions } from "./BoardDetailActions";

export const useBoardDetailStore = defineStore("boardDetailStore", {
  state: boardDetailState,
  actions: {
    async requestDetailBoard(boardId: number) {
      return await useBoardDeleteActions.requestDeleteBoard(boardId);
    }
  },
});
