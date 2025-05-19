
<template>
    <v-container class="user-management-container">
      <h2 class="section-title">👤 사용자 관리</h2>
  
      <v-text-field
        v-model="search"
        label="사용자 검색"
        prepend-inner-icon="mdi-magnify"
        class="mb-4"
        clearable
      />
  
      <v-data-table
        :headers="headers"
        :items="filteredUsers"
        item-value="id"
        class="user-table"
        :items-per-page="5"
      >
        <template #item.actions="{ item }">
          <v-btn size="small" variant="text" @click="toggleRole(item)">
            {{ item.role === 'admin' ? '일반으로 변경' : '관리자로 변경' }}
          </v-btn>
          <v-btn size="small" color="red" variant="text" @click="deactivateUser(item)">
            정지
          </v-btn>
        </template>
      </v-data-table>
    </v-container>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue'
  
  const search = ref('')
  const users = ref([
    { id: 1, name: '유제나', email: 'jena@hungll.com', role: 'admin' },
    { id: 2, name: '홍길동', email: 'gildong@gmail.com', role: 'user' },
    { id: 3, name: '박철수', email: 'chulsoo@hungll.com', role: 'user' },
  ])
  
  const headers = [
    { title: '이름', key: 'name' },
    { title: '이메일', key: 'email' },
    { title: '권한', key: 'role' },
    { title: '조치', key: 'actions', sortable: false },
  ]
  
  const filteredUsers = computed(() =>
    users.value.filter((user) =>
      user.name.toLowerCase().includes(search.value.toLowerCase())
    )
  )
  
  function toggleRole(user: any) {
    user.role = user.role === 'admin' ? 'user' : 'admin'
  }
  function deactivateUser(user: any) {
    alert(`${user.name} 계정을 정지 처리했습니다.`)
  }
  </script>
  
  <style scoped>
  .user-management-container {
    padding-top: 32px;
    max-width: 960px;
    margin: 0 auto;
  }
  .section-title {
    font-size: 1.4rem;
    font-weight: bold;
    margin-bottom: 24px;
  }
  .user-table {
    border-radius: 12px;
  }
  </style>
  