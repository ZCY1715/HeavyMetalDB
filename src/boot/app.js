import { boot } from 'quasar/wrappers'
import ElementUI, { ElMessage, ElMessageBox } from 'element-plus'
import 'element-plus/dist/index.css'
import ECharts from 'vue-echarts'
import { use } from "echarts/core"

import {
  CanvasRenderer
} from 'echarts/renderers'
import {
  LineChart,
  BarChart,
  ScatterChart,
  PieChart
} from 'echarts/charts'
import {
  TitleComponent,
  GridComponent,
  TooltipComponent,
  LegendComponent
} from 'echarts/components'
import {
  UniversalTransition
} from 'echarts/features';

use([
  CanvasRenderer,
  LineChart,
  BarChart,
  PieChart,
  ScatterChart,
  TitleComponent,
  GridComponent,
  TooltipComponent,
  UniversalTransition,
  LegendComponent
])


export default boot(({ app }) => {
  app.use(ElementUI)
  app.component('v-chart', ECharts)
  app.config.globalProperties.$message = ElMessage
  app.config.globalProperties.$messageBox = ElMessageBox
})
