import { defineStore } from "pinia";
import { boardState } from "./BoardLisState";
import { boardAction } from "./BoardListActions";

export const useBoardStore = defineStore("boardStore", {
    state: () => ({ ...boardState }), // ✅ 객체를 spread하여 상태 복사
    actions: {
        async requestBoardList(payload: { page: number; perPage: number; title?: string; author?: string }) {
            const response = await boardAction.requestBoardList(payload);

            this.boardList = response.boardList;
            this.currentPage = response.currentPage;
            this.totalPages = response.totalPages;
        },

        async requestCreateBoard(payload: { title: string; content: string; userToken: string }) {
            return await boardAction.requestCreateBoard(payload);
        },

        async requestReadBoard(boardId: number | string) {
            return await boardAction.requestReadBoard(boardId);
        },

        async requestModifyBoard(boardId: number | string, boardDetails: { title: string; content: string; userToken: string }) {
            return await boardAction.requestModifyBoard(boardId, boardDetails);
        },

        async requestDeleteBoard(boardId: number | string, userToken: string) {
            return await boardAction.requestDeleteBoard(boardId, userToken);
        },
    },
});
