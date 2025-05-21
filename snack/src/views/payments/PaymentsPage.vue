<template>
  <div class="wrapper">
    <div class="box_section">
      <div class="summary">
        <h3>주문 정보</h3>
        <p>주문 상품: {{ route.query.planName || '헝글 패스' }}</p>
        <p>결제 금액: {{ amount.toLocaleString() }}원</p>
      </div>
      <div id="payment-method"></div>
      <div id="agreement"></div>
      <v-btn
        :disabled="!inputEnabled"
        @click="requestPayment"
        class="button"
        id="payment-button"
        style="margin: 30px"
      >
        결제하기
      </v-btn>
    </div>
  </div>
</template>

<script setup>
import { loadPaymentWidget, ANONYMOUS } from "@tosspayments/payment-widget-sdk"
import { useRuntimeConfig } from "nuxt/app"
import { nanoid } from "nanoid"
import { onMounted, ref } from "vue"
import { useRoute } from "vue-router"
import { useAccountStore } from '@/store/account/accountStore'

const config = useRuntimeConfig()
const route = useRoute()

const paymentWidget = ref(null)
const paymentMethodWidget = ref(null)
const clientKey = ref(config.public.TOSS_CLIENT_KEY)
const customerKey = ref(null)
const amount = ref(route.query.amount ? Number(route.query.amount) : 0)
const inputEnabled = ref(false)
const accountStore = useAccountStore()

async function requestPayment() {
  try {
    if (paymentWidget.value) {
      await paymentWidget.value.requestPayment({
        orderId: nanoid(),
        orderName: route.query.planName || 'Hungll Pass', 
        customerName: accountStore.name || accountStore.nickname || '헝글 유저',
        customerEmail: accountStore.email || 'test@example.com',
        customerMobilePhone:  '01012345678',
        successUrl: `${window.location.origin}/payments/success`,
        failUrl: `${window.location.origin}/payments/fail`,
      })
    }
  } catch (error) {
    console.error(error)
  }
}

onMounted(async () => {
  paymentWidget.value = await loadPaymentWidget(clientKey.value, ANONYMOUS)
  paymentMethodWidget.value = paymentWidget.value.renderPaymentMethods(
    "#payment-method",
    { value: amount.value },
    { variantKey: "DEFAULT" }
  )
  paymentWidget.value.renderAgreement("#agreement", { variantKey: "AGREEMENT" })
  paymentMethodWidget.value.on("ready", () => {
    inputEnabled.value = true
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
}
.summary {
  text-align: center;
  margin-bottom: 24px;
}
.summary h3 {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 8px;
}
.summary p {
  margin: 4px 0;
  font-size: 14px;
}

</style>