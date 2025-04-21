import { createAxiosInstance } from '@/common/utils/axiosInstance'

export const boardDetailRepository = {
  async getBoardDetail(boardId: number) {
    const token = localStorage.getItem('userToken') || ''
    const accountId = localStorage.getItem('account_id') || ''
    const axios = createAxiosInstance(token, accountId)

    const { data } = await axios.get(`board/${boardId}`)
    console.log('📥 boardDetail 응답:', data)

    return data
  },
}
