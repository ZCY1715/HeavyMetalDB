<script>
import html2Canvas from 'html2canvas'

class OrderedQueue {
  arr = []
  valueArr = []
  set(value) {
    const index = this.arr.findIndex(item => item === value)
    if (~index) {
      return this.valueArr[index]++
    }
    for (let i = 0, len = this.arr.length; i < len; i++) {
      if (this.arr[i] > value) {
        this.arr.splice(i, 0, value)
        this.valueArr.splice(i, 0, 1)
        return
      }
    }
    this.arr.push(value)
    this.valueArr.push(1)
  }
  x() {
    return this.arr
  }
  y() {
    return this.valueArr
  }
}

export default {
  data() {
    return {
      showChart: false,
      isLoading: false,
      arg1: "",
      arg2: "",
      option: null,
    }
  },
  props: ["data", "titles", "canDownload"],
  computed: {
    chart() {
      return this.$refs.chart
    }
  },
  methods: {
    hideCanvas() {
      this.chart.root.style.display = "none"
    },
    showCanvas() {
      this.chart.root.style.display = "block"
    },
    createCanvas() {
      if (this.arg1 === "" && this.arg2 === "") {
        this.hideCanvas()
        return this.showChart = false
      }
      this.chart.clear()
      this.showCanvas()
      this.showChart = true
      this.isLoading = true
      this.option = null
      if (this.arg1 === "" || this.arg2 === "" || this.arg1 === this.arg2) {
        const arg = this.titles[[this.arg1, this.arg2].find(item => item !== "")]
        var data = this.data.map(item => item[arg.nonce]).filter(item => !["", null, undefined].includes(item))
        switch (arg.type) {
          case "文本":
            var statistics = {}
            for (const item of data) {
              if (!statistics[item]) {
                statistics[item] = 1
              } else {
                statistics[item]++
              }
            }
            this.option = {
              title: {
                text: arg.label,
                left: 'center',
              },
              tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c} ({d}%)',
                axisPointer: {
                  type: 'shadow'
                }
              },
              legend: {
                data: Object.keys(statistics),
                left: 'left',
                orient: 'vertical',
              },
              series: [
                {
                  data: Object.keys(statistics).map(item => ({
                    value: statistics[item],
                    name: item
                  })),
                  name: arg.label,
                  type: 'pie',
                  radius: '55%',
                  center: ['50%', '60%'],
                  emphasis: {
                    itemStyle: {
                      shadowBlur: 10,
                      shadowOffsetX: 0,
                      shadowColor: 'rgba(0, 0, 0, 0.5)',
                    },
                  },
                }
              ]
            }
            break
          case "选项":
            var statistics = {}
            for (const item of data) {
              if (!statistics[item]) {
                statistics[item] = 1
              } else {
                statistics[item]++
              }
            }
            this.option = {
              title: {
                text: arg.label,
                left: 'center',
              },
              tooltip: {
                trigger: 'item',
                axisPointer: {
                  type: 'shadow'
                }
              },
              xAxis: {
                type: 'category',
                data: Object.keys(statistics)
              },
              yAxis: {
                type: 'value'
              },
              series: [
                {
                  data: Object.values(statistics),
                  type: 'bar',
                  emphasis: {
                    itemStyle: {
                      shadowBlur: 10,
                      shadowOffsetX: 0,
                      shadowColor: 'rgba(0, 0, 0, 0.5)',
                    },
                  },
                }
              ]
            }
            break
          case "数值":
            const queue = new OrderedQueue()
            for (const item of data) {
              queue.set(item)
            }
            this.option = {
              title: {
                text: arg.label,
                left: 'center',
              },
              tooltip: {
                trigger: 'item',
                axisPointer: {
                  type: 'shadow'
                }
              },
              xAxis: {
                data: queue.x()
              },
              yAxis: {
                type: 'value'
              },
              series: [
                {
                  data: queue.y(),
                  type: 'line',
                  emphasis: {
                    itemStyle: {
                      shadowBlur: 10,
                      shadowOffsetX: 0,
                      shadowColor: 'rgba(0, 0, 0, 0.5)',
                    },
                  },
                }
              ]
            }
            break
        }
      } else {
        const indexArr = [this.arg1, this.arg2].sort((a, b) => {
          const ranks = ["文本", "选项", "数值"]
          const index1 = ranks.indexOf(this.titles[a].type)
          const index2 = ranks.indexOf(this.titles[b].type)
          return index1 - index2
        })
        const arg1 = this.titles[indexArr[0]]
        const arg2 = this.titles[indexArr[1]]
        var data = this.data.map(item => ({
          value1: item[arg1.nonce],
          value2: item[arg2.nonce],
        })).filter(item => !["", null, undefined].includes(item.value1) && !["", null, undefined].includes(item.value2))

        if (arg1.type !== "数值" && arg2.type !== "数值") {

          var statistics = {}
          var subtitles = []

          for (const item of data) {
            statistics[item.value1] = {}
            subtitles.push(item.value2)
          }
          subtitles = Array.from(new Set(subtitles))

          Object.keys(statistics).forEach(k => {
            for (const s of subtitles) {
              statistics[k][s] = 0
            }
          })

          for (const item of data) {
            statistics[item.value1][item.value2]++
          }

          this.option = {
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              }
            },
            legend: {
              data: [...subtitles]
            },

            xAxis: [
              {
                type: 'category',
                axisTick: { show: false },
                data: Object.keys(statistics)
              }
            ],
            yAxis: [
              {
                type: 'value'
              }
            ],
            series: subtitles.map(item => ({
              name: item,
              type: 'bar',
              barGap: 0,
              label: {
                show: true,
                position: 'insideBottom',
                distance: 15,
                align: 'left',
                verticalAlign: 'middle',
                rotate: 90,
                formatter: '{c}  {name|{a}}',
                fontSize: 16,
                rich: {
                  name: {}
                }
              },
              emphasis: {
                focus: 'series'
              },
              data: Object.keys(statistics).map(key => statistics[key][item])
            }))
          }
        } else if (arg1.type !== "数值" && arg2.type === "数值") {

          var statistics = {}
          var subtitles = []

          for (const item of data) {
            statistics[item.value2] = {}
            subtitles.push(item.value1)
          }
          subtitles = Array.from(new Set(subtitles))
          Object.keys(statistics).forEach(k => {
            for (const s of subtitles) {
              statistics[k][s] = 0
            }
          })
          for (const item of data) {
            statistics[item.value2][item.value1]++
          }

          this.option = {
            tooltip: {
              trigger: 'axis'
            },
            legend: {
              data: [...subtitles]
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            xAxis: {
              type: 'category',
              boundaryGap: false,
              data: Object.keys(statistics).map(item => Number(item)).sort((a, b) => a - b)
            },
            yAxis: {
              type: 'value'
            },
            series: subtitles.map(item => ({
              name: item,
              type: 'line',
              data: Object.keys(statistics).map(item => Number(item)).sort((a, b) => a - b).map(key => statistics[key][item])
            }))
          }
        } else {
          this.option = {
            xAxis: {
              name: arg1.label,
              nameLocation: 'center',
              nameTextStyle: {
                padding: 5
              }
            },
            yAxis: {
              name: arg2.label,
              nameLocation: 'center',

            },
            tooltip: {
              position: 'top'
            },
            series: [
              {
                symbolSize: 10,
                encode: { tooltip: [0, 1] },
                itemStyle: {
                  borderColor: '#555'
                },
                data: data.map(item => [item.value1, item.value2]),
                type: 'scatter'
              }
            ]
          }
        }

      }
      this.chart.root.scrollIntoView({ behavior: 'smooth' })
      this.isLoading = false
    },
    saveChart() {
      if (!this.showChart || !this.chart) return
      html2Canvas(this.chart.root, {
        dpi: 350,
        width: this.chart.root.offsetWidth,
        height: this.chart.root.offsetHeight
      }).then((canvas) => {
        var context = canvas.getContext('2d')
        context.mozImageSmoothingEnabled = false
        context.webkitImageSmoothingEnabled = false
        context.msImageSmoothingEnabled = false
        context.imageSmoothingEnabled = false
        const dataURL = canvas.toDataURL()
        const a = document.createElement('a')
        this.$el.appendChild(a)
        a.download = `image-${Date.now().toString()}.png`
        a.href = dataURL
        a.click()
        a.remove()
      })
    }
  },
  watch: {
    arg1() {
      this.createCanvas()
    },
    arg2() {
      this.createCanvas()
    }
  },
  mounted() {
    this.hideCanvas()
  }
}
</script>

<template>
  <div :class="$style.container">

    <div :class="$style.argSelect">
      <span>* 参数一：</span>
      <el-select clearable placeholder="none" v-model="arg1">
        <el-option v-for="(title, index) of titles" :label="title.label" :value="index" />
      </el-select>
    </div>
    <div :class="$style.argSelect">
      <span>* 参数二：</span>
      <el-select clearable placeholder="none" v-model="arg2">
        <el-option v-for="(title, index) of titles" :label="title.label" :value="index" />
      </el-select>
    </div>

    <v-chart ref="chart" :class="$style.chart" :loading="isLoading" :option="option" />

    <span :class="$style.bthControl" @click="saveChart" v-if="canDownload && showChart">保存图像</span>

  </div>
</template>

<style module>
.container {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.chart {
  width: 750px;
  height: 700px;
  margin-top: 20px;
}

.argSelect {
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.bthControl {
  width: 120px;
  background-color: var(--theme-color);
  color: #fff;
  text-align: center;
  padding: 5px 10px 5px 10px;
  border-radius: 20px;
  cursor: pointer;
}
</style>