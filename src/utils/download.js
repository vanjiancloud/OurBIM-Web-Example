import Vue from 'vue'
import { getToken } from '@/utils/auth';
import { Getuserid } from '@/store/index.js'

export default new Vue({
  data() {
    return {
      loading: null // 加载
    }
  },
  methods: {
    // ====================== 下载文件 ======================
    // url: 下载地址, name: 文件名, params: 查询参数, headers: 自定义请求头
    downloadHeader(url, name, params = {}, headers = {}) {
      // 处理查询参数
      const queryString = Object.keys(params).length ? '?' + new URLSearchParams(params).toString() : '';
      const fullUrl = url + queryString;

      // 获取默认token头
      const windowsParams = new URLSearchParams(window.location.href);
      const defaultHeaders = {
        'accessToken': getToken() || windowsParams.get('shareToken'),
        'token': Getuserid() || windowsParams.get('userId'),
      };

      this.getBlobHeader(fullUrl, { ...defaultHeaders, ...headers }).then(blob => {
        if (window.navigator.msSaveOrOpenBlob) {
          navigator.msSaveBlob(blob, name);
        } else {
          const link = document.createElement('a');
          const body = document.querySelector('body');
          link.href = window.URL.createObjectURL(blob);
          link.download = name;
          link.style.display = 'none';
          body.appendChild(link);
          link.click();
          body.removeChild(link);
          window.URL.revokeObjectURL(link.href);
        }
      }).catch(error => {
        this.message('下载失败: ' + (error.message || '网络错误'), 'error');
      });
    },
    getBlobHeader(url, headers = {}) { // 解决跨域导致a.download无效，无法重命名的问题
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'blob';

        // 设置请求头
        Object.keys(headers).forEach(key => {
          xhr.setRequestHeader(key, headers[key]);
        });

        xhr.onload = () => {
          console.log('Response headers:', xhr.getAllResponseHeaders());
          if (xhr.status === 200) {
            resolve(xhr.response);
          } else {
            reject(new Error(`HTTP error! status: ${xhr.status}`));
          }
        };

        xhr.onerror = () => {
          console.error('Request failed with status:', xhr.status);
          reject(new Error('Network request failed'));
        };

        xhr.send();
      })
    },
    message(text, type = 'info') {
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
  }
})
