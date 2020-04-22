import {message} from "antd";

/**
 * 封装get
 * @param url
 * @param success
 * @param fail
 * @constructor
 */
const Get_Request=(url,success,fail)=>{
    fetch(url).then(function (response) {
        return response.json()
    }).then(function (json) {
        if (json.success) {
            success && success(json)
        } else if (json.code == '506') {
            message.error(json.msg)
            window.initLogin();
        } else {
            fail && fail()
            message.error(json.msg)
        }
    }).catch(function (ex) {
        console.log('parsing failed', ex)
    })
}

export default {
    Get_Request
}
