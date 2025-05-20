import { createAxiosInstance } from '@/common/utils/axiosInstance';

export const orderRepository = {
  // 주문 생성
  async createOrder(planType: string, price: number) {
    const token = localStorage.getItem('userToken') || '';
    const accountId = localStorage.getItem('account_id') || '';

    const axios = createAxiosInstance(token, accountId);

    const { data } = await axios.post('/orders/create', {
      items: [{ planType, quantity: 1, price }],
      total: price,
      userToken: token
    });

    if (data.success) {
      return data.orderId;
    } else {
      throw new Error('주문 생성에 실패했습니다.');
    }
  },

  //  주문 완료 (결제 완료 처리)
  async completeOrder(orderId: string) {
    const token = localStorage.getItem('userToken') || '';
    const axios = createAxiosInstance(token);

    const { data } = await axios.post('/orders/complete', { orderId });

    if (data.success) {
      return true;
    } else {
      throw new Error('주문 완료 처리에 실패했습니다.');
    }
  }
};