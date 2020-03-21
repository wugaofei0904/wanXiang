import React, { Component } from 'react';
import { LocaleProvider, Button, message,Row, Col, Select, Input, DatePicker, Badge,Pagination, Table, Popconfirm, Form } from 'antd';
// import {CheckCircleOutlined} from 'antd/icons'
import HeaderTabbar from '../../components/headTabBar/index'
import { getAuthList,deleteAuth } from './../../utils/fetchApi';

import 'moment/locale/zh-cn';
import { withRouter } from 'react-router-dom';


class AuthManage extends Component {

  constructor(props) {
    super(props);
      this.state = {
          pageSize: 10,
          pageNumber: 1,
          authList:[],
          total: 0,
      };

    this.columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        key:'id'
      },
      {
        title: '公众号',
        dataIndex: 'wxId',
      },
      {
        title: '联系人',
        dataIndex: 'phone',
      },
      {
        title: '授权',
        dataIndex: 'authorize',
        render: (text, record) => {
          return (
            <div>
                {text==true?<span style={{color:'green',fontWeight:'bold'}}>√</span>:'-'}
            </div>
          )
        }
      },
      {
        title: '操作',
        dataIndex: 'id',
        width: 300,
        render: (text, record) => {
            return <div>
              <Button disabled={this.state['ifStay'+text]} onClick={()=>this.jumpToCreate(record)}>创建</Button>
                <Button  style={{marginLeft:10}}
                         onClick={()=>this.stayOn(text,this.state['ifStay'+text])}>{this.state['ifStay'+text]?'取消待定':'待定'}</Button>
              <Popconfirm disabled={this.state['ifStay'+text]} title="确认删除?" onConfirm={()=>this.deleteAuth(text)}>
                <Button style={{marginLeft:10}}
                        disabled={this.state['ifStay'+text]} type="danger">删除</Button>
              </Popconfirm>
            </div>


        }

      },
    ];

  }

    /**
     * 跳转
     * @param val
     */
    jumpToCreate=val=>{
        let wxName=val.wxId

        this.props.history.push( {
            pathname: '/createAnthor/',
            state: {
                data: {
                    wxId:wxName
                },
                edit:true
            } } )

    }

    /**
     * 待定
     * @param val
     */
    stayOn=(id,val)=>{
      this.setState({
          ['ifStay'+id]:!val
      })
    }

    /**
     * delete
     * @param id
     */
    deleteAuth=id=>{
        // deleteAuth
        let that=this;
        fetch(`${deleteAuth}?id=${id}`)
            .then(function (response) {
                return response.json()
            }).then(function (json) {
            console.log('json',json)
            if (json.success) {
               message.success('删除成功')
                that.requestListData(1)
            } else if (json.msg == '未登录') {
                message.error(json.msg)
                window.initLogin();
            } else {
                message.error(json.msg)
            }
        }).catch(function (ex) {
            console.log('parsing failed', ex)
        })
    }


  requestListData = pageNumber => {
    let { pageSize } = this.state;
    // console.log(anthorName, rank, tagId, startTime, endTime)
    let _this = this;
    // debugger
    fetch(`${getAuthList}?pageNum=${pageNumber}&pageSize=${pageSize}`)
      .then(function (response) {
        return response.json()
      }).then(function (json) {
        console.log('json',json)
        if (json.success) {
          let data=json.data;
          _this.setState({
              authList: data.list,
            total: data.total
          })
        } else if (json.msg == '未登录') {
          alert(json.msg)
          window.initLogin();
        } else {
          alert(json.msg)
        }
      }).catch(function (ex) {
        console.log('parsing failed', ex)
      })
  }

  onChange = (pageNumber) => {
        this.requestListData(pageNumber);
        // console.log('Page: ', pageNumber);
  }

  componentDidMount() {
      this.requestListData(1)
  }

  render() {
    let {authList,total}=this.state

    return (
      <div className="appPage">
        <HeaderTabbar current='anthor' />
        <h2 style={{marginTop:20}}>授权管理</h2>
          <div className="articleTable m_t_16">
              <div className="articleTable_table_list">
                  <Table
                      dataSource={authList}
                      columns={this.columns}
                      pagination={false}
                  />
              </div>
              <Pagination showQuickJumper defaultPageSize={10} defaultCurrent={1} total={total} onChange={this.onChange} />
          </div>
      </div>
    );
  }
}

export default withRouter(AuthManage);
