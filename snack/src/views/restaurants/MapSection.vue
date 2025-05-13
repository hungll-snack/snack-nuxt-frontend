<template>
  <!-- <div class="map-wrapper">
    <div id="map" class="map-area" />
  </div> -->
</template>

<script setup lang="ts">
// import { onMounted, watch } from 'vue'
// import { useRestaurantsStore } from '@/store/restaurants/restaurantsStore'

// const restaurantStore = useRestaurantsStore()

// let map: any = null
// let clusterer: any = null
// let defaultCenter: any = null
// let isInitialLoad = true // 🔑 최초 1회만 setCenter 실행

// function initMap() {
//   const container = document.getElementById('map') as HTMLElement

//   defaultCenter = new window.kakao.maps.LatLng(37.49919, 127.03088)
//   const options = {
//     center: defaultCenter,
//     level: 4,
//   }

//   map = new window.kakao.maps.Map(container, options)

//   clusterer = new window.kakao.maps.MarkerClusterer({
//     map,
//     averageCenter: false,
//     minLevel: 4,
//   })

//   // ⏱️ relayout + 최초 1회 center 설정
//   setTimeout(() => {
//     map.relayout()
//     if (isInitialLoad) {
//       map.setCenter(defaultCenter)
//       isInitialLoad = false
//     }
//   }, 300)

//   updateMarkers()
// }

// function updateMarkers() {
//   if (!map || !clusterer) return

//   const validRestaurants = restaurantStore.restaurantList.filter(r => {
//     const lat = Number(r.latitude)
//     const lng = Number(r.longitude)
//     return isFinite(lat) && isFinite(lng) && lat !== 0 && lng !== 0
//   })

//   console.log('🍽️ 전체 식당 수:', restaurantStore.restaurantList.length)
//   console.log('✅ 유효 좌표 식당 수:', validRestaurants.length)

//   clusterer.clear()

//   const markers = validRestaurants.map(r => {
//     const lat = Number(r.latitude)
//     const lng = Number(r.longitude)
//     const pos = new window.kakao.maps.LatLng(lat, lng)
//     const marker = new window.kakao.maps.Marker({ position: pos })
//     marker.__pos = pos

//     const info = new window.kakao.maps.InfoWindow({
//       content: `<div style="padding:5px;font-size:14px;">${r.name}<br/>⭐ ${r.rating}</div>`,
//     })

//     window.kakao.maps.event.addListener(marker, 'mouseover', () => info.open(map, marker))
//     window.kakao.maps.event.addListener(marker, 'mouseout', () => info.close())

//     return marker
//   })

//   clusterer.addMarkers(markers)

//   console.log('📌 최종 마커 수:', markers.length)

//   if (markers.length > 0) {
//     if (markers.length <= 30) {
//       const bounds = new window.kakao.maps.LatLngBounds()
//       markers.forEach(m => bounds.extend(m.__pos))

//       setTimeout(() => {
//         map.setBounds(bounds)
//       }, 100)
//     } else {
//       map.setCenter(defaultCenter)
//     }
//   } else {
//     map.setCenter(defaultCenter)
//   }
// }


// onMounted(() => {
//   const wait = setInterval(() => {
//     if (window.kakao && window.kakao.maps && window.kakao.maps.load) {
//       clearInterval(wait)
//       window.kakao.maps.load(initMap)
//     }
//   }, 100)
// })

// watch(
//   () => restaurantStore.restaurantList,
//   () => {
//     updateMarkers()
//   },
//   { deep: true }
// )
</script>

<style scoped>
/* .map-wrapper {
  width: 100%;
  height: 600px;
  padding: 8px;
  background: #f9f9f9;
  border-radius: 16px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
}

.map-area {
  width: 100%;
  height: 100%;
  border-radius: 12px;
  box-shadow: inset 0 0 4px rgba(0, 0, 0, 0.02);
} */
</style>
