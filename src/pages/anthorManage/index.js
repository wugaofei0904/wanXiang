import React, { Component } from 'react';
import { LocaleProvider, Button, Row, Col, Select, Input, DatePicker, Pagination, Table, Popconfirm, Form } from 'antd';
import './style.css';
import HeaderTabbar from '../../components/headTabBar/index';
import moment from 'moment';
import fetchJsonp from 'fetch-jsonp';
import { authorList, tagList } from './../../utils/fetchApi';

import GetTagList from './../hooks/useGetTagList';
import { async } from 'q';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';

const { Option } = Select;
const { MonthPicker, RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';
const monthFormat = 'YYYY/MM';
const dateFormatList = ['DD/MM/YYYY', 'DD/MM/YY'];


const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
  state = {
    editing: false,
  };

  toggleEdit = () => {
    const editing = !this.state.editing;
    this.setState({ editing }, () => {
      if (editing) {
        this.input.focus();
      }
    });
  };

  save = e => {
    const { record, handleSave } = this.props;
    this.form.validateFields((error, values) => {
      if (error && error[e.currentTarget.id]) {
        return;
      }
      this.toggleEdit();
      handleSave({ ...record, ...values });
    });
  };

  renderCell = form => {
    this.form = form;
    const { children, dataIndex, record, title } = this.props;
    const { editing } = this.state;
    return editing ? (
      <Form.Item style={{ margin: 0 }}>
        {form.getFieldDecorator(dataIndex, {
          rules: [
            {
              required: true,
              message: `${title} is required.`,
            },
          ],
          initialValue: record[dataIndex],
        })(<Input ref={node => (this.input = node)} onPressEnter={this.save} onBlur={this.save} />)}
      </Form.Item>
    ) : (
        <div
          className="editable-cell-value-wrap"
          style={{ paddingRight: 24 }}
          onClick={this.toggleEdit}
        >
          {children}
        </div>
      );
  };



  render() {
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      handleSave,
      children,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editable ? (
          <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
        ) : (
            children
          )}
      </td>
    );
  }
}




class ArticleManage extends Component {

  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '作者名',
        dataIndex: 'name',
        // width: '30%',
        // editable: true,
      },
      {
        title: '封禁',
        dataIndex: 'status',
      },
      {
        title: '发布文章数',
        dataIndex: 'articleNum',
      },
      {
        title: '等级',
        dataIndex: 'rank',
      },
      {
        title: '领域',
        dataIndex: 'tagId',
      },
      {
        title: '备注',
        dataIndex: 'remark',
      },
      {
        title: '文章更新时间',
        dataIndex: 'updateTime',
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        render: (text, record) =>
          this.state.dataSource.length >= 1 ? (
            <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record.key)}>
              <a>Delete</a>
            </Popconfirm>
          ) : null,
      },
    ];

    this.state = {
      dataSource: [{
        "id": 1,
        "name": "测试",
        "settledState": "0",      //0 未入驻，1以入驻
        "status": "1",               //0 封禁，1正常
        "articleNum": 0,          //发表文章数
        "rank": "1",	 //等级
        "tagId": 3,                 // 标签号
        "tagName": "综合",    //标签名
        "remark": "xx",         //备注
        "updateTime": "2019-10-22T05:00:00.000+0000",  //文章更新时间
        "createTime": "2019-10-22T18:59:11.000+0000",    //作者创建时间
        "headImg": "头像",
        "wxId": "微信号",
      }],
      count: 2,
      anthorName: '',
      rank: '',
      tagId: '',
      startTime: '',
      endTime: '',
      tagIdList: []  //领域list
    };
  }

  handleDelete = key => {
    const dataSource = [...this.state.dataSource];
    this.setState({ dataSource: dataSource.filter(item => item.key !== key) });
  };

  handleAdd = () => {
    const { count, dataSource } = this.state;
    const newData = {
      key: count,
      name: `Edward King ${count}`,
      age: 32,
      address: `London, Park Lane no. ${count}`,
    };
    this.setState({
      dataSource: [...dataSource, newData],
      count: count + 1,
    });
  };

  handleSave = row => {
    const newData = [...this.state.dataSource];
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    this.setState({ dataSource: newData });
  };


  requestListData = () => {
    let _this = this;
    fetch('http://open.suwenyj.xyz:8080/author/list-page?pageSize=10&pageNum=1&rank=1&tagId=1')
      .then(function (response) {
        return response.json()
      }).then(function (json) {

        console.log(json)

        _this.setState({
          dataSource: json.data
        })
      }).catch(function (ex) {
        console.log('parsing failed', ex)
      })
  }

  isgetTagList = async () => {
    let tagList = await GetTagList(0);
    this.setState({
      tagIdList: tagList.data
    })
  }


  componentDidMount() {
    this.isgetTagList();
  }

  onChange(pageNumber) {
    console.log('Page: ', pageNumber);
  }

  handleChange = (value) => {
    console.log(`selected ${value}`);
  }

  search = () => {


    let { anthorName, rank, tagId, startTime, endTime } = this.state;

    console.log(anthorName, rank, tagId, startTime, endTime)

    this.requestListData();

  }

  nameChange = (e) => {
    this.setState({
      anthorName: e.target.value
    })
  }

  rankhandleChange = value => {
    this.setState({
      rank: value
    })

  }

  taghandleChange = value => {
    this.setState({
      tagId: value
    })
  }

  rangePickeronChange = (date, dateString) => {
    console.log(date, dateString);
    this.setState({
      startTime: dateString[0],
      endTime: dateString[1],
    })
  }

  render() {
    const { dataSource, tagIdList } = this.state;
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
        }),
      };
    });




    return (
      <div className="appPage">
        <HeaderTabbar current='anthor' />
        <div className="fiter-list">
          <Row className="row" type="flex">
            <Col >作者名：</Col>
            <Col className="mr-12">
              <Input onChange={this.nameChange} style={{ width: 100 }} placeholder="" />
            </Col>
            <Col className="mr-12" >等级</Col>
            <Col className="mr-12">
              <Select defaultValue="0" style={{ width: 120 }} onChange={this.rankhandleChange}>
                <Option value="0">全部</Option>
                <Option value="1">一级</Option>
                <Option value="2">二级</Option>
                <Option value="3">三级</Option>
                <Option value="4">四级</Option>
              </Select>
            </Col>
            <Col className="mr-12" >领域</Col>
            <Col className="mr-12">
              <Select defaultValue="0" style={{ width: 120 }} onChange={this.taghandleChange}>
                <Option value="0">全部</Option>
                {tagIdList.map(item => {
                  return <Option value={item.id}>{item.tagName}</Option>
                })}
              </Select>
            </Col>

            <Col >创建时间： </Col>
            <Col className="mr-12">
              {/* <RangePicker
                defaultValue={[moment('2015/01/01', dateFormat), moment('2015/01/01', dateFormat)]}
                format={dateFormat}
              /> */}
              <LocaleProvider locale={zh_CN}>
                <RangePicker onChange={this.rangePickeronChange} />
              </LocaleProvider>
            </Col>
            <Col className="mr-12"><Button onClick={this.search}>搜索</Button></Col>
            <Col ><Button type="primary">添加作者</Button></Col>
          </Row>
        </div>
        <div className="articleTable m_t_16">
          <div className="articleTable_table_list">
            <Table
              components={components}
              rowClassName={() => 'editable-row'}
              bordered
              dataSource={dataSource}
              columns={columns}
              pagination={false}
            />
          </div>
          <Pagination showQuickJumper defaultCurrent={2} total={500} onChange={this.onChange} />
        </div>
      </div>
    );
  }
}

export default ArticleManage;