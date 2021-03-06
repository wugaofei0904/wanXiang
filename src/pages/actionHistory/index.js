import React, { Component } from 'react';
import { LocaleProvider, Button, Row, Col, Select, Input, DatePicker, Pagination } from 'antd';
import './style.css';
import HeaderTabbar from '../../components/headTabBar/index';
import moment from 'moment';
import ActionItem from './ActionItem/index'

import { recordList } from './../../utils/fetchApi';

import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';

const { Option } = Select;
const { MonthPicker, RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';
const monthFormat = 'YYYY/MM';
const dateFormatList = ['DD/MM/YYYY', 'DD/MM/YY'];

class ActionHistory extends Component {

  constructor(props) {
    super(props);
    this.state = {
      actionType: 1,
      people: '',  //作者名
      startTime: '',
      endTime: '',
      pageSize: 10,
      pageNumber: 1,
      actionList: [],
      total: 0
    };
  }



  onChange = (pageNumber) => {
    // console.log('Page: ', pageNumber);
    this.searchData(pageNumber);
  }

  handleChange = (value) => {
    // console.log(`selected ${value}`);
    this.setState({
      actionType: value
    })
  }

  actionPeople = (e) => {
    this.setState({
      people: e.target.value
    })
  }

  rangePickeronChange = (date, dateString) => {
    console.log(date, dateString);
    this.setState({
      startTime: dateString[0].replace('/', '-').replace('/', '-'),
      endTime: dateString[1].replace('/', '-').replace('/', '-')
    })
  }


  componentDidMount() {
    this.searchData(1);
  }


  searchData = (pageNumber = 1) => {
    let { actionType, people, startTime, endTime, pageSize } = this.state;
    let _this = this;
    // fetch(`http://open.suwenyj.xyz:8080/article/list-page?pageSize=10&pageNum=${pageNumber}&status=${articleStatus}&authorName=${anthorName}&startTime=${startTime}&endTime=${endTime}&articleName=${articleName}`)
    fetch(`${recordList}?pageSize=${pageSize}&pageNum=${pageNumber}&type=${actionType}&nickname=${people}&startTime=${startTime}&endTime=${endTime}`)
      .then(function (response) {
        return response.json()
      }).then(function (json) {
        if (json.success) {
          _this.setState({
            actionList: json.data,
            total: json.total
          })
        } else if (json.code == '506') {
          window.initLogin();
        }
      }).catch(function (ex) {
        console.log('parsing failed', ex)
      })
  }
  // 跳转到权限
  toAuthority = ()=>{
    this.props.history.push("authorityManage")
  }


  render() {

    let { total, actionList } = this.state;
    let showAuthority = false;
    let authority = JSON.parse(sessionStorage.getItem("authority"))
        for(let i in authority){
            if(authority[i].menuIndex === '/authorityManage'){
              showAuthority = true;
              break;
            }
        }
    return (
      <div className="appPage">
        <HeaderTabbar current='actionHistory' />
        <div className="fiter-list">
          {
            showAuthority?<div className="fabu_btn">
              <Button onClick={this.toAuthority} type="primary">权限管理</Button>
            </div>:''
          }
          
          <Row className="row" type="flex">
            <Col className="mr-12">
              <Select defaultValue="0" style={{ width: 120 }} onChange={this.handleChange}>
                {/* <Option value="999">全部动作</Option> */}
                <Option value="0">作者创建</Option>
                <Option value="1">作者编辑</Option>
                <Option value="2">作者删除</Option>
                <Option value="3">文章发布</Option>
                <Option value="4">文章代发</Option>
                <Option value="5">文章删除</Option>
              </Select>
            </Col>
            <Col >操作人：</Col>
            <Col className="mr-12">
              <Input onChange={this.actionPeople} style={{ width: 100 }} placeholder="" />
            </Col>
            <Col >操作时间： </Col>
            <Col className="mr-12">
              <LocaleProvider locale={zh_CN}>
                <RangePicker onChange={this.rangePickeronChange} />
              </LocaleProvider>
            </Col>
            <Col className="mr-12"><Button onClick={this.searchData.bind(null, 1)}  >查找</Button></Col>
          </Row>
        </div>
        <div className="articleTable">
          <div className="articleTable_header">
            <div className="articleTable_header_text w_280">共{total}条</div>
            <div className="articleTable_header_text w_180">动作</div>
            {/* <div className="articleTable_header_text w_160">原因</div> */}
            <div className="articleTable_header_text w_160">操作时间</div>
            <div className="articleTable_header_text w_160">操作人</div>
          </div>
          <div className="articleTable_table_list">
            {
              actionList.map(item => {
                return <ActionItem key={item.id} data={item} />
              })
            }
          </div>
          <Pagination showQuickJumper defaultPageSize={20} defaultCurrent={1} total={total} onChange={this.onChange} />
        </div>
      </div>
    );
  }
}

export default ActionHistory;