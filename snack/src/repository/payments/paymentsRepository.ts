import { createAxiosInstance } from '@/common/utils/axiosInstance';

export const paymentsRepository = {
  // ✅ 결제 처리 API 호출
  async processPayment(userToken: string, paymentKey: string, orderId: string, amount: number) {
    const axios = createAxiosInstance(userToken);
    const { data } = await axios.post('/payments/process', {
      userToken,
      paymentKey,
      orderId,
      amount,
      orderInfoId: orderId,
    });

    return data;
  },

  // ✅ 결제 정보 조회 API 호출
  async getPaymentInfo(orderId: string) {
    const token = localStorage.getItem('userToken') || '';
    const axios = createAxiosInstance(token);
    const { data } = await axios.get(`/payments/info?orderId=${orderId}`);
    return data;
  },
};
