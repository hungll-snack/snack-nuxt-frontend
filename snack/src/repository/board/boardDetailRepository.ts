import { createAxiosInstance } from '@/common/utils/axiosInstance'

export const boardDetailRepository = {
  async getBoardDetail(boardId: number) {
    try {
      const token = localStorage.getItem('userToken') || ''
      const accountId = localStorage.getItem('account_id') || ''
      const axios = createAxiosInstance(token, accountId)

      const { data } = await axios.get(`/board/${boardId}`)
      console.log('📥 boardDetail 응답:', data)
      return data
    } catch (error: any) {
      console.error('❌ 게시글 상세 요청 실패:', error)
      throw new Error(error?.response?.data?.error || '게시글 정보를 불러오지 못했습니다.')
    }
  },
}
