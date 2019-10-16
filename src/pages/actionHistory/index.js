import React, { Component } from 'react';
import { Button, Row, Col, Select, Input, DatePicker,Pagination  } from 'antd';
import './style.css';
import HeaderTabbar from '../../components/headTabBar/index';
import moment from 'moment';
import ActionItem from './ActionItem/index'


const { Option } = Select;
const { MonthPicker, RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';
const monthFormat = 'YYYY/MM';
const dateFormatList = ['DD/MM/YYYY', 'DD/MM/YY'];

class ActionHistory extends Component {
  onChange(pageNumber) {
    console.log('Page: ', pageNumber);
  }

  handleChange = (value) => {
    console.log(`selected ${value}`);
  }

  render() {
    return (
      <div className="appPage">
        <HeaderTabbar current='action' />
        <div className="fiter-list">
          <Row className="row" type="flex">
            <Col className="mr-12">
              <Select defaultValue="0" style={{ width: 120 }} onChange={this.handleChange}>
                <Option value="0">全部动作</Option>
                <Option value="lucy">Lucy</Option>
                <Option value="Yiminghe">yiminghe</Option>
              </Select>
            </Col>
            <Col >操作人：</Col>
            <Col className="mr-12">
              <Input style={{ width: 100 }} placeholder="" />
            </Col>            
            <Col > ID： </Col>
            <Col className="mr-12">
              <Input placeholder="" style={{ width: 100 }} />
            </Col>
            <Col >操作时间： </Col>
            <Col className="mr-12">
              <RangePicker
                defaultValue={[moment('2015/01/01', dateFormat), moment('2015/01/01', dateFormat)]}
                format={dateFormat}
              />
            </Col>
            <Col className="mr-12"><Button>查找</Button></Col>       
          </Row>
        </div>
        <div className="articleTable">
          <div className="articleTable_header">
            <div className="articleTable_header_text w_280">共20条</div>
            <div className="articleTable_header_text w_180">动作</div>
            <div className="articleTable_header_text w_160">原因</div>
            <div className="articleTable_header_text w_160">操作时间</div>
            <div className="articleTable_header_text w_160">操作人</div>
          </div>
          <div className="articleTable_table_list">
            <ActionItem />
            <ActionItem />
            <ActionItem />
          </div>
          <Pagination showQuickJumper defaultCurrent={2} total={500} onChange={this.onChange} />
        </div>
      </div>
    );
  }
}

export default ActionHistory;