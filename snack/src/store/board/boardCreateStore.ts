// src/store/board/boardCreateStore.ts
import { defineStore } from 'pinia'
import { boardCreateRepository, fetchAllRestaurants, searchRestaurants } from '@/repository/board/boardCreateRepository'

interface BoardCreatePayload {
  title: string
  content: string
  image?: File
  end_time: string
  restaurant_id?: number
  author_id?: number
}

export const useBoardCreateStore = defineStore('boardCreate', {
  state: () => ({
    title: '',
    content: '',
    image: null as File | null,
    end_time: '',
    restaurant_id: null as number | null,
    restaurantList: [] as any[],
    restaurantSearchKeyword: '',
  }),
  actions: {
    async requestCreateBoard(payload: BoardCreatePayload) {
      console.log('📤 게시글 생성 요청:', payload)
      return await boardCreateRepository.requestCreateBoard(payload)
    },
    async loadAllRestaurants() {
      this.restaurantList = await fetchAllRestaurants()
    },

    async searchRestaurantList() {
      if (!this.restaurantSearchKeyword.trim()) {
        await this.loadAllRestaurants()
        return
      }
      this.restaurantList = await searchRestaurants(this.restaurantSearchKeyword)
    },

  },
})
