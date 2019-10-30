import React, { Component } from 'react';
import { Modal, Button, Row, Col, Select, Input, DatePicker, Pagination, Radio, Form, Icon, Divider } from 'antd';
import './style.css';
import HeaderTabbar from '../../components/headTabBar/index';
import moment from 'moment';
import cs from 'classnames';
// import ActionItem from './ActionItem/index'
import ImgCropper from './../../components/imgCropper'
import Ueditor from './components/ueditor';
import AuthorToast from './../../components/authorToast'
import ToastComponent from './../../components/toastComponent';

import Editor from 'react-umeditor';

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
                'http://pic1.58cdn.com.cn/p1/big/n_v2066985acab204602b8e156ee453fb3f7_7fa21218dfb7b68c.jpg',
                'http://pic1.58cdn.com.cn/p1/big/n_v2066985acab204602b8e156ee453fb3f7_7fa21218dfb7b68c.jpg',
                'http://pic1.58cdn.com.cn/p1/big/n_v2066985acab204602b8e156ee453fb3f7_7fa21218dfb7b68c.jpg',
            ],
            baseImgChecked: 0,

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



    handleSubmit() {


        let { content } = this.state;
        console.log(content)


        // this.props.form.validateFields((err, values) => {
        //     if (!err) {
        //         console.log('Received values of form: ', values);
        //         values.content1 = this.refs.content1.getVal();
        //         console.log(values);
        //     }
        // });
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


    showImgChooseModel = () => {

        this.imgModelOk();
    }

    imgModelOk = () => {
        this.setState({ imgModelVisible: true });
    }

    imgModelCancel = () => {
        this.setState({ imgModelVisible: false });
    }

    getCropData = (imgdata) => {
        debugger
        // console.log('截取图片...');
        let _randomString = this.randomString();

        var formdata = new FormData();
        formdata.append("file", this.dataURLtoFile(imgdata, `img_${_randomString}.png`));
        let _this = this;
        // fetch(`${imgUpload}`, {
        //     method: 'post',
        //     body: formdata,
        // })
        //     .then(function (response) {
        //         return response.json()
        //     }).then(function (json) {
        //         _this.setState({
        //             resultImg: json.data
        //         })

        //         //隐藏弹窗
        //         _this.handleCancel();

        //     }).catch(function (ex) {
        //         console.log('parsing failed', ex)
        //     })
    }

    render() {

        let editConfig = {

        };


        let { baseImgChecked, baseImgList, imgModelVisible, textAreavalue, authorName, showAuthorMsg, authorRadioValue, textNumber, tagList } = this.state;
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
                                    return <div className={cs("toast_img_box", { "checked": baseImgChecked == index })}>
                                        <img src={item} />
                                    </div>
                                })
                            }
                        </div>
                    </div>
                    <div className="bottom_btn_list">
                        <Button size="default" type="primary">另选图片</Button>
                        <Button size="default" type="primary">下一步</Button>
                    </div>
                    <ImgCropper getCropData={this.getCropData} src={baseImgList[0]} />
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
                        <Col onClick={this.showImgChooseModel} className="mr-12">
                            <div className="img_add_box">+</div>

                        </Col>
                        <Col onClick={this.showImgChooseModel} className="mr-12">
                            <div className="img_add_box">+</div>
                        </Col>
                        <Col onClick={this.showImgChooseModel} className="mr-12">
                            <div className="img_add_box">+</div>
                        </Col>
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
                            tagList.map(item => {
                                return <div className="bq_list_item">{item.name}</div>
                            })
                        }

                        <Button onClick={this.showBqToast} > + 添加标签</Button>
                    </div>
                </div>
                <div className="submit_btn">
                    <Button size="large" type="primary">发布</Button>
                </div>


            </div>
        );
    }
}

const EditPage = Form.create()(EditForm);

export default EditPage;
