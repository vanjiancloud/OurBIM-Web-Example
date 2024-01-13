const serverConfig = {
    development: { // 2.19
        mqttPort: 8083,
        VUE_APP_REQUEST_URL: 'http://202.46.225.212:11011/vjapi',
        ADMIN_REQUEST_URL: 'https://manage.ourbim.com:10012',
        CAD_REQUEST_URL: 'https://xr.ourbim.com:10088/vjapi',
        CAD_Web: 'http://120.86.64.201:5023/bim_CAD/'
    },
    production: {
        mqttPort: 28083,
        VUE_APP_REQUEST_URL: 'https://api.ourbim.com:11023/vjapi',
        ADMIN_REQUEST_URL: 'https://api.ourbim.com:10012',
        CAD_REQUEST_URL: 'https://api.ourbim.com:11088/vjapi',
        CAD_Web: 'https://www.ourbim.com/bim_CAD/'
    }
}

const env = 'production'
export default serverConfig[env]