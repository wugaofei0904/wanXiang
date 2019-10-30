import React, { Component } from 'react';
import { Button, Row, Col, Select, Input, DatePicker, Pagination, Radio, Form, Icon, Divider } from 'antd';
import './style.css';
import HeaderTabbar from '../../components/headTabBar/index';
import moment from 'moment';
import cs from 'classnames';
// import ActionItem from './ActionItem/index'

import Ueditor from './components/ueditor';
import AuthorToast from './../../components/authorToast'
import ToastComponent from './../../components/toastComponent';

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
        };

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
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                values.content1 = this.refs.content1.getVal();
                console.log(values);
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

    render() {

        let { textAreavalue, authorName, showAuthorMsg, authorRadioValue, textNumber, tagList } = this.state;
        return (
            <div className="appPage">
                <AuthorToast changeAuthor={this.updateAuthor} ref='authorToast' />
                <ToastComponent getTagid={this.getTagid} ref='tagToast' />
                {/* <h1 className="m_t_16">编辑器</h1> */}
                {/* <div className="edit_header">
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
                </div> */}
                <Ueditor id="content1" height="1000" ref="content1" />
                <Button type={'primary'} onClick={this.handleSubmit.bind(this)}>保存</Button>
                {/* <div className="fmt_container">
                    <div className="fmt_container_title edit_title">封面图(必填项)</div>
                    <Row className="row color_hui flex_hc" type="flex">
                        <Col className="mr-12">
                            <img src="http://pic3.58cdn.com.cn/p1/big/n_v2fbe4cbab39c747d58320b506c0f37719_3f83a4486744d165.jpg" />
                        </Col>
                        <Col className="mr-12">
                            <img src="http://pic3.58cdn.com.cn/p1/big/n_v2fbe4cbab39c747d58320b506c0f37719_3f83a4486744d165.jpg" />
                        </Col>
                        <Col className="mr-12">
                            <img src="http://pic3.58cdn.com.cn/p1/big/n_v2fbe4cbab39c747d58320b506c0f37719_3f83a4486744d165.jpg" />
                        </Col>
                    </Row>
                    <div className="fmt_container_tips">图片最低尺寸要求 450像素*270像素</div>
                </div> */}

                {/* <div className="hxgd_container">
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
                </div> */}

                {/* <div className="addBq_container">
                    <div className="fmt_container_title edit_title">添加标签 <span className="font_color_grid">文章审核通过后不可再修改关联话题。</span></div>
                    <div className="bq_list">
                        {
                            tagList.map(item => {
                                return <div className="bq_list_item">{item.name}</div>
                            })
                        }

                        <Button onClick={this.showBqToast} > + 添加标签</Button>
                    </div>
                </div> */}

                <div className="submit_btn">
                    <Button size="large" type="primary">发布</Button>
                </div>


            </div>
        );
    }
}

const EditPage = Form.create()(EditForm);

export default EditPage;
