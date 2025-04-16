<!-- HungllIntroModal.vue -->
<template>
    <div class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-content">
        <p>🙌 로그인 후 헝글의 추천을 받아보세요!</p>
        <div class="button-group">
          <button class="confirm" @click="$emit('confirm')">확인</button>
          <button class="cancel" @click="$emit('close')">취소</button>
        </div>
      </div>
    </div>
  </template>
  
  <style scoped>
  .modal-overlay {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999;
  }
  
  .modal-content {
    background: white;
    border-radius: 16px;
    padding: 32px 24px;
    text-align: center;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
    max-width: 320px;
    animation: popup-fade 0.3s ease-out;
  }
  
  .modal-content p {
    font-size: 16px;
    margin-bottom: 20px;
  }
  
  .button-group {
    display: flex;
    justify-content: space-around;
    gap: 5px;
  }
  
  button {
    padding: 10px 24px;
    border: none;
    border-radius: 20px;
    cursor: pointer;
    font-weight: bold;
  }
  
  .confirm {
    background: linear-gradient(135deg, #ff9800, #ff5722);
    color: white;
  }
  .cancel {
    background: #e0e0e0;
    color: #333;
  }
  
  @keyframes popup-fade {
    from {
      transform: scale(0.9);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }
  </style>
  