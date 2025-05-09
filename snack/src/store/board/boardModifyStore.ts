import { defineStore } from 'pinia'
import { boardDetailRepository } from '@/repository/board/boardDetailRepository'
import { boardModifyRepository } from '@/repository/board/boardModifyRepository'

interface BoardModify {
  board_id: number | null
  title: string
  content: string
  end_time: string
  restaurant?: string
  restaurant_id?: number
  image?: File | string | null
}

interface BoardModifyState {
  board: BoardModify
  isLoading: boolean
  isSuccess: boolean
  errorMessage: string | null
}

export const useBoardModifyStore = defineStore('boardModifyStore', {
  state: (): BoardModifyState => ({
    board: {
      board_id: null,
      title: '',
      content: '',
      end_time: '',
      restaurant: '',
      restaurant_id: null,
      image: null
    },
    isLoading: false,
    isSuccess: false,
    errorMessage: null,
  }),

  actions: {
    async fetchBoard(boardId: number) {

      if (!boardId || isNaN(boardId)) {
        console.error('❌ 잘못된 boardId로 요청 시도:', boardId)
        this.errorMessage = '잘못된 게시글 ID입니다.'
        return
      }

      this.isLoading = true
      this.errorMessage = null
      this.isSuccess = false
      console.log("🔍 게시글 ID:", boardId);

      try {
        const data = await boardDetailRepository.getBoardDetail(boardId)
        console.log("🔍 가져온 데이터:", data);

        if (data && data.board_id) {
          this.board = {
            board_id: data.board_id,
            title: data.title,
            content: data.content || '',
            end_time: data.end_time,
            restaurant: data.restaurant || '',
            restaurant_id: data.restaurant_id || null,
            image: data.image_url || null
          }
          this.isSuccess = true
        } else {
          this.errorMessage = '게시글을 찾을 수 없습니다.'
        }
      } catch (err) {
        console.error('❌ 게시글 불러오기 실패:', err)
        this.errorMessage = '게시글 정보를 불러오는 데 실패했습니다.'
      } finally {
        this.isLoading = false
      }
    },

   async updateBoard() {
      const board = this.board

      if (!board.board_id) {
        alert('게시글 ID가 없습니다.')
        return false
      }

      if (!board.title?.trim() || !board.content?.trim() || !board.end_time) {
        alert('제목, 내용, 종료일은 필수입니다.')
        return false
      }

      this.isLoading = true
      this.isSuccess = false
      this.errorMessage = null

      try {
        const formData = new FormData()
        formData.append('title', board.title)
        formData.append('content', board.content)
        formData.append('end_time', board.end_time)

        if (board.restaurant_id) {
          formData.append('restaurant', board.restaurant_id.toString())
        }

        // ⭐ 이미지 처리
        if (board.image instanceof File) {
          // 새 파일이면 파일을 추가
          formData.append('image', board.image)
        } else if (typeof board.image === 'string' && board.image) {
          // 기존 이미지 URL이면 파일 안 보내고 서버가 기존 이미지 유지하도록 한다
          // 아무것도 추가하지 않음
        } else {
          // 이미지 삭제한 경우 (이미지가 null임)
          formData.append('image', '')
        }

        formData.append('_method', 'PUT')

        const axios = await getAxios()
        const res = await axios.post(`/board/update/${board.board_id}`, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`,
            'Content-Type': 'multipart/form-data',
          },
        })

        console.log('✅ 게시글 수정 성공:', res.data)
        this.isSuccess = true
        return true
      } catch (error) {
        console.error('❌ 게시글 수정 실패:', error)
        this.isSuccess = false
        this.errorMessage = '게시글 수정 실패'
        return false
      } finally {
        this.isLoading = false
      }
    }
  }
})
