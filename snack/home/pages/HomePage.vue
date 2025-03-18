<template>
    <v-container fluid class="pa-4">
        <!-- ✅ 채팅 입력 효과 적용된 텍스트 -->
        <v-row justify="center" class="text-section">
            <h2>
                {{ location }}에서 
                <span style="color: #E76200" class="typing-text">{{ displayedText }}</span>찾고 계신가요?
            </h2>
        </v-row>

        <!-- Kakao Map -->
        <v-row>
            <v-col cols="12">
                <div id="map" class="map-container"></div>
            </v-col>
        </v-row>

        <!-- Footer -->
        <v-row>
            <v-col cols="12" class="text-center">
                <v-divider></v-divider>
                <p>&copy; 2025 SNACK. All rights reserved.</p>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

const location = ref("독산동"); // ✅ 원하는 지역명
const words = ["맛집을 ", "동네친구를 ", "에디 아카데미를 "]; // ✅ 타이핑될 단어들
const displayedText = ref(""); // 현재 표시되는 텍스트
let currentWordIndex = 0;
let isDeleting = false;
let charIndex = 0;

const typeEffect = () => {
    const currentWord = words[currentWordIndex];

    if (isDeleting) {
        // 글자 삭제
        displayedText.value = currentWord.substring(0, charIndex--);
    } else {
        // 글자 추가
        displayedText.value = currentWord.substring(0, charIndex++);
    }

    let speed = isDeleting ? 100 : 150; // 삭제 속도는 더 빠르게
    if (!isDeleting && charIndex === currentWord.length) {
        speed = 1000; // 단어가 다 입력되면 잠시 멈춤
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        currentWordIndex = (currentWordIndex + 2) % words.length; // 다음 단어로 변경
    }

    setTimeout(typeEffect, speed);
};

onMounted(() => {
    typeEffect();
});
</script>

<style scoped>
/* ✅ 텍스트 스타일 */
.text-section {
    text-align: center;
    margin-bottom: 16px;
    font-size: 24px;
    font-weight: bold;
    display: flex;
    justify-content: center;
    align-items: center;
}

/* ✅ 타이핑 효과 (커서 깜빡임) */
.typing-text::after {
    content: "|";
    display: inline-block;
    animation: blink 0.7s infinite;
}

@keyframes blink {
    0% { opacity: 1; }
    50% { opacity: 0; }
    100% { opacity: 1; }
}

/* ✅ 카카오 맵 스타일 */
.map-container {
    width: 100%;
    height: 600px;
}
</style>
