<script>
import useStore from 'stores/store'

export default {
  data() {
    return {
      store: useStore(),
      isShowAddUser: false,
      isShowModifyUser: false,
      modifyIndex: 0,
      acc: "",
      pwd: "",
    }
  },
  computed: {
    userData() {
      return this.store.userData.data.map((item, index) => ({
        index,
        account: item[0],
        password: "******",
        realPassword: item[1],
      }))
    },
  },
  methods: {
    init() {
      this.acc = ""
      this.pwd = ""
    },
    addUser() {
      if (this.acc === "" || this.pwd === "") {
        return this.$message.warning({
          message: "账户或密码不能为空！",
          duration: 1000,
          grouping: true
        })
      }
      this.store.userData.AddUser(this.acc, this.pwd)
      this.isShowAddUser = false

      this.$message.success({
        message: "添加成功！",
        duration: 1000,
        grouping: true
      })

    },
    showModifyUser(index) {
      this.modifyIndex = index
      this.acc = this.userData[index].account
      this.pwd = this.userData[index].realPassword
      this.isShowModifyUser = true
    },
    deleteUser(index) {
      this.store.userData.RemoveUser(index)
      this.isShowModifyUser = false
      this.$message.success({
        message: "删除成功！",
        duration: 1000,
        grouping: true
      })
    },
    saveModifyUser() {
      if (this.acc === "" || this.pwd === "") {
        return this.$message.warning({
          message: "账户或密码不能为空！",
          duration: 1000,
          grouping: true
        })
      }

      this.store.userData.modifyUser(this.modifyIndex, this.acc, this.pwd)
      this.isShowModifyUser = false
      this.$message.success({
        message: "修改成功！",
        duration: 1000,
        grouping: true
      })
    }
  },
  watch: {
    isShowAddUser(value) {
      !value && this.init()
    },
    isShowModifyUser(value) {
      !value && this.init()
    }
  }
}

</script>

<template>
  <div :class="$style.conatiner">
    <el-table :data="userData" stripe height="500" style="width: 100%" :border="true">
      <el-table-column type="index" label="" width="50" />
      <el-table-column prop="account" label="Account" width="350" />
      <el-table-column prop="password" label="Password" />
      <el-table-column label="" width="180">
        <template #default="scope">
          <el-button plain type="warning" size="small" @click="() => showModifyUser(scope.row.index)">edit</el-button>
          <el-button plain type="danger" size="small" @click="() => deleteUser(scope.row.index)">delete</el-button>
        </template>
      </el-table-column>
    </el-table>
    <span :class="$style.addUser" @click="() => isShowAddUser = true">添加用户</span>
    <el-dialog v-model="isShowAddUser" title="添加用户">
      <div :class="$style.userPanel">
        <input v-model="acc" placeholder="account" />
        <input v-model="pwd" placeholder="password" @keyup.enter="addUser" />
        <div>
          <span @click="addUser">提交</span>
        </div>
      </div>
    </el-dialog>
    <el-dialog v-model="isShowModifyUser" title="修改">
      <div :class="$style.userPanel">
        <input v-model="acc" placeholder="account" />
        <input v-model="pwd" placeholder="password" @keyup.enter="saveModifyUser" />
        <div>
          <span @click="saveModifyUser">保存</span>
        </div>
      </div>
    </el-dialog>

  </div>
</template>

<style module>
.conatiner {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.addUser {
  margin-top: 20px;
  padding: 5px 10px 5px 10px;
  width: 120px;
  font-size: 18px;
  text-align: center;
  border-radius: 20px;
  color: #fff;
  cursor: pointer;
  background-color: var(--theme-color);
}

.userPanel {
  display: flex;
  flex-direction: column;
}

.userPanel>input {
  width: 300px;
  margin-top: 20px;
  margin-left: 30px;
  border: 1px solid #ddd;
  transition: .3s;
  outline: none;
  border-radius: 5px;
  padding-left: 10px;
}

.userPanel>input:focus {
  border: 1px solid var(--theme-color);
}

.userPanel>:last-child {
  margin-top: 30px;
  width: 330px;
  display: flex;
  justify-content: flex-end;
}

.userPanel>:last-child>span {
  padding: 5px 15px 5px 15px;
  margin: 0 5px 0 5px;
  font-size: 18px;
  background-color: var(--theme-color);
  color: #fff;
  cursor: pointer;
  border-radius: 20px;
}
</style>