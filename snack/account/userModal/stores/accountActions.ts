import * as axiosUtility from "../../../utility/axiosInstance";
import type { AxiosResponse } from "axios";
import { useAccountStore } from "./accountStore";

export const accountAction = {

  async requestEmail(userToken: string): Promise<string | null> {
    const { djangoAxiosInstance } = axiosUtility.createAxiosInstances();
    try {
      const res: AxiosResponse = await djangoAxiosInstance.post(
        "/account/email/",
        { userToken }
      );

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
    try {
      console.log(`🚀 getAccount API 호출: /account/get/${email}/`);
      const accountRes: AxiosResponse = await djangoAxiosInstance.get(
        `/account/get/${email}/`
      );

      console.log("✅ 백엔드 응답 확인 (계정):", accountRes.data);
      useAccountStore().$patch({
        email: accountRes.data.email,
        accountPath: accountRes.data.account_path,
        accountRegister: accountRes.data.account_register,
      });

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
    try {
      const encodedEmail = encodeURIComponent(email);
      console.log(`🚀 getProfile API 호출: /account-profile/get/${email}/`);
      const profileRes: AxiosResponse = await djangoAxiosInstance.get(
        `/account-profile/get/${email}/`
      );

      console.log("✅ 백엔드 응답 확인 (프로필):", profileRes.data);
      useAccountStore().$patch({
        name: profileRes.data.account_name,
        nickname: profileRes.data.account_nickname,
        phoneNum: profileRes.data.phone_num,
        address: profileRes.data.account_add,
        gender: profileRes.data.account_sex,
        birth: profileRes.data.account_birth,
        payment: profileRes.data.account_pay,
        subscribe: profileRes.data.account_sub,
      });

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
    } catch (error) {
      console.error("❌ getAccountAndProfile() 오류:", error);
    }
  }
};
