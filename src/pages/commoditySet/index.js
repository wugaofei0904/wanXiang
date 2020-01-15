import React, { Component } from 'react';
import { LocaleProvider, Button, Row, Col, Select, Input, DatePicker, Pagination, Tabs, Modal } from 'antd';

import './style.css';
import HeaderTabbar from '../../components/headTabBar/index';
import moment from 'moment';
import CommodityItem from './components/commodityItem/index'
import { withRouter } from 'react-router-dom';

import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import { adpageList } from './../../utils/fetchApi'
import CommpToast from './components/editToast'

const { TabPane } = Tabs;
const { Option } = Select;
const { MonthPicker, RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';
const monthFormat = 'YYYY/MM';
const dateFormatList = ['DD/MM/YYYY', 'DD/MM/YY'];

class CommoditySet extends Component {

    constructor(props) {
        super(props);
        this.state = {
            pageNumber: 1,
            // anthorName: '',  //作者名
            shangpinBq: "",
            adTitle: '',
            shangpinStatus: '',
            articleName: '',  //文章名
            detailBq: "",

            modalVisible: false,

            articleStatus: '',

            startTime: '',
            endTime: '',
            total: 0,
            pageSize: 20,
            sxStatus: '-1',
            listData: []
        };
        this.showEditSet = this.showEditSet.bind(this);
    }


    callback(key) {
        console.log(key);
    }

    onChange = (pageNumber) => {
        this.setState({
            pageNumber
        }, () => {

            this.searchList(pageNumber);
        })
        // console.log('Page: ', pageNumber);
    }

    handleChange = (value) => {
        console.log(`selected ${value}`);
    }

    fabuwenzhang = () => {
        this.props.history.push('editPage')
    }

    statusChange = (value) => {
        this.setState({
            shangpinStatus: value == 2 ? '' : value
        })
    }

    sxStatusChange = (value) => {
        this.setState({
            sxStatus: value
        })
    }

    rangePickeronChange = (date, dateString) => {
        console.log(date, dateString);
        this.setState({
            startTime: dateString[0],
            endTime: dateString[1],
        })
    }

    articleNameChange = (e) => {
        this.setState({
            articleName: e.target.value
        })
        console.log(e.target.value)
    }

    shangpinBqChange = e => {
        this.setState({
            shangpinBq: e.target.value
        })
        console.log(e.target.value)
    }
    adTitleChange = e => {
        this.setState({
            adTitle: e.target.value
        })
        console.log(e.target.value)
    }

    detailBqChange = e => {
        this.setState({
            detailBq: e.target.value
        })
        console.log(e.target.value)
    }



    anthorChange = (e) => {
        this.setState({
            anthorName: e.target.value
        })
    }

    searchList = (pageNumber) => {
        if(!pageNumber){
            pageNumber = this.state.pageNumber
        }

        let { shangpinStatus, articleName, shangpinBq, adTitle, detailBq, startTime, endTime, pageSize } = this.state;
        let _this = this;
        let _url = `${adpageList}?pageSize=${pageSize}&pageNum=${pageNumber}&status=${shangpinStatus}&articleName=${articleName}&startTime=${startTime}&endTime=${endTime}&goodsTag=${shangpinBq}&goodsTitle=${adTitle}&tag=${detailBq}`
        // let _url = `${adpageList}?pageSize=${pageSize}&pageNum=${pageNumber}`
        // if (sxStatus != '-1') {
        //     _url += `&isTop=${sxStatus}`
        // }
        fetch(_url)
            // fetch(`${articleList}?pageSize=${pageSize}&pageNum=${pageNumber}&status=${articleStatus}&title=${articleName}&authorName=${anthorName}&startTime=${startTime}&endTime=${endTime}`)
            .then(function (response) {
                return response.json()
            }).then(function (json) {
                if (json.success) {
                    //更新当前列表
                    _this.setState({
                        total: json.total,
                        listData: json.data
                    })
                    window.scrollTo(0, 0);
                } else if (json.msg == '未登录') {
                    window.initLogin();
                }

            }).catch(function (ex) {
                console.log('parsing failed', ex)
            })

    }


    componentDidMount() {


        // let _hasList = this.try_restore_component();

        // if (!_hasList) {
        //     // debugger
        //     this.searchList(1);
        // }

        this.searchList(1);

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

    // try_restore_component(cb) {
    //     let data = window.sessionStorage.getItem("tmpdata");
    //     if (data) {
    //         data = JSON.parse(data);
    //         this.setState(
    //             {
    //                 listData: data.listData,
    //                 pageNumber: parseInt(data.pageNumber),
    //                 scrollpx: data.scrollpx,
    //                 total: data.total,
    //             }
    //         )
    //         window.sessionStorage.setItem('tmpdata', '');

    //         setTimeout(() => {
    //             // debugger
    //             window.scrollTo(0, data.scrollpx);
    //         }, 10)
    //         return 1
    //     }
    //     return 0
    // }

    // componentWillUnmount() {
    //     console.log('待保存的数据：', this.state.listData);
    //     console.log('保存滚动条位置：', window.scrollY);
    //     let data = {
    //         listData: this.state.listData,
    //         scrollpx: window.scrollY,
    //         pageNumber: this.state.pageNumber,
    //         total: this.state.total
    //     }
    //     window.sessionStorage.setItem('tmpdata', JSON.stringify(data));
    // }

    showEditSet() {
        this.commpToast.showModal();
    }

    render() {
        let _this = this;
        let { total, listData, pageNumber } = this.state;
        return (
            <div className="appPage">
                <HeaderTabbar current='commodity' />

                <Tabs defaultActiveKey="1" onChange={this.callback}>
                    <TabPane tab="见地X京东" key="1">
                        <CommpToast searchList={this.searchList} ref={(commpToast) => { this.commpToast = commpToast }} />
                        <div className="fiter-list">
                            <div className="fabu_btn_2">
                                <Button onClick={this.showEditSet} type="primary">发布商品</Button>
                            </div>

                            <Row className="row" type="flex">

                                <Col >商品标签：</Col>
                                <Col className="mr-12">
                                    <Input onChange={this.shangpinBqChange} style={{ width: 80 }} placeholder="" />
                                </Col>
                                <Col >商品标题：</Col>
                                <Col className="mr-12">
                                    <Input onChange={this.adTitleChange} placeholder="" style={{ width: 80 }} />
                                </Col>
                                <Col >状态：</Col>
                                <Col className="mr-12">
                                    <Select defaultValue="2" style={{ width: 100 }} onChange={this.statusChange}>
                                        <Option value="2">全部状态</Option>
                                        <Option value="0">已下线</Option>
                                        <Option value="1">生效</Option>
                                    </Select>
                                </Col>

                                <Col >文章名：</Col>
                                <Col className="mr-12">
                                    <Input onChange={this.articleNameChange} style={{ width: 80 }} placeholder="" />
                                </Col>
                                <Col >内容标签：</Col>
                                <Col className="mr-12">
                                    <Input onChange={this.detailBqChange} placeholder="" style={{ width: 80 }} />
                                </Col>
                                <Col >下线时间： </Col>
                                <Col className=" width_120">
                                    <LocaleProvider locale={zh_CN}>
                                        <RangePicker onChange={this.rangePickeronChange} />
                                    </LocaleProvider>
                                </Col>

                                <Col className=""><Button type="primary" onClick={this.searchList.bind(null, 1)}>查找</Button></Col>
                                {/* <Col ><Button onClick={this.showEditSet} type="primary">发布商品</Button></Col> */}
                            </Row>
                        </div>
                        <div className="articleTable">
                            <div className="articleTable_header">
                                <div className="articleTable_header_text w_150_n">商品标签</div>
                                <div className="articleTable_header_text text_center width_120_n">商品头图</div>
                                <div className="articleTable_header_text w_150_n text_right">商品标题</div>
                                <div className="articleTable_header_text flex_1 text_center">推荐理由</div>


                                <div className="articleTable_header_text width_80">卖点</div>
                                <div className="articleTable_header_text width_80 text_center">合作价/原价</div>

                                <div className="articleTable_header_text width_80">下线时间</div>
                                
                                <div className="articleTable_header_text width_80 text_center">点击量</div>
                                <div className="articleTable_header_text width_80 text_center">操作</div>
                            </div>
                            <div className="articleTable_table_list">
                                {
                                    listData.map(item => {
                                        return <CommodityItem searchList={_this.searchList} key={item.id} data={item} />
                                    })
                                }
                            </div>
                            <Pagination showQuickJumper defaultPageSize={20} current={pageNumber} total={total} onChange={this.onChange} />
                        </div>
                    </TabPane>
                    <TabPane tab="Tab 2" key="2">2</TabPane>
                </Tabs>

            </div>
        );
    }
}

export default withRouter(CommoditySet);