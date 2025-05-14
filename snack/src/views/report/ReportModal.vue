<template>
    <FocusTrap v-if="isOpen" :active="isOpen" :initial-focus="() => $refs.closeBtn">
      <div class="modal-overlay" @click.self="close">
        <div class="modal-content" role="dialog" aria-modal="true" aria-labelledby="report-title">
          <h2 id="report-title">신고하기</h2>
          <p>신고 사유를 선택해주세요:</p>
          <select v-model="selectedReason" class="reason-select">
            <option disabled value="">-- 사유 선택 --</option>
            <option v-for="(label, key) in reasonOptions" :key="key" :value="key">
              {{ label }}
            </option>
          </select>
          <div class="modal-actions">
            <button @click="submitReport" class="submit-btn">신고하기</button>
            <button ref="closeBtn" @click="close" class="cancel-btn">취소</button>
          </div>
        </div>
      </div>
    </FocusTrap>
  </template>
  
  <script setup lang="ts">
  import { ref, watch, defineProps, defineEmits } from 'vue';
  import { FocusTrap } from 'focus-trap-vue';
  import { useReportStore } from '@/store/report/reportStore';
  
  const props = defineProps<{
    isOpen: boolean;
    targetId: number;
    targetType: 'BOARD' | 'COMMENT';
  }>();
  
  const emit = defineEmits(['close']);
  
  const selectedReason = ref('');
  const reasonOptions = {
    SPAM: '불법광고',
    ABUSE: '욕설/인신공격',
    REPEAT: '도배성글/댓글반복',
    PRIVACY: '개인정보노출/사생활침해',
    SEXUAL: '음란성/선정성',
    FALSE_INFO: '허위정보/가짜리뷰',
    DISCRIMINATION: '차별/혐오표현',
    ETC: '기타부적절한행위',
  };
  
  const reportStore = useReportStore();
  
  const submitReport = async () => {
  if (!selectedReason.value) {
    alert('신고 사유를 선택해주세요.');
    return;
  }

  const payload = {
    content_id: props.targetId,
    target_type: props.targetType,
    reason_type: selectedReason.value,
  };

  console.log('📦 신고 요청 payload:', payload);

  try {
    await reportStore.requestReport(payload);
    alert('✅ 신고가 정상적으로 접수되었습니다.');
    close();
  } 
  catch (error: any) {
  console.error('❌ 신고 실패:', error);
  alert(error?.response?.data?.error || error.message || '❌ 신고에 실패했습니다.');
}
};
  
  const close = () => {
    selectedReason.value = '';
    emit('close');
  };
  </script>
  
  <style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .modal-content {
    background-color: #fff;
    padding: 24px;
    border-radius: 8px;
    width: 320px;
    max-width: 90%;
  }
  
  .reason-select {
    width: 100%;
    margin: 12px 0;
    padding: 8px;
    font-size: 14px;
  }
  
  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
  }
  
  .submit-btn {
    background-color: #ff6b6b;
    color: #fff;
    padding: 8px 12px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .cancel-btn {
    background-color: #ccc;
    color: #000;
    padding: 8px 12px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  </style>
  