<template>
  <div class="mypage-container">
    <h1>마이페이지</h1>
    <p>이메일: {{ account.email }}</p>
    <p>이름: {{ account.name }}</p>
    <p>닉네임: {{ account.nickname }}</p>
    <p>전화번호: {{ account.phoneNum }}</p>
    <p>주소: {{ account.address }}</p>
    <p>성별: {{ account.gender }}</p>
    <p>생년월일: {{ account.birth }}</p>
    <p>결제수단: {{ account.payment }}</p>
    <p>구독여부: {{ account.subscribe ? "구독" : "미구독" }}</p>
    <p>가입날짜: {{ account.accountRegister }}</p>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useAccountStore } from "@/stores/accountStore";
import { accountAction } from "@/stores/accountActions";

const account = useAccountStore();

const loadAccountData = async () => {
  try {
    console.log("🚀 마이페이지 로딩 시작");

    const userToken = localStorage.getItem("userToken");
    if (!userToken) {
      console.error("❌ userToken이 없습니다.");
      return;
    }

    const email = await accountAction.requestEmail(userToken);
    if (!email) {
      console.error("❌ 이메일을 가져오지 못했습니다.");
      return;
    }

    await accountAction.getAccount(email);
    console.log("✅ 마이페이지 데이터 로딩 완료");
  } catch (error) {
    console.error("❌ 마이페이지 데이터 불러오기 오류:", error);
  }
};

onMounted(() => {
  loadAccountData();
});
</script>

<style scoped>
.mypage-container {
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>