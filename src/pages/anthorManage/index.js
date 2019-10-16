import React, { Component } from 'react';
import { Button, Row, Col, Select, Input, DatePicker, Pagination, Table, Popconfirm, Form } from 'antd';
import './style.css';
import HeaderTabbar from '../../components/headTabBar/index';
import moment from 'moment';


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
        title: '入住',
        dataIndex: 'ruzhu',
      },
      {
        title: '封禁',
        dataIndex: 'fengjin',
      },
      {
        title: '百度账号',
        dataIndex: 'zhanghao',
      },
      {
        title: '发布文章数',
        dataIndex: 'fabuwenzhangshu',
      },
      {
        title: '等级',
        dataIndex: 'dengji',
      },
      {
        title: '领域',
        dataIndex: 'lingyu',
      },
      {
        title: '备注',
        dataIndex: 'beizhu',
      },
      {
        title: '文章更新时间',
        dataIndex: 'wenzhanggenxinshijian',
      },
      {
        title: '作者更新时间',
        dataIndex: 'zuozhegengxinshijian',
      },
      {
        title: '作者开户时间',
        dataIndex: 'zuozhekaihushijian',
      },
      {
        title: 'operation',
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
      dataSource: [
        {
          key: '0',
          name: 'Edward King 0',
          age: '32',
          address: 'London, Park Lane no. 0',
        },
        {
          key: '1',
          name: 'Edward King 1',
          age: '32',
          address: 'London, Park Lane no. 1',
        },
      ],
      count: 2,
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




  onChange(pageNumber) {
    console.log('Page: ', pageNumber);
  }

  handleChange = (value) => {
    console.log(`selected ${value}`);
  }
  render() {


    const { dataSource } = this.state;
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
              <Input style={{ width: 100 }} placeholder="" />
            </Col>
            <Col className="mr-12" >等级</Col>
            <Col className="mr-12">
              <Select defaultValue="0" style={{ width: 120 }} onChange={this.handleChange}>
                <Option value="0">全部</Option>
                <Option value="lucy">Lucy</Option>
                <Option value="Yiminghe">yiminghe</Option>
              </Select>
            </Col>
            <Col className="mr-12" >领域</Col>
            <Col className="mr-12">
              <Select defaultValue="0" style={{ width: 120 }} onChange={this.handleChange}>
                <Option value="0">全部</Option>
                <Option value="lucy">Lucy</Option>
                <Option value="Yiminghe">yiminghe</Option>
              </Select>
            </Col>

            <Col >创建时间： </Col>
            <Col className="mr-12">
              <RangePicker
                defaultValue={[moment('2015/01/01', dateFormat), moment('2015/01/01', dateFormat)]}
                format={dateFormat}
              />
            </Col>
            <Col className="mr-12"><Button>搜索</Button></Col>
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