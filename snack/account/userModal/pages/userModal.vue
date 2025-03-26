<template>
  <v-dialog :model-value="show" @update:model-value="updateShow" max-width="320px">
    <v-card class="modal-card">
      <v-card-title class="modal-title">계정 정보</v-card-title>
      <v-card-text>
        <p>이메일: {{ account.email }}</p>
        <p>가입경로: {{ account.accountPath }}</p>
        <p>가입날짜: {{ account.accountRegister }}</p>
        <p>이름: {{ account.name }}</p>
        <p>닉네임: {{ account.nickname }}</p>
        <p>전화번호: {{ account.phoneNum }}</p>
        <p>주소: {{ account.address }}</p>
        <p>성별: {{ account.gender }}</p>
        <p>생년월일: {{ account.birth }}</p>
        <p>결제수단: {{ account.payment }}</p>
        <p>구독여부: {{ account.subscribe ? "구독" : "미구독" }}</p>
      </v-card-text>
      <v-card-actions>
        <v-btn color="red" @click="emit('logout')">로그아웃</v-btn> <!-- ✅ 직접 이벤트만 emit -->
        <v-btn @click="updateShow(false)">닫기</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { defineProps, defineEmits, onMounted } from "vue";
import { useAccountStore } from "@/account/userModal/stores/accountStore";
import { accountAction } from "@/account/userModal/stores/accountActions";

const props = defineProps({ 
  show: Boolean,  // ✅ 부모에서 전달받는 `show`
});

const emit = defineEmits(["update:show", "logout"]);
const account = useAccountStore(); // ✅ Pinia Store 사용

// ✅ 모달 상태 업데이트
const updateShow = (value) => {
  emit("update:show", value);
};

// ✅ 계정 데이터 불러오기
const loadAccountData = async () => {
  try {
    console.log("🚀 계정 정보 로딩 시작");

    const userToken = localStorage.getItem("userToken");
    if (!userToken) {
      console.error("❌ userToken이 없습니다.");
      return;
    }

    await accountAction.getAccountAndProfile(userToken);
    console.log("✅ 계정 정보 로딩 완료");
  } catch (error) {
    console.error("❌ 계정 정보 불러오기 오류:", error);
  }
};

onMounted(() => {
  loadAccountData();
});
</script>

<style scoped>
.modal-card {
  padding: 20px;
}
.modal-title {
  font-size: 18px;
  font-weight: bold;
}
</style>
