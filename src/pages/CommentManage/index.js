import React, { Component } from 'react';
import { LocaleProvider, Button, Row, Col, Select, Input, DatePicker, Pagination } from 'antd';
import './style.css';
import HeaderTabbar from '../../components/headTabBar/index';
import moment from 'moment';
import CommentItem from './components/index'
import { withRouter } from 'react-router-dom';

import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import { domain } from './../../utils/fetchApi';

import { commentList, articleExport } from './../../utils/fetchApi'


const { Option } = Select;
const { MonthPicker, RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';
const monthFormat = 'YYYY/MM';
const dateFormatList = ['DD/MM/YYYY', 'DD/MM/YY'];

class CommentManage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      pageNumber: 1,
      status: 0,  //状态筛选
      appType: '', // 平台筛选
      type: '',// 互动类型
      articleName: '',  //文章名
      nickname: '', // 用户
      body: '', // 评论内容
      startTime: '',
      endTime: '',


      modalVisible: false,
      articleStatus: '',
      total: 0,
      pageSize: 20,
      sxStatus: '-1',
      listData: []
    };
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
      status: value
    })
  }

  appTypeChange = (value) => {
    this.setState({
      appType: value
    })
  }
  typeChange = value => {
    this.setState({
      type: value
    })
  }

  articleNameChange = (e) => {
    this.setState({
      articleName: e.target.value
    })
  }

  bodyChange = e => {
    this.setState({
      body: e.target.value
    })
  }

  anthorChange = (e) => {
    this.setState({
      nickname: e.target.value
    })
  }

  rangePickeronChange = (date, dateString) => {
    this.setState({
      startTime: dateString[0],
      endTime: dateString[1],
    })
  }


  

  searchList = (pageNumber) => {


    let { status, appType, type, articleName, nickname, body, startTime, endTime, pageSize, sxStatus } = this.state;
    let _this = this;
    let _url = `${commentList}?pageSize=${pageSize}&pageNum=${pageNumber}&status=${status}&appType=${appType}&type=${type}&articleName=${articleName}&nickname=${nickname}&body=${body}&startTime=${startTime}&endTime=${endTime}`
    if (sxStatus != '-1') {
      _url += `&isTop=${sxStatus}`
    }
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

  exportExl = (pageNumber) => {
    let { articleStatus, articleName, anthorName, startTime, endTime, pageSize, sxStatus } = this.state;
    let _this = this;
    // fetch(`${articleExport}?status=${articleStatus}&title=${articleName}&authorName=${anthorName}&startTime=${startTime}&endTime=${endTime}&isTop=${sxStatus}`)
    //   // fetch(`${articleExport}?pageSize=${pageSize}&pageNum=${pageNumber}&status=${articleStatus}&title=${articleName}&authorName=${anthorName}&startTime=${startTime}&endTime=${endTime}`)
    //   .then(function (response) {
    //     return response.json()
    //   }).then(function (json) {
    //     if (json.success) {
    //       //更新当前列表
    //       _this.setState({
    //         total: json.total,
    //         listData: json.data
    //       })
    //       window.scrollTo(0, 0);
    //     } else if (json.msg == '未登录') {
    //       window.initLogin();
    //     }

    //   }).catch(function (ex) {
    //     console.log('parsing failed', ex)
    //   })
    let _url = `${articleExport}?status=${articleStatus}&title=${articleName}&authorName=${anthorName}&startTime=${startTime}&endTime=${endTime}`
    if (sxStatus != '-1') {
      _url += `&isTop=${sxStatus}`
    }
    // window.location.href = `${articleExport}?status=${articleStatus}&title=${articleName}&authorName=${anthorName}&startTime=${startTime}&endTime=${endTime}&isTop=${sxStatus}`
    window.location.href = _url
  }


  componentDidMount() {


    // let _hasList = this.try_restore_component();
    // console.log(_hasList);

    // if (!_hasList) {
    //   // debugger
    //   this.searchList(1);
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

    const _this = this;
  }

  // try_restore_component(cb) {
  //   let data = window.sessionStorage.getItem("tmpdata");
  //   if (data) {
  //     data = JSON.parse(data);
  //     this.setState(
  //       {
  //         listData: data.listData,
  //         pageNumber: parseInt(data.pageNumber),
  //         scrollpx: data.scrollpx,
  //         total: data.total,
  //       }
  //     )
  //     // window.sessionStorage.setItem('tmpdata', '');

  //     setTimeout(() => {
  //       // debugger
  //       window.scrollTo(0, data.scrollpx);
  //     }, 10)
  //     return 1
  //   }
  //   return 0
  // }

  componentWillUnmount() {
    console.log('待保存的数据：', this.state.listData);
    console.log('保存滚动条位置：', window.scrollY);
    let data = {
      listData: this.state.listData,
      scrollpx: window.scrollY,
      pageNumber: this.state.pageNumber,
      total: this.state.total
    }
    window.sessionStorage.setItem('tmpdata', JSON.stringify(data));
  }

  render() {
    let { total, listData, pageNumber } = this.state;
    return (
      <div className="appPage">

        <HeaderTabbar current='comment' />
        <div className="fiter-list">
          <Row className="row" type="flex">
            <Col className="mr-12">
              <Select defaultValue="" style={{ width: 100 }} onChange={this.statusChange}>
                <Option value="">全部状态</Option>
                <Option value="0">在线</Option>
                <Option value="1">已下线</Option>
              </Select>
            </Col>
            <Col className="mr-12">
              <Select defaultValue="" style={{ width: 100 }} onChange={this.appTypeChange}>
                <Option value="">全部平台</Option>
                <Option value="0">百度</Option>
                <Option value="1">微信</Option>
                <Option value="2">头条</Option>
              </Select>
            </Col>
            <Col className="mr-12">
              <Select defaultValue="" style={{ width: 100 }} onChange={this.typeChange}>
                <Option value="">全部类型</Option>
                <Option value="0">评论</Option>
                <Option value="1">回复</Option>
              </Select>
            </Col>
            <Col >文章名：</Col>
            <Col className="mr-12">
              <Input onChange={this.articleNameChange} style={{ width: 80 }} placeholder="" />
            </Col>
            <Col >内容：</Col>
            <Col className="mr-12">
              <Input onChange={this.bodyChange} placeholder="" style={{ width: 80 }} />
            </Col>
            <Col >用户：</Col>
            <Col className="mr-12">
              <Input onChange={this.anthorChange} placeholder="" style={{ width: 80 }} />
            </Col>
            <Col >发布时间： </Col>
              <Col className="mr-12">
                <LocaleProvider locale={zh_CN}>
                  <RangePicker onChange={this.rangePickeronChange} />
                </LocaleProvider>
              </Col>
              <Col className="mr-12"><Button onClick={this.searchList.bind(null, 1)}>查找</Button></Col>
              <Col ><Button onClick={this.exportExl} type="primary">导出</Button></Col>
          </Row>
        </div>
        
        <div className="articleTable">
          <div className="articleTable_header">
            <div className="articleTable_header_text w_100">共{total}条</div>
            {/* <div className="articleTable_header_text w_180">评论者</div> */}
            <div className="articleTable_header_text w_100">类型</div>
            <div className="articleTable_header_text w_280">互动内容</div>
            <div className="articleTable_header_text w_180">文章名</div>
            <div className="articleTable_header_text w_100">发布时间</div>
            <div className="articleTable_header_text w_100">认可数</div>
            <div className="articleTable_header_text w_100">平台</div>
            <div className="articleTable_header_text w_100">操作</div>
          </div>
          <div className="articleTable_table_list">
            {
              listData.map(item => {
                return <CommentItem key={item.id} data={item} commentList={listData} />
              })
            }
          </div>
          <Pagination showQuickJumper defaultPageSize={20} current={pageNumber} total={total} onChange={this.onChange} />
        </div>
      </div>
    );
  }
}

export default withRouter(CommentManage);