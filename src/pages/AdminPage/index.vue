<script>
import useStore from 'stores/store'
import SideBar from 'components/SideBar.vue'
import Logout from 'components/Logout.vue'
import { initData } from "../../core/index"

export default {
  data() {
    return {
      store: useStore(),
      sideBarData: [
        {
          title: "总览",
          pageName: "AdminPage"
        },
        {
          title: "筛选项管理",
          pageName: "FilterManage"
        },
        {
          title: "数据管理",
          pageName: "DataManage",
        },
        {
          title: "用户管理",
          pageName: "UserManage"
        },
        {
          title: "账户管理",
          pageName: "AccountManage"
        },
      ]
    }
  },
  components: { SideBar, Logout },
  mounted() {
    initData()
  }
}

</script>

<template>
  <div :class="$style.container">
    <Logout />
    <SideBar :data="sideBarData" />
    <div :class="$style.main">
      <router-view />
    </div>
  </div>
</template>


<style module>
.container {
  width: 100%;
  height: 100%;
  display: flex;
}

.main {
  flex: 1;
  height: 100%;
  padding: 30px 90px 30px 30px;
}
</style>