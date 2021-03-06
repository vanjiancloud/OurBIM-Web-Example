// 通过localstorage封装有关用户信息的操作

// 1. 存用户数据
const KEY = 'userid' // 作为存值和取值的key

export const setuserid = (info) => {
  // try语法块中如果有错误，会被catch捕获，执行catch语法块中的代码，不会导致整个应用奔溃
  let userid
  try {
    userid = JSON.stringify(info)
  } catch (error) {
    userid = ''
  }
  return window.localStorage.setItem(KEY, userid)
}

// 2. 取用户数据
export const getuserid = () => {
  const infoStr = window.localStorage.getItem(KEY)
  let formartStr
  try {
    formartStr = JSON.parse(infoStr)
  } catch (error) {
    formartStr = {}
  }
  return formartStr
}

// 3. 删除用户数据

export const deluserid = () => {
  // 1.删除操作  
  // 2.删除方法调用之后的返回结果return出去
  return window.localStorage.removeItem(KEY)
}
