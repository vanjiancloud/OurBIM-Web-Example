const serverConfig = {
    development: { // 小牛云
        VUE_APP_REQUEST_URL: 'https://xr.ourbim.com:10011/vjapi',
        ADMIN_REQUEST_URL: 'https://manage.ourbim.com:10012',
        CAD_REQUEST_URL: 'https://xr.ourbim.com:10088/vjapi',
        CAD_Web: 'http://120.86.64.201:5023/bim_CAD/',
    },
    production: {
        VUE_APP_REQUEST_URL: 'https://api.ourbim.com:11023/vjapi',
        ADMIN_REQUEST_URL: 'https://api.ourbim.com:10012',
        CAD_REQUEST_URL: 'https://api.ourbim.com:11088/vjapi',
        CAD_Web: 'https://www.ourbim.com/bim_CAD/',
    }
}

const env = 'development'
export default serverConfig[env]