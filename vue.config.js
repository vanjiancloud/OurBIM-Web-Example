/*
 * @Author: zk
 * @Date: 2021-03-20 11:07:12
 * @LastEditors: zk
 * @LastEditTime: 2021-09-10 11:32:13
 * @description: 
 */
module.exports = {
    lintOnSave: false,
    // publicPath: "./",
    publicPath: "/project_center/",
    // 生产环境是否生成 sourceMap 文件
    productionSourceMap: false,
    devServer: {
        port: 8888
    },
    configureWebpack: (config) => {
        if (process.env.NODE_ENV === 'production') {
            config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
        }
    }
}