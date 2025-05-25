<template>
  <ClientOnly>
    <PaymentsPage />
  </ClientOnly>
</template>
  
<script setup lang="ts">
definePageMeta({
  ssr: false,
  middleware: ['require-auth'],
})
  
import PaymentsPage from '@/views/payments/PaymentsPage.vue'
</script>
  