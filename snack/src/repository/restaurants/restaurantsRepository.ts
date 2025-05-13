import { createAxiosInstance } from '@/common/utils/axiosInstance'

export const restaurantsRepository = {
  async fetchAllRestaurants() {
    const { data } = await createAxiosInstance().get('/restaurant/list/')
    return data
  },
  async searchRestaurants(keyword: string) {
    const { data } = await createAxiosInstance().get(`/restaurant/search/?keyword=${encodeURIComponent(keyword)}`)
    return data
  },
  async fetchRestaurantBoardCounts() {
    const { data } = await createAxiosInstance().get('/board/count')
    return Array.isArray(data.data) ? data.data : [] // ✅ 안전하게 배열만 반환
  }

}
