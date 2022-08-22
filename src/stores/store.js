import { defineStore } from 'pinia'

const useStore = defineStore('store', {
  state: () => ({
    config: null,
    loadStatu: {
      loading: false,
      message: ''
    },
    identity: "",
    userData: null,
    filterSet: null,
    dataSet: null,
  }),
  getters: {

  },
  actions: {
    setLoading(msg) {
      this.loadStatu = {
        loading: true,
        message: msg
      }
    },
    setUnLoad() {
      this.loadStatu = {
        loading: false,
        message: ""
      }
    },
    LoginAsAdmin() {
      this.identity = "admin"
    },
    LoginAsUser() {
      this.identity = "user"
    },
    Logout() {
      this.identity = ""
    },
    isAdmin() {
      return this.identity === "admin"
    },
  },
})

export default useStore
