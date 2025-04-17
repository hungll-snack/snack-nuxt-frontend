<template>
    <v-container fluid>
      <v-row>
        <!-- 좌측: 지도 -->
        <v-col cols="12" md="6" style="height:600px" class="map-col">
          <MapSection />
        </v-col>
        <!-- 우측: 검색 -->
        <v-col cols="12" md="6" class="search-col">
          <SearchSection />
        </v-col>

      </v-row>
    </v-container>
  </template>
  
  <script setup lang="ts">
  import SearchSection from './SearchSection.vue'
  import MapSection from './MapSection.vue'
  </script>
  
  <style scoped>
  .map-col {
    padding-right: 8px;
  }
  .search-col {
    padding-left: 8px;
  }
  </style>
  