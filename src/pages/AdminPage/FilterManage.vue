<script>
import useStore from 'stores/store'


export default {
  data() {
    return {
      store: useStore(),
      showAddFilterPanel: false,
      filter: {
        name: "",
        type: "",
      },
      showAddFilterOptionPanel: false,
      filterOption: "",
      showRenameFilterPanel: false,
      newFilterName: "",
      filterNonce: "",
      showRenameFilterOptionPanel: false,
      filterOptionNonce: "",
      newFilterOptionName: ""
    }
  },
  computed: {
    tableData() {
      return this.store.filterSet.getFormatData()
    },
  },
  methods: {
    toShowRenameFilterPanel(nonce, name) {
      this.showRenameFilterPanel = true
      this.filterNonce = nonce
      this.newFilterName = name
    },
    toShowRenameFilterOptionPanel(nonce, optionNonce, name) {
      this.showRenameFilterOptionPanel = true
      this.filterNonce = nonce
      this.filterOptionNonce = optionNonce
      this.newFilterOptionName = name
    },
    toShowAddFilterOptionPanel(nonce) {
      this.showAddFilterOptionPanel = true
      this.filterNonce = nonce
    },
    deleteFilter(nonce) {
      this.store.filterSet.removeFilter(nonce)
      this.$message.success({
        message: "删除成功！",
        duration: 1000,
        grouping: true
      })
    },
    deleteFilterOption(nonce, optionNonce) {
      this.store.filterSet.removeFilterOption(nonce, optionNonce)
      this.$message.success({
        message: "删除成功！",
        duration: 1000,
        grouping: true
      })
    },
    addFilter() {
      if (!this.filter.name || !this.filter.type) {
        return this.$message.error({
          message: "内容不能为空！",
          duration: 1000,
          grouping: true
        })
      }
      this.store.filterSet.addFilter(this.filter.name, this.filter.type)
      this.showAddFilterPanel = false
      this.$message.success({
        message: "添加成功！",
        duration: 1000,
        grouping: true
      })
    },
    addFilterOption() {
      if (!this.filterOption) {
        return this.$message.error({
          message: "内容不能为空！",
          duration: 1000,
          grouping: true
        })
      }
      this.store.filterSet.addFilterOption(this.filterNonce, this.filterOption)
      this.showAddFilterOptionPanel = false
      this.$message.success({
        message: "添加成功！",
        duration: 1000,
        grouping: true
      })
    },
    modifyFilter() {
      if (!this.newFilterName) {
        return this.$message.error({
          message: "内容不能为空！",
          duration: 1000,
          grouping: true
        })
      }
      this.store.filterSet.modifyFilter(this.filterNonce, this.newFilterName)
      this.showRenameFilterPanel = false
      this.$message.success({
        message: "修改成功！",
        duration: 1000,
        grouping: true
      })
    },
    modifyOptionFilter() {
      if (!this.newFilterOptionName) {
        return this.$message.error({
          message: "内容不能为空！",
          duration: 1000,
          grouping: true
        })
      }
      this.store.filterSet.modifyFilterOption(this.filterNonce, this.filterOptionNonce, this.newFilterOptionName)
      this.showRenameFilterOptionPanel = false
      this.$message.success({
        message: "修改成功！",
        duration: 1000,
        grouping: true
      })

    }
  },
  watch: {
    showAddFilterPanel(value) {
      if (!value) {
        this.filter.name = ""
        this.filter.type = "Select"
      }
    },
    showAddFilterOptionPanel(value) {
      if (!value) {
        this.filterOption = ""
      }
    },
    showRenameFilterPanel(value) {
      if (!value) {
        this.newFilterName = ""
        this.filterNonce = ""
      }
    },
    showRenameFilterOptionPanel(value) {
      if (!value) {
        this.newFilterOptionName = ""
        this.filterNonce = ""
        this.filterOptionNonce = ""
      }
    }
  }
}

</script>

<template>
  <div :class="$style.container">
    <el-table :data="tableData" stripe :border="true" style="width: 100%" height="95%" row-key="nonce"
      :row-class-name="({ row }) => row.options ? '' : 'can_not_expand'">
      <el-table-column type="expand">
        <template #default="props">
          <el-table :data="props.row.options" style="width: 100%" :show-header="false">
            <el-table-column type="index" width="40" />
            <el-table-column prop="option" />
            <el-table-column width="180">
              <template #default="optionProps">
                <el-button plain type="warning" size="small"
                  @click="() => toShowRenameFilterOptionPanel(props.row.nonce, optionProps.row.nonce, optionProps.row.option)">
                  edit
                </el-button>
                <el-button plain type="danger" size="small"
                  @click="() => deleteFilterOption(props.row.nonce, optionProps.row.nonce)">delete
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <span :class="$style.addFilterOption" @click="() => toShowAddFilterOptionPanel(props.row.nonce)">添加选项</span>
        </template>
      </el-table-column>
      <el-table-column label="Name" prop="title" />
      <el-table-column label="Type" prop="type" width="100" />
      <el-table-column width="180">
        <template #default="props">
          <el-button type="warning" size="small"
            @click="() => toShowRenameFilterPanel(props.row.nonce, props.row.title)">edit
          </el-button>
          <el-button type="danger" size="small" @click="() => deleteFilter(props.row.nonce)">delete</el-button>
        </template>
      </el-table-column>
    </el-table>
    <span :class="$style.addFilter" @click="() => showAddFilterPanel = true">添加筛选项</span>
    <el-dialog v-model="showAddFilterOptionPanel" title="添加选项">
      <div :class="$style.formatPanel">
        <input v-model="filterOption" placeholder="name" />
        <div>
          <span @click="addFilterOption">提交</span>
        </div>
      </div>
    </el-dialog>
    <el-dialog v-model="showAddFilterPanel" title="添加筛选项">
      <div :class="$style.formatPanel">
        <el-select v-model="filter.type" placeholder="type" :class="$style.selectType">
          <el-option
            v-for="item in [{ label: '选项', value: 'Select' }, { label: '数值', value: 'Number' }, { label: '文本', value: 'String' }]"
            :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <input v-model="filter.name" placeholder="name" />
        <div>
          <span @click="addFilter">提交</span>
        </div>
      </div>
    </el-dialog>
    <el-dialog v-model="showRenameFilterPanel" title="修改名称">
      <div :class="$style.formatPanel">
        <input v-model="newFilterName" placeholder="name" />
        <div>
          <span @click="modifyFilter">保存</span>
        </div>
      </div>
    </el-dialog>
    <el-dialog v-model="showRenameFilterOptionPanel" title="修改名称">
      <div :class="$style.formatPanel">
        <input v-model="newFilterOptionName" placeholder="name" />
        <div>
          <span @click="modifyOptionFilter">保存</span>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<style>
.can_not_expand .el-table__expand-icon {
  display: none;
}
</style>

<style module>
.container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.addFilter,
.addFilterOption {
  font-size: 18px;
  text-align: center;
  border-radius: 20px;
  color: #fff;
  cursor: pointer;
  background-color: var(--theme-color);
  margin-left: 40px;
  margin-top: 10px;
  display: inline-block;
}

.addFilter {
  width: 150px;
  padding: 3px 6px 3px 6px;
}

.addFilterOption {
  width: 120px;
}

.formatPanel {
  display: flex;
  flex-direction: column;
}

.formatPanel>input {
  width: 300px;
  margin-top: 20px;
  margin-left: 30px;
  border: 1px solid #ddd;
  transition: .3s;
  outline: none;
  border-radius: 5px;
  padding-left: 10px;
}

.formatPanel>input:focus {
  border: 1px solid var(--theme-color);
}

.formatPanel>:last-child {
  margin-top: 30px;
  width: 330px;
  display: flex;
  justify-content: flex-end;
}

.formatPanel>:last-child>span {
  padding: 5px 15px 5px 15px;
  margin: 0 5px 0 5px;
  font-size: 18px;
  background-color: var(--theme-color);
  color: #fff;
  cursor: pointer;
  border-radius: 20px;
}

.selectType {
  width: 100px;
  margin-left: 30px;
}
</style>