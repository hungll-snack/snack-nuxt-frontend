interface BoardModifyPayload {
    board_id: number
    title: string
    content: string
    end_time: string
    restaurant_id?: number
    image?: File | string | null
  }
  
  export const boardModifyRepository = {
    async requestUpdateBoard(payload: BoardModifyPayload) {
      if (!payload.board_id || !payload.title || !payload.content || !payload.end_time) {
        throw new Error('필수 항목이 누락되었습니다.')
      }
  
      const formData = new FormData()
      formData.append('title', payload.title)
      formData.append('content', payload.content)
      formData.append('end_time', payload.end_time)
  
      if (payload.restaurant_id) {
        formData.append('restaurant', String(payload.restaurant_id))
      }
  
      if (typeof payload.image === 'string') {
        // 기존 이미지 유지 (전송 안 함)
      } else if (payload.image instanceof File) {
        formData.append('image', payload.image)
      } else if (payload.image === null) {
        formData.append('image', '')
      }
  
      formData.append('_method', 'PUT')
  
      try {
        // ✅ 여기서 동적 import로 axios 인스턴스 가져오기
        const { createAxiosInstance } = await import('@/common/utils/axiosInstance')
        const token = localStorage.getItem('userToken') || ''
        const accountId = localStorage.getItem('account_id') || ''
        const axios = createAxiosInstance(token, accountId)
  
        const res = await axios.put(`/board/update/${payload.board_id}`, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`,
            'Content-Type': undefined,
          },
        })
  
        return res.data
  
      } catch (error: any) {
        console.error('❌ 게시글 수정 실패:', error.response?.data || error.message)
        throw error
      }
    }
  }
  