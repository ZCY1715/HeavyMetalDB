<script>

export default {
  data() {
    return {
      target: 0,
    }
  },
  props: ["data"],
  methods: {
    switchNav(pageName, index) {
      if (this.target === index) return
      this.$router.push({ name: pageName })
      this.target = index
    }
  }
}

</script>

<template>
  <div :class="$style.container">
    <div :class="$style.header">管理员</div>
    <div v-for="(item, index) of data" :key="index" :class="[$style.navItem, index === target ? $style.targetNav : '']"
      @click="() => switchNav(item.pageName, index)">
      {{ item.title }}
    </div>
  </div>

</template>

<style module>
.container {
  height: 100%;
  width: 150px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #eee;
  box-shadow: 3px 0 5px #ddd;
}

.header {
  font-weight: bold;
  background-color: #666;
  color: #fff;
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: -3px 0 5px #000;
  user-select: none;
}

.navItem {
  width: 100%;
  height: 40px;
  font-size: 18px;
  padding-left: 20px;
  display: flex;
  align-items: center;
  transition: .3s;
  cursor: pointer;
  border-bottom: 1px solid #ddd;
  background-color: #fff;
  user-select: none;
}

.navItem:hover {
  background-color: var(--theme-color);
  color: #fff;
}

.targetNav {
  background-color: var(--theme-color);
  color: #fff;
}
</style>