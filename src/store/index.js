// 通过localstorage封装有关用户信息的操作

// 1. 存用户id
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

// 2. 取用户id
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

// 3. 删除用户id
export const deluserid = () => {
  // 1.删除操作  
  // 2.删除方法调用之后的返回结果return出去
  return window.localStorage.removeItem(KEY)
}


// 1. 存用户email
const key = 'email' // 作为存值和取值的key
export const setemail = (info) => {
  // try语法块中如果有错误，会被catch捕获，执行catch语法块中的代码，不会导致整个应用奔溃
  let email
  try {
    email = JSON.stringify(info)
  } catch (error) {
    email = ''
  }
  return window.localStorage.setItem(key, email)
}
// 2. 取用户email
export const getemail = () => {
  const infoStr = window.localStorage.getItem(key)
  let formartStr
  try {
    formartStr = JSON.parse(infoStr)
  } catch (error) {
    formartStr = {}
  }
  return formartStr
}
// 3. 删除用户email
export const delemail = () => {
  // 1.删除操作  
  // 2.删除方法调用之后的返回结果return出去
  return window.localStorage.removeItem(key)
}


// 1. 存用户密码
const code = 'password' // 作为存值和取值的key
export const setpassword = (info) => {
  // try语法块中如果有错误，会被catch捕获，执行catch语法块中的代码，不会导致整个应用奔溃
  let password
  try {
    password = JSON.stringify(info)
  } catch (error) {
    password = ''
  }
  return window.localStorage.setItem(code, password)
}
// 2. 取用户密码
export const getpassword = () => {
  const infoStr = window.localStorage.getItem(code)
  let formartStr
  try {
    formartStr = JSON.parse(infoStr)
  } catch (error) {
    formartStr = {}
  }
  return formartStr
}
// 3. 删除用户密码
export const delpassword = () => {
  // 1.删除操作  
  // 2.删除方法调用之后的返回结果return出去
  return window.localStorage.removeItem(code)
}


// 1. 存用户mobile
const Key = 'mobile' // 作为存值和取值的key
export const setmobile = (info) => {
  // try语法块中如果有错误，会被catch捕获，执行catch语法块中的代码，不会导致整个应用奔溃
  let mobile
  try {
    mobile = JSON.stringify(info)
  } catch (error) {
    mobile = ''
  }
  return window.localStorage.setItem(Key, mobile)
}
// 2. 取用户mobile
export const getmobile = () => {
  const infoStr = window.localStorage.getItem(Key)
  let formartStr
  try {
    formartStr = JSON.parse(infoStr)
  } catch (error) {
    formartStr = {}
  }
  return formartStr
}
// 3. 删除用户mobile
export const delmobile = () => {
  // 1.删除操作  
  // 2.删除方法调用之后的返回结果return出去
  return window.localStorage.removeItem(Key)
}

// 通过sessionStorage封装有关用户信息的操作

// 1. 存用户id
const keys = 'userid' // 作为存值和取值的key
export const Setuserid = (info) => {
  // try语法块中如果有错误，会被catch捕获，执行catch语法块中的代码，不会导致整个应用奔溃
  let userid
  try {
    userid = JSON.stringify(info)
  } catch (error) {
    userid = ''
  }
  return window.sessionStorage.setItem(keys, userid)
}
// 3. 删除用户id
export const Deluserid = () => {
  // 1.删除操作  
  // 2.删除方法调用之后的返回结果return出去
  return window.sessionStorage.removeItem(keys)
}