// src/repository/admin/adminRepository.ts
import { createAxiosInstance } from '@/common/utils/axiosInstance'

export const adminRepository = {
  async validateAdminCode(adminCode: string) {
    const token = localStorage.getItem('userToken') || ''
    const accountId = localStorage.getItem('account_id') || ''

    const axios = createAxiosInstance(token, accountId)

    const response = await axios.post('/github-oauth/request-admin-code-validation', {
      admin_code: adminCode,
    })

    return response.data
  },
}
