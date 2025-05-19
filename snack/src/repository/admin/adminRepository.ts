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

  async requestGithubWorkflow(userToken: string, repoUrl: string) {
    const accountId = localStorage.getItem('account_id') || ''
    const axios = createAxiosInstance(userToken, accountId)

    const response = await axios.post('/github-action-monitor/workflow', {
      userToken,
      repoUrl,
    })

    return response.data.workflowInfo || []
  },

  async triggerGithubWorkflow(userToken: string, repoUrl: string, workflowName: string) {
    const accountId = localStorage.getItem('account_id') || ''
    const axios = createAxiosInstance(userToken, accountId)

    const response = await axios.post('/github-action-monitor/trigger', {
      userToken,
      repoUrl,
      workflowName,
    })

    return response.data
  },
}
