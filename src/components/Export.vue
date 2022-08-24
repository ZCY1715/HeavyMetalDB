<script>
import { exportJsonToExcel } from '../utils'

export default {
  props: ["data", "titles"],
  methods: {
    toExport() {

      const titles = this.titles.map(item => item.label)

      const data = this.data.map(item => {
        const target = {}
        for (let i = 0; i < titles.length; i++) {
          target[titles[i]] = item[this.titles[i].nonce] || ""
        }
        return target
      })

      exportJsonToExcel(data, titles, "exportData", false)
    }
  }
}


</script>

<template>
  <span @click="toExport">
    导出为 Excel
  </span>
</template>