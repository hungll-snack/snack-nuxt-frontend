// src/store/account/accountStore.ts

import { defineStore } from 'pinia'
import { accountRepository } from '@/repository/account/accountRepository'

export const useAccountStore = defineStore('account', {
  state: () => ({
    accountId: '',
    email: '',
    name: '',
    nickname: '',
    phoneNum: '',
    address: '',
    gender: '',
    birth: '',
    payment: '',
    age: '',
    subscribe: false,
    accountRegister: '',
    accountPath: '',
  }),
  actions: {
    setAccount(account: any) {
      this.email = account.email
      this.accountRegister = account.account_register
      this.accountPath = account.account_path
    },

    setProfile(profile: any) {
      this.accountId = profile.account_id
      this.name = profile.account_name
      this.nickname = profile.account_nickname
      this.phoneNum = profile.phone_num
      this.address = profile.account_add
      this.gender = profile.account_sex
      this.birth = profile.account_birth
      this.payment = profile.account_pay
      this.age = profile.account_age
      this.subscribe = profile.account_sub
    },

    // ✅ 여기에 추가: account 정보를 서버에서 직접 요청해서 갱신
    async getAccount() {
      try {
        const profile = await accountRepository.getProfileInfo()
        this.setProfile(profile)
        return profile
      } catch (error) {
        console.error('❌ getAccount 실패:', error)
        throw error
      }
    },
  },
})
