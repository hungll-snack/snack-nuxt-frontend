<template>
    <div class="search-section-card">
      <h2 class="section-title">🔎 밥친구 검색</h2>
  
      <!-- 📌 제목 검색 -->
      <div class="input-wrapper">
        <label class="input-label">📝 제목</label>
        <input class="search-input" type="text" placeholder="제목을 입력하세요" v-model="title" />
      </div>
  
      <!-- 🧑‍💼 작성자 검색 -->
      <div class="input-wrapper">
        <label class="input-label">👤 작성자</label>
        <input class="search-input" type="text" placeholder="작성자 이름" v-model="author" />
      </div>
  
      <div class="divider" />
  
      <!-- 📅 날짜 검색 -->
      <div class="date-flex-wrapper">
        <div class="input-wrapper">
          <label class="input-label">📅 시작 날짜</label>
          <input
            class="search-input"
            :value="sDate"
            readonly
            @click="openStartCalendar"
            placeholder="날짜 선택"
          />
          <HungllDatePicker ref="startCalendar" v-model="sDate" />
        </div>
  
        <div class="input-wrapper">
          <label class="input-label">📅 종료 날짜</label>
          <input
            class="search-input"
            :value="eDate"
            readonly
            @click="openEndCalendar"
            placeholder="날짜 선택"
          />
          <HungllDatePicker ref="endCalendar" v-model="eDate" />
        </div>
      </div>
  
      <div class="button-flex-wrapper">
        <button class="btn primary" @click="handleSearch">검색</button>
        <button class="btn grey" @click="handleReset">초기화</button>
      </div>
  
      <div class="divider" />
      <button class="btn orange">+ 모임 등록</button>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, onBeforeUnmount } from 'vue'
  import HungllDatePicker from '@/common/components/HungllDatePicker.vue'
  
  const title = ref('')
  const author = ref('')
  const sDate = ref('')
  const eDate = ref('')
  
  const startCalendar = ref()
  const endCalendar = ref()
  
  const openStartCalendar = () => {
    startCalendar.value?.open()
  }
  const openEndCalendar = () => {
    endCalendar.value?.open()
  }
  
  const handleReset = () => {
    title.value = ''
    author.value = ''
    sDate.value = ''
    eDate.value = ''
  }
  
  const handleSearch = () => {
    console.log('검색!', { title: title.value, author: author.value, sDate: sDate.value, eDate: eDate.value })
  }
  
  const handleClickOutside = (event: MouseEvent) => {
    const popup1 = startCalendar.value?.$refs?.popup || startCalendar.value?.getPopupElement?.()
    const popup2 = endCalendar.value?.$refs?.popup || endCalendar.value?.getPopupElement?.()
  
    if (
      popup1 && !popup1.contains(event.target as Node) &&
      popup2 && !popup2.contains(event.target as Node)
    ) {
      startCalendar.value?.close()
      endCalendar.value?.close()
    }
  }
  
  onMounted(() => {
    window.addEventListener('click', handleClickOutside)
  })
  
  onBeforeUnmount(() => {
    window.removeEventListener('click', handleClickOutside)
  })
  </script>
  
  <style scoped>
  .search-section-card {
    padding: 24px;
    background: white;
    border-radius: 16px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.06);
    transition: 0.3s ease;
    border: 1px solid #f2f2f2;
    position: relative;
  }
  
  .section-title {
    font-size: 22px;
    font-weight: 700;
    margin-bottom: 20px;
    color: #ff7043;
  }
  
  .input-wrapper {
    margin-bottom: 16px;
    flex: 1;
  }
  
  .input-label {
    display: block;
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 6px;
    color: #444;
  }
  
  .search-input {
    width: 100%;
    padding: 12px 16px;
    border: 1px solid #e0e0e0;
    border-radius: 12px;
    font-size: 14px;
    transition: 0.2s;
    background: white;
  }
  
  .search-input:focus {
    outline: none;
    border-color: #ff7043;
    box-shadow: 0 0 0 2px rgba(255, 112, 67, 0.2);
  }
  
  .divider {
    border-top: 1px solid #f2f2f2;
    margin: 20px 0;
  }
  
  .btn {
    width: 100%;
    padding: 12px;
    font-weight: 600;
    border-radius: 12px;
    border: none;
    cursor: pointer;
    margin-bottom: 12px;
    transition: 0.2s;
    font-size: 15px;
  }
  
  .btn.primary {
    background-color: #ff7043;
    color: white;
  }
  
  .btn.primary:hover {
    background-color: #ff5722;
  }
  
  .btn.grey {
    background-color: #eeeeee;
    color: #555;
  }
  
  .btn.grey:hover {
    background-color: #e0e0e0;
  }
  
  .btn.orange {
    background-color: #ffe0b2;
    color: #e65100;
  }
  
  .btn.orange:hover {
    background-color: #ffcc80;
  }
  
  .date-flex-wrapper {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  
  .button-flex-wrapper {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  @media (min-width: 768px) {
    .date-flex-wrapper {
      flex-direction: row;
      gap: 12px;
    }
  
    .button-flex-wrapper {
      flex-direction: row;
    }
  
    .button-flex-wrapper .btn {
      width: 100%;
    }
  }
  </style>
  