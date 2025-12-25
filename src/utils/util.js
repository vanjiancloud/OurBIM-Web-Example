
// import * as CryptoJS from 'crypto-js'
import JSEncrypt from 'jsencrypt/bin/jsencrypt.min'

const ENABLE_ENCRYPTION = true;
/**
 *加密处理
 */
// export const encryption = (params) => {
//   if(!ENABLE_ENCRYPTION) return params.data
//   let {
//     data,
//     type,
//     param,
//     // key
//   } = params
//   let key = 'vjvanjian*2025!#';
//   const result = JSON.parse(JSON.stringify(data))
//   if (type === 'Base64') {
//     param.forEach(ele => {
//       result[ele] = btoa(result[ele])
//     })
//   } else {
//     key = CryptoJS.enc.Latin1.parse(key)
//     var iv = key
//     param.forEach(ele => {
//       var data = result[ele]
//       // 加密
//       var encrypted = CryptoJS.AES.encrypt(
//         data,
//         key, {
//         iv: iv,
//         mode: CryptoJS.mode.CFB,
//         padding: CryptoJS.pad.NoPadding
//       })
//       result[ele] = encrypted.toString()
//     })
//   }
//   return result
// }

// 公钥
const publicKey = 'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAMH55ATRceEqIXArpY50zx9dRrGGsKkbe1eXoZJArfWNfYadch0GY9euMgGk1dmDB/Y5E2R+7QRCjzspGGL7WDcCAwEAAQ=='
// 加密
function encrypt(txt) {
  const encryptor = new JSEncrypt()
  encryptor.setPublicKey(publicKey) // 设置公钥
  return encryptor.encrypt(txt) // 对数据进行加密
}
// 通用加密处理
export const encryption = (params) => {
  if(!ENABLE_ENCRYPTION) return params.data
  let {
    data,
    type,
    param,
  } = params
  const result = JSON.parse(JSON.stringify(data))
  if (type === 'Base64') {
    param.forEach(ele => {
      result[ele] = btoa(result[ele])
    })
  } else {
    param.forEach(ele => {
      result[ele] = encrypt(result[ele])
    })
  }
  return result
}
