<template>
    <div id="map" class="w-full h-full rounded-lg" />
  </template>
  
  <script setup lang="ts">
  import { onMounted, watch } from 'vue'
  import { useRestaurantStore } from '@/store/restaurants/restaurantsStore'
  
  const restaurantStore = useRestaurantStore()
  
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
  
    const validRestaurants = restaurantStore.restaurants.filter(r => {
      const lat = parseFloat(r.latitude)
      const lng = parseFloat(r.longitude)
      return isFinite(lat) && isFinite(lng)
    })
  
    console.log('✅ 좌표 확인 (최초 10개):', restaurantStore.restaurants.slice(0, 10).map(r => [r.name, typeof r.latitude, r.latitude, typeof r.longitude, r.longitude]))
  
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
    () => restaurantStore.restaurants,
    () => {
      updateMarkers()
    },
    { deep: true }
  )
  </script>
  
  <style scoped>
  .map-wrapper {
    height: 600px; /* ✅ 고정 높이 */
    width: 100%;
  }
  #map {
    height: 100%;
    width: 100%;
  }
  </style>
  