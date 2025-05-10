<template>
  <div class="map-wrapper">
    <div id="map" class="map-area" />
  </div>
</template>

  
  <script setup lang="ts">
  import { onMounted, watch } from 'vue'
  import { useRestaurantsStore } from '@/store/restaurants/restaurantsStore'
  
  const restaurantStore = useRestaurantsStore()
  
  let map: any = null
  let clusterer: any = null
  let defaultCenter: any = null
  
  function initMap() {
    const container = document.getElementById('map') as HTMLElement

    defaultCenter = new window.kakao.maps.LatLng(37.49919, 127.03088)
    const options = {
      center: defaultCenter,
      level: 4,
    }
  
    map = new window.kakao.maps.Map(container, options)

    map.setCenter(defaultCenter)
  
    clusterer = new window.kakao.maps.MarkerClusterer({
      map,
      averageCenter: false,
      minLevel: 4,
    })

    setTimeout(() => {
        map.relayout()
        map.setCenter(defaultCenter)
    }, 300)
  
    updateMarkers()
  }
  
  function updateMarkers() {
    if (!map || !clusterer) return
  
    const validRestaurants = restaurantStore.restaurantList.filter(r => {
      const lat = parseFloat(r.latitude)
      const lng = parseFloat(r.longitude)
      return isFinite(lat) && isFinite(lng)
    })
  
    console.log('✅ 좌표 확인 (최초 10개):', restaurantStore.restaurantList.slice(0, 10).map(r => [r.name, typeof r.latitude, r.latitude, typeof r.longitude, r.longitude]))
  
    clusterer.clear()
  
    if (validRestaurants.length === 0) {
      map.setCenter(defaultCenter)
      return
    }
  
    const markers = validRestaurants.map((r) => {
      const lat = parseFloat(r.latitude)
      const lng = parseFloat(r.longitude)
      const pos = new window.kakao.maps.LatLng(lat, lng)
      const marker = new window.kakao.maps.Marker({ position: pos })
      marker.__pos = pos
  
      const info = new window.kakao.maps.InfoWindow({
        content: `<div style="padding:5px;font-size:14px;">${r.name}<br/>⭐ ${r.rating}</div>`,
      })
  
      window.kakao.maps.event.addListener(marker, 'mouseover', () => info.open(map, marker))
      window.kakao.maps.event.addListener(marker, 'mouseout', () => info.close())
  
      return marker
    })
  
    clusterer.addMarkers(markers)
  
    const bounds = new window.kakao.maps.LatLngBounds()
    markers.forEach(m => {
        if (m.__pos) {
            bounds.extend(m.__pos)
        }
    })
  
    if (!bounds.isEmpty?.() && bounds.getSouthWest && bounds.getNorthEast) {
      map.setBounds(bounds)
    } else {
      map.setCenter(defaultCenter)
    }
  }
  
  onMounted(() => {
    const wait = setInterval(() => {
      if (window.kakao && window.kakao.maps && window.kakao.maps.load) {
        clearInterval(wait)
        window.kakao.maps.load(initMap)
      }
    }, 100)
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
.map-wrapper {
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
}


  </style>
  