import { createAxiosInstance } from '@/common/utils/axiosInstance'

export const accountRepository = {
  async getProfileInfo() {

    const token = localStorage.getItem('userToken') || ''
    const accountId = localStorage.getItem('account_id') || ''

    console.log('여긴 어카운트 리포지토리 token,accountId : ', token,accountId )


    const axios = createAxiosInstance(token, accountId)
    const { data } = await axios.get('/account-profile/get')

    console.log(' 어카운트 repository요청해서 받은 data :',data)
    return data
  }
}
