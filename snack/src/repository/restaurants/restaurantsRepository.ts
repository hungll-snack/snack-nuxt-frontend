import { createAxiosInstance } from '@/common/utils/axiosInstance'

export const restaurantRepository = {
  async getRestaurantList() {
    const token = localStorage.getItem('userToken') || ''
    const accountId = localStorage.getItem('account_id') || ''
    const axios = createAxiosInstance(token, accountId)
    const { data } = await axios.get('/restaurant/list')
    return data
  },

  async searchRestaurants(keyword: string) {
    const token = localStorage.getItem('userToken') || ''
    const accountId = localStorage.getItem('account_id') || ''
    const axios = createAxiosInstance(token, accountId)
    const { data } = await axios.get(`/restaurant/search?keyword=${encodeURIComponent(keyword)}`)
    return data
  }
  
}
