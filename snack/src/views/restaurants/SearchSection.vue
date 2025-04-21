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
        <div class="rating">⭐ {{ r.rating }} / 리뷰 {{ r.reviewCount }}</div>
        <div class="address">📍 {{ r.address }}</div>
        <div class="button-group">
          <button class="friend-btn" @mousedown.prevent>밥 친구 찾기 ({{ r.friendCount || 0 }})</button>
          <button class="call-btn" @mousedown.prevent>전화 하기</button>
        </div>
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
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.03);
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
  color: #ff6f00;
}

.restaurant-card {
  background: #fffaf5;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(255, 102, 0, 0.05);
  margin-bottom: 16px;
  border-left: 4px solid #ff9800;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.restaurant-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(255, 102, 0, 0.1);
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
  color: #ff6f00;
  margin-bottom: 4px;
}

.address {
  font-size: 13px;
  color: #666;
  margin-bottom: 8px;
}

.button-group {
  display: flex;
  gap: 8px;
}

.friend-btn,
.call-btn {
  font-size: 13px;
  font-weight: 600;
  padding: 6px 12px;
  border: none;
  border-radius: 999px;
  cursor: pointer;
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.friend-btn {
  background: #ffe0b2;
  color: #e65100;
}
.friend-btn:hover {
  transform: scale(1.05);
  background: #ffd699;
}

.call-btn {
  background: linear-gradient(to right, #ff9800, #ff5722);
  color: white;
}
.call-btn:hover {
  transform: scale(1.05);
  opacity: 0.95;
}
</style>