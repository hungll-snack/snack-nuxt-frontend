import * as axiosUtility from "../../utility/axiosInstance";
import type { AxiosResponse } from "axios";
import { useAccountStore } from "./accountStore";

export const accountAction = {
  async requestEmail(userToken: string): Promise<string | null> {
    if (!userToken) {
      console.error("❌ requestEmail() 호출 시 userToken이 없습니다.");
      return null;
    }
  
    const { djangoAxiosInstance } = axiosUtility.createAxiosInstances();
    const accountId = localStorage.getItem("account_id");
  
    if (!accountId) {
      console.error("❌ account_id가 없습니다. 이메일 요청 불가.");
      return null;
    }
  
    const payload = {
      userToken,
      account_id: accountId,
    };
  
    console.log("📦 requestEmail 보낼 payload:", payload); // ✅ 실제로 어떤 데이터를 보내는지 확인
  
    try {
      const res: AxiosResponse = await djangoAxiosInstance.post("/account/email/", payload);
  
      console.log("✅ requestEmail 응답:", res.data);
      return res.data.email;
    } catch (error) {
      console.error("❌ requestEmail() 오류:", error);
      return null;
    }
  },
  
  
  async getAccount(email: string): Promise<void> {
    if (!email) {
      console.error("❌ 이메일 값이 없습니다. API 요청을 중단합니다.");
      return;
    }

    const { djangoAxiosInstance } = axiosUtility.createAxiosInstances();
    const accountStore = useAccountStore(); // ✅ 여기서 store 인스턴스 고정

    try {
      console.log(`🚀 getAccount API 호출: /account/get/${email}/`);
      const accountRes: AxiosResponse = await djangoAxiosInstance.get(
        `/account/get/${email}/`
      );

      console.log("✅ 백엔드 응답 확인 (계정):", accountRes.data);

      accountStore.$patch({
        accountId: accountRes.data.account_id, // ✅ account_id 저장
        email: accountRes.data.email,
        accountPath: accountRes.data.account_path,
        accountRegister: accountRes.data.account_register,
      });

      console.log("🟢 저장된 accountId:", accountStore.accountId);

      const accountId = accountRes.data.account_id
      localStorage.setItem('account_id', accountId)

    } catch (error) {
      console.error("❌ getAccount() 오류:", error);
    }
  },

  async getProfile(email: string): Promise<void> {
    if (!email) {
      console.error("❌ 이메일 값이 없습니다. API 요청을 중단합니다.");
      return;
    }

    const { djangoAxiosInstance } = axiosUtility.createAxiosInstances();
    const accountStore = useAccountStore(); // ✅ 중복 호출 방지

    try {
      console.log(`🚀 getProfile API 호출: /account-profile/get/${email}/`);
      const profileRes: AxiosResponse = await djangoAxiosInstance.get(
        `/account-profile/get/${email}/`
      );

      console.log("✅ 백엔드 응답 확인 (프로필):", profileRes.data);
      accountStore.$patch({
        name: profileRes.data.account_name,
        nickname: profileRes.data.account_nickname,
        phoneNum: profileRes.data.phone_num,
        address: profileRes.data.account_add,
        gender: profileRes.data.account_sex,
        birth: profileRes.data.account_birth,
        payment: profileRes.data.account_pay,
        subscribe: profileRes.data.account_sub,
      });

      console.log("✅ accountStore.accountId (프로필 내부):", accountStore.accountId);

    } catch (error) {
      console.error("❌ getProfile() 오류:", error);
    }
  },

  async getAccountAndProfile(userToken: string): Promise<void> {
    try {
      const email = await this.requestEmail(userToken);
      if (!email) return;

      await this.getAccount(email);
      await this.getProfile(email);

      const accountStore = useAccountStore();
      console.log("🟢 최종 저장된 accountId:", accountStore.accountId);

    } catch (error) {
      console.error("❌ getAccountAndProfile() 오류:", error);
    }
  }
};
