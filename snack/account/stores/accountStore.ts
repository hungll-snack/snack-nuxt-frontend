import { defineStore } from "pinia";
import { accountAction } from "./accountActions";

export const useAccountStore = defineStore("accountStore", {
  state: () => ({
    email: "",
    accountRegister: "",
    accountPath: "",
  }),
  actions: accountAction,
});
