<script>
import useStore from 'stores/store'
import BannerLogin from 'assets/bannerLogin.jpg'
import { readImg, CheckAdminLogin, CheakUserLogin } from '../../core/index'

export default {
  data() {
    return {
      store: useStore(),
      isAdminMode: false,
      acc: "",
      pwd: "",
    }
  },
  computed: {
    banner() {
      const img = this.store.config.bannerLogin
      return img ? readImg(img) : BannerLogin
    },
  },
  methods: {
    AdminLogin() {
      if (this.acc === "" || this.pwd === "") {
        return this.$message.warning({
          message: "账户或密码不能为空！",
          duration: 1000,
          grouping: true
        })
      }

      if (this.isAdminMode) {
        const statu = CheckAdminLogin(this.acc, this.pwd)
        if (statu) {
          this.store.LoginAsAdmin()
          this.$message.success({
            message: "登陆成功！",
            duration: 1000,
            grouping: true
          })
        } else {
          this.$message.error({
            message: "账户或密码错误！",
            duration: 1000,
            grouping: true
          })
        }
      } else {
        const statu = CheakUserLogin(this.acc, this.pwd)
        if (statu) {
          this.store.LoginAsUser()
          this.$message.success({
            message: "登陆成功！",
            duration: 1000,
            grouping: true
          })
        } else {
          this.$message.error({
            message: "账户或密码错误！",
            duration: 1000,
            grouping: true
          })
        }
      }
    }
  },
}
</script>

<template>
  <div :class="$style.container">
    <img :src="banner" :class="$style.banner" />
    <div :class="$style.main">
      <div :class="$style.head">
        <div :class="$style.title">{{ store.config.title }}</div>
        <div :class="$style.subTitle">{{ '—— ' + store.config.subTitle }}</div>
      </div>
      <div :class="$style.loginPanel">
        <el-switch v-model="isAdminMode" :class="$style.modeSwitch" active-text="Admin" inactive-text="User" />
        <input placeholder="Account" v-model="acc" />
        <input type="password" placeholder="Password" v-model="pwd" @keyup.enter="AdminLogin" />
        <span @click="AdminLogin">登录</span>
      </div>
    </div>
  </div>
</template>

<style module>
.container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
}

.banner {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.main {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.head {
  font-size: 30px;
  min-width: 800px;
  max-width: 1000px;
  padding: 10px 20px 10px 20px;
  border-radius: 20px;
  min-height: 100px;
  background-color: rgba(255, 255, 255, 0.7);
  margin-top: 50px;
  animation: floatRight 2s;
}

@keyframes floatRight {
  from {
    transform: translateX(-1000px);
  }

  to {
    transform: translateX(0);
  }
}

.title {
  font-size: 40px;
  font-weight: bold;
  width: 100%;
  text-align: center;
}

.subTitle {
  width: 100%;
  text-align: right;
  margin-top: 10px;
  font-size: 25px;
  padding-right: 50px;
}

.loginPanel {
  width: 500px;
  height: 300px;
  border-radius: 10px;
  margin-top: 100px;
  background-color: #fff;
  box-shadow: 0 0 20px #666;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.modeSwitch {
  margin-top: 30px;
  --el-switch-on-color: #5788e4;
  --el-switch-off-color: #13ce66;

}

.loginPanel>input {
  width: 70%;
  height: 30px;
  margin-top: 30px;
  outline: none;
  border: none;
  border-bottom: 1px solid var(--theme-color);
}

.loginPanel>input::placeholder {
  text-align: center;
}

.loginPanel>input:focus {
  border-bottom: 2px solid var(--theme-color);
}

.loginPanel>span {
  margin-top: 50px;
  padding: 5px 20px 5px 20px;
  box-shadow: 0 0 10px var(--theme-color);
  border-radius: 10px;
  transition: .3s;
  cursor: pointer;
}

.loginPanel>span:hover {
  background-color: var(--theme-color);
  color: #fff;
}
</style>
