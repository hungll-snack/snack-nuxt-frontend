import { defineStore } from 'pinia';
import { subscribeRepository } from '@/repository/subscribe/subscribeRepository';

export const useSubscribeStore = defineStore('subscribeStore', {
  state: () => ({
    isSubscribed: false,
    planType: '',
    endDate: '',
    message: '',
  }),

  actions: {
    // ✅ 구독 상태 조회
    async getSubscribeStatus() {
      try {
        const userToken = localStorage.getItem('userToken');
        const accountId = localStorage.getItem('account_id');

        if (!userToken || !accountId) {
          this.isSubscribed = false;
          this.message = '로그인 정보가 필요합니다.';
          return;
        }

        const response = await subscribeRepository.getSubscribeStatus(userToken, accountId);
        if (response && response.status === 200) {
          this.isSubscribed = true;
          this.planType = response.data.planType;
          this.endDate = response.data.endDate;
        } else {
          this.isSubscribed = false;
          this.planType = '';
          this.endDate = '';
        }
      } catch (error) {
        console.error('구독 상태 조회 오류:', error);
        this.isSubscribed = false;
        this.planType = '';
        this.endDate = '';
        this.message = '구독 상태를 불러올 수 없습니다.';
      }
    },

    async createSubscribe(planType: string, endDate: string) {
        const userToken = localStorage.getItem('userToken');
        const accountId = localStorage.getItem('account_id');
  
        if (!userToken || !accountId) {
          this.message = '로그인 정보가 필요합니다.';
          return;
        }
  
        const response = await subscribeRepository.createSubscribe(userToken, accountId, planType, endDate);
        if (response && response.status === 201) {
          this.isSubscribed = true;
          this.planType = planType;
          this.endDate = endDate;
          this.message = '구독이 성공적으로 생성되었습니다.';
        } else {
          this.message = '구독 생성에 실패했습니다.';
        }
      },

        
    //  구독 취소
    async cancelSubscribe() {
      try {
        const userToken = localStorage.getItem('userToken');
        const accountId = localStorage.getItem('account_id');

        if (!userToken || !accountId) {
          this.message = '로그인 정보가 필요합니다.';
          return;
        }

        await subscribeRepository.cancelSubscribe(userToken, accountId);
        this.isSubscribed = false;
        this.planType = '';
        this.endDate = '';
        this.message = '구독이 성공적으로 취소되었습니다.';
      } catch (error) {
        console.error('구독 취소 오류:', error);
        this.message = '구독 취소 중 오류가 발생했습니다.';
      }
    },
  },
  }
)
