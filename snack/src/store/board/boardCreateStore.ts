import { defineStore } from 'pinia'
import { boardCreateRepository, fetchAllRestaurants, searchRestaurants } from '@/repository/board/boardCreateRepository'

interface BoardCreatePayload {
  title: string
  content: string
  end_time: string
  restaurant_id?: number
  author_id?: number
}

export const useBoardCreateStore = defineStore('boardCreate', {
  state: () => ({
    title: '',
    content: '',
    image_url: null as string | null,
    end_time: '',
    restaurant_id: null as number | null,
    restaurantList: [] as any[],
    restaurantSearchKeyword: '',
  }),
  actions: {
    // ✅ 게시글 생성
    async requestCreateBoard(payload: BoardCreatePayload) {
      const finalPayload = {
        title: payload.title,
        content: payload.content,
        image_url: this.image_url ?? null,
        end_time: payload.end_time,
        restaurant_id: payload.restaurant_id,
        author_id: payload.author_id,
      }
  
      console.log('📤 게시글 생성 요청 payload:', finalPayload)
      return await boardCreateRepository.requestCreateBoard(finalPayload)
    },
  
    // ✅ 전체 식당 목록 불러오기
    async loadAllRestaurants() {
      this.restaurantList = await boardCreateRepository.fetchAllRestaurants()
    },
  
    // ✅ 식당 검색
    async searchRestaurantList() {
      if (!this.restaurantSearchKeyword.trim()) {
        await this.loadAllRestaurants()
        return
      }
      this.restaurantList = await boardCreateRepository.searchRestaurants(this.restaurantSearchKeyword)
    },
  }  
})
