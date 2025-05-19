// src/store/admin/adminStore.ts
import { defineStore } from 'pinia'
import { adminRepository } from '@/repository/admin/adminRepository'

export const useAdminStore = defineStore('admin', {
  state: () => ({
    workflows: [] as any[], // GitHub 워크플로우 목록
  }),

  actions: {
    async checkAdminCode(code: string): Promise<string | null> {
      try {
        const res = await adminRepository.validateAdminCode(code)
        if (res.success) {
          return res.message || '관리자 인증에 성공했습니다.'
        } else {
          return res.message || '관리자 인증에 실패했습니다.'
        }
      } catch (error: any) {
        return error.response?.data?.message || '서버 오류로 관리자 인증 실패'
      }
    },

    async fetchGithubWorkflow(userToken: string, repoUrl: string): Promise<void> {
      try {
        const data = await adminRepository.requestGithubWorkflow(userToken, repoUrl)
        this.workflows = data
      } catch (error) {
        console.error('❌ GitHub 워크플로우 불러오기 실패:', error)
        throw error
      }
    },

    async triggerGithubWorkflow(userToken: string, repoUrl: string, workflowName: string): Promise<void> {
      try {
        await adminRepository.triggerGithubWorkflow(userToken, repoUrl, workflowName)
      } catch (error) {
        console.error('❌ GitHub 워크플로우 실행 실패:', error)
        throw error
      }
    },
  },
})
