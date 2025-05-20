import { createAxiosInstance } from '@/common/utils/axiosInstance'

const getAxios = () => {
  const token = localStorage.getItem('userToken') || ''
  const accountId = localStorage.getItem('account_id') || ''
  return createAxiosInstance(token, accountId)
}

export const restaurantsRepository = {
  async fetchAllRestaurants() {
    const { data } = await getAxios().get('/restaurant/list')
    return data
  },
  async searchRestaurants(keyword: string) {
    const { data } = await getAxios().get(`/restaurant/search?keyword=${encodeURIComponent(keyword)}`)
    return data
  },
  async fetchRestaurantBoardCounts() {
    const { data } = await getAxios().get('/board/count')
    return Array.isArray(data.data) ? data.data : [] // ✅ 안전하게 배열만 반환
  },
  async getMyScraps() {
  const { data } = await getAxios().get('/account-scrap/my')
  return data.scraps || []
  },

  async createScrap(restaurantId: number) {
    const { data } = await getAxios().post('/account-scrap/create', {
      restaurant_id: restaurantId
    })
    return data
  },

  async deleteScrapByRestaurantId(restaurantId: number) {
    // 먼저 scrap_id를 알아야 함. 간단히 scrap 목록 다시 받아서 찾아서 삭제.
    const scraps = await restaurantsRepository.getMyScraps()
    const scrap = scraps.find(s => s.restaurant_id === restaurantId)
    if (!scrap) return

    const { data } = await getAxios().delete(`/account-scrap/delete/${scrap.scrap_id}`)
    return data
  }

}
