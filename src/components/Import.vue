<script>
import useStore from 'stores/store'
import { uploader, importExcel } from '../utils'

export default {

  data() {
    return {
      store: useStore()
    }
  },
  props: ["titles"],
  mounted() {
    uploader(this.$refs.toImport, file => {
      importExcel(file, data => {

        this.$alert("正在导入...", {
          showClose: false,
          showCancelButton: false,
          showConfirmButton: false
        })

        const newDataArr = []

        let hasError = false

        try {
          for (const item of data) {

            const newData = {}

            const indexArr = Object.keys(item).map(title => {
              return {
                data: item[title],
                index: this.titles.findIndex(item => title.trim() === item.title)
              }
            }).filter(item => item.index !== -1)

            for (const indexObj of indexArr) {
              const title = this.titles[indexObj.index]
              if (!indexObj.data) continue
              if (title.type === "文本" || title.type === "数值") {
                newData[title.nonce] = indexObj.data
              } else {
                const index = title.options.findIndex(item => item.option === indexObj.data)
                if (~index) {
                  newData[title.nonce] = title.options[index].nonce
                } else {
                  const nonce = this.store.filterSet.addFilterOption(title.nonce, indexObj.data)
                  newData[title.nonce] = nonce
                }
              }
            }

            newDataArr.push(newData)
          }
        } catch (_) {
          hasError = true
        }

        if (hasError) {
          this.$messageBox.close()
          return this.$message.error({
            duration: 2000,
            message: '导入出错了！请检查Excel格式后再次尝试！',
            grouping: true
          })
        }

        console.log(newDataArr)

        for (const newData of newDataArr) {
          this.store.dataSet.addOneData(newData)
        }

        this.$messageBox.close()

        this.$message.success({
          duration: 1000,
          message: '导入成功！',
          grouping: true
        })


      })
    })
  }
}

</script>

<template>
  <span ref="toImport">
    从 Excel 导入
  </span>
</template>