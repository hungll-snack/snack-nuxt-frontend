<template>
    <v-container class="log-alerts-container">
      <h2 class="section-title">📢 로그 및 알림 관리</h2>
  
      <v-data-table
        :headers="headers"
        :items="logs"
        class="log-table"
        :items-per-page="5"
      >
        <template #item.status="{ item }">
          <v-chip :color="item.status === 'resolved' ? 'green' : 'red'" small>
            {{ item.status === 'resolved' ? '해결됨' : '에러' }}
          </v-chip>
        </template>
  
        <template #item.actions="{ item }">
          <v-btn
            size="small"
            color="primary"
            variant="text"
            :disabled="item.status === 'resolved'"
            @click="resolveLog(item)"
          >
            재시도
          </v-btn>
        </template>
      </v-data-table>
    </v-container>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  
  const logs = ref([
    {
      id: 1,
      type: 'FastAPI Timeout',
      message: '요청 시간 초과',
      created_at: '2025-05-13 10:12',
      status: 'error',
    },
    {
      id: 2,
      type: 'Django Auth Error',
      message: 'Token 검증 실패',
      created_at: '2025-05-12 17:44',
      status: 'resolved',
    },
  ])
  
  const headers = [
    { title: '에러 종류', key: 'type' },
    { title: '메시지', key: 'message' },
    { title: '발생 시간', key: 'created_at' },
    { title: '상태', key: 'status' },
    { title: '조치', key: 'actions', sortable: false },
  ]
  
  function resolveLog(log: any) {
    log.status = 'resolved'
    alert(`"${log.type}" 로그를 재시도 처리했습니다.`)
  }
  </script>
  
  <style scoped>
  .log-alerts-container {
    padding-top: 32px;
    max-width: 960px;
    margin: 0 auto;
  }
  .section-title {
    font-size: 1.4rem;
    font-weight: bold;
    margin-bottom: 24px;
  }
  .log-table {
    border-radius: 12px;
  }
  </style>
  