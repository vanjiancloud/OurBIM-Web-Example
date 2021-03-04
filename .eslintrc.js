/*
 * @Author: zk
 * @Date: 2021-02-20 13:30:47
 * @LastEditors: zk
 * @LastEditTime: 2021-03-04 14:33:33
 * @description: 
 */
module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    // '@vue/standard'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    // 'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'vue/no-parsing-error': [2, { 'x-invalid-end-tag': false }]
  }
}
