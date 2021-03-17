import Vue from 'vue'

export default new Vue({
  data () {
    return {
      loading: null // 加载
    }
  },
  methods: {
    // ==================== 开启加载 ====================
    openLoading () {
      this.loading = this.$loading({
        lock: true,
        text: '拼命加载中……',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
    },
    // ==================== 关闭加载 ====================
    closeLoading () {
      this.loading && this.loading.close()
    },
    // ==================== 删除数组指定元素 返回新数组 deOneArr(数组，元素) ====================
    deOneArr (arr, str) {
      let newArr = arr
      let index = newArr.indexOf(str)
      newArr.splice(index, 1)
      return newArr
    },
    // ==================== 提示信息 ====================
    // type = success / error / warning / info, 输入'<br>'换行
    message (text, type = 'info') {
      const h = this.$createElement
      let arr = []
      if (text.indexOf('<br>') > -1) {
        text.split('<br>').forEach(b => {
          arr.push(h('p', null, b))
        })
      } else {
        arr.push(h('p', null, text))
      }
      this.$message({
        message: h('div', { style: { marginRight: '24px' } }, arr),
        type,
        showClose: true // 显示关闭按钮
      })
    },
    // ==================== 数组找下标 ====================
    // arr[必填]: 数组 / val[必填]: 当前值 / valKey: 当前值键名
    arrFindIndex (arr, val, valKey) {
      if (!arr) arr = []
      return arr.findIndex(b => b === val || b + '' === val || b[valKey] === val || b[valKey] + '' === val)
    },
    // ==================== 数组找元素 ====================
    // arr[必填]: 数组 / val[必填]: 当前值 / valKey: 当前值键名 / expectKey: 目标键名
    arrFindEl (arr, val, valKey, expectKey) {
      if (!arr) arr = []
      const el = arr.find(b => b === val || b + '' === val || b[valKey] === val || b[valKey] + '' === val)
      return el ? (expectKey ? el[expectKey] : el) : null
    },
    // ==================== 日期格式 'YYYY-MM-DD hh:mm:ss:SS 星期W' ====================
    // H+: 也是时，但只显示(1-12) / Q+: 季度
    dateFormat (date, format) {
      const week = ['\u65e5', '\u4e00', '\u4e8c', '\u4e09', '\u56db', '\u4e94', '\u516d']
      const str = {
        'M+': date.getMonth() + 1, // 月
        'D+': date.getDate(), // 日
        'W+': week[date.getDay()], // 星期/周
        'H+': date.getHours() % 12 === 0 ? 12 : date.getHours() % 12, // 时
        'h+': date.getHours(), // 时
        'm+': date.getMinutes(), // 分
        's+': date.getSeconds(), // 秒
        'S+': date.getMilliseconds(), // 毫秒
        'Q+': Math.floor((date.getMonth() + 3) / 3) // 季度
      }
      let fmt = format
      if (/(Y+)/.test(fmt)) { // 年
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
      }
      for (const k in str) { // 循环替换匹配值
        if (new RegExp('(' + k + ')').test(fmt)) {
          fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? str[k] : ('00' + str[k]).substr(('' + str[k]).length))
        }
      }
      return fmt
    },
    // ==================== 获取日期 (返回原日期格式) ====================
    getDate (type, num, time) {
      let date = time ? new Date(time) : new Date()
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      // let day = date.getDate()
      if (type === 'Y') { // 设置某年
        date.setFullYear(num)
      } else if (type === 'M') { // 设置某月 0-11
        date.setMonth(num - 1)
      } else if (type === 'D') { // 设置某日 1-31
        date.setDate(num)
      } else if (type === 'beforeY') { // 年前
        date.setFullYear(year - num)
      } else if (type === 'afterY') { // 年后
        date.setFullYear(year + num)
      } else if (type === 'beforeM') { // 月前
        if (num < month) {
          date.setMonth(month - num - 1)
        } else {
          let numY = parseInt((num - month) / 12)
          let numM = 12 - (num - month) % 12
          date.setFullYear(year - numY - 1)
          date.setMonth(numM - 1)
        }
      } else if (type === 'afterM') { // 月后
        if (num <= 12 - month) {
          date.setMonth(month + num - 1)
        } else {
          let numY = parseInt((num - (12 - month)) / 12)
          let numM = (num - (12 - month)) % 12
          date.setFullYear(year + numY + 1)
          date.setMonth(numM - 1)
        }
      } else if (type === 'beforeD') { // 日前
        let numD = date.getTime() - 1000 * 60 * 60 * 24 * num
        date = new Date(numD)
      } else if (type === 'afterD') { // 日后
        let numD = date.getTime() + 1000 * 60 * 60 * 24 * num
        date = new Date(numD)
      }
      return date
    },
    // ====================== 日期时间差 ====================
    dateInterval (startTime, endtime, type = 'M') {
      if (!startTime || !endtime) return 0
      const startArr = this.dateFormat(new Date(startTime), 'YYYY-MM-DD').split('-')
      const endArr = this.dateFormat(new Date(endtime), 'YYYY-MM-DD').split('-')
      const endaddArr = this.dateFormat(new Date(this.dayadd(endtime)), 'YYYY-MM-DD').split('-')
      const interval = new Date(endtime).getTime() - new Date(startTime).getTime() // 时间差
      if (type === 'Y') {
        let start = parseInt(startArr[0])
        let end = parseInt(endArr[0])
        return (end - start)
      } else if (type === 'M') {
        let start = parseInt(startArr[0]) * 12 + parseInt(startArr[1])
        // let end = parseInt(endArr[0]) * 12 + parseInt(endArr[1])
        let endadd = parseInt(endaddArr[0]) * 12 + parseInt(endaddArr[1])
        // let differenceonce = end - start
        let differencetwo = endadd - start
        return differencetwo
      } else if (type === 'D') {
        return Math.floor(interval / (24 * 60 * 60 * 1000))
      } else {
        return 0
      }
    },
    // ====================== 确认提示框 ====================
    confirm (type = 'del', confirm, cancel) {
      const info = {
        del: { text: '此操作将永久删除该条数据，是否继续？' },
        batchDel: { text: '此操作将永久删除选中数据，是否继续？' },
        submit: { text: '您选择提交此记录，提交后将不能更改，是否继续？', confirmBtnText: '继续' },
        lesmony: { text: '当前合同收费未完成，是否继续终止？' },
        equmony: { text: '该操作将终止合同，是否继续终止？' },
        submitCon: { text: '该操作将结束合同，是否结束？', confirmBtnText: '继续' }
      }
      this.$confirm(info[type].text, (info[type].title || '提示'), {
        confirmButtonText: info[type].confirmBtnText || '确定',
        cancelButtonText: info[type].cancelBtnText || '取消',
        type: 'warning'
      }).then(() => {
        confirm && typeof confirm === 'function' && confirm()
      }).catch(() => {
        cancel && typeof cancel === 'function' && cancel()
      })
    },
    // ====================== 下载文件 ======================
    download (url, name) {
      // window.open(url) // 该方法只能下载比如xls等不能直接打开的文件，对于png之类的文件会直接打开而非下载
      this.getBlob(url).then(blob => {
        if (window.navigator.msSaveOrOpenBlob) {
          navigator.msSaveBlob(blob, name)
        } else {
          const link = document.createElement('a')
          const body = document.querySelector('body')
          link.href = window.URL.createObjectURL(blob)
          link.download = name
          link.style.display = 'none'
          body.appendChild(link)
          link.click()
          body.removeChild(link)
          window.URL.revokeObjectURL(link.href)
        }
      })
    },
    getBlob (url) { // 解决跨域导致a.download无效，无法重命名的问题
      return new Promise(resolve => {
        const xhr = new XMLHttpRequest()
        xhr.open('GET', url, true)
        xhr.responseType = 'blob'
        xhr.onload = () => {
          if (xhr.status === 200) resolve(xhr.response)
        }
        xhr.send()
      })
    },
    // ====================== 小数运算 ======================
    // math[必填]: 运算符(+ - * / %) / num1[必填]: 数字1 / num2: 数字2
    decimalMath (num1, math, num2) {
      let pow = 1
      const arr = [num1 + '', num2 + '']
      arr.forEach(b => {
        const n = b.indexOf('.') ? b.length - b.indexOf('.') - 1 : 0
        pow = n > pow ? n : pow
      })
      const len = Math.pow(10, pow)
      num1 = Number(num1) * len
      num2 = Number(num2) * len
      let result = 0
      math = math.trim() // 删除字符串两端的空白字符
      if (math === '+') result = (num1 + num2) / len
      if (math === '-') result = (num1 - num2) / len
      if (math === '*') result = num1 * num2 / len / len
      if (math === '/') result = num1 / num2
      if (math === '%') result = num1 % num2 / len
      // console.log('小数运算', result)
      return result
    },
    // ====================== 限制时间 ======================
    // 注: 开始时间小于结束时间，用于时间框，一般与@blur事件绑定
    // startStr: 开始时间字符串 / startTime: 开始时间 / endStr: 结束时间字符串 / endTime: 结束时间
    // comeback([startStr||endTime]): 回调函数([开始/结束时间字符串]), 不符合规则时清空时间
    limitTime (startStr, startTime, endStr, endTime, comeback) {
      if (!startTime || !endTime) return
      let start = new Date(startTime).getTime()
      let end = new Date(endTime).getTime()
      if (start > end) {
        startStr && this.message('开始时间不能大于结束时间，请重新选择', 'warning')
        endStr && this.message('结束时间不能小于开始时间，请重新选择', 'warning')
        comeback && typeof comeback === 'function' && comeback(startStr || endStr)
      }
    },
    // ==================== 获取1级菜单名 ====================
    getMenuName ($route) {
      const str = $route.path.replace('/home/', '')
      const menuName = str.indexOf('/') !== -1 ? str.substring(0, str.indexOf('/')) : str.substring(0)
      return menuName
    },
    // ==================== val 不为空 ====================
    noNull (val) { return (val || val === 0 || val === false) }
  }
})
