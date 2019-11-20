import React, { Component } from 'react';
import { Modal, Form, Icon, Input, Button, Checkbox, message, Tabs, Select, Table, Pagination } from 'antd';
import { withRouter } from 'react-router-dom';
// import './style.css';
import './index.scss';
import ChexingCom from './components/chexingList/index'

// import { Tabs } from 'antd';

const { TabPane } = Tabs;
const { Option } = Select;


class OtherPage extends Component {
    state = {
        visible: false,
        username: '',
        password: '',
        data: [
            {
                key: '1',
                id: 1,
                sjname: '诚信二手车',
                tiezi: '标致301 2018款 1.8L 手动舒适版',
                price: '3.4万',
                postTime: '09-10 12:30',
                phoneNum: '220',
                fangwenNum: '5123',
            },
            {
                key: '2',
                id: 2,
                sjname: '诚信二手车',
                tiezi: '标致301 2018款 1.8L 手动舒适版',
                price: '3.4万',
                postTime: '09-10 12:30',
                phoneNum: '210',
                fangwenNum: '5124',
            },
            {
                key: '3',
                id: 3,
                sjname: '诚信二手车',
                tiezi: '标致301 2018款 1.8L 手动舒适版',
                price: '3.4万',
                postTime: '09-10 12:30',
                phoneNum: '320',
                fangwenNum: '5125',
            },
            {
                key: '4',
                id: 4,
                sjname: '诚信二手车',
                tiezi: '标致301 2018款 1.8L 手动舒适版',
                price: '3.4万',
                postTime: '09-10 12:30',
                phoneNum: '520',
                fangwenNum: '5126',
            },
            {
                key: '5',
                id: 5,
                sjname: '诚信二手车',
                tiezi: '标致301 2018款 1.8L 手动舒适版',
                price: '3.4万',
                postTime: '09-10 12:30',
                phoneNum: '240',
                fangwenNum: '5127',
            },

        ],
        columns: [
            {
                title: '序号',
                dataIndex: 'id',
                align: "center"
            },
            {
                title: '商家',
                dataIndex: 'sjname',
                align: "center"

            },
            {
                title: '帖子',
                dataIndex: 'tiezi',
                align: "center"

            },
            {
                title: '价格',
                dataIndex: 'price',
                key: 'price',
                defaultSortOrder: 'descend',
                sorter: (a, b) => a.price - b.price,
                align: "center"

            },
            {
                title: '发布时间',
                dataIndex: 'postTime',
                key: 'postTime',

                defaultSortOrder: 'descend',
                sorter: (a, b) => a.postTime - b.postTime,
                align: "center"

            },
            {
                title: '电话量',
                dataIndex: 'phoneNum',
                key: 'phoneNum',

                defaultSortOrder: 'descend',
                sorter: (a, b) => a.phoneNum - b.phoneNum,
                align: "center"

            },
            {
                title: '访问量',
                dataIndex: 'fangwenNum',
                key: 'fangwenNum',

                defaultSortOrder: 'descend',
                sorter: (a, b) => a.fangwenNum - b.fangwenNum,
                align: "center"

            }
        ]
    };

    callback(key) {
        console.log(key);
    }

    handleChange(value) {
        console.log(`selected ${value}`);
    }

    onChange(pagination, filters, sorter, extra) {
        console.log('params', pagination, filters, sorter, extra);
    }

    itemRender(current, type, originalElement) {
        if (type === 'prev') {
            return <a>上一页</a>;
        }
        if (type === 'next') {
            return <a>下一页</a>;
        }
        return originalElement;
    }

    render() {

        let { columns, data } = this.state;

        return (
            <div className="che_gongxu">
                <Tabs defaultActiveKey="1" onChange={this.callback}>
                    <TabPane tab="会员城市同车系" key="1">
                        <div className="tab-item">
                            <div className="tab-header">
                                <div className="tab-header-list1 flex-hc">
                                    <div className="item-text m-r-6">车型：</div>
                                    <ChexingCom />
                                    <div className="item-text m-r-6">城市：</div>
                                    <Select defaultValue="bj" style={{ width: 108, height: 30, marginRight: 50 }} onChange={this.handleChange}>
                                        <Option value="bj">北京</Option>
                                        <Option value="lucy">Lucy</Option>
                                    </Select>
                                </div>
                                <div className="tab-header-list2 flex-hc">
                                    <div className="list2-item">车源：<span>80辆</span></div>
                                    <div className="list2-item">最高价：<span>4.5万</span></div>
                                    <div className="list2-item">最低价：<span>2.5万</span></div>
                                    <div className="list2-item">均价：<span>3.8万</span></div>
                                    <div className="list2-item">有 <span>80辆</span> 车比商家便宜</div>
                                    <div className="list2-item">最近一周新发帖：<span>80辆</span></div>
                                </div>
                            </div>
                            <Table className="table_list" pagination={false} columns={columns} dataSource={data} onChange={this.onChange} />

                            <div className="flex-vc">
                                <Pagination style={{}} total={500} itemRender={this.itemRender} />
                            </div>
                        </div>
                    </TabPane>
                    <TabPane tab="会员城市同车系" key="2">
                        Content of Tab Pane 2
                    </TabPane>
                    <TabPane tab="会员城市同车系" key="3">
                        Content of Tab Pane 3
                    </TabPane>
                </Tabs>
            </div>
        );
    }
}

export default withRouter(OtherPage);