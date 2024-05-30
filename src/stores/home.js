import { defineStore } from "pinia";

export const useHomeStore = defineStore("home", {
  state: () => ({
    salaryStructMonth: "",
  }),
  getters: {},
  actions: {},
  persist: false, // localstorage yes or no
});
