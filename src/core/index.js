const fs = require("fs")
const yaml = require('js-yaml')
const { join } = require("path")
import { _configTemplate, _adminTemplate, _filterTemplate, _filterType } from './config'
import useStore from 'stores/store'
import { randomHex, Encrypt, Decrypt } from './AES'

const basePath = './_data'

const fullPath = path => join(basePath, path)

const _configYaml = fullPath('_config.yaml')
const _configAES = fullPath('_app.key')
const _identity = fullPath('identity')
const _identity_admin = join(_identity, '_admin.key')
const _identity_user = join(_identity, '_user.key')
const _DB = fullPath('database')
const _filter = join(_DB, "filter.txt")
const _dataSet = join(_DB, "dataSet.txt")

function deepClone(obj, cache = new WeakMap()) {
  if (obj === null || typeof obj !== "object") return obj
  if (obj instanceof Date) return new Date(obj)
  if (obj instanceof RegExp) return new RegExp(obj)

  if (cache.has(obj)) return cache.get(obj)
  let cloneObj = new obj.constructor()
  cache.set(obj, cloneObj)

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloneObj[key] = deepClone(obj[key], cache)
    }
  }

  return cloneObj
}


function readYaml(path) {
  const fileContents = fs.readFileSync(path, 'utf8')
  return yaml.load(fileContents)
}

function writeYaml(path, data) {
  const yamlStr = yaml.dump(data)
  fs.writeFileSync(path, yamlStr, 'utf8')
}

function LoadAES(path, key, iv) {
  const data = [key, iv].join(';')
  fs.writeFileSync(path, data, "utf8")
}

function getAES(path) {
  const data = fs.readFileSync(path).toString("utf8")
  const arr = data.split(";")
  return {
    key: arr[0],
    iv: arr[1]
  }
}

function EncryptObjectAsFile(path, obj) {
  const data = JSON.stringify(obj)
  const { key, iv } = getAES(_configAES)
  const encrptData = Encrypt(data, key, iv)
  fs.writeFileSync(path, encrptData, "utf8")
}

function DecryptFileAsObject(path) {
  const encrptData = fs.readFileSync(path).toString("utf8")
  const { key, iv } = getAES(_configAES)
  const data = Decrypt(encrptData, key, iv)
  return JSON.parse(data)
}

export function init() {

  if (!fs.existsSync(basePath)) {
    fs.mkdirSync(basePath)
    writeYaml(_configYaml, _configTemplate)
    LoadAES(_configAES, randomHex(), randomHex())
  }

  if (!fs.existsSync(_identity)) {
    fs.mkdirSync(_identity)
    EncryptObjectAsFile(_identity_admin, _adminTemplate)
    EncryptObjectAsFile(_identity_user, [])
  }

  if (!fs.existsSync(_DB)) {
    fs.mkdirSync(_DB)

    EncryptObjectAsFile(_filter, _filterTemplate)
    fs.writeFileSync(_dataSet, "")
  }

  const store = useStore()
  store.config = readYaml(_configYaml)

}

export function initData() {
  const store = useStore()

  if (store.isAdmin() && !store.userData) {
    store.setLoading("正在加载用户组信息")
    store.userData = new UserData()
  }

  if (!store.filterSet) {
    store.setLoading("正在加载筛选项")
    store.filterSet = new FilterSet()
  }

  if (!store.dataSet) {
    store.dataSet = new DataSet()
  }

  store.setUnLoad()
}

export function readImg(path) {
  const prefix = path.match(/\.(.+)$/)[1]
  return 'data: image/' + prefix + ';base64,' + fs.readFileSync(fullPath(path), 'base64')
}

function CheckLogin(acc, pwd, path) {
  const data = DecryptFileAsObject(path)
  return !!~data.findIndex(item => item[0] === acc && item[1] === pwd)
}

export const CheckAdminLogin = (acc, pwd) => CheckLogin(acc, pwd, _identity_admin)

export const CheakUserLogin = (acc, pwd) => CheckLogin(acc, pwd, _identity_user) || CheckAdminLogin(acc, pwd, _identity_admin)

export const modifyAdmin = (acc, pwd) => EncryptObjectAsFile(_identity_admin, [[acc, pwd]])

class UserData {

  data = []

  constructor() {
    this.data = DecryptFileAsObject(_identity_user)
  }
  save() {
    EncryptObjectAsFile(_identity_user, this.data)
  }
  AddUser(acc, pwd) {
    this.data.push([acc, pwd])
    this.save()
  }
  modifyUser(index, acc, pwd) {
    if (!this.data[index]) return
    this.data[index] = [acc, pwd]
    this.save()
  }
  RemoveUser(index) {
    if (!this.data[index]) return
    this.data.splice(index, 1)
    this.save()
  }

}

class FilterSet {
  data = {}
  constructor() {
    this.data = DecryptFileAsObject(_filter)
  }
  save() {
    EncryptObjectAsFile(_filter, this.data)
  }
  /**
   * 
   * @param {String} name 
   * @param {"Select"|"Number"|"String"} type 
   */
  addFilter(name, type) {
    this.data.nonce += 1
    const obj = {
      name,
      type: _filterType[type]
    }
    if (type === "Select") {
      obj.options = {
        nonce: 0,
        data: {}
      }
    }
    this.data.data[this.data.nonce] = obj
    this.save()
  }
  modifyFilter(nonce, name) {
    if (!this.data.data[nonce]) return
    this.data.data[nonce].name = name
    this.save()
  }
  removeFilter(nonce) {
    if (!this.data.data[nonce]) return
    delete this.data.data[nonce]
    this.save()
  }
  addFilterOption(nonce, option) {
    if (this.data.data[nonce]?.type !== _filterType.Select) return
    this.data.data[nonce].options.nonce += 1
    this.data.data[nonce].options.data[this.data.data[nonce].options.nonce] = option
    this.save()
  }
  modifyFilterOption(nonce, optionNonce, name) {
    if (
      this.data.data[nonce]?.type !== _filterType.Select ||
      !this.data.data[nonce].options.data[optionNonce]
    ) return
    this.data.data[nonce].options.data[optionNonce] = name
    this.save()
  }
  removeFilterOption(nonce, optionNonce) {
    if (
      this.data.data[nonce]?.type !== _filterType.Select ||
      !this.data.data[nonce].options.data[optionNonce]
    ) return
    delete this.data.data[nonce].options.data[optionNonce]
    this.save()
  }

  getFormatData() {
    const result = []
    const Types = ["选项", "文本", "数值"]
    for (const nonce of Object.keys((this.data.data))) {
      const data = this.data.data[nonce]
      const item = {}
      item.nonce = nonce
      item.title = data.name
      item.type = Types[data.type - 1]
      if (data.type === _filterType.Select) {
        const optionsData = data.options.data
        item.options = Object.keys(optionsData).map(item => ({
          nonce: item,
          option: optionsData[item]
        }))
      }
      result.push(item)
    }
    return result
  }

}

export class FilterEntity {

  data = {}
  nonces = []
  dataTypes = {}
  optionsNonces = {}
  optionsValue = {}

  constructor() {
    const store = useStore()
    const filter = deepClone(store.filterSet.data.data)
    const nonces = Object.keys(filter)
    this.nonces = nonces
    for (const nonce of nonces) {
      this.data[nonce] = null
      this.dataTypes[nonce] = filter[nonce].type
      if (this.dataTypes[nonce] === _filterType.Select) {
        const options = deepClone(filter[nonce].options.data)
        this.optionsNonces[nonce] = Object.keys(options)
        this.optionsValue[nonce] = options
      }
    }
  }

  set(nonce, value) {
    nonce = String(nonce)
    if (!this.nonces.includes(nonce)) return
    if (["", null, undefined].includes(value)) {
      return this.data[nonce] = null
    }
    switch (this.dataTypes[nonce]) {
      case _filterType.Number:
        return this.data[nonce] = Number(value)
      case _filterType.String:
        return this.data[nonce] = String(value)
      case _filterType.Select:
        if (!this.optionsNonces[nonce].includes(String(value))) return
        return this.data[nonce] = value
      default:
        return
    }
  }

  judge(data) {
    for (const nonce of this.nonces) {
      if ([null, undefined, ""].includes(this.data[nonce])) continue
      if (!data[nonce]) return false
      switch (this.dataTypes[nonce]) {
        case _filterType.Number:
        case _filterType.Select:
          if (this.data[nonce] !== data[nonce]) return false
          break
        case _filterType.String:
          if (!data[nonce].includes(this.data[nonce])) return false
          break
      }
    }
    return true
  }

}

class DataSet {
  data = []

  constructor() {
    const data = fs.readFileSync(_dataSet, "utf8")
    this.data = data.split(/\t?\n/).slice(0, -1).map(line => new DataEntity(JSON.parse(line)))
  }
  addOneData(data) {
    const newData = new DataEntity(data)
    this.data.push(newData)
    fs.appendFileSync(_dataSet, newData.getDataStr(), "utf8")
  }
  save() {
    const data = this.data.map(item => item.getDataStr())
    fs.writeFileSync(_dataSet, data.join(""), "utf8")
  }

  modifyOneData(index, data) {
    this.data[index] = new DataEntity(data)
    this.save()
  }
  deleteOneData(index) {
    this.data.splice(index, 1)
    this.save()
  }

  getOneData(index) {
    return deepClone(this.data[index].getData())
  }

  getData(filter = new FilterEntity()) {
    return this.data.map((oneDataEntity, index) => {
      if (filter.judge(oneDataEntity.getData())) {
        return {
          index,
          data: oneDataEntity.getFormatData()
        }
      }
      return false
    }).filter(item => item)
  }

}


export class DataEntity {

  filter = new FilterEntity()

  constructor(data) {
    if (data) {
      for (const nonce of this.filter.nonces) {
        this.set(nonce, data[nonce])
      }
    }
  }
  set(nonce, value) {
    this.filter.set(nonce, value)
  }
  getData() {
    return this.filter.data
  }
  getFormatData() {
    const data = {}
    for (const nonce of this.filter.nonces) {
      switch (this.filter.dataTypes[nonce]) {
        case _filterType.Number:
          data[nonce] = Number(this.filter.data[nonce]) || ""
          break
        case _filterType.String:
          data[nonce] = String(this.filter.data[nonce] || "")
          break
        case _filterType.Select:
          data[nonce] = this.filter.optionsValue[nonce][this.filter.data[nonce]]
          break
      }
    }
    return data
  }
  getDataStr() {
    return JSON.stringify(this.getData()) + "\n"
  }
}