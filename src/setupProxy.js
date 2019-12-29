const proxy = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        proxy('/api', {
            target: 'https://open.suwenyj.xyz:8080',
            changeOrigin: true
        })
    )
}