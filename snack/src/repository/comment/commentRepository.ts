import { createAxiosInstance } from '@/common/utils/axiosInstance'

const getAxios = () => {
  const token = process.client ? localStorage.getItem('userToken') || '' : ''
  const accountId = process.client ? localStorage.getItem('account_id') || '' : ''
  return createAxiosInstance(token, accountId)
}

export const commentRepository = {

  async fetchCommentsByBoard(boardId: number, page = 1) {
    const response = await getAxios().get(`/comment/board/${boardId}/?page=${page}&page_size=10`)
    return {
      comments: response.data?.comments || [],
      total: response.data?.total || 0,
    }
  },

  async createComment(payload: { board_id: number; content: string; author_id: number }) {
    const response = await getAxios().post('/comment/create/', payload)
    return response.data
  },

  async createReply(payload: { board_id: number; content: string; parent_id: number; author_id: number }) {
    const response = await getAxios().post('/comment/reply/', payload)
    return response.data
  },

  async deleteComment(commentId: number) {
    const response = await getAxios().delete(`/comment/delete/${commentId}/`)
    return response.data?.success === true
  },

  async updateComment(commentId: number, content: string) {
    const response = await getAxios().put(`/comment/update/${commentId}/`, { content })
    return response.data?.success === true
  },
}
