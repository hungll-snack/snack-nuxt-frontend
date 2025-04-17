<template>
  <v-container fluid>
    <v-row>
      <!-- 좌측: 검색 -->
      <v-col cols="12" md="3" class="search-col">
        <SearchSection />
      </v-col>

      <!-- 우측: 테이블 -->
      <v-col cols="12" md="9" class="table-col">
        <TableSection />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import SearchSection from './SearchSection.vue'
import TableSection from './TableSection.vue'
</script>

<style scoped>
.search-col {
  padding-right: 8px;
}
.table-col {
  padding-left: 8px;
}
</style>
