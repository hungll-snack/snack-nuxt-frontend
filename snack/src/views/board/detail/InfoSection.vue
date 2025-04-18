<template>
  <v-card class="info-card fill-height">
    <div class="thumbnail-info-wrapper">
      <!-- 모바일: 좌우 배치 -->
      <div class="mobile-layout" v-if="$vuetify.display.smAndDown">
        <div class="thumbnail-container">
          <v-img
            :src="board?.image_url || '/default-thumbnail.jpg'"
            class="thumbnail-img"
          />
        </div>
        <div class="info-body">
          <div class="info-block">
            <span class="info-label">✨ 모임 제목</span>
            <div class="info-value">{{ board?.title }}</div>
          </div>
          <div class="info-block">
            <span class="info-label">📅 모임 날짜</span>
            <div class="info-value">{{ formattedDate }}</div>
          </div>
          <div class="info-block">
            <span class="info-label">👤 작성자</span>
            <div class="info-value">{{ board?.author_nickname }}</div>
          </div>
        </div>
      </div>

      <!-- 태블릿 이상: 위아래 배치 -->
<!-- 데스크탑 이상: 위아래 배치 -->
<div class="desktop-layout" v-else>
  <div class="thumbnail-wrapper">
    <v-img
      :src="board?.image_url || '/default-thumbnail.jpg'"
      class="thumbnail-img"
      cover
    />
  </div>
  <div class="info-body">
    <div class="info-block">
      <span class="info-label">✨ 모임 제목</span>
      <div class="info-value">{{ board?.title }}</div>
    </div>
    <div class="info-block">
      <span class="info-label">📅 모임 날짜</span>
      <div class="info-value">{{ formattedDate }}</div>
    </div>
    <div class="info-block">
      <span class="info-label">👤 작성자</span>
      <div class="info-value">{{ board?.author_nickname }}</div>
    </div>
  </div>
</div>

    </div>
  </v-card>
</template>

<script setup lang="ts">
defineProps<{
  board: {
    image_url?: string
    title?: string
    author_nickname?: string
  }
  formattedDate: string
}>()
</script>

<style scoped>
.info-card {
  border: 1px solid #e0e0e0;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  height: 100%;
  max-height: 560px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  padding-top: 50px;
}

.thumbnail-info-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.mobile-layout {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
}
.desktop-layout .thumbnail-wrapper {
  margin-top: -12px; /* 살짝 위로 올림 */
}

.desktop-layout {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.thumbnail-container {
  flex-shrink: 0;
}

.thumbnail-img {
  width: 200px;
  min-width: 150px;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
}

.info-body {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  flex: 1;
  min-width: 0;
}

.info-block {
  margin-bottom: 12px;
}

.info-label {
  font-size: 13px;
  font-weight: 500;
  color: #888;
  margin-bottom: 4px;
  display: block;
  margin-left: 10px;

}

.info-value {
  font-size: 15px;
  font-weight: 600;
  margin-left: 10px;
  color: #333;
}

@media (max-width: 576px) {
  .info-label {
    font-size: 12px;
    margin-left: 10px
  }
  .info-value {
    font-size: 14px;
    margin-left: 10px
  }
  .thumbnail-img {
    width: 200px;
    height: 100%;
    object-fit: cover;
    border-radius: 10px;
  }
}
</style>
