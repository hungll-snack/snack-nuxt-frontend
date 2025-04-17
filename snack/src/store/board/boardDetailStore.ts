import { defineStore } from 'pinia'
import { boardDetailRepository } from '@/repository/board/boardDetailRepository'

interface BoardDetail {
  board_id: number
  title: string
  content: string
  author_nickname: string
  created_at: string
  end_time: string
  image_url?: string
  status: string
}

interface BoardDetailState {
  board: BoardDetail | null
  isLoading: boolean
  errorMessage: string | null
}

export const useBoardDetailStore = defineStore('boardDetailStore', {
  state: (): BoardDetailState => ({
    board: null,
    isLoading: false,
    errorMessage: null,
  }),
  actions: {
    async requestDetailBoard(boardId: number) {
      this.isLoading = true
      this.errorMessage = null
      try {
        const data = await boardDetailRepository.getBoardDetail(boardId)
        this.board = data
      } catch (err) {
        this.errorMessage = '게시글을 불러오는 데 실패했습니다.'
      } finally {
        this.isLoading = false
      }
    },
  },
})
