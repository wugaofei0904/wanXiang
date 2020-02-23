import React, { Component } from 'react';
import { Modal, Button, Row, Col, Select, Input, DatePicker, Pagination, message } from 'antd';
import './style.css';
import GetTagList from './../hooks/useGetTagList';

import ImgCropper from './../../components/imgCropper'
import { withRouter } from 'react-router-dom';
import { createAuthor, imgUpload, authorEdit } from './../../utils/fetchApi'

const { Option } = Select;
const { TextArea } = Input;
class CreateAnthor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            edit: false,
            id: '',
            rank: '',
            anthorName: '',
            shenfenText: '',
            tagId: '',
            tagName: '综合',
            wxName: '',
            modalVisible: false,
            localImg: '',
            imgValue: '',
            wxIndexName: '',
            resultImg: '',
            tagIdList: []  //领域list
        };
    }

    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    handleOk = e => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };

    handleCancel = e => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };


    onChange(pageNumber) {
        console.log('Page: ', pageNumber);
    }

    handleChange = (value) => {
        console.log(`selected ${value}`);
    }

    isgetTagList = async () => {
        let tagList = await GetTagList(0);
        if (tagList.msg == "未登录") {
            window.initLogin();
        }
        // debugger
        this.setState({
            tagIdList: tagList.data || []
        })
    }


    componentDidMount() {
        let _this = this;

        this.isgetTagList();
        try {
            let { data, edit } = _this.props.location.state;
            // debugger
            if (edit) {
                let _data = JSON.parse(data);
                console.log(_data);
                _this.setState({
                    rank: _data.rank,
                    anthorName: _data.name,
                    shenfenText: _data.detail,
                    tagId: _data.tagId,
                    tagName: _data.tagName,
                    wxName: _data.wxId,
                    resultImg: _data.headImg,
                    edit: true,
                    id: _data.id,
                    wxIndexName: _data.publicUrl
                })
            }
        } catch (err) {

        }

    }

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

    getCropData = (imgdata) => {
        // console.log('截取图片...');
        let _randomString = this.randomString();

        var formdata = new FormData();
        formdata.append("file", this.dataURLtoFile(imgdata, `img_${_randomString}.png`));
        let _this = this;
        message.loading('图片上传中...');
        fetch(`${imgUpload}`, {
            method: 'post',
            body: formdata,
        })
            .then(function (response) {
                return response.json()
            }).then(function (json) {
                message.success('上传成功！');

                if (json.success) {
                    _this.setState({
                        resultImg: json.data
                    })
                } else if (json.msg == '未登录') {
                    window.initLogin();
                }
                //隐藏弹窗
                _this.handleCancel();

            }).catch(function (ex) {
                console.log('parsing failed', ex)
            })
    }

    imgChange(e) {
        console.log(e.target.value)

        let file_head = e.target;
        let picture = e.target.value;
        if (!picture.match(/.jpg|.gif|.png|.bmp/i)) {
            alert("您上传的图片格式不正确，请重新选择！")
            this.setState({
                imgValue: ''
            })
            return false
        }
        if (file_head.files && file_head.files[0]) {
            var a = window.navigator.userAgent.indexOf("Chrome") >= 1 || window.navigator.userAgent.indexOf("Safari") >= 1 ? window.webkitURL.createObjectURL(file_head.files[0]) : window.URL.createObjectURL(file_head.files[0]);
            console.log(a)
            this.setState({
                localImg: a,
                visible: true,
            }, () => {
                this.setState({
                    imgValue: ''
                })
            })
        }
    }

    tagHandleChange = (value) => {
        console.log(value)
        this.setState({
            tagId: value
        })

    }

    rankHandleChange = (value) => {
        this.setState({
            rank: value
        })
    }

    nameChange = (e) => {
        this.setState({
            anthorName: e.target.value
        })
        // console.log(e.target.value)
    }


    textAreaChange = (e) => {
        this.setState({
            shenfenText: e.target.value
        })
        // console.log(e.target.value)
    }


    wxNameChange = (e) => {
        this.setState({
            wxName: e.target.value
        })
    }



    wxIndexNameChange = (e) => {
        this.setState({
            wxIndexName: e.target.value
        })
    }

    submitData = () => {

        let { id, edit, rank, anthorName, shenfenText, wxName, tagId, resultImg, wxIndexName } = this.state;
        let _this = this;
        // console.log(rank, anthorName, shenfenText, wxName, tagId, resultImg);
        console.log(anthorName, '123');

        if (edit) {
            fetch(`${authorEdit}?id=${id}&name=${anthorName}&rank=${rank}&tagId=${tagId}&detail=${shenfenText}&headImg=${resultImg}&wxId=${wxName}&publicUrl=${wxIndexName}`)
                .then(function (response) {
                    return response.json()
                }).then(function (json) {

                    if (json.success) {
                        message.success('编辑成功！即将返回列表页');
                        setTimeout(() => {
                            _this.props.history.push('anthorManage')
                        }, 1500)
                    } else if (json.msg == '未登录') {
                        window.initLogin();
                    }

                }).catch(function (ex) {
                    console.log('parsing failed', ex)
                })
        } else {
            fetch(`${createAuthor}?name=${anthorName}&rank=${rank}&tagId=${tagId}&detail=${shenfenText}&headImg=${resultImg}&wxId=${wxName}`)
                .then(function (response) {
                    return response.json()
                }).then(function (json) {

                    if (json.success) {
                        message.success('创建成功！即将返回列表页');
                        setTimeout(() => {
                            _this.props.history.push('anthorManage')
                        }, 1500)
                    } else if (json.msg == '未登录') {
                        window.initLogin();
                    }

                }).catch(function (ex) {
                    console.log('parsing failed', ex)
                })
        }
    }

    onClose = () => {
        this.props.history.push('anthorManage')
    }



    render() {
        // debugger
        let { tagName, rank, tagId, wxName, shenfenText, tagIdList, localImg, imgValue, resultImg, anthorName, wxIndexName } = this.state;
        console.log(rank, tagId, wxName, shenfenText, tagIdList, localImg, imgValue, resultImg, anthorName)

        return (
            <div className="create_anthor_Page">
                <Modal
                    title="裁剪图片"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={null}
                >
                    <ImgCropper getCropData={this.getCropData} src={localImg} />
                </Modal>
                <h1 className="page_title">创建作者</h1>
                <div className="form_item">
                    <div className="item_title">领域</div>
                    <div className="item_content">
                        <Select value={tagId} style={{ width: 120 }} onChange={this.tagHandleChange}>
                            {/* <Option value='3'>综合</Option> */}
                            {tagIdList.map(item => {
                                // return <Option value={item.id}>{item.tagName}</Option>
                                return <Option key={item.id} value={item.id}>{item.tagName}</Option>
                            })}
                        </Select>
                    </div>
                </div>
                <div className="form_item">
                    <div className="item_title"><span className="red_color">*</span>作者名</div>
                    <div className="item_content">
                        <Input className="w_300" value={anthorName} onChange={this.nameChange} placeholder="请输入作者名" />
                    </div>
                </div>

                <div className="form_item">
                    <div className="item_title"><span className="red_color">*</span>身份介绍</div>
                    <div className="item_content">
                        <TextArea defaultValue={shenfenText} onChange={this.textAreaChange} placeholder="请准确描述作者擅长领域" className="w_300" rows={4} />
                    </div>
                </div>

                <div className="form_item">
                    <div className="item_title"><span className="red_color">*</span>作者头像</div>
                    <div className="item_content">
                        <div className="anthor_touxaing">
                            {resultImg &&
                                <img src={resultImg} />
                            }
                        </div>
                        <div className="sc_btn">
                            <Input value={imgValue} onChange={this.imgChange.bind(this)} className="hidden_input" type="file" placeholder="Basic usage" />
                            <Button type="primary">选择头像</Button>
                        </div>
                    </div>
                </div>

                <div className="form_item">
                    <div className="item_title">作者等級</div>
                    <div className="item_content">
                        <Select value={rank} style={{ width: 120 }} onChange={this.rankHandleChange} >
                            <Option value="1">一级</Option>
                            <Option value="2">二级</Option>
                            <Option value="3">三级</Option>
                            <Option value="4">四级</Option>
                        </Select>
                    </div>
                </div>

                <div className="form_item">
                    <div className="item_title">微信公众号</div>
                    <div className="item_content">
                        <Input value={wxName} className="w_300" onChange={this.wxNameChange} placeholder="请输入微信公众号" />
                    </div>
                </div>

                <div className="form_item">
                    <div className="item_title">公众号主页</div>
                    <div className="item_content">
                        <Input value={wxIndexName} className="w_300" onChange={this.wxIndexNameChange} placeholder="请输入公众号主页" />
                    </div>
                </div>

                <div className="btn_container">
                    <Button onClick={this.submitData} className="m_r_24" type="primary">保存</Button>
                    <Button onClick={this.onClose} >取消</Button>
                </div>

            </div>
        );
    }
}

export default withRouter(CreateAnthor);