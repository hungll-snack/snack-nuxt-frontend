<template>
  <div class="restaurant-list-wrapper">
    <input
      v-model="keyword"
      @keydown.enter="search"
      placeholder="식당명을 검색하세요"
      class="search-input"
    />

    <h2 class="list-title">🍽️ 맛집 목록</h2>

    <div
      v-for="r in restaurantStore.restaurants"
      :key="r.id"
      class="restaurant-card"
    >
      <div class="flex-1">
        <div class="restaurant-name">
          {{ r.name }}
          <span v-if="r.closed" class="closed-badge">영업종료</span>
        </div>
        <div class="address">📍 {{ r.address }}</div>
      </div>
      <div class="button-group">
        <button class="friend-btn" @mousedown.prevent @click="alertServiceReady">밥 친구 찾기 ({{ r.friendCount || 0 }})</button>
        <button class="call-btn" @mousedown.prevent @click="alertServiceReady">
          <span class="icon">📞</span> 전화 하기
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRestaurantStore } from '@/store/restaurants/restaurantsStore'

const keyword = ref('')
const restaurantStore = useRestaurantStore()

const search = () => {
  if (keyword.value.trim()) {
    restaurantStore.searchRestaurants(keyword.value.trim())
  }
}

const alertServiceReady = () => {
  alert('서비스 준비중입니다. 잠시만 기다려주세요.')
}

onMounted(() => {
  restaurantStore.fetchRestaurants()
})
</script>

<style scoped>
.restaurant-list-wrapper {
  padding: 16px;
  height: 100%;
  background: #ffffff;
  border-radius: 16px;
  overflow-y: auto;
  max-height: 100vh;
}

.search-input {
  width: 100%;
  padding: 10px 14px;
  margin-bottom: 16px;
  border: 1px solid #ddd;
  border-radius: 999px;
  font-size: 14px;
  background-color: #fff;
  box-shadow: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
.search-input:focus {
  outline: none;
  border-color: #ff9800;
  box-shadow: 0 0 0 3px rgba(255, 152, 0, 0.2);
}

.list-title {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 20px;
  color: #333;
}

.restaurant-card {
  background: #ffffff;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid #eee;
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.restaurant-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
}

.restaurant-name {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
  color: #333;
}

.closed-badge {
  color: #d32f2f;
  font-size: 13px;
  margin-left: 8px;
}

.rating {
  font-size: 14px;
  color: #444;
  margin-bottom: 4px;
}

.address {
  font-size: 13px;
  color: #777;
  margin-bottom: 12px;
}

.button-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 120px;
  align-items: flex-end;
  justify-content: flex-start;
}

.friend-btn,
.call-btn {
  font-size: 13px;
  font-weight: 600;
  padding: 8px 14px;
  border: none;
  border-radius: 999px;
  cursor: pointer;
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.friend-btn {
  background: #f5f5f5;
  color: #333;
}
.friend-btn:hover {
  transform: scale(1.05);
  background: #e0e0e0;
}

.call-btn {
  background: #ff6f00;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}
.call-btn:hover {
  transform: scale(1.05);
  opacity: 0.95;
}
</style>
