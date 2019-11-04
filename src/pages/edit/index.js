import React, { Component } from 'react';
import { Switch, Modal, Button, Row, Col, Select, Input, DatePicker, Pagination, Radio, Form, Icon, Divider, message } from 'antd';
import './style.css';
import HeaderTabbar from '../../components/headTabBar/index';
import moment from 'moment';
import cs from 'classnames';
// import ActionItem from './ActionItem/index'
import ImgCropperTwo from './../../components/imgCropperTwo'
import Ueditor from './components/ueditor';
import AuthorToast from './../../components/authorToast'
import ToastComponent from './../../components/toastComponent';
import { createAuthor, imgUpload, postArticle } from './../../utils/fetchApi'
// import Editor from 'react-umeditor';
import { withRouter } from 'react-router-dom';
const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const { MonthPicker, RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';
const monthFormat = 'YYYY/MM';
const dateFormatList = ['DD/MM/YYYY', 'DD/MM/YY'];

class EditForm extends Component {


    constructor(props) {
        super(props);
        this.state = {
            author: {},
            authorName: '无',  //作者名
            articleTitle: '',  //文章title
            showAuthorMsg: false,
            authorMsg: '',
            authorRadioValue: 1,
            textNumber: 0,
            textAreavalue: '',  //核心
            tagList: [],
            content: '',
            imgModelVisible: false,
            baseImgList: [
                // './../../img/test1.jpg',
                // './../../img/test2.jpg',
                // './../../img/test3.jpg',
                // 'http://pic1.58cdn.com.cn/p1/big/n_v2066985acab204602b8e156ee453fb3f7_7fa21218dfb7b68c.jpg',
                // 'http://pic1.58cdn.com.cn/p1/big/n_v2066985acab204602b8e156ee453fb3f7_7fa21218dfb7b68c.jpg',
            ],
            lastImgList: [
                '', '', ''
            ],
            editImgIdx: 0,
            baseImgChecked: 0,
            imgTwoVisible: false,
            qingwuzhuanzai: 1,
            localImgValue: ''

        };
    }

    handleChange(content) {
        this.setState({
            content: content
        })
    }
    getIcons() {
        var icons = [
            "source | undo redo | bold italic underline strikethrough fontborder emphasis | ",
            "paragraph fontfamily fontsize | superscript subscript | ",
            "forecolor backcolor | removeformat | insertorderedlist insertunorderedlist | selectall | ",
            "cleardoc  | indent outdent | justifyleft justifycenter justifyright | touppercase tolowercase | ",
            "horizontal date time  | image emotion spechars | inserttable"
        ]
        return icons;
    }
    getQiniuUploader() {
        return {
            url: 'http://upload.qiniu.com',
            type: 'qiniu',
            name: "file",
            request: "image_src",
            qiniu: {
                app: {
                    Bucket: "liuhong1happy",
                    AK: "l9vEBNTqrz7H03S-SC0qxNWmf0K8amqP6MeYHNni",
                    SK: "eizTTxuA0Kq1YSe2SRdOexJ-tjwGpRnzztsSrLKj"
                },
                domain: "http://o9sa2vijj.bkt.clouddn.com",
                genKey: function (options) {
                    return options.file.type + "-" + options.file.size + "-" + options.file.lastModifiedDate.valueOf() + "-" + new Date().valueOf() + "-" + options.file.name;
                }
            }
        }
    }

    authorRadioChange = e => {
        console.log(e.target.value)
        this.setState({
            authorRadioValue: e.target.value
        })
    }

    componentDidMount() {

    }

    titleChange = e => {
        console.log(e.target.value)
        this.setState({
            articleTitle: e.target.value
        })
    }


    onTextAreaChange = ({ target: { value } }) => {
        console.log(value.length)
        this.setState({
            textAreavalue: value,
            textNumber: value.length,
        });
    }

    onChange = (e) => {
        console.log('radio checked', e.target.value);
        this.setState({
            value: e.target.value,
        });
    }




    getImgurl = (item) => {
        let imgReg = /<img.*?(?:>|\/>)/gi //匹配图片中的img标签
        let srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i // 匹配图片中的src
        let str = item.content
        let arr = str.match(imgReg) || [];  //筛选出所有的img
        let srcArr = []
        for (let i = 0; i < arr.length; i++) {
            let src = arr[i].match(srcReg)
            // 获取图片地址
            srcArr.push(src[1])
        }
        // item.dataValues.imgList = srcArr
        console.log(srcArr);
        return srcArr;
        // this.baseImgList
    }



    handleSubmit() {
        // let { content } = this.state;
        // console.log(content)
        let _this = this;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                values.content = this.refs.content1.getVal();
                // console.log(values);
                // console.log(_this.getImgurl(values));
                // _this.getImgurl(values)
                this.setState({
                    content: values.content,
                    baseImgList: _this.getImgurl(values),
                    // baseImgList: ['./../../img/test1.jpg','./../../img/test2.jpg']
                })
            }
        });
    }

    changeAnthor = () => {
        this.refs['authorToast'].showModal();
    }

    updateAuthor = item => {
        this.setState({
            author: item,
            authorName: item.name,
        })
    }

    authorMsgChange = e => {
        this.setState({
            authorMsg: e.target.value
        })
        console.log(e.target.value)
    }

    showBqToast = () => {
        this.refs['tagToast'].showModal();
    }

    getTagid = (tag) => {
        console.log(tag)
        let newtagList = this.state.tagList;
        newtagList.push(tag)
        this.setState({
            tagList: newtagList
        })
        this.refs['tagToast'].initModal();
    }


    showImgChooseModel = idx => {
        this.setState({
            editImgIdx: idx
        })
        this.imgModelOk();
    }

    imgModelOk = () => {
        this.setState({ imgModelVisible: true });
    }

    imgModelCancel = () => {
        this.setState({ imgModelVisible: false });
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

    getCropData = (imgdata) => {

        let { lastImgList, editImgIdx } = this.state;

        let _randomString = this.randomString();

        var formdata = new FormData();
        formdata.append("file", this.dataURLtoFile(imgdata, `img_${_randomString}.png`));
        let _this = this;
        fetch(`${imgUpload}`, {
            method: 'post',
            body: formdata,
        })
            .then(function (response) {
                return response.json()
            }).then(function (json) {

                if (json.success) {
                    lastImgList[editImgIdx] = json.data;
                    _this.setState({
                        lastImgList: [...lastImgList]
                    })
                    //隐藏弹窗
                    _this.imgModelCancel();
                    _this.imgTwoCancel();
                } else if (json.msg == '未登录') {
                    window.initLogin();
                }


            }).catch(function (ex) {
                console.log('parsing failed', ex)
            })
    }


    handleCancel = () => {


    }

    imgTwoOk = () => {
        this.setState({
            imgTwoVisible: true
        })
    }
    imgTwoCancel = () => {
        this.setState({
            imgTwoVisible: false
        })
    }

    nextCjImg = () => {

    }

    chooseFmImg = idx => {
        this.setState({
            baseImgChecked: idx
        })
    }


    checkForm = () => {

        let { authorMsg, author, authorName, content, articleTitle, lastImgList, tagList } = this.state;
        let _msg = '';
        if (authorName == '无') {
            _msg = '请选择作者';
            message.error(_msg);
            return false
        }

        if (articleTitle == '') {
            _msg = '请输入文章标题';
            message.error(_msg);
            return false
        }


        if (JSON.stringify(lastImgList) == '["","",""]') {
            _msg = '请选择封面图';
            message.error(_msg);
            return false
        }

        if (tagList.length == 0) {
            _msg = '请选择文章标签';
            message.error(_msg);
            return false
        }

        if (content == '') {
            _msg = '请输入文章内容';
            message.error(_msg);
            return false
        }

        return true

    }

    submitAllData = () => {
        if (!this.checkForm()) return;

        let { authorMsg, authorRadioValue, author, authorName, content, articleTitle, lastImgList, tagList, textAreavalue, qingwuzhuanzai } = this.state;

        let _arr = [];
        tagList.map(item => {
            // _arr.push(item.id);
            _arr.push(item.name);

        })

        // debugger
        var formdata = new FormData();
        formdata.append("title", articleTitle);
        formdata.append("picUrl", lastImgList[0]);

        formdata.append("tags", _arr.join(','));
        formdata.append("body", content);
        formdata.append("authorId", author.id);

        formdata.append("isOwn", authorRadioValue);
        formdata.append("otherAuthorName", authorMsg);
        formdata.append("otherImg", '');

        formdata.append("corePoint", textAreavalue);
        formdata.append("isReprint", qingwuzhuanzai);


        let _this = this;
        fetch(`${postArticle}`, {
            method: 'post',
            body: formdata,
        })
            .then(function (response) {
                return response.json()
            }).then(function (json) {
                if (json.success) {
                    message.success('发布成功！')
                    setTimeout(() => {
                        _this.props.history.push('articleManage')
                    }, 1500)
                } else if (json.msg == '未登录') {
                    window.initLogin();
                }
            }).catch(function (ex) {
                console.log('parsing failed', ex)
            })
        // console.log(2)
    }

    deleteTag = (idx) => {
        let { tagList } = this.state;
        tagList.splice(idx, 1);
        this.setState({
            tagList
        })

    }

    switchChange = value => {
        this.setState({
            qingwuzhuanzai: value ? 1 : 0
        })
    }

    componentDidMount() {

        Array.prototype.indexOf = function (val) {
            for (var i = 0; i < this.length; i++) {
                if (this[i] == val) return i;
            }
            return -1;
        };
        Array.prototype.remove = function (val) {
            var index = this.indexOf(val);
            if (index > -1) {
                this.splice(index, 1);
            }
        };

    }

    imgChange(e) {
        console.log(e.target.value)
        let _this = this;

        let { baseImgList } = this.state;

        let file_head = e.target;
        let picture = e.target.value;
        if (!picture.match(/.jpg|.gif|.png|.bmp/i)) {
            alert("您上传的图片格式不正确，请重新选择！")
            _this.setState({
                localImgValue: ''
            })
            return false
        }
        if (file_head.files && file_head.files[0]) {
            var a = window.navigator.userAgent.indexOf("Chrome") >= 1 || window.navigator.userAgent.indexOf("Safari") >= 1 ? window.webkitURL.createObjectURL(file_head.files[0]) : window.URL.createObjectURL(file_head.files[0]);
            // console.log(a)
            // debugger
            baseImgList.push(a);
            _this.setState({
                localImgValue: a,
                baseImgList: baseImgList
            }, () => {
                _this.imgTwoOk();
            })
        }
    }

    render() {

        let editConfig = {

        };

        let { localImgValue, lastImgList, baseImgChecked, baseImgList, imgModelVisible, textAreavalue, authorName, showAuthorMsg, authorRadioValue, textNumber, tagList } = this.state;
        return (
            <div className="appPage">

                <Modal
                    className="img_modal"
                    visible={imgModelVisible}
                    title="选择封面图"
                    onOk={this.imgModelOk}
                    onCancel={this.imgModelCancel}
                    footer={null}
                >
                    <div className="img_list_container">
                        <div className="img_scroll_box">
                            {
                                baseImgList.map((item, index) => {
                                    return <div onClick={this.chooseFmImg.bind(null, index)} className={cs("toast_img_box", { "checked": baseImgChecked == index })}>
                                        <img src={item} />
                                    </div>
                                })
                            }
                        </div>
                    </div>
                    <div className="bottom_btn_list">

                        <div className="sc_btn">
                            <Input onChange={this.imgChange.bind(this)} className="hidden_input" type="file" placeholder="Basic usage" />
                            <Button type="primary">另选图片</Button>
                        </div>

                        {/* <Button onClick={this.getLocalImg} size="default" type="primary">另选图片</Button> */}
                        <Button onClick={this.imgTwoOk} size="default" type="primary">下一步</Button>
                    </div>
                    <Modal
                        title="裁剪图片"
                        visible={this.state.imgTwoVisible}
                        onOk={this.imgTwoOk}
                        onCancel={this.imgTwoCancel}
                        footer={null}
                    >
                        <ImgCropperTwo getCropData={this.getCropData} src={baseImgList[baseImgChecked]} />
                    </Modal>
                </Modal>

                <AuthorToast changeAuthor={this.updateAuthor} ref='authorToast' />
                <ToastComponent getTagid={this.getTagid} ref='tagToast' />
                <h1 className="m_t_16">编辑器</h1>
                <div className="edit_header">
                    <Row className="row" type="flex">
                        <Col className="mr-12 flex_hc color_red">
                            发布作者：{authorName}
                        </Col>
                        <Col className="mr-12">
                            <Button onClick={this.changeAnthor} size="default" type="primary">更换</Button>
                        </Col>
                    </Row>
                    <Input onChange={this.titleChange} className="edit_title" placeholder="请输入文章标题（谁改为无锡事故买奥术大师多但？)" />
                    <Row className="row color_hui flex_hc" type="flex">
                        <Col className="mr-12 flex_hc">
                            请选择：
                        </Col>
                        <Col className="mr-12">
                            <Radio.Group onChange={this.authorRadioChange} value={authorRadioValue}>
                                <Radio value={1}>我是原创作者</Radio>
                                <Radio value={2}>输入作者信息</Radio>
                            </Radio.Group>
                        </Col>
                        {
                            authorRadioValue == 2 && <Col className="mr-12 w_300 flex_hc">
                                <Input onChange={this.authorMsgChange} width="200" placeholder="1-10字 示例：厉以宁经济学教授" />
                            </Col>
                        }
                    </Row>
                </div>
                <Ueditor config={editConfig} id="content1" height="1000" ref="content1" />
                <Button type={'primary'} onClick={this.handleSubmit.bind(this)}>保存</Button>
                <div className="fmt_container">
                    <div className="fmt_container_title edit_title">封面图(必填项)</div>
                    <Row className="row color_hui flex_hc" type="flex">
                        {
                            lastImgList.map((item, idx) =>
                                <Col onClick={this.showImgChooseModel.bind(null, idx)} className="mr-12">
                                    {
                                        item === '' ? <div className="img_add_box">+</div> :
                                            <img className="last_img_item" src={item} />
                                    }
                                </Col>
                            )
                        }
                    </Row>
                    <div className="fmt_container_tips">图片最低尺寸要求 450像素*270像素</div>
                </div>

                <div className="hxgd_container">
                    <div className="fmt_container_title edit_title">核心观点 <span className="font_color_grid">(推荐填写，有助于提升阅读量和点赞，不少于50字)</span></div>
                    <div className="hx_box">
                        <TextArea
                            className="hxText"
                            value={textAreavalue}
                            rows={4}
                            onChange={this.onTextAreaChange}
                            placeholder="Controlled autosize"
                            autoSize={{ minRows: 3, maxRows: 5 }}
                        />
                        <div className={cs("hx_box_num", { "color_red": textNumber > 140 })}>{textNumber}/140</div>
                    </div>
                </div>

                <div className="addBq_container">
                    <div className="fmt_container_title edit_title">添加标签 <span className="font_color_grid">文章审核通过后不可再修改关联话题。</span></div>
                    <div className="bq_list">
                        {
                            tagList.map((item, idx) => {
                                return <div className="bq_list_item"><span onClick={this.deleteTag.bind(null, idx)} className="cancle_btn"></span> {item.name}</div>
                            })
                        }

                        <Button onClick={this.showBqToast} > + 添加标签</Button>
                    </div>
                </div>

                <div className="qingwuzhuanzai">
                    <Switch onChange={this.switchChange} /> 请勿转载
                </div>

                <div className="submit_btn">
                    <Button onClick={this.submitAllData} size="large" type="primary">发布</Button>
                </div>


            </div>
        );
    }
}

const EditPage = Form.create()(EditForm);

export default withRouter(EditPage);
