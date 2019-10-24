import React, { Component } from 'react';
import { Modal, Button, Row, Col, Select, Input, DatePicker, Pagination } from 'antd';
import './style.css';
import GetTagList from './../hooks/useGetTagList';

const { Option } = Select;
const { TextArea } = Input;
class CreateAnthor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            // count: 2,
            // anthorName: '',
            // rank: '',
            // tagId: '',
            // startTime: '',
            // endTime: '',
            modalVisible: false,
            localImg: '',
            imgValue:'',
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
        this.setState({
            tagIdList: tagList.data
        })
    }


    componentDidMount() {
        this.isgetTagList();
    }

    imgChange(e) {
        console.log(e.target.value)

        let file_head = e.target;
        let picture = e.target.value;
        if (!picture.match(/.jpg|.gif|.png|.bmp/i)) {
            alert("您上传的图片格式不正确，请重新选择！")
            this.setState({
                imgValue:''
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
                    imgValue:''
                })
            })
        }


    }



    render() {
        let { tagIdList, localImg, imgValue } = this.state;
        return (
            <div className="create_anthor_Page">
                <Modal
                    title="裁剪图片"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <img src={localImg} />
                </Modal>
                <h1 className="page_title">创建作者</h1>
                <div className="form_item">
                    <div className="item_title">领域</div>
                    <div className="item_content">
                        <Select defaultValue="0" style={{ width: 120 }} onChange={this.handleChange}>
                            <Option value="0">综合</Option>
                            {tagIdList.map(item => {
                                return <Option value={item.id}>{item.tagName}</Option>
                            })}
                        </Select>
                    </div>
                </div>
                <div className="form_item">
                    <div className="item_title"><span className="red_color">*</span>作者名</div>
                    <div className="item_content">
                        <Input className="w_300" placeholder="请输入作者名" />
                    </div>
                </div>

                <div className="form_item">
                    <div className="item_title"><span className="red_color">*</span>身份介绍</div>
                    <div className="item_content">
                        <TextArea placeholder="请准确描述作者擅长领域" className="w_300" rows={4} />
                    </div>
                </div>

                <div className="form_item">
                    <div className="item_title"><span className="red_color">*</span>作者头像</div>
                    <div className="item_content">
                        <div className="anthor_touxaing">

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
                        <Select defaultValue="1" style={{ width: 120 }} onChange={this.handleChange}>
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
                        <Input className="w_300" placeholder="请输入微信公众号" />
                    </div>
                </div>

                <div className="btn_container">
                    <Button className="m_r_24" type="primary">保存</Button>
                    <Button >取消</Button>
                </div>

            </div>
        );
    }
}

export default CreateAnthor;