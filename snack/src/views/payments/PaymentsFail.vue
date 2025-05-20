<template>
    <div class="fail-container">
      <h2>결제가 실패하였습니다.</h2>
      <p>문제가 발생했습니다. 다시 시도해주세요.</p>
      <button @click="retryPayment">다시 결제하기</button>
    </div>
  </template>
  
  <script setup>
  import { useRouter, useRoute } from 'vue-router';
  
  const router = useRouter();
  const route = useRoute();
  
  const retryPayment = () => {
    const orderId = route.query.orderId;
    if (orderId) {
      router.push(`/payments?orderId=${orderId}`);
    } else {
      router.push('/subscribe/select');
    }
  };
  </script>
  
  <style scoped>
  .fail-container {
    max-width: 600px;
    margin: 0 auto;
    text-align: center;
    padding: 40px;
  }
  </style>
  