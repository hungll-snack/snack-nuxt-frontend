import * as axiosUtility from "../../utility/axiosInstance";
import type { AxiosResponse } from "axios";
import { useAccountStore } from "./accountStore";

export const accountAction = {

  async getAccount(email: string): Promise<any> {
    if (!email) {
      console.error("❌ 이메일 값이 없습니다. API 요청을 중단합니다.");
      return;
    }

    const { djangoAxiosInstance } = axiosUtility.createAxiosInstances();
    try {
      console.log(`🚀 getAccount API 호출: /account/get/${email}/`);
      console.log(`🚀 getProfile API 호출: /account/profile/get/${email}/`);

      const [accountRes, profileRes] = await Promise.all([
        djangoAxiosInstance.post(`/account/get/${email}/`),
        djangoAxiosInstance.post(`/account-profile/get/${email}/`)
      ]);

      console.log("✅ 백엔드 응답 확인:", accountRes.data, profileRes.data);

      useAccountStore().$patch({
        email: accountRes.data.email,
        accountPath: accountRes.data.account_path,
        name: profileRes.data.account_name,
        nickname: profileRes.data.account_nickname,
        phoneNum: profileRes.data.phone_num,
        address: profileRes.data.account_add,
        gender: profileRes.data.account_sex,
        birth: profileRes.data.account_birth,
        payment: profileRes.data.account_pay,
        subscribe: profileRes.data.account_sub,
        accountRegister: profileRes.data.account_register,
      });

      console.log("✅ 스토어 업데이트 완료:", useAccountStore());
      return { ...accountRes.data, ...profileRes.data };
    } catch (error) {
      console.error("❌ getAccount() 오류:", error);
      throw new Error("Failed to fetch account information");
    }
  },
};
