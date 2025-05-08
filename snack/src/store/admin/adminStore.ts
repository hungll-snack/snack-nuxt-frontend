// src/store/admin/adminStore.ts
import { defineStore } from 'pinia'
import { adminRepository } from '@/repository/admin/adminRepository'

export const useAdminStore = defineStore('admin', {
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
  },
})
