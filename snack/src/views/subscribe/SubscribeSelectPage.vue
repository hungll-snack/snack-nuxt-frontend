<template>
    <div class="subscribe-select-container">
      <h2 class="title">Hungll Pass</h2>
      <div class="plans">
        <div class="plan-card basic">
          <h3>Hungll Pass Basic</h3>
          <p>가격: <strong>9,900원</strong> / 월</p>
          <ul>
            <li>💬 1:1 채팅 가능</li>
            <li>❌ 취향 기반 밥친구 자동 매칭 불가</li>
          </ul>
          <button @click="createOrder('BASIC', 9900)">구독하기</button>
        </div>
  
        <div class="plan-card premium">
          <h3>Hungll Pass Premium</h3>
          <p>가격: <strong>15,900원</strong> / 월</p>
          <ul>
            <li>💬 1:1 채팅 가능</li>
            <li>👥 취향 기반 밥친구 자동 매칭 가능</li>
          </ul>
          <button @click="createOrder('PREMIUM', 15900)">구독하기</button>
        </div>
      </div>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useRouter } from 'vue-router';
  import { useOrderStore } from '@/store/order/orderStore';
  import { ref } from 'vue';
  
  const router = useRouter();
  const orderStore = useOrderStore();
  const isLoading = ref(false);
  const errorMessage = ref('');
  
  const createOrder = async (planType: string, price: number) => {
    if (isLoading.value) return; // 중복 클릭 방지
    isLoading.value = true;
    errorMessage.value = '';
  
    try {
      const orderId = await orderStore.createOrder(planType, price);
      if (orderId) {
        router.push(`/payments?orderId=${orderId}&planType=${planType}&amount=${price}`);
      } else {
        throw new Error("주문 생성에 실패했습니다.");
      }
    } catch (error) {
      console.error("주문 생성 오류:", error);
      errorMessage.value = "주문 생성에 실패했습니다. 다시 시도해주세요.";
    } finally {
      isLoading.value = false;
    }
  };
  </script>
  
  <style scoped>
  .subscribe-select-container {
    max-width: 800px;
    margin: 0 auto;
    text-align: center;
    padding: 40px 20px;
  }
  
  .title {
    font-size: 32px;
    font-weight: bold;
    margin-bottom: 24px;
    color: #ff5722;
  }
  
  .plans {
    display: flex;
    gap: 20px;
    justify-content: center;
  }
  
  .plan-card {
    background: #ffffff;
    padding: 24px 20px;
    border-radius: 16px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
    width: 320px;
    text-align: center;
    transition: transform 0.3s, box-shadow 0.3s;
  }
  
  .plan-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.15);
  }
  
  .plan-card h3 {
    font-size: 24px;
    font-weight: bold;
    color: #333;
    margin-bottom: 12px;
  }
  
  .plan-card p {
    font-size: 18px;
    margin-bottom: 16px;
    color: #ff5722;
  }
  
  .plan-card ul {
    list-style: none;
    padding: 0;
    margin: 0 0 16px 0;
  }
  
  .plan-card li {
    font-size: 15px;
    margin-bottom: 6px;
  }
  
  .plan-card button {
    background-color: #ff9800;
    color: #fff;
    border: none;
    padding: 12px 28px;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.3s;
    font-weight: bold;
  }
  
  .plan-card button:hover {
    background-color: #e65100;
  }
  
  .plan-card.basic {
    border-top: 4px solid #ff9800;
  }
  
  .plan-card.premium {
    border-top: 4px solid #ff5722;
  }
  
  .error-message {
    color: red;
    font-size: 14px;
    margin-top: 12px;
  }
  </style>
  