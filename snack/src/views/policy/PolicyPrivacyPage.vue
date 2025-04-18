<template>
  <div class="policy-wrapper">
    <h2>약관 동의</h2>
    <br />

    <!-- ✅ 개인정보처리방침 -->
    <section class="policy-section">
      <label class="policy-check">
        <input type="checkbox" v-model="privacyAgreed" @change="onAgree('privacy')" />
        개인정보처리방침에 동의합니다
      </label>

      <div v-if="showPrivacy" class="policy-text-box" v-html="privacyText"></div>

      <div class="toggle-line">
        <button class="toggle-btn" @click="toggleView('privacy')">
          {{ showPrivacy ? '내용 접기' : '자세히 보기' }}
        </button>
      </div>
    </section>

    <v-divider class="divider" />

    <!-- ✅ 이용약관 -->
    <section class="policy-section">
      <label class="policy-check">
        <input type="checkbox" v-model="termsAgreed" @change="onAgree('terms')" />
        이용약관에 동의합니다
      </label>

      <div v-if="showTerms" class="policy-text-box" v-html="termsText"></div>

      <div class="toggle-line">
        <button class="toggle-btn" @click="toggleView('terms')">
          {{ showTerms ? '내용 접기' : '자세히 보기' }}
        </button>
      </div>
    </section>

    <!-- ✅ 로그인 버튼 -->
    <button class="custom-btn agree-btn" :disabled="!canProceed" @click="goToLogin">
      간편 로그인으로 계속하기
    </button>

    <p class="back-text" @click="goBack">돌아가기</p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { privacyText } from './PrivacyText'
import { termsText } from './TermsText'

const router = useRouter()

const privacyAgreed = ref(false)
const termsAgreed = ref(false)
const showPrivacy = ref(true)
const showTerms = ref(true)

const canProceed = computed(() => privacyAgreed.value && termsAgreed.value)

const toggleView = (type: string) => {
  if (type === 'privacy') showPrivacy.value = !showPrivacy.value
  if (type === 'terms') showTerms.value = !showTerms.value
}

const onAgree = (type: string) => {
  if (type === 'privacy' && privacyAgreed.value) showPrivacy.value = false
  if (type === 'terms' && termsAgreed.value) showTerms.value = false
}

const goToLogin = () => {
  if (canProceed.value) {
    sessionStorage.setItem('agreed', 'true')
    router.push('/login')
  }
}


const goBack = () => {
  router.push('/')
}
</script>

<style scoped>
.policy-wrapper {
  max-width: 800px;
  width: 90%;
  margin: 40px auto;
  padding: 24px;
  border: 1px solid #eee;
  border-radius: 12px;
  background-color: #fff;
  box-sizing: border-box;
}

.policy-section {
  margin-bottom: 32px;
}

.policy-check {
  font-size: 1rem;
  font-weight: 500;
}

.policy-text-box {
  font-size: 0.9rem;
  color: #444;
  line-height: 1.6;
  white-space: pre-line;
  padding: 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
  max-height: 250px;
  overflow-y: auto;
  margin-top: 8px;
}

.toggle-line {
  margin-top: 8px;
  text-align: left;
}

.toggle-btn {
  background: none;
  border: none;
  color: #1976d2;
  cursor: pointer;
  text-decoration: underline;
  font-size: 0.9rem;
  padding: 0;
}

.divider {
  margin: 24px 0;
  border-color: #ccc;
}

.agree-btn {
  width: 100%;
  max-width: 300px;
  margin: 24px auto 8px;
  display: block;
  background-color: #ffaa00;
  color: white;
  padding: 12px;
  border-radius: 6px;
  font-weight: bold;
  transition: background-color 0.2s;
  font-size: 1rem;
}

.agree-btn:disabled {
  background-color: #ddd;
  color: #999;
  cursor: not-allowed;
}

.back-text {
  margin-top: 16px;
  color: #666;
  text-decoration: underline;
  cursor: pointer;
  text-align: center;
  font-size: 0.9rem;
}

/* 📱 모바일 대응 */
@media (max-width: 600px) {
  .policy-wrapper {
    padding: 16px;
    margin: 24px auto;
  }

  .policy-check {
    font-size: 0.95rem;
  }

  .policy-text-box {
    font-size: 0.85rem;
    padding: 12px;
  }

  .agree-btn {
    font-size: 0.95rem;
    padding: 10px;
  }
}

/* 💻 데스크탑 이상에서는 살짝 키움 */
@media (min-width: 1200px) {
  .policy-wrapper {
    padding: 32px;
  }

  .policy-check {
    font-size: 1.05rem;
  }

  .policy-text-box {
    font-size: 1rem;
  }

  .agree-btn {
    font-size: 1.1rem;
    padding: 14px;
  }
}
</style>
