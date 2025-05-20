<template>
    <div class="wrapper">
      <div class="box_section">
        <h2>결제하기</h2>
        <p>주문 ID: {{ orderId }}</p>
        <p>플랜 타입: {{ planType }}</p>
        <p>결제 금액: {{ amount }}원</p>
  
        <div id="payment-method"></div>
        <div id="agreement"></div>
        
        <v-btn
          :disabled="!inputEnabled"
          @click="requestPayment"
          class="button"
          style="margin-top: 30px"
        >
          결제하기
        </v-btn>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { loadPaymentWidget, ANONYMOUS } from "@tosspayments/payment-widget-sdk"
  import { useRuntimeConfig } from "nuxt/app"
  import { nanoid } from "nanoid"
  import { onMounted, ref } from "vue"
  import { useRoute, useRouter } from "vue-router"
  import { useOrderStore } from "@/store/order/orderStore"
  
  const config = useRuntimeConfig()
  const route = useRoute()
  const router = useRouter()
  const orderStore = useOrderStore()
  
  // ✅ URL 파라미터에서 결제 정보 가져오기
  const orderId = route.query.orderId || nanoid()
  const planType = route.query.planType || "BASIC"
  const amount = ref(Number(route.query.amount || 0))
  
  const inputEnabled = ref(false)
  const paymentWidget = ref(null)
  const paymentMethodWidget = ref(null)
  const errorMessage = ref("")
  
  // ✅ 결제 요청 (Toss Payments)
  async function requestPayment() {
    try {
      if (!paymentWidget.value) return
      await paymentWidget.value.requestPayment({
        orderId: orderId,
        orderName: `Hungll Pass - ${planType}`,
        customerName: "사용자",
        customerEmail: "user@example.com",
        customerMobilePhone: "01012341234",
        successUrl: `${window.location.origin}/payments/success?orderId=${orderId}&planType=${planType}&amount=${amount.value}`,
        failUrl: `${window.location.origin}/payments/failed`,
      })
  
      // ✅ 결제 완료 처리 (서버에 주문 상태 변경)
      await orderStore.completeOrder(orderId)
      alert("결제가 성공적으로 완료되었습니다!")
      router.push(`/payments/success?orderId=${orderId}&planType=${planType}&amount=${amount.value}`)
    } catch (error) {
      console.error("❌ 결제 요청 실패:", error)
      errorMessage.value = "결제 처리 중 오류가 발생했습니다. 다시 시도해주세요."
    }
  }
  
  // ✅ Toss Payments 위젯 초기화
  onMounted(async () => {
    const clientKey = config.public.TOSS_CLIENT_KEY
    if (!clientKey) {
      console.error("❌ Toss client key 누락됨")
      return
    }
  
    paymentWidget.value = await loadPaymentWidget(clientKey, ANONYMOUS)
    paymentMethodWidget.value = paymentWidget.value.renderPaymentMethods(
      "#payment-method",
      { value: amount.value },
      { variantKey: "DEFAULT" }
    )
  
    paymentWidget.value.renderAgreement("#agreement", { variantKey: "AGREEMENT" })
  
    paymentMethodWidget.value.on("ready", () => {
      inputEnabled.value = true
      console.log("✅ Toss 위젯 렌더링 완료")
    })
  })
  </script>
  
  <style scoped>
  .wrapper {
    display: flex;
    justify-content: center;
    padding-top: 60px;
  }
  .box_section {
    width: 600px;
    text-align: center;
  }
  
  .error-message {
    color: red;
    font-size: 14px;
    margin-top: 12px;
  }
  </style>
  