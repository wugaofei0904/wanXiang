import React, {Component} from 'react';
import {LocaleProvider, Button, Row, Col, Select, Input, DatePicker, Pagination, Badge, Table} from 'antd';
import HeaderTabbar from '../../../components/headTabBar/index';
import {withRouter} from 'react-router-dom';
import '../style.css'
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import {getDayCost,dayCostExport} from "../../../utils/fetchApi";
import Request from "../../../utils/request";


const {Option} = Select;
const {MonthPicker, RangePicker} = DatePicker;

class DayCost extends Component {

    constructor(props) {
        super(props);
        this.state = {
            pageNumber: 1,
            total: 0,
            pageSize: 20,
            dayList:[],
            authorName:'',
            rank:'',
            startTime:'',
            endTime:''

        };
        this.columns = [{
            title: '作者名',
            dataIndex: 'authorName',
            key: 'authorName'
        }, {
            title: '等级',
            dataIndex: 'authorRank',
            key: 'authorRank',
            render: (text, record) => {
                let _text = '';
                switch (text) {
                    case '1':
                        _text = '一级';
                        break
                    case '2':
                        _text = '二级';
                        break
                    case '3':
                        _text = '三级';
                        break
                    case '4':
                        _text = '四级';
                        break
                    case '5':
                        _text = '五级';
                        break
                }
                return (
                    <div>
                        {_text}
                    </div>
                )
            }
        }, {
            title: '时间段',
            dataIndex: 'balanceTime',
            key: 'balanceTime',
        }, {
            title: '阅读量',
            dataIndex: 'readNum',
            key: 'readNum'
        }, {
            title: '流量分润',
            dataIndex: 'profit',
            key: 'profit'
        }]
    }


    onChange = (pageNumber) => {
        this.setState({
            pageNumber
        }, () => {

            this.searchList(pageNumber);
        })
        // console.log('Page: ', pageNumber);
    }

    /**
     * 单日查询列表
     * @param pageNumber
     */
    requestListData = pageNumber => {
        let { authorName, rank, startTime, endTime, pageSize } = this.state;
        let _this = this;
        // debugger
        Request.Get_Request(`${getDayCost}?pageNum=${pageNumber}&pageSize=${pageSize}&authorName=${authorName}&rank=${rank}&startTime=${startTime}&endTime=${endTime}`, (res) => {
                let data=res.data;
                _this.setState({
                    dayList:data,
                    total:res.total
                })
        })
    }

    nameChange = (e) => {
        this.setState({
            authorName: e.target.value
        })
    }

    rangePickeronChange = (date, dateString) => {
        this.setState({
            startTime: dateString[0],
            endTime: dateString[1],
        })
    }


    searchList = (pageNumber) => {
        this.requestListData(pageNumber)
        this.setState({
            pageNumber:pageNumber
        })

    }

    exportExl = () => {
        let { authorName,pageNumber, rank, startTime, endTime, pageSize } = this.state;
        let _url = `${dayCostExport}?pageSize=${pageSize}&pageNum=${pageNumber}&authorName=${authorName}&rank=${rank}&startTime=${startTime}&endTime=${endTime}`
        window.open(_url)
    }


    componentDidMount() {
        this.requestListData(1)

    }

    rankChange = (value) => {
        this.setState({
            rank: value
        })
    }

    render() {
        let {total, dayList, pageNumber} = this.state;
        return (
            <div className="appPage">

                <HeaderTabbar current='cost'/>
                <div style={{marginTop:20}}>
                    <h3 style={{fontWeight:'bold'}}>日收益</h3>
                </div>
                <div className="fiter-list">
                    <Row className="row" type="flex">
                            <Col className="mr-12">等级</Col>
                            <Col className="mr-12">
                                <Select defaultValue="" style={{width: 120}} onChange={this.rankChange}>
                                    <Option value="">全部</Option>
                                    <Option value="1">一级</Option>
                                    <Option value="2">二级</Option>
                                    <Option value="3">三级</Option>
                                    <Option value="4">四级</Option>
                                </Select>
                            </Col>
                            <Col>作者：</Col>
                            <Col className="mr-12">
                                <Input onChange={this.nameChange} style={{width: 100}} placeholder=""/>
                            </Col>
                            <Col>发布时间： </Col>
                            <Col className="mr-12 relative-title">
                                <LocaleProvider locale={zh_CN}>
                                    <RangePicker onChange={this.rangePickeronChange}/>
                                </LocaleProvider>
                                <span className='absolute-content content-area-font'>单日查询、时间段查询</span>
                            </Col>
                            <Col className="mr-12"><Button onClick={this.searchList.bind(null, 1)}>查找</Button></Col>
                            <Col><Button onClick={this.exportExl} type="primary">导出</Button></Col>
                        </Row>
                </div>

                <div className="articleTable">
                    <div className="articleTable m_t_16">
                        <div className="articleTable_table_list">
                            <Table
                                dataSource={dayList}
                                columns={this.columns}
                                pagination={false}
                            />
                        </div>
                    <Pagination showQuickJumper defaultPageSize={20} current={pageNumber} total={total}
                                onChange={this.onChange}/>
                    </div>
                </div>
            </div>
    );
    }
    }

    export default withRouter(DayCost);