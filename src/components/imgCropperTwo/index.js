import React from 'react'
import Cropper from 'react-cropper'
import 'cropperjs/dist/cropper.css'
import { Button } from 'antd'

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

    cropImage() {
        if (this.cropper.getCroppedCanvas() === 'null') {
            return false
        }

        // this.uploadImg()
        // console.log(this.cropper.getCroppedCanvas().toDataURL())
        this.props.getCropData(this.cropper.getCroppedCanvas().toDataURL())
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