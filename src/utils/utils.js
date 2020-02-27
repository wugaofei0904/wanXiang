export const getTimeInit = function formatDateTime(date) {
    var time = new Date(Date.parse(date));
    time.setTime(time.setHours(time.getHours() + 8));
    var Y = time.getFullYear() + '-';
    var M = addZero(time.getMonth() + 1) + '-';
    var D = addZero(time.getDate()) + ' ';
    var h = addZero(time.getHours()) + ':';
    var m = addZero(time.getMinutes()) + ':';
    var s = addZero(time.getSeconds());
    return Y + M + D + 'T' + h + m + s;
    // }
}


function addZero(num) {
    return num < 10 ? '0' + num : num;
}


//生成随机字符串
export function randomString(len) {
    len = len || 32;
    var _chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
    var maxPos = _chars.length;
    var pwd = '';
    for (var i = 0; i < len; i++) {
        pwd += _chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
}

//将base64码转化为FILE格式
export function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
}