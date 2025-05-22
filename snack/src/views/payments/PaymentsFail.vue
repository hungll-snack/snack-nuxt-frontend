<template>
  <div class="fail-page">
    <h2>❌ 결제에 실패했습니다</h2>
    <p>문제가 지속될 경우 고객센터로 문의해주세요.</p>
    <v-btn color="primary" @click="goBack">다시 시도하기</v-btn>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

const goBack = () => {
  router.push('/subscribe/select')
}
</script>

<style scoped>
.fail-page {
  padding: 48px;
  text-align: center;
  color: red;
}
</style>
