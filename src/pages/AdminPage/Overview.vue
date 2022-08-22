<script>
import useStore from 'stores/store'

function formatCount(num) {
  if (num < 10000) {
    return num
  }
  if (num < 9999999) {
    return parseFloat((num / 10000).toFixed(1)) + '万'
  }

}

export default {
  data() {
    return {
      store: useStore(),
    }
  },
  computed: {
    dataList() {

      if (this.store.loadStatu.loading) return []

      const clone = data => JSON.parse(JSON.stringify(data))

      const list = []

      let obj = {}
      obj.title = "数据量"
      obj.color = "lightgreen"
      obj.num = formatCount(this.store.dataSet.data.length)
      list.push(clone(obj))

      obj = {}
      obj.title = "筛选项"
      obj.color = "#f5f529"
      obj.num = formatCount(Object.keys(this.store.filterSet.data.data).length)
      list.push(clone(obj))

      obj = {}
      obj.title = "用户数"
      obj.color = "red"
      obj.num = formatCount(this.store.userData.data.length)
      list.push(clone(obj))

      return list

    }
  }
}
</script>

<template>
  <div :class="$style.container">
    <div :class="$style.item" v-for="(item, index) of dataList" :key="index" :style="'--c: ' + item.color">
      <div>
        <span>{{ item.num }}</span>
      </div>
      <div>{{ item.title }}</div>
    </div>
  </div>
</template>

<style module>
.container {
  width: 100%;
  height: 100%;
  padding-top: 50px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  column-gap: 60px;
}

.item {
  height: 100px;
  width: 95%;
  margin: 5px;
  box-shadow: 0 0 5px #999;
  border-radius: 5px;
  display: flex;
  align-items: center;
  animation: floutUp 1s;
  transition: .5s;
  user-select: none;
}

@keyframes floutUp {
  from {
    transform: translateY(50px);
  }

  to {
    transform: translateY(0);
  }
}

.item:hover {
  transform: translateY(-20px);
}

.item>:first-child {
  width: 70px;
  height: 70px;
  background-color: var(--c);
  border-radius: 50%;
  margin-left: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.item>:first-child>span {
  width: 60px;
  height: 60px;
  background-color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: bold;
  color: var(--c);
}

.item>:nth-child(2) {
  flex: 1;
  display: flex;
  align-items: center;
  font-size: 25px;
  padding-left: 20px;
}
</style>

