import { defineStore } from 'pinia';
import { orderRepository } from '@/repository/order/orderRepository';

export const useOrderStore = defineStore('orderStore', {
  state: () => ({
    orders: [] as any[],
  }),

  actions: {
    async createOrder(planType: string, price: number) {
      try {
        const orderId = await orderRepository.createOrder(planType, price);
        return orderId;
      } catch (error) {
        console.error('주문 생성 오류:', error);
        return null;
      }
    },

    async completeOrder(orderId: string) {
      try {
        const success = await orderRepository.completeOrder(orderId);
        return success;
      } catch (error) {
        console.error('주문 완료 오류:', error);
        return false;
      }
    },
  }
});
