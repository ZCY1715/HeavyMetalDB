const CryptoJS = require("crypto-js")

export function randomHex() {
  const randomUnit = () => "0123456789abcdef".charAt(Math.min(Math.floor(Math.random() * 16), 15))
  return Array.from({ length: 16 }, () => randomUnit()).join("")
}

export function Decrypt(word, key, iv) {
  key = CryptoJS.enc.Utf8.parse(key)
  iv = CryptoJS.enc.Utf8.parse(iv)
  let encryptedHexStr = CryptoJS.enc.Hex.parse(word)
  let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr)
  let decrypt = CryptoJS.AES.decrypt(srcs, key, { iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 })
  let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8)
  return decryptedStr.toString()
}

export function Encrypt(word, key, iv) {
  key = CryptoJS.enc.Utf8.parse(key)
  iv = CryptoJS.enc.Utf8.parse(iv)
  let srcs = CryptoJS.enc.Utf8.parse(word)
  let encrypted = CryptoJS.AES.encrypt(srcs, key, { iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 })
  return encrypted.ciphertext.toString().toUpperCase()
}


