<template>
    <div class="success-container">
      <h2>결제가 성공적으로 완료되었습니다!</h2>
      <p>주문 ID: {{ orderId }}</p>
      <p>결제 금액: {{ paymentAmount }}원</p>
      <p>결제 방법: {{ paymentMethod }}</p>
      <p v-if="receiptUrl">영수증: <a :href="receiptUrl" target="_blank">영수증 보기</a></p>
      <button @click="goToMyPage">마이페이지로 이동</button>
    </div>
</template>
  
<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
import { usePaymentsStore } from '@/store/payments/paymentsStore';
  
const router = useRouter();
const route = useRoute();
const paymentsStore = usePaymentsStore();
  
// ✅ TypeScript에서 타입 지정
const orderId = route.query.orderId as string;
const paymentAmount = paymentsStore.paymentInfo?.amount ?? 0
const paymentMethod = paymentsStore.paymentInfo?.method ?? ''
const receiptUrl = paymentsStore.paymentInfo?.receiptUrl ?? ''

  
const goToMyPage = () => {
router.push('/mypage');
};
</script>
  
<style scoped>
.success-container {
max-width: 600px;
margin: 0 auto;
text-align: center;
padding: 40px;
 }
</style>
  