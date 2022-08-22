export const _configTemplate = {
  title: '重金属数据库',
  subTitle: '这里是副标题',
  bannerLogin: '',
}

export const _adminTemplate = [
  ["admin", "admin"]
]

export const _filterType = {
  Select: 1,
  String: 2,
  Number: 3
}

export const _filterTemplate = {
  nonce: 10,
  data: {
    "1": {
      name: "水泥种类",
      type: _filterType.Select,
      options: {
        nonce: 3,
        data: {
          "1": "硅酸盐水泥",
          "2": "铝酸盐水泥",
          "3": "硫铝酸盐水泥"
        }
      }
    },
    "2": {
      name: "固废类型",
      type: _filterType.Select,
      options: {
        nonce: 4,
        data: {
          "1": "污泥",
          "2": "钢渣",
          "3": "飞灰",
          "4": "煤矸石",
        }
      }
    },
    "3": {
      name: "处理方式",
      type: _filterType.Select,
      options: {
        nonce: 3,
        data: {
          "1": "水泥窑共处理",
          "2": "水泥基固化/稳定",
          "3": "水泥窑共处理&水泥基固化/稳定"
        }
      }
    },
    "4": {
      name: "表征",
      type: _filterType.Select,
      options: {
        nonce: 3,
        data: {
          "1": "迁移转化",
          "2": "浸出(方法1)",
          "3": "浸出(方法2)"
        }
      }
    },
    "5": {
      name: "重金属种类",
      type: _filterType.Select,
      options: {
        nonce: 6,
        data: {
          "1": "Cr",
          "2": "As",
          "3": "Ni",
          "4": "Zn",
          "5": "Cu",
          "6": "Mn"
        }
      }
    },
    "6": {
      name: "添加量/比例",
      type: _filterType.Number,
    },
    "7": {
      name: "迁移转移比例",
      type: _filterType.Number,
    },
    "8": {
      name: "浸出率/比例",
      type: _filterType.Number,
    },
    "9": {
      name: "研究团队",
      type: _filterType.String,
    },
    "10": {
      name: "文献名称",
      type: _filterType.String
    }
  }


}
