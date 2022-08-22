<script>
import useStore from 'stores/store'
import { FilterEntity, DataEntity } from '../../core'
import Charts from 'src/components/Charts.vue'
import Logout from 'components/Logout.vue'
import { initData } from "../../core/index"

export default {
  data() {
    return {
      store: useStore(),
      filterOption: {},
      filter: new FilterEntity(),
      showMakeChartPanel: false,
    }
  },
  components: { Charts, Logout },
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
    chartData() {
      return this.matchedData.map(item => item.data)
    }
  },
  methods: {
    createNewFilter() {
      this.filter = new DataEntity(this.filterOption).filter
    }
  },
  beforeCreate() {
    initData()
  }
}


</script>

<template>
  <Logout />
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
        <span :class="$style.control" @click="() => showMakeChartPanel = true">根据筛选数据生成图像</span>
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
    </el-table>
    <el-dialog v-model="showMakeChartPanel" v-if="showMakeChartPanel" title="图像生成" :width="800">
      <Charts :data="chartData" :titles="titles" :canDownload="false" />
    </el-dialog>
  </div>
</template>

<style module>
.container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 30px;
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