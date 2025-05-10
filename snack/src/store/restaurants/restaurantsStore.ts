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

export const useRestaurantsStore = defineStore('restaurants', {
  state: () => ({
    restaurantList: [] as any[],
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

      const restaurants = await restaurantsRepository.searchRestaurants(this.searchKeyword)
      const counts = await restaurantsRepository.fetchRestaurantBoardCounts()

      const boardCountMap: Record<number, number> = {}
      counts.forEach(({ restaurant_id, board_count }) => {
        if (restaurant_id !== null) {
          boardCountMap[restaurant_id] = board_count
        }
      })

      this.restaurantList = restaurants.map(r => ({
        ...r,
        friendCount: boardCountMap[r.id] || 0
      }))
    },

    async loadBoardCounts() {
      const counts = await restaurantsRepository.fetchRestaurantBoardCounts()

      const boardCountMap: Record<number, number> = {}
      counts.forEach(({ restaurant_id, board_count }) => {
        if (restaurant_id !== null) {
          boardCountMap[restaurant_id] = board_count
        }
      })

      this.restaurantList = this.restaurantList.map(r => ({
        ...r,
        friendCount: boardCountMap[r.id] || 0
      }))
    }

  }
})
