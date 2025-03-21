import * as axiosUtility from "../../../utility/axiosInstance";

export const boardAction = { // ✅ `export const` 확인
    async requestCreateBoard(payload) {
        const { djangoAxiosInstance } = axiosUtility.createAxiosInstances();

        if (!payload.title || !payload.author_id) {
            console.error("❌ 필수 필드 누락: 제목과 author_id는 필수입니다.");
            throw new Error("제목과 로그인은 필수 입력값입니다.");
        }

        const { title, content = "", author_id, image, end_time, restaurant_id } = payload;

        console.log("🟢 author_id 값:", author_id.value);
        console.log("🟢 title 값:", title.value);
        console.log("🟢 content 값:", content.value);
        console.log("🟢 end_time 값:", selectedDate.value);

        const formData = new FormData();
        formData.append('title', title.value);
        formData.append('content', content.value);
        formData.append('author_id', author_id.value);
        formData.append('end_time', selectedDate.value);

        console.log("🟢 formData 확인:", Object.fromEntries(formData.entries()));


        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("content", content);
            formData.append("author_id", author_id);
            formData.append("end_time", end_time || new Date().toISOString().substr(0, 10));

            if (image) formData.append("image", image);
            if (restaurant_id) formData.append("restaurant_id", restaurant_id);

            console.log("📤 게시글 생성 요청 데이터:", Object.fromEntries(formData.entries()));

            const res = await djangoAxiosInstance.post(`/board/create/`, formData);

            console.log("✅ 게시글 생성 성공:", res.data);
            return res.data;
        } catch (error) {
            console.error("❌ requestCreateBoard() 중 에러:", error.response ? error.response.data : error.message);
            throw error;
        }
    },
};
