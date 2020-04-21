import React, {Component} from 'react';
import {LocaleProvider, Button, Row, Col, Select, Input,InputNumber, DatePicker, Pagination, message, Table} from 'antd';
import HeaderTabbar from '../../../components/headTabBar/index';
import {withRouter} from 'react-router-dom';
import '../style.css'
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import {getMonthCost, monthCostExport,updateSubsidy} from "../../../utils/fetchApi";
import Request from "../../../utils/request";
import {DateIsFS} from '../../../utils/utils'

const {Option} = Select;
const {RangePicker} = DatePicker;
const mode = ['month', 'month']


class MonthCost extends Component {

    constructor(props) {
        super(props);
        this.state = {
            pageNumber: 1,
            total: 0,
            pageSize: 20,
            dayList: [],
            authorName: '',
            rank: '',
            startTime: '',
            endTime: '',
            open:false,
            value:[]
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
            title: '结算时间',
            dataIndex: 'month',
            key: 'month',
            render: (text, record) => {

                return (<span>{text}月</span>)
            }
        }, {
            title: '阅读量',
            dataIndex: 'readNum',
            key: 'readNum'
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
            key: 'subsidy',
            render:(text,record)=>{
                let val=DateIsFS();
                let firstProper=val.day==1 ||val.day==2;
                let secondProper=((val.month-1)==Number(record.month)) || (val.month==1 && Number(record.month)==12)
                if(firstProper && secondProper){ //本月的一号二号方可编辑上月补贴
                    return (<InputNumber value={text} min={0} onBlur={this.changeSubsidy.bind(this,record.orderId,text)}  style={{ width: 80 }} />
                    )
                }else{
                    return (<span>{text}</span>)
                }
            }
        }, {
            title: '税费',
            dataIndex: 'tax',
            key: 'tax'
        }, {
            title: '最终收益',
            dataIndex: 'gross',
            key: 'gross'
        }]
    }

    changeSubsidy=(id,originalVal,e)=>{
        let val=e.target.value;

        if(!(/(^[1-9]\d*$)/.test(val))){
            e.target.value=originalVal
            message.error('请输入大于0的整数')
        }else{
            // orderId
            // subsidy
            let _this=this;
            let {pageNumber}=this.state
            Request.Get_Request(`${updateSubsidy}?orderId=${id}&subsidy=${val}`, () => {
                // let data = res.data;
                message.success('修改成功')
                _this.requestListData(pageNumber)

            },()=>{
                e.target.value=originalVal
            })
        }
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
     * 月查询列表
     * @param pageNumber
     */
    requestListData = pageNumber => {
        let {authorName, rank, startTime, endTime, pageSize} = this.state;
        let _this = this;
        // debugger
        Request.Get_Request(`${getMonthCost}?pageNum=${pageNumber}&pageSize=${pageSize}&authorName=${authorName}&rank=${rank}&startTime=${startTime}&endTime=${endTime}`, (res) => {
            let data = res.data;
            _this.setState({
                dayList: data,
                total: res.total
            })
        })
    }

    nameChange = (e) => {
        this.setState({
            authorName: e.target.value
        })
    }

    // rangePickeronChange = (date, dateString) => {
    //     this.setState({
    //         startTime: dateString[0],
    //         endTime: dateString[1],
    //     })
    // }


    searchList = (pageNumber) => {
        this.requestListData(pageNumber)
        this.setState({
            pageNumber: pageNumber
        })

    }

    exportExl = () => {
        let {authorName, pageNumber, rank, startTime, endTime, pageSize} = this.state;
        let _url = `${monthCostExport}?pageSize=${pageSize}&pageNum=${pageNumber}&authorName=${authorName}&rank=${rank}&startTime=${startTime}&endTime=${endTime}`
        window.open(_url)
    }


    componentDidMount() {
        this.requestListData(1)

    }
    onOpenChange=(boolean)=>{
        this.setState({
            open:!boolean
        })
    }

    // onOpenChangeSelect=(boolean,val)=>{
    //     this.setState({
    //         open:!boolean
    //     })
    // }
    rankChange = (value) => {
        this.setState({
            rank: value
        })
        this.handlePanelChange(value)
    }
    handleChange = value => {
        this.setState({ value });
        if(value[0] && value[1]){
            this.setState({
                startTime: value[0].format('YYYY-MM-DD'),
                endTime: value[1].format('YYYY-MM-DD'),
            })
        }else{
            this.setState({
                startTime: '',
                endTime: '',
            })
        }
    };
    handlePanelChange = (value) => {
        this.setState({
            value,
        });
        this.setState({
            startTime: value[0].format('YYYY-MM-DD'),
            endTime: value[1].format('YYYY-MM-DD'),
        })
    };
    // renderButton=(val)=>{
    //     return (<Button type={'primary'} onClick={()=>this.onOpenChangeSelect(true,val)} >确定</Button>)
    // }
    render() {
        let {total, dayList, pageNumber,value,open} = this.state;
        return (
            <div className="appPage">

                <HeaderTabbar current='cost'/>
                <div style={{marginTop: 20}}>
                    <h3 style={{fontWeight: 'bold'}}>月度收益</h3>
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
                        <Col>结算时间： </Col>
                        <Col className="mr-12 relative-title">
                            <LocaleProvider locale={zh_CN}>
                                <RangePicker placeholder={['开始月份', '结束月份']}
                                             value={value}
                                             format="YYYY-MM"
                                             mode={mode}
                                             open={open}
                                             allowClear={true}
                                             onChange={this.handleChange}
                                             onOpenChange={()=>this.onOpenChange(open)}
                                             onPanelChange={this.handlePanelChange}

                                />
                            </LocaleProvider>
                            <span className='absolute-content content-area-font'>月度查询</span>
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

export default withRouter(MonthCost);