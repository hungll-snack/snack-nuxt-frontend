import * as axiosUtility from "../../utility/axiosInstance";
import type { AxiosResponse } from "axios";
import { useAccountStore } from "./accountStore";

export const accountAction = {

  async requestEmail(userToken: string): Promise<string | null> {
    const { djangoAxiosInstance } = axiosUtility.createAxiosInstances();
    try {
      const res: AxiosResponse = await djangoAxiosInstance.post(
        "/account/email/",
        { userToken } // 요청 바디로 userToken 전달
      );

      console.log("✅ requestEmail 응답:", res.data);
      return res.data.email; // 이메일 반환
    } catch (error) {
      console.error("❌ requestEmail() 오류:", error);
      return null;
    }
  },

  async getAccount(email: string): Promise<any> {
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

      console.log("✅ 백엔드 응답 확인:", accountRes.data);

      useAccountStore().$patch({
        email: accountRes.data.email,
        accountPath: accountRes.data.account_path,
        //name: profileRes.data.account_name,
        //nickname: profileRes.data.account_nickname,
        //phoneNum: profileRes.data.phone_num,
        //address: profileRes.data.account_add,
        //gender: profileRes.data.account_sex,
        //birth: profileRes.data.account_birth,
        //payment: profileRes.data.account_pay,
        //subscribe: profileRes.data.account_sub,
        accountRegister: accountRes.data.account_register,
      });

      console.log("✅ 스토어 업데이트 완료:", useAccountStore());
    } catch (error) {
      console.error("❌ getAccount() 오류:", error);
    }
  },
};
