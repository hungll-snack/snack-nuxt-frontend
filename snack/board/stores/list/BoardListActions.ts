import * as axiosUtility from "../../../utility/axiosInstance";

export const boardAction = {
    async requestBoardList(payload) {
        const { djangoAxiosInstance } = axiosUtility.createAxiosInstances();
        const { page, perPage, title, author } = payload; 

        try {
            const res = await djangoAxiosInstance.get(`/all/`, { 
                params: { page, per_page: perPage, title, author }, 
            });

            console.log("✅ Response Data:", res.data);

            // 응답 데이터 구조 반영 (List.vue에 맞게 수정)
            const { boards, total_pages, current_page } = res.data;

            console.log(`✅ boardList: ${boards}, totalPages: ${total_pages}, currentPage: ${current_page}`);

            return {
                boardList: boards || [],
                totalPages: total_pages || 0,
                currentPage: current_page || 1,
            };
        } catch (error) {
            console.error("❌ requestBoardList() 중 에러:", error);

            return {
                boardList: [],
                totalPages: 0,
                currentPage: 1,
            };
        }
    },

    // async requestCreateBoard(payload) {
    //     const { djangoAxiosInstance } = axiosUtility.createAxiosInstances();
    //     const { title, content, userToken } = payload;

    //     try {
    //         const res = await djangoAxiosInstance.post(`/create/`, { 
    //             title, content, userToken
    //         });

    //         console.log("✅ Create Board Response Data:", res.data);

    //         return res.data;
    //     } catch (error) {
    //         console.error("❌ requestCreateBoard() 중 에러:", error);
    //         throw error;
    //     }
    // },

    async requestReadBoard(boardId) {
        try {
            const { djangoAxiosInstance } = axiosUtility.createAxiosInstances();
            const res = await djangoAxiosInstance.get(`/${boardId}/`); 

            console.log(`✅ Read Board Response: ${JSON.stringify(res.data)}`);

            return res.data;
        } catch (error) {
            console.error("❌ 게시글 정보를 가져오는 데 실패했습니다:", error);
            return null;
        }
    },

    // async requestModifyBoard(boardId, boardDetails) {
    //     try {
    //         const { djangoAxiosInstance } = axiosUtility.createAxiosInstances();
    //         const response = await djangoAxiosInstance.put(`/update/${boardId}/`, { 
    //             content: boardDetails.content,
    //             userToken: boardDetails.userToken,  
    //         });

    //         console.log("✅ 게시글 수정 성공:", response.data);
    //         return response.data;
    //     } catch (error) {
    //         console.error("❌ 게시글 수정 요청 중 에러 발생:", error);
    //         throw error;
    //     }
    // },

    // async requestDeleteBoard(boardId, userToken) {
    //     try {
    //         const { djangoAxiosInstance } = axiosUtility.createAxiosInstances();
    //         const response = await djangoAxiosInstance.delete(`/delete/${boardId}/`, { 
    //             data: { userToken }
    //         });

    //         console.log("✅ 게시글 삭제 성공:", response.data);
    //         return response.data;
    //     } catch (error) {
    //         console.error("❌ 게시글 삭제 요청 중 에러 발생:", error);
    //         throw error;
    //     }
    // },
};
