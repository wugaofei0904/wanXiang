const proxy = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        proxy('/api', {
            target: 'http://open.suwenyj.xyz:8080',
            changeOrigin: true
        })
    )
}