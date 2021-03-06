import React from 'react'
import Cropper from 'react-cropper'
import 'cropperjs/dist/cropper.css'
import { Button, message } from 'antd'
import { createAuthor, imgUpload, postArticle, articleEdit, initBaseImg } from './../../utils/fetchApi'


export default class ImgCropperTwo extends React.Component {
    constructor() {
        super();
        this.cropImage = this.cropImage.bind(this);
    }


    // this.refs.cropper.reset();
    // _ready() {
    //     this.cropper.setData({
    //         width: this.state.width,
    //         height: this.state.height,
    //     });
    // }

    //将base64码转化为FILE格式
    dataURLtoFile(dataurl, filename) {
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

    //生成随机字符串
    randomString = (len) => {
        len = len || 32;
        var _chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
        var maxPos = _chars.length;
        var pwd = '';
        for (var i = 0; i < len; i++) {
            pwd += _chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return pwd;
    }

    cropImage = () => {
        let _this = this;

        if (this.cropper.getCroppedCanvas() === 'null') {
            return false
        }

        let _randomString = this.randomString();

        // 这里可以尝试修改上传图片的尺寸
        this.cropper.getCroppedCanvas().toBlob(async blob => {
            // 创造提交表单数据对象
            var formdata = new FormData();
            formdata.append('file', blob, `img_${_randomString}.jpg`);
            // 提示开始上传
            // try {
            //     // 接口
            //     let res = await upload(srcCropper, formData);
            //     if (res.errCode === 0) {
            //         // 上传成功
            //         //子传父
            //         this.props.getImg();
            //         message.success('上传成功')
            //     } else {
            //         // 上传失败
            //         message.error('上传失败')
            //     }
            // } catch (err) {
            //     console.log(err);
            // }
            fetch(`${imgUpload}`, {
                method: 'post',
                body: formdata,
            })
                .then(function (response) {
                    return response.json()
                }).then(function (json) {
                    // debugger
                    if (json.success) {
                        _this.props.getCropData(json.data);
                        message.success('上传成功');
                    } else if (json.code == '506') {
                        window.initLogin();
                    }
                }).catch(function (ex) {
                    console.log('parsing failed', ex)
                })


        }, "image/jpeg")

        // this.uploadImg()
        // console.log(this.cropper.getCroppedCanvas().toDataURL())
        // this.props.getCropData(this.cropper.getCroppedCanvas().toDataURL())
    }

    // uploadImg = () => {

    // }

    render() {
        let _props = this.props;
        return (
            <div>
                <div style={{ width: '100%' }}>
                    <Cropper
                        viewMode={1}
                        zoomable={true} //是否允许放大图像
                        movable={true} //是否允许移动图像
                        rotatable={false} //是否旋转
                        // style={{ height: '100%', width: '100%' }}
                        cropBoxResizable={true}//是否可以拖拽
                        cropBoxMovable={false}//是否可以移动裁剪框
                        dragMode="move"
                        center={true}
                        src={this.props.src}
                        ref={cropper => {
                            this.cropper = cropper;
                        }}
                        style={{ height: 400, width: '100%' }}
                        aspectRatio={400 / 300}
                        guides={false}
                    />
                </div>
                <div>
                    <Button type="primary" size="large" onClick={this.cropImage} style={{ marginTop: '10px' }}>
                        确认裁剪
                    </Button>
                </div>
            </div>
        );
    }
}