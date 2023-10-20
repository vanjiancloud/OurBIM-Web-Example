/*
 * @Author: zk
 * @Date: 2021-03-20 11:07:12
 * @LastEditors: zk
 * @LastEditTime: 2021-09-10 11:32:13
 * @description: 
 */
const path = require('path')
function resolve(dir) {
    return path.join(__dirname, dir)
}
module.exports = {
    lintOnSave: false,
    publicPath: "./",
    // publicPath: "/ourbimtest/",
    // 生产环境是否生成 sourceMap 文件
    productionSourceMap: false,
    devServer: {
        port: 8888,
        // proxy: {
        //     '/api': {
        //         target: 'https://manage.ourbim.com:10012',
        //         changeOrigin: true,
        //         logLevel: 'debug',
        //         pathRewrite: {
        //             '^/api': ''
        //         }
        //     }
        // }
    },
    configureWebpack: (config) => {
        if (process.env.NODE_ENV === 'production') {
            config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
        }
    },
    chainWebpack(config) {
        // set svg-sprite-loader
        config.module
            .rule('svg')
            .exclude.add(resolve('src/icons'))
            .end()
        config.module
            .rule('icons')
            .test(/\.svg$/)
            .include.add(resolve('src/icons'))
            .end()
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({
            symbolId: 'icon-[name]'
            })
            .end()
    }
}