import { defineStore } from 'pinia'
import { restaurantsRepository } from '@/repository/restaurants/restaurantsRepository'

export interface Restaurant {
  id: number
  name: string
  rating: number
  reviewCount: number
  address: string
  latitude: number
  longitude: number
  closed?: boolean
  friendCount?: number
}


interface BoardCountResponse {
  restaurant_id: number | null
  board_count: number
}

export const useRestaurantsStore = defineStore('restaurants', {
  state: () => ({
    restaurantList: [] as Restaurant[],
    searchKeyword: '',
    boardCounts: {} as Record<number, number>
  }),
  actions: {
    async loadAllRestaurants() {
      this.restaurantList = await restaurantsRepository.fetchAllRestaurants()
    },

    async searchRestaurants() {
      if (!this.searchKeyword.trim()) {
        await this.loadAllRestaurants()
        return
      }

      const restaurants: Restaurant[] = await restaurantsRepository.searchRestaurants(this.searchKeyword)
      const counts: BoardCountResponse[] = await restaurantsRepository.fetchRestaurantBoardCounts()

      const boardCountMap: Record<number, number> = {}
      counts.forEach((item: BoardCountResponse) => {
        const { restaurant_id, board_count } = item
        if (restaurant_id !== null) {
          boardCountMap[restaurant_id] = board_count
        }
      })

      this.restaurantList = restaurants.map((r: Restaurant) => ({
        ...r,
        friendCount: boardCountMap[r.id] || 0
      }))
    },

    async loadBoardCounts() {
      const counts: BoardCountResponse[] = await restaurantsRepository.fetchRestaurantBoardCounts()

      const boardCountMap: Record<number, number> = {}
      counts.forEach((item: BoardCountResponse) => {
        const { restaurant_id, board_count } = item
        if (restaurant_id !== null) {
          boardCountMap[restaurant_id] = board_count
        }
      })

      this.restaurantList = this.restaurantList.map((r: Restaurant) => ({
        ...r,
        friendCount: boardCountMap[r.id] || 0
      }))
    }
  }
})
