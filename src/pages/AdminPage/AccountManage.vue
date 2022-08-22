<script>
import { modifyAdmin } from '../../core'
import useStore from 'stores/store'

export default {
  data() {
    return {
      acc: "",
      pwd: "",
      store: useStore()
    }
  },
  methods: {
    modify() {
      if (this.acc === "" || this.pwd === "") {
        return this.$message.warning({
          message: "账户或密码不能为空！",
          duration: 1000,
          grouping: true
        })
      }

      this.$messageBox.confirm(
        '修改后需重新登陆，确定修改?',
        'Warning',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: "info"
        }
      )
        .then(() => {
          modifyAdmin(this.acc, this.pwd)
          this.store.Logout()
          this.$message({
            type: 'success',
            message: '修改成功!',
            duration: 1000,
          })
        })

        .catch(() => {
          this.acc = ""
          this.pwd = ""
        })

    }
  }
}
</script>

<template>
  <div :class="$style.container">
    <span> * 修改管理员账户</span>
    <input v-model="acc" placeholder="account" />
    <input v-model="pwd" placeholder="password" type="password" />
    <div>
      <span @click="modify">提交</span>
    </div>
  </div>
</template>

<style module>
.container {
  display: flex;
  flex-direction: column;
  padding: 30px 0 0 30px;
}

.container>input {
  width: 300px;
  margin-top: 20px;
  margin-left: 30px;
  border: 1px solid #ddd;
  transition: .3s;
  outline: none;
  border-radius: 5px;
  padding-left: 10px;
}

.container>input:focus {
  border: 1px solid var(--theme-color);
}

.container>:last-child {
  margin-top: 30px;
  width: 330px;
  display: flex;
  justify-content: flex-end;
}

.container>:last-child>span {
  padding: 5px 20px 5px 20px;
  font-size: 18px;
  background-color: var(--theme-color);
  color: #fff;
  cursor: pointer;
  border-radius: 20px;
}
</style>