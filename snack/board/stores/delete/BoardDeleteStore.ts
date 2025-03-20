import { defineStore } from "pinia";
import { boardDeleteState } from "./BoardDeleteState";
import { boardDeleteAction } from "./BoardDeleteActions";

export const useBoardDeleteStore = defineStore("boardDeleteStore", {
  state: boardDeleteState,
  actions: {
    async requestDeleteBoard(boardId: number, userId: string) {
      return await boardDeleteAction.requestDeleteBoard(boardId, userId);
    }
  },
});
