import { createAxiosInstance } from '@/common/utils/axiosInstance'

export const accountRepository = {
  async getProfileInfo() {

    const token = localStorage.getItem('userToken') || ''
    const accountId = localStorage.getItem('account_id') || ''

    const axios = createAxiosInstance(token, accountId)
    const { data } = await axios.get('/account-profile/get')
    return data
  }
}
