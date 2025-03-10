<template>
    <v-container fluid class="pa-4">
        <!-- Kakao Map을 표시할 Hero 섹션 -->
        <v-row>
            <v-col cols="12">
                <div id="map" style="width: 100%; height: 600px;"></div>
            </v-col>
        </v-row>

        <!-- Footer 섹션 -->
        <v-row>
            <v-col cols="12" class="text-center">
                <v-divider></v-divider>
                <p>&copy; 2025 SNACK. All rights reserved.</p>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import { useRuntimeConfig } from '#imports'
import { ref, onMounted } from 'vue'


const config = useRuntimeConfig();
const restaurants = ref([]);

onMounted(async () => {
    await loadRestaurants();
    loadKakaoMap();
});

const loadRestaurants = async () => {
    try {
        const response = await fetch('http://localhost:8000/restaurants/list/');
        restaurants.value = await response.json();
    } catch (error) {
        console.error("API 로딩 실패:", error);
    }
};

const loadKakaoMap = () => {
    const KAKAO_API_KEY = config.public.KAKAO_JAVASCRIPT_APP_KEY;
    if (window.kakao && window.kakao.maps) {
        initMap();
    } else {
        const script = document.createElement("script");
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_API_KEY}&autoload=false`;
        script.onload = () => {
            kakao.maps.load(initMap);
        };
        document.head.appendChild(script);
    }
};

const initMap = () => {
    const container = document.getElementById("map");
    if (!container) return;

    const map = new kakao.maps.Map(container, {
        center: new kakao.maps.LatLng(37.496486063, 127.028361548),
        level: 3,
    });

    addMarkers(map);
};

const addMarkers = (map) => {
    restaurants.value.forEach(({ name, latitude, longitude, address }) => {
        const marker = new kakao.maps.Marker({
            position: new kakao.maps.LatLng(latitude, longitude),
            map: map
        });

        const infoWindow = new kakao.maps.InfoWindow({
            content: `<div style="padding:5px;font-size:14px;">${name}<br>${address}</div>`
        });

        kakao.maps.event.addListener(marker, "click", () => {
            infoWindow.open(map, marker);
        });
    });
};
</script>

<style scoped>
</style>
