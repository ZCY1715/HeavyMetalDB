<script>
import useStore from "stores/store"

export default {
  data() {
    return {
      store: useStore()
    }
  },
}

</script>

<template>
  <span :class="$style.container" @click="store.Logout">
    Logout
  </span>
</template>

<style module>
.container {
  position: fixed;
  right: 20px;
  top: 10px;
  text-decoration: underline;
  color: var(--theme-color);
  cursor: pointer;
  transition: .3s;
}

.container:hover {
  text-shadow: 0 0 4px var(--theme-color);
}
</style>