import React, {Component} from 'react';
import {Button, Row, Col, Select, Input, message, DatePicker, Pagination, Tabs, Modal, Table} from 'antd';

import './style.css';
import HeaderTabbar from '../../components/headTabBar/index';
import {withRouter} from 'react-router-dom';
import 'moment/locale/zh-cn';
import Request from "../../utils/request";
import {costBenifit, costList, costPay} from './../../utils/fetchApi';
import {dateFtt} from './../../utils/utils'
import echarts from './../../lib/echarts'

const {TabPane} = Tabs;

class CostCenter extends Component {

    constructor(props) {
        super(props);
        this.state = {
            fivePageNum: 1,
            ninePageNum: 1,
            zeroPageNum: 1,
            benefitData: {},
            zeroTotal: 0,
            fiveTotal: 0,
            nineTotal: 0,
            zeroCostList: [], //待处理工单
            fiveCostList: [],  //已处理
            nineCostList: [],  //未提交
            dataX: [],
            dataY: [],
            monthData:{}
        };
        // 工单编号、付款对象、备注、预估收益、分润收益、创作补贴、税费、最终收益、工单产生时间、操作
        // ati: "4000.00"
        // authorId: "64"
        // authorName: "艺非凡"
        // balanceTime: "202003"
        // createTime: "2020-04-02T07:58:19.000+0000"
        // deduct: "1000.00"
        // gross: "4200.00"
        // id: 1
        // income: "5000.00"
        // month: "3"
        // orderId: "111"
        // profit: "100"
        // rate: "0.20"
        // readNum: "1111"
        // remark: "设置补贴:900||设置补贴:4400||设置补贴:4000||设置补贴:900||设置补贴:900||设置补贴:4900"
        // status: 0
        // subsidy: "4900"
        // tax: "800.00"
        // year: "2020"
        this.columns = [{
            title: '工单编号',
            dataIndex: 'orderId',
            key: 'orderId'
        }, {
            title: '付款对象',
            dataIndex: 'authorName',
            key: 'authorName'
        }, {
            title: '备注',
            dataIndex: 'remark',
            key: 'remark',
            width: 250
        }, {
            title: '预估收益',
            dataIndex: 'income',
            key: 'income'
        }, {
            title: '分润收益',
            dataIndex: 'profit',
            key: 'profit'
        }, {
            title: '创作补贴',
            dataIndex: 'subsidy',
            key: 'subsidy'
        }, {
            title: '税费',
            dataIndex: 'tax',
            key: 'tax'
        }, {
            title: '最终收益',
            dataIndex: 'gross',
            key: 'gross'
        }, {
            title: '工单产生时间',
            dataIndex: 'createTime',
            key: 'createTime',
            render: (text, record) => {
                let date = new Date(text)
                let returnDate = dateFtt("yyyy-MM-dd hh:mm:ss", date)
                return (<span>
                    {returnDate}
                    </span>
                )
            }
        }, {
            title: '操作',
            key: 'id',
            render: (text, record) => {
                if (record.status == 5) {
                    return (<Button
                            onClick={() => this.pay(record.orderId)}
                            style={{background: '#1988CB'}}
                            type={'primary'}>支付</Button>
                    )
                } else if (record.status == 9) {
                    return (<span>已处理</span>)
                } else if (record.status == 0) {
                    return (<span>待提交</span>)

                }
            }
        }]
    }

    componentDidMount() {
        this.getCostBenefit()
        this.getCostList(1, 5)
        this.getCostList(1, 9)
        this.getCostList(1, 0)
        this.getLastMonth()
    }

    draw = () => {
        let myEcharts = echarts.init(document.getElementById('main'))
        let {dataX, dataY} = this.state;
        myEcharts.setOption({
            tooltip: {
                trigger: 'axis'
            },
            xAxis: [{
                type: 'category',
                data: dataX,
                axisLine: {
                    lineStyle: {
                        color: "#999"
                    }
                }
            }],
            yAxis: [{
                type: 'value',
                splitNumber: 4,
                splitLine: {
                    lineStyle: {
                        type: 'dashed',
                        color: '#DDD'
                    }
                },
                axisLine: {
                    show: false,
                    lineStyle: {
                        color: "#333"
                    },
                },
                nameTextStyle: {
                    color: "#999"
                },
                splitArea: {
                    show: false
                }
            }],
            series: [{
                name: '成本',
                type: 'line',
                data: dataY,
                lineStyle: {
                    normal: {
                        width: 8,
                        color: {
                            type: 'linear',

                            colorStops: [{
                                offset: 0,
                                color: '#A9F387' // 0% 处的颜色
                            }, {
                                offset: 1,
                                color: '#48D8BF' // 100% 处的颜色
                            }],
                            globalCoord: false // 缺省为 false
                        },
                        shadowColor: 'rgba(72,216,191, 0.3)',
                        shadowBlur: 10,
                        shadowOffsetY: 20
                    }
                },
                itemStyle: {
                    normal: {
                        color: '#fff',
                        borderWidth: 10,
                        /*shadowColor: 'rgba(72,216,191, 0.3)',
                        shadowBlur: 100,*/
                        borderColor: "#A9F387"
                    }
                },
                smooth: true
            }]
        })
    }
    pay = (id) => {
        let _this = this;
        let {fivePageNum} = this.state
        Request.Get_Request(`${costPay}?orderId=${id}`, () => {
            message.success('支付成功')
            _this.getCostList(fivePageNum, 5)
        }, err => {
            console.log('err', err)
            message.error(err.msg)
        })
    }
    /**
     * 获取内容数据
     * @param
     */
    getCostBenefit = () => {
        let _this = this;
        Request.Get_Request(`${costBenifit}`, (res) => {
            console.log('data', res)
            let data = res.data;
            let dataShow = data.month_benefit;
            let listX = Object.keys(dataShow)
            let listY = Object.values(dataShow)
            let returnX = []
            let returnY = []
            for (let i = 0; i < listX.length; i++) {
                returnX.push(listX[i])
                returnY.push(Number(listY[i]))
            }
            let dataListX = returnX.reverse();
            let dataListY = returnY.reverse();
            _this.setState({
                benefitData: data,
                dataX: dataListX,
                dataY: dataListY
            }, () => {
                _this.draw()
            })
        })
    }

    /**
     * 获取工单数据
     * @param pageNumber
     */
    getCostList = (pageNumber, status) => {
        let _this = this;
        // debugger
        Request.Get_Request(`${costList}?pageNum=${pageNumber}&pageSize=20&status=${status}`, (res) => {
            let data = res.data;
            let updateList = ''
            let updateTotal = ''
            if (status == 0) {
                updateList = 'zeroCostList'
                updateTotal = 'zeroTotal'
            } else if (status == 5) {
                updateList = 'fineCostList'
                updateTotal = 'fineTotal'
            } else if (status == 9) {
                updateList = 'nineCostList'
                updateTotal = 'nineTotal'
            }
            _this.setState({
                [updateList]: data,
                [updateTotal]: res.total
            })
        })
    }

    getLastMonth() {
        let now = new Date();
        let year = now.getFullYear();//getYear()+1900=getFullYear()
        let month = now.getMonth() + 1;//0-11表示1-12月
        let day = now.getDate();
        let dateObj = {};
        if (parseInt(month) < 10) {
            month = "0" + month;
        }
        if (parseInt(day) < 10) {
            day = "0" + day;
        }

        dateObj.now =  month + day;

        if (parseInt(month) == 1) {//如果是1月份，则取上一年的12月份
            dateObj.last = '12' + day;
        }

        let preSize = new Date(year, parseInt(month) - 1, 0).getDate();//上月总天数
        if (preSize < parseInt(day)) {//上月总天数<本月日期，比如3月的30日，在2月中没有30
            dateObj.last = month + '01';
        }

        if (parseInt(month) <= 10) {
            dateObj.last = '0' + (parseInt(month) - 1)+ day;
        } else {
            dateObj.last = (parseInt(month) - 1) + day;
        }
        this.setState({
            monthData:dateObj
        })

    }

    callback(key) {
        console.log(key);
    }

    onChange = (status, pageNumStatus, pageNumber) => {
        this.setState({
            [pageNumStatus]: pageNumber
        })
        this.getCostList(pageNumber, status)
    }

    goToPage=(type)=>{
        if(type==1){
            this.props.history.push('dayCost')
        }else if(type==2){
            this.props.history.push('monthCost')
        }
    }

    render() {
        let {benefitData,monthData, zeroCostList, fiveCostList, nineCostList, zeroTotal, fiveTotal, nineTotal, fivePageNum, ninePageNum, zeroPageNum} = this.state
        return (
            <div className="appPage">
                <HeaderTabbar current='cost'/>

                <Tabs defaultActiveKey="1" onChange={this.callback}>
                    <TabPane tab="内容成本" key="1">
                        <div className='content-area'>
                            <div className='content-area-title'>
                                <span className='content-area-font'>内容成本</span>
                                <div>
                                    <span className='content-area-font cursor' onClick={this.goToPage.bind(this,1)}>日报</span>
                                    <span className='content-area-font cursor' style={{marginLeft:10}} onClick={this.goToPage.bind(this,2)}>月报</span>
                                </div>
                            </div>
                            <div className='content-area-content'>
                                <div className='content-area-content-item'>
                                    <span className='content-area-content-itemFot'>{benefitData.pre_day_benefit} <i
                                        style={{fontSize: 8}}>{benefitData.day_growth}</i> </span>
                                    <span className='content-area-content-itemBot'>昨日预估成本</span>
                                </div>
                                <div className='content-area-content-item'>
                                    <span className='content-area-content-itemFot'>{benefitData.week_benefit}</span>
                                    <span className='content-area-content-itemBot'>前七日预估成本</span>
                                </div>
                                <div className='content-area-content-item'>
                                    <span className='content-area-content-itemFot'>{benefitData.cur_month_benfit}</span>
                                    <span className='content-area-content-itemBot'>本月预估成本</span>
                                </div>
                                <div className='content-area-content-item'>
                                    <span className='content-area-content-itemFot'>{benefitData.pre_month_benfit}</span>
                                    <span className='content-area-content-itemBot'>上月预估成本</span>
                                </div>
                            </div>
                            <div>
                                <div className='content-area-title'>
                                    <span className='content-area-font'>近30日预估成本</span>
                                    {monthData &&<span className='content-area-font'>{monthData.last+'-'+monthData.now}</span>}
                                </div>
                                <div id='main'></div>
                            </div>
                            <Tabs defaultActiveKey="1" onChange={this.changeTab}>

                                <TabPane tab="待处理工单" key="1">
                                    <div className="articleTable m_t_16">
                                        <div className="articleTable_table_list">
                                            <Table
                                                dataSource={fiveCostList}
                                                columns={this.columns}
                                                pagination={false}
                                            />
                                        </div>
                                        <Pagination showQuickJumper defaultPageSize={20} current={fivePageNum}
                                                    total={fiveTotal}
                                                    onChange={this.onChange.bind(this, 5, 'fivePageNum')}/>
                                    </div>
                                </TabPane>
                                <TabPane tab="已处理工单" key="2">
                                    <div className="articleTable m_t_16">
                                        <div className="articleTable_table_list">
                                            <Table
                                                dataSource={nineCostList}
                                                columns={this.columns}
                                                pagination={false}
                                            />
                                        </div>
                                        <Pagination showQuickJumper defaultPageSize={20} current={ninePageNum}
                                                    total={nineTotal}
                                                    onChange={this.onChange.bind(this, 9, 'ninePageNum')}/>
                                    </div>
                                </TabPane>
                                <TabPane tab="未提交工单" key="3">
                                    <div className="articleTable m_t_16">
                                        <div className="articleTable_table_list">
                                            <Table
                                                dataSource={zeroCostList}
                                                columns={this.columns}
                                                pagination={false}
                                            />
                                        </div>
                                        <Pagination showQuickJumper defaultPageSize={20} current={zeroPageNum}
                                                    total={zeroTotal}
                                                    onChange={this.onChange.bind(this, 0, 'zeroPageNum')}/>
                                    </div>
                                </TabPane>
                            </Tabs>
                        </div>
                    </TabPane>
                </Tabs>

            </div>
        );
    }
}

export default withRouter(CostCenter);