<template>
  <v-container fluid>
    <v-row>
      <v-col
        cols="12"
        md="6"
        style="height: 600px"
        class="map-col"
      >
        <div class="map-wrapper">
          <div
            id="map"
            class="map-area"
          />
        </div>
      </v-col>
      <v-col
        cols="12"
        md="6"
        class="search-col"
      >
        <div
          class="restaurant-list-wrapper"
        >
          <input
            v-model="
              restaurantStore.searchKeyword
            "
            @keydown.enter="search"
            placeholder="식당명을 검색하세요"
            class="search-input"
          />
          <!-- 📍 검색창 아래 필터 버튼들 추가 -->
          <div class="filter-section">
            <div class="filter-group">
              <h4 class="filter-title">
                지역
              </h4>
              <div
                class="filter-button-group"
              >
                <button
                  v-for="area in areas"
                  :key="area"
                  :class="[
                    'filter-button',
                    selectedAreas.includes(
                      area
                    )
                      ? 'selected'
                      : '',
                  ]"
                  @click="
                    toggleArea(area)
                  "
                >
                  {{ area }}
                </button>
              </div>
            </div>

            <div class="filter-group">
              <h4 class="filter-title">
                카테고리
              </h4>
              <div
                class="filter-button-group"
              >
                <button
                  v-for="cat in categories"
                  :key="cat"
                  :class="[
                    'filter-button',
                    selectedCategories.includes(
                      cat
                    )
                      ? 'selected'
                      : '',
                  ]"
                  @click="
                    toggleCategory(cat)
                  "
                >
                  {{ cat }}
                </button>
              </div>
            </div>
          </div>

          <h2 class="list-title">
            🍽️ 맛집 목록
          </h2>

          <div
            v-for="r in restaurantStore.restaurantList"
            :key="r.id"
            class="restaurant-card"
          >
            <div class="flex-1">
              <div
                class="restaurant-name"
              >
                {{ r.name }}
                <span
                  v-if="r.closed"
                  class="closed-badge"
                  >영업종료</span
                >
              </div>
              <div class="address">
                📍 {{ r.address }}
              </div>
            </div>
            <div class="button-group">
              <button
                class="friend-btn"
                @mousedown.prevent
                @click="
                  alertServiceReady
                "
              >
                밥 친구 찾기 ({{
                  r.friendCount || 0
                }})
              </button>
              <button
                class="call-btn"
                @mousedown.prevent
                @click="
                  alertServiceReady
                "
              >
                <span class="icon"
                  >📞</span
                >
                전화 하기
              </button>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import {
  ref,
  onMounted,
  watch,
} from 'vue'
import { useRestaurantsStore } from '@/store/restaurants/restaurantsStore'

const areas = [
  '종로구', '중구', '용산구', '성동구', '광진구',
  '동대문구', '중랑구', '성북구', '강북구', '도봉구',
  '노원구', '은평구', '서대문구', '마포구', '양천구',
  '강서구', '구로구', '금천구', '영등포구', '동작구',
  '관악구', '서초구', '강남구', '송파구', '강동구'
]

const categories = ['한식', '양식', '일식', '중식', '카페', '분식', '고기', '술집']

const selectedAreas = ref<string[]>([])
const selectedCategories = ref<string[]>([])

const toggleArea = (area: string) => {
  if (selectedAreas.value.includes(area)) {
    selectedAreas.value = selectedAreas.value.filter(a => a !== area)
  } else {
    selectedAreas.value.push(area)
  }
}

const toggleCategory = (cat: string) => {
  if (selectedCategories.value.includes(cat)) {
    selectedCategories.value = selectedCategories.value.filter(c => c !== cat)
  } else {
    selectedCategories.value.push(cat)
  }
}

const keyword = ref('')
const restaurantStore =
  useRestaurantsStore()

const search = () => {
  if (
    restaurantStore.searchKeyword.trim()
  ) {
    restaurantStore.searchRestaurants()
  }
}

const alertServiceReady = () => {
  alert(
    '서비스 준비중입니다. 잠시만 기다려주세요.'
  )
}

let map: any = null
let clusterer: any = null
let defaultCenter: any = null
let isInitialLoad = true

function initMap() {
  const container =
    document.getElementById(
      'map'
    ) as HTMLElement
  defaultCenter =
    new window.kakao.maps.LatLng(
      37.49919,
      127.03088
    )
  const options = {
    center: defaultCenter,
    level: 4,
  }
  map = new window.kakao.maps.Map(
    container,
    options
  )
  clusterer =
    new window.kakao.maps.MarkerClusterer(
      {
        map,
        averageCenter: false,
        minLevel: 4,
      }
    )
  setTimeout(() => {
    map.relayout()
    if (isInitialLoad) {
      map.setCenter(defaultCenter)
      isInitialLoad = false
    }
  }, 300)
  updateMarkers()
}

function updateMarkers() {
  if (!map || !clusterer) return
  const validRestaurants =
    restaurantStore.restaurantList.filter(
      (r) => {
        const lat = Number(r.latitude)
        const lng = Number(r.longitude)
        return (
          isFinite(lat) &&
          isFinite(lng) &&
          lat !== 0 &&
          lng !== 0
        )
      }
    )
  console.log(
    '🍽️ 전체 식당 수:',
    restaurantStore.restaurantList
      .length
  )
  console.log(
    '✅ 유효 좌표 식당 수:',
    validRestaurants.length
  )
  clusterer.clear()
  const markers = validRestaurants.map(
    (r) => {
      const lat = Number(r.latitude)
      const lng = Number(r.longitude)
      const pos =
        new window.kakao.maps.LatLng(
          lat,
          lng
        )
      const marker =
        new window.kakao.maps.Marker({
          position: pos,
        })
      marker.__pos = pos
      const info =
        new window.kakao.maps.InfoWindow(
          {
            content: `<div style=\"padding:5px;font-size:14px;\">${r.name}<br/>⭐ ${r.rating}</div>`,
          }
        )
      window.kakao.maps.event.addListener(
        marker,
        'mouseover',
        () => info.open(map, marker)
      )
      window.kakao.maps.event.addListener(
        marker,
        'mouseout',
        () => info.close()
      )
      return marker
    }
  )
  clusterer.addMarkers(markers)
  console.log(
    '📌 최종 마커 수:',
    markers.length
  )
  if (markers.length > 0) {
    if (markers.length <= 30) {
      const bounds =
        new window.kakao.maps.LatLngBounds()
      markers.forEach((m) =>
        bounds.extend(m.__pos)
      )
      setTimeout(() => {
        map.setBounds(bounds)
      }, 100)
    } else {
      map.setCenter(defaultCenter)
    }
  } else {
    map.setCenter(defaultCenter)
  }
}

onMounted(async () => {
  const wait = setInterval(() => {
    if (
      window.kakao &&
      window.kakao.maps &&
      window.kakao.maps.load
    ) {
      clearInterval(wait)
      window.kakao.maps.load(initMap)
    }
  }, 100)

  await restaurantStore.loadAllRestaurants()
  await restaurantStore.loadBoardCounts()
})

watch(
  () => restaurantStore.restaurantList,
  () => {
    updateMarkers()
  },
  { deep: true }
)
</script>

<style scoped>
.map-col {
  padding-right: 8px;
}
.search-col {
  padding-left: 8px;
}
.map-wrapper {
  width: 100%;
  height: 600px;
  padding: 8px;
  background: #f9f9f9;
  border-radius: 16px;
  box-shadow: 0 2px 6px
    rgba(0, 0, 0, 0.03);
}
.map-area {
  width: 100%;
  height: 100%;
  border-radius: 12px;
  box-shadow: inset 0 0 4px
    rgba(0, 0, 0, 0.02);
}
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
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}
.search-input:focus {
  outline: none;
  border-color: #ff9800;
  box-shadow: 0 0 0 3px
    rgba(255, 152, 0, 0.2);
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
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}
.restaurant-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px
    rgba(0, 0, 0, 0.04);
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
  transition:
    transform 0.2s ease,
    opacity 0.2s ease;
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
.icon {
  margin-right: 4px;
}
.filter-section {
  margin-bottom: 20px;
}
.filter-group {
  margin-bottom: 12px;
}
.filter-title {
  font-size: 14px;
  font-weight: 600;
  color: #555;
  margin-bottom: 8px;
}
.filter-button-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.filter-button {
  padding: 6px 14px;
  background: #eee;
  color: #333;
  border: none;
  border-radius: 999px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
}
.filter-button.selected {
  background: linear-gradient(to right, #ff9800, #ff5722);
  color: #fff;
  font-weight: 700;
}

</style>
