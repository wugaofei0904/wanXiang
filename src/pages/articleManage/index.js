import React, { Component } from 'react';
import { Button, Row, Col, Select, Input, DatePicker, Pagination } from 'antd';
import './style.css';
import HeaderTabbar from '../../components/headTabBar/index';
import moment from 'moment';
import ArticleItem from './components/articleItem/index'
import { withRouter } from 'react-router-dom';

const { Option } = Select;
const { MonthPicker, RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';
const monthFormat = 'YYYY/MM';
const dateFormatList = ['DD/MM/YYYY', 'DD/MM/YY'];

class AnthorManage extends Component {
  onChange(pageNumber) {
    console.log('Page: ', pageNumber);
  }

  handleChange = (value) => {
    console.log(`selected ${value}`);
  }

  fabuwenzhang = () => {
    this.props.history.push('editPage')
  }

  render() {
    return (
      <div className="appPage">
        <HeaderTabbar current='article' />
        <div className="fiter-list">
          <Row className="row" type="flex">
            <Col className="mr-12">
              <Select defaultValue="lucy" style={{ width: 120 }} onChange={this.handleChange}>
                <Option value="jack">Jack</Option>
                <Option value="lucy">Lucy</Option>
                <Option value="Yiminghe">yiminghe</Option>
              </Select>
            </Col>
            <Col >文章名：</Col>
            <Col className="mr-12">
              <Input style={{ width: 100 }} placeholder="" />
            </Col>
            <Col >作者：</Col>
            <Col className="mr-12">
              <Input placeholder="" style={{ width: 100 }} />
            </Col>
            <Col > ID： </Col>
            <Col className="mr-12">
              <Input placeholder="" style={{ width: 100 }} />
            </Col>
            <Col >发布时间： </Col>
            <Col className="mr-12">
              <RangePicker
                defaultValue={[moment('2015/01/01', dateFormat), moment('2015/01/01', dateFormat)]}
                format={dateFormat}
              />
            </Col>
            <Col className="mr-12"><Button>查找</Button></Col>
            <Col ><Button onClick={this.fabuwenzhang} type="primary">发布文章</Button></Col>
          </Row>
        </div>
        <div className="articleTable">
          <div className="articleTable_header">
            <div className="articleTable_header_text w_280">共20条</div>
            <div className="articleTable_header_text w_180">封面图</div>
            <div className="articleTable_header_text w_160">作者</div>
            <div className="articleTable_header_text w_160">状态</div>
            <div className="articleTable_header_text w_160">时间</div>
            <div className="articleTable_header_text w_160">操作</div>
          </div>
          <div className="articleTable_table_list">
            <ArticleItem />
            <ArticleItem />
            <ArticleItem />
          </div>
          <Pagination showQuickJumper defaultCurrent={2} total={500} onChange={this.onChange} />
        </div>
      </div>
    );
  }
}

export default withRouter(AnthorManage);