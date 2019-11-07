import React, { Component } from 'react';
import { LocaleProvider, Button, Row, Col, Select, Input, DatePicker, Pagination } from 'antd';
import './style.css';
import HeaderTabbar from '../../components/headTabBar/index';
import moment from 'moment';
import ArticleItem from './components/articleItem/index'
import { withRouter } from 'react-router-dom';

import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import { domain } from './../../utils/fetchApi';

import { articleList } from './../../utils/fetchApi'


const { Option } = Select;
const { MonthPicker, RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';
const monthFormat = 'YYYY/MM';
const dateFormatList = ['DD/MM/YYYY', 'DD/MM/YY'];

class ArticleManage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      pageNumber: 1,
      anthorName: '',  //作者名
      modalVisible: false,
      articleStatus: '',
      articleName: '',  //文章名
      startTime: '',
      endTime: '',
      total: 0,
      pageSize: 20,
      listData: []
    };
  }



  onChange = (pageNumber)=> {
    this.searchList(pageNumber);
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
      articleStatus: value == 0 ? '' : value
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
  }

  anthorChange = (e) => {
    this.setState({
      anthorName: e.target.value
    })
  }

  searchList = pageNumber => {

    let { articleStatus, articleName, anthorName, startTime, endTime, pageSize } = this.state;
    let _this = this;
    fetch(`${articleList}?pageSize=${pageSize}&pageNum=${pageNumber}&status=${articleStatus}&title=${articleName}&authorName=${anthorName}&startTime=${startTime}&endTime=${endTime}`)
      .then(function (response) {
        return response.json()
      }).then(function (json) {
        if (json.success) {
          //更新当前列表
          _this.setState({
            total: json.total,
            listData: json.data
          })
        } else if (json.msg == '未登录') {
          window.initLogin();
        }

      }).catch(function (ex) {
        console.log('parsing failed', ex)
      })

  }


  componentDidMount() {
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


  render() {
    let { total, listData } = this.state;
    return (
      <div className="appPage">
        <HeaderTabbar current='article' />
        <div className="fiter-list">
          <Row className="row" type="flex">
            <Col className="mr-12">
              <Select defaultValue="0" style={{ width: 120 }} onChange={this.statusChange}>
                <Option value="0">全部状态</Option>
                <Option value="1">发布成功</Option>
                <Option value="2">已删除</Option>
              </Select>
            </Col>
            <Col >文章名：</Col>
            <Col className="mr-12">
              <Input onChange={this.articleNameChange} style={{ width: 100 }} placeholder="" />
            </Col>
            <Col >作者：</Col>
            <Col className="mr-12">
              <Input onChange={this.anthorChange} placeholder="" style={{ width: 100 }} />
            </Col>
            <Col >发布时间： </Col>
            <Col className="mr-12">
              <LocaleProvider locale={zh_CN}>
                <RangePicker onChange={this.rangePickeronChange} />
              </LocaleProvider>
            </Col>
            <Col className="mr-12"><Button onClick={this.searchList.bind(null, 1)}>查找</Button></Col>
            <Col ><Button onClick={this.fabuwenzhang} type="primary">发布文章</Button></Col>
          </Row>
        </div>
        <div className="articleTable">
          <div className="articleTable_header">
            <div className="articleTable_header_text w_280">共{total}条</div>
            <div className="articleTable_header_text w_180">封面图</div>
            <div className="articleTable_header_text w_160">作者</div>
            <div className="articleTable_header_text w_160">状态</div>
            <div className="articleTable_header_text w_160">发布时间</div>
            <div className="articleTable_header_text w_160">操作</div>
          </div>
          <div className="articleTable_table_list">
            {
              listData.map(item => {
                return <ArticleItem key={item.id} data={item} />
              })
            }
          </div>
          <Pagination showQuickJumper defaultPageSize={20} defaultCurrent={1} total={total} onChange={this.onChange} />
        </div>
      </div>
    );
  }
}

export default withRouter(ArticleManage);