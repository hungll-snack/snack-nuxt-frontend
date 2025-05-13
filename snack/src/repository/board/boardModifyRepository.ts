import { useRuntimeConfig } from '#app'
import { deleteImageFromS3 } from '@/common/utils/awsS3Instance'

interface BoardModifyPayload {
  board_id: number
  title: string
  content: string
  end_time: string
  restaurant_id?: number
  image?: File | string | null
  previous_image_url?: string | null 
}

export const boardModifyRepository = {
  async requestUpdateBoard(payload: BoardModifyPayload) {
    const config = useRuntimeConfig()
    const token = localStorage.getItem('userToken') || ''
    const accountId = localStorage.getItem('account_id') || ''

    if (!payload.board_id || !payload.title || !payload.content || !payload.end_time) {
      throw new Error('필수 항목이 누락되었습니다.')
    }

    const jsonPayload = {
      title: payload.title,
      content: payload.content,
      end_time: payload.end_time,
      restaurant: payload.restaurant_id,
      image_url: payload.image_url ?? null,
    }
    
    console.log('📦 [repository] 받은 payload:', payload)


    const url = `${config.public.MAIN_API_URL}/board/update/${payload.board_id}`
    console.log('📡 수정 요청 URL:', url)
    console.log('📦 전송 payload:', jsonPayload)

    try {
      const res = await $fetch(url, {
        method: 'PUT', 
        body: jsonPayload,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'X-Account-Id': accountId,
        },
      })

      console.log('✅ 게시글 수정 성공:', res)

      // ✅ 이전 이미지 삭제
      if (
        typeof payload.image === 'string' &&
        payload.previous_image_url &&
        payload.image !== payload.previous_image_url
      ) {
        await deleteImageFromS3(payload.previous_image_url)
      } else if (payload.image === null && payload.previous_image_url) {
        await deleteImageFromS3(payload.previous_image_url)
      }

      return res
    } catch (error: any) {
      console.error('❌ 게시글 수정 실패:', error.response?.data || error.message)
      throw error
    }
  },
}
