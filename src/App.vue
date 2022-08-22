<script>
import { init } from './core'
import Loading from 'components/Loading.vue'
import useStore from 'stores/store'

export default {
  data() {
    return {
      store: useStore()
    }
  },
  components: { Loading },
  computed: {
    identity() {
      return this.store.identity
    }
  },
  mounted() {
    this.store.setLoading("载入中")
    init()
    this.store.setUnLoad()
  },
  watch: {
    identity(value) {
      switch (value) {
        case "":
          return this.$router.push({ name: "LoginPage" })
        case "admin":
          this.$router.push({ name: "AdminPage" })
          break
        case "user":
          this.$router.push({ name: "UserPage" })
          break
      }
      this.store.setLoading("正在加载")
    }
  }
}

</script>

<template>
  <router-view />
  <Loading v-if="store.loadStatu.loading" :message="store.loadStatu.message" />
</template>