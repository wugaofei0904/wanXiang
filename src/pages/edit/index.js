import React, { Component } from 'react';
import { Button, Row, Col, Select, Input, DatePicker, Pagination, Radio, Form, Icon, Divider } from 'antd';
import './style.css';
import HeaderTabbar from '../../components/headTabBar/index';
import moment from 'moment';
import cs from 'classnames';
// import ActionItem from './ActionItem/index'

import Ueditor from './components/ueditor';
import AnthorToast from './../../components/anthorToast'


const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const { MonthPicker, RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';
const monthFormat = 'YYYY/MM';
const dateFormatList = ['DD/MM/YYYY', 'DD/MM/YY'];

class EditForm extends Component {


    componentDidMount() {

    }


    onChange = (e) => {
        console.log('radio checked', e.target.value);
        this.setState({
            value: e.target.value,
        });
    }

    state = {
        value: 1,
        textAreavalue: '',
        showAnthorMsg: false
    };

    onTextAreaChange = ({ target: { value } }) => {
        this.setState({ textAreavalue: value });
    }

    handleSubmit() {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                values.content1 = this.refs.content1.getVal();
                values.content2 = this.refs.content2.getVal();
                console.log(values);
            }
        });
    }

    changeAnthor = ()=>{
        this.refs['anthorToast'].showModal();
    }

    render() {

        let { textAreavalue } = this.state;
        return (
            <div className="appPage">
                <AnthorToast ref='anthorToast' />
                <h1>编辑器</h1>
                <div className="edit_header">
                    <Row className="row" type="flex">
                        <Col className="mr-12 flex_hc color_red">
                            {/* <div className="flex_hc">发布作者：肥罗大电影</div> */}
                            发布作者：肥罗大电影
                        </Col>
                        <Col className="mr-12">
                            <Button onClick={this.changeAnthor} size="default" type="primary">更换</Button>
                        </Col>
                    </Row>
                    <div className="edit_title">谁改为无锡事故买奥术大师多但？</div>
                    <Row className="row color_hui flex_hc" type="flex">
                        <Col className="mr-12 flex_hc">
                            请选择：
                        </Col>
                        <Col className="mr-12">
                            <Radio.Group onChange={this.onChange} value={this.state.value}>
                                <Radio value={1}>我是原创作者</Radio>
                                <Radio value={2}>输入作者信息</Radio>
                            </Radio.Group>
                        </Col>
                        <Col className="mr-12 w_300 flex_hc">
                            <Input width="200" placeholder="1-10字 示例：厉以宁经济学教授" />
                        </Col>
                    </Row>
                </div>
                <Ueditor id="content1" height="1000" ref="content1" />
                <Button type={'primary'} onClick={this.handleSubmit.bind(this)}>保存</Button>
                <div className="fmt_container">
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
                </div>

                <div className="hxgd_container">
                    <div className="fmt_container_title edit_title">核心观点 <span className="font_color_grid">(推荐填写，有助于提升阅读量和点赞，不少于50字)</span></div>
                    <TextArea
                        value={textAreavalue}
                        onChange={this.onTextAreaChange}
                        placeholder="Controlled autosize"
                        autoSize={{ minRows: 3, maxRows: 5 }}
                    />
                </div>

                <div className="addBq_container">
                    <div className="fmt_container_title edit_title">添加标签 <span className="font_color_grid">文章审核通过后不可再修改关联话题。</span></div>
                    <div className="bq_list">

                        <Button> + 添加标签</Button>
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
