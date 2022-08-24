<script>
import useStore from 'stores/store'
import { FilterEntity, DataEntity } from '../../core'
import Charts from 'src/components/Charts.vue'
import Export from 'components/Export.vue'
import Import from 'components/Import.vue'

export default {
  data() {
    return {
      store: useStore(),
      filterOption: {},
      filter: new FilterEntity(),
      showAddDataPanel: false,
      showModifyDataPanel: false,
      showMakeChartPanel: false,
      data: {},
      dataIndex: null
    }
  },
  components: { Charts, Export, Import },
  computed: {
    filterData() {
      return this.store.filterSet.getFormatData()
    },
    titles() {
      return Object.values(this.filterData).map(item => ({
        label: item.title,
        nonce: item.nonce,
        type: item.type
      }))
    },
    matchedData() {
      return this.store.dataSet.getData(this.filter)
    },
    mainData() {
      return this.matchedData.map(item => item.data)
    }
  },
  methods: {
    createNewFilter() {
      this.filter = new DataEntity(this.filterOption).filter
    },
    checkData() {
      if (Object.values(this.data).filter(item => item).length === 0) {
        this.$message.warning({
          message: "不能为空数据！",
          duration: 1000,
          grouping: true
        })
        return false
      }
      return true
    },
    addData() {
      if (!this.checkData()) return
      this.store.dataSet.addOneData(this.data)
      this.showAddDataPanel = false

      this.$message.success({
        message: "添加成功！",
        duration: 1000,
        grouping: true
      })

    },
    deleteData(index) {
      this.store.dataSet.deleteOneData(index)

      this.$message.success({
        message: "删除成功！",
        duration: 1000,
        grouping: true
      })

    },
    modifyData() {
      if (!this.checkData()) return
      this.store.dataSet.modifyOneData(this.dataIndex, this.data)
      this.showModifyDataPanel = false

      this.$message.success({
        message: "修改成功！",
        duration: 1000,
        grouping: true
      })
    },
    toShowAddDataPanel() {
      this.showAddDataPanel = true
      this.data = {}
    },
    toShowModifyDataPanel(index) {
      this.dataIndex = index
      this.data = this.store.dataSet.getOneData(index)
      this.showModifyDataPanel = true
    }
  }
}


</script>

<template>
  <div :class="$style.container">
    <span style="margin-bottom: 10px;">* 筛选条件：</span>
    <el-table :data="[filterData]" style="width: 100%" :height="100">
      <el-table-column v-for="(item, index) of titles" width="150" align="center">
        <template #header>
          <span style="white-space: nowrap;">{{ item.label }}</span>
        </template>
        <template #default="props">
          <input v-if="item.type === '文本'" :class="$style.filterInput" v-model="filterOption[props.row[index].nonce]"
            @change="createNewFilter" type="text" />
          <input v-else-if="item.type === '数值'" :class="$style.filterInput" type="number"
            v-model="filterOption[props.row[index].nonce]" @change="createNewFilter" />
          <el-select clearable placeholder="none" v-else v-model="filterOption[props.row[index].nonce]"
            @change="createNewFilter">
            <el-option v-for="option of props.row[index].options" :label="option.option" :value="option.nonce" />
          </el-select>
        </template>
      </el-table-column>
    </el-table>
    <span :class="$style.dataTitle">
      <span>* 数据集：</span>
      <span>
        <Import :class="$style.control" :titles="filterData" />
        <Export :class="$style.control" :data="mainData" :titles="titles" />
        <span :class="$style.control" @click="() => showMakeChartPanel = true">生成图像</span>
        <span :class="$style.control" @click="() => toShowAddDataPanel()">添加数据</span>
      </span>
    </span>
    <el-table :data="matchedData" style="width: 100%" :height="500" stripe border>
      <el-table-column fixed type="index" width="100" align="center" label="Index" />
      <el-table-column v-for="item of titles" :prop="`data[${item.nonce}]`" width="150" align="center"
        show-overflow-tooltip>
        <template #header>
          <span style="white-space: nowrap;">{{ item.label }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" width="180" align="center" label="Control">
        <template #default="props">
          <el-button type="warning" size="small" @click="() => toShowModifyDataPanel(props.row.index)">edit</el-button>
          <el-button type="danger" size="small" @click="() => deleteData(props.row.index)">delete</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-model="showAddDataPanel" title="数据添加">
      <template #default>
        <div :class="$style.dataPanel">
          <div v-for="(item, index) of titles" :key="index">
            <p>* {{ item.label }}</p>
            <input v-if="item.type === '文本'" :class="$style.filterInput" v-model="data[filterData[index].nonce]"
              type="text" />
            <input v-else-if="item.type === '数值'" :class="$style.filterInput" type="number"
              v-model="data[filterData[index].nonce]" />
            <el-select clearable placeholder="none" v-else v-model="data[filterData[index].nonce]">
              <el-option v-for="option of filterData[index].options" :label="option.option" :value="option.nonce" />
            </el-select>
          </div>
          <span :class="[$style.control, $style.panelControl]" @click="addData">提交</span>
        </div>
      </template>
    </el-dialog>
    <el-dialog v-model="showModifyDataPanel" title="数据修改">
      <template #default>
        <div :class="$style.dataPanel">
          <div v-for="(item, index) of titles" :key="index">
            <p>* {{ item.label }}</p>
            <input v-if="item.type === '文本'" :class="$style.filterInput" v-model="data[filterData[index].nonce]"
              type="text" />
            <input v-else-if="item.type === '数值'" :class="$style.filterInput" type="number"
              v-model="data[filterData[index].nonce]" />
            <el-select clearable placeholder="none" v-else v-model="data[filterData[index].nonce]">
              <el-option v-for="option of filterData[index].options" :label="option.option" :value="option.nonce" />
            </el-select>
          </div>
          <span :class="[$style.control, $style.panelControl]" @click="modifyData">保存</span>
        </div>
      </template>
    </el-dialog>
    <el-dialog v-model="showMakeChartPanel" v-if="showMakeChartPanel" title="生成图像" :width="800">
      <Charts :data="mainData" :titles="titles" :canDownload="true" />
    </el-dialog>
  </div>
</template>

<style module>
.container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.filterInput {
  width: 100%;
  border: 1px solid #ddd;
  transition: .3s;
  outline: none;
  border-radius: 5px;
  padding-left: 10px;
}

.filterInput:focus {
  border: 1px solid var(--theme-color);
}

.dataTitle {
  margin: 20px 0 20px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.control {
  padding: 5px 15px 5px 15px;
  margin: 0 5px 0 5px;
  background-color: var(--theme-color);
  color: #fff;
  cursor: pointer;
  border-radius: 10px;
}

.panelControl {
  width: 150px;
  margin-top: 20px;
  text-align: center;
}

.dataPanel {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.dataPanel>div {
  margin-top: 10px;
}
</style>