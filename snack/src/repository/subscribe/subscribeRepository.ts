import { createAxiosInstance } from '@/common/utils/axiosInstance';

export const subscribeRepository = {
  // ✅ 구독 상태 조회
  async getSubscribeStatus(userToken: string, accountId: string) {
    const axios = createAxiosInstance(userToken, accountId);
    const response = await axios.get(`/subscribe/status?subscriberId=${accountId}`);

    return response.data;
  },

  // ✅ 구독 생성
  async createSubscribe(userToken: string, accountId: string, planType: string, endDate: string) {
    const axios = createAxiosInstance(userToken, accountId);
    const response = await axios.post('/subscribe/create', {
      subscriberId: accountId,
      subscribeId: planType,
      endDate: endDate,
    });

    return response.data;
  },

  // ✅ 구독 취소
  async cancelSubscribe(userToken: string, accountId: string) {
    const axios = createAxiosInstance(userToken, accountId);
    const response = await axios.post('/subscribe/cancel', {
      subscriberId: accountId,
    });

    return response.data;
  },
};
