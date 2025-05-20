import { defineStore } from 'pinia';
import { paymentsRepository } from '@/repository/payments/paymentsRepository';

export type PaymentInfo = {
    amount: number
    method: string
    paidAt: string
    receiptUrl: string
  };

export const usePaymentsStore = defineStore('paymentsStore', {
  state: () => ({
    paymentInfo: {} as PaymentInfo | null,
    paymentStatus: '',
  }),

  actions: {
    // ✅ 결제 처리
    async processPayment(userToken: string, paymentKey: string, orderId: string, amount: number) {
      try {
        const response = await paymentsRepository.processPayment(userToken, paymentKey, orderId, amount)
        if (response.success) {
          this.paymentStatus = 'success'
          this.paymentInfo = {
            amount: response.amountWithCurrency,
            method: response.method,
            paidAt: response.approvedAt,
            receiptUrl: response.receiptUrl,
          };
        } else {
          this.paymentStatus = 'failed'
          this.paymentInfo = null
        }
      } catch (error) {
        console.error('❌ 결제 처리 중 오류:', error)
        this.paymentStatus = 'failed'
        this.paymentInfo = null
      }
    },

    // ✅ 결제 정보 조회
    async getPaymentInfo(orderId: string) {
      try {
        const response = await paymentsRepository.getPaymentInfo(orderId)
        if (response.success) {
          this.paymentInfo = response.paymentInfo as PaymentInfo
          this.paymentStatus = 'success'
          return this.paymentInfo
        } else {
          this.paymentStatus = 'failed'
          this.paymentInfo = null
        }
      } catch (error) {
        console.error('❌ 결제 정보 조회 오류:', error)
        this.paymentStatus = 'failed'
        this.paymentInfo = null
        return null
      }
    },
  },
})
