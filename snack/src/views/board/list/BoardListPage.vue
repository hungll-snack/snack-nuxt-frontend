<template>
  <v-container fluid>
    <v-row>
      <!-- 좌측: 검색 -->
      <v-col cols="12" md="3" class="search-col">
        <SearchSection @search="onSearch" />
      </v-col>

      <!-- 우측: 테이블 -->
      <v-col cols="12" md="9" class="table-col">
        <TableSection
          :title="searchParams.title"
          :author="searchParams.author"
          :start_date="searchParams.start_date"
          :end_date="searchParams.end_date"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import SearchSection from './SearchSection.vue'
import TableSection from './TableSection.vue'

// 🔥 검색 파라미터 상태
const searchParams = ref({
  title: '',
  author: '',
  start_date: '',
  end_date: ''
})

// 🔥 SearchSection에서 emit 받은 값 저장
const onSearch = (params: {
  title: string
  author: string
  start_date: string
  end_date: string
}) => {
  searchParams.value = { ...params }
}
</script>

<style scoped>
.search-col {
  padding-right: 8px;
}
.table-col {
  padding-left: 8px;
}
</style>
