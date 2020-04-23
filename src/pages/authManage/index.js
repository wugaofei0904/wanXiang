import React, { Component } from 'react';
import { LocaleProvider, Button, message,Row, Col, Select, Input, DatePicker, Badge,Pagination, Table, Popconfirm, Form } from 'antd';
// import {CheckCircleOutlined} from 'antd/icons'
import HeaderTabbar from '../../components/headTabBar/index'
import { getAuthList,deleteAuth,cancelStay,goStay,wxAuthUrl} from './../../utils/fetchApi';
import Request from '../../utils/request'
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
            title: '推荐人',
            dataIndex: 'referee',
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
              <Button disabled={record.status==1}
                      onClick={()=>this.jumpToCreate(record)}
                      style={{background:'#1988CB'}}
                      type={'primary'}>创建</Button>
                <Button  style={{marginLeft:10,background:'#1988CB'}}
                         onClick={()=>this.stayOn(text,record.status)}
                         type={'primary'}
                >{record.status==1?'取消待定':'待定'}</Button>
              <Popconfirm disabled={record.status==1} title="确认删除?" onConfirm={()=>this.deleteAuth(text)}>
                <Button style={{marginLeft:10}}
                        disabled={record.status==1} type="danger">删除</Button>
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
            pathname: '/createAnthor',
            state: {
                data: {
                    name:wxName
                },
                edit:true
            } } )

    }

    /**
     * 待定
     * @param val
     */
    stayOn=(id,status)=>{
      if(status!=1){  //如果没待定
          Request.Get_Request(`${goStay}?id=${id}`,()=>{
              message.success('待定成功')
          })
      }else{
          Request.Get_Request(`${cancelStay}?id=${id}`,()=>{
              message.success('取消待定成功')
          })
      }
      setTimeout(()=>{
          this.requestListData(1)

      },100)
    }

    /**
     * delete
     * @param id
     */
    deleteAuth=id=>{
        // deleteAuth
        let that=this;
        Request.Get_Request(`${deleteAuth}?id=${id}`,()=>{
            message.success('删除成功')
            that.requestListData(1)
        })
    }

    /**
     * 获取列表数据
     * @param pageNumber
     */
  requestListData = pageNumber => {
    let { pageSize } = this.state;
    // console.log(anthorName, rank, tagId, startTime, endTime)
    let _this = this;
    // debugger
      Request.Get_Request(`${getAuthList}?pageNum=${pageNumber}&pageSize=${pageSize}`,(res)=>{
          console.log('ceshi',res)
          let data=res.data;
          _this.setState({
              authList: data,
              total: res.total
          })
      })
  }

  onChange = (pageNumber) => {
        this.requestListData(pageNumber);
        // console.log('Page: ', pageNumber);
  }
    jumpToWX(){
            // if(process.env.NODE_ENV === 'production'){
            //     window.open('https://www.jiandi.life/open/wx/op/authPage');
            //
            // }else{
                window.open('/open/wx/op/authPage');

            // }
    }

  componentDidMount() {
      this.requestListData(1)
  }

  render() {
    let {authList,total}=this.state

    return (
      <div className="appPage">
        <HeaderTabbar current='anthorManage' />
          <div style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',width:'100%'}}>
              <h2 style={{marginTop:20,display:'inline-block'}}>授权管理</h2>
                 <Button onClick={()=>this.jumpToWX()}
                         style={{marginLeft:'77%'}}
                         type={'primary'}>授权二维码</Button>
          </div>
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
