<template>
  <PreferView />
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['require-auth'], // 로그인된 사용자만 접근
})

import PreferView from '~/views/prefer/PreferPage.vue'
</script>
