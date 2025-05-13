<template>
  <BoardCreatePage />
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['require-auth']
})
import BoardCreatePage from '@/views/board/create/BoardCreatePage.vue'
</script>
