import { defineStore } from 'pinia'
import { restaurantRepository } from '@/repository/restaurants/restaurantsRepository'

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

export const useRestaurantStore = defineStore('restaurant', {
  state: () => ({
    restaurants: [] as Restaurant[],
  }),
  actions: {
    async fetchRestaurants() {
        try {
          const response = await restaurantRepository.getRestaurantList()
          console.log('📦 받아온 맛집 목록:', response)
          this.restaurants = response
        } catch (e) {
          console.error('❌ fetchRestaurants 실패', e)
        }
      },

    async searchRestaurants(keyword: string) {
        try {
          const response = await restaurantRepository.searchRestaurants(keyword)
          this.restaurants = response
        } catch (e) {
          console.error('❌ searchRestaurants 실패', e)
        }
      }
      
  },
})
