import React, { Component } from 'react';
import { LocaleProvider, Button, Row, Col, Select, Input, DatePicker, Pagination,Modal,message,Form } from 'antd';
import './style.css';
import HeaderTabbar from '../../components/headTabBar/index';
import moment from 'moment';
import AuthorityItem from './components/AuthorityItem'

import { getUser,getMenu,editMenu,addUser } from './../../utils/fetchApi';

import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';

const { Option } = Select;
const { MonthPicker, RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';
const monthFormat = 'YYYY/MM';
const dateFormatList = ['DD/MM/YYYY', 'DD/MM/YY'];
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

class AuhorityManage extends Component {
  formRef = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      actionType: 1,
      people: '',  //作者名
      startTime: '',
      endTime: '',
      pageSize: 10,
      pageNumber: 1,
      authorityList: [],
      total: 0,
      modalVisible: false, //显示新增
      menuList: [],//菜单列表
      changeMenuData: [],//修改列表
      authorityChange: false
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
    // console.log(e.target.value)
  }

  rangePickeronChange = (date, dateString) => {
    // console.log(date, dateString);
    this.setState({
      startTime: dateString[0].replace('/', '-').replace('/', '-'),
      endTime: dateString[1].replace('/', '-').replace('/', '-')
    })
  }


  componentDidMount() {
    const _this = this;
    this.getMenu();
    Array.prototype.remove = function (userId) {
      for(let i in this){
        if(this[i].id == userId){
          this[i].splice(i, 1);
          break;
        }
      }
      _this.setState({
        authorityList: this
      })
    };
    Array.prototype.changeLine = function(userId,status){
      for(let i in this){
        if(this[i].id == userId){
          this[i].status = status;
          break;
        }
      }
      _this.setState({
        authorityList: this
      })
    }
  }

  // 修改权限函数
  changeMenu = (userId,menuIds)=>{
    let {changeMenuData} = this.state;
    let inMenu = false;
    for(let i in changeMenuData){
      if(userId === changeMenuData[i].userId){
        changeMenuData[i].menuIds = menuIds.concat();
        inMenu = true;
        break;
      }
    }
    if(!inMenu){
      changeMenuData.push({
        userId,menuIds
      })
    }
    this.setState({
      changeMenuData: changeMenuData,
      authorityChange: true
    })
  }
  // 获取index
  getIndex(arr,id){
    if(!Array.isArray(arr))return;
    for(let i in arr){
      if(arr[i].id == id){
        return i;
      }
    }
    return -1;
  }
  // 修改状态函数
  changeStatus = (userId,status)=>{
    let authorityList = JSON.parse(JSON.stringify(this.state.authorityList));
    const index = this.getIndex(authorityList,userId);
    if(index === -1)return;
    authorityList[index].status = status;
    this.setState({
      authorityList: authorityList
    })
  }
  // 删除函数
  deleteLine = (userId)=>{
    let authorityList = JSON.parse(JSON.stringify(this.state.authorityList));
    const index = this.getIndex(authorityList,userId);
    if(index === -1)return;
    authorityList.splice(index,1);
    this.setState({
      authorityList: authorityList,
      total: this.state.total - 1
    })
  }

  // 获取菜单列表
  getMenu = () => {
    fetch(getMenu)
    .then( response => {
      return response.json()
    }).then(json => {
      if (json.success) {
        // console.log(json.data);
        this.setState({
          menuList:json.data
        },()=>{
          this.searchData(1);
        })
      }else if (json.msg == '未登录') {
        window.initLogin();
      }
    })
  }

  searchData = (pageNumber = 1) => {
    let {pageSize,menuList } = this.state;
    let _this = this;
    // fetch(`http://open.suwenyj.xyz:8080/article/list-page?pageSize=10&pageNum=${pageNumber}&status=${articleStatus}&authorName=${anthorName}&startTime=${startTime}&endTime=${endTime}&articleName=${articleName}`)
    fetch(`${getUser}?pageSize=${pageSize}&pageNum=${pageNumber}`)
      .then(function (response) {
        return response.json()
      }).then(function (json) {
        if (json.success) {
          for(let i in json.data){
            json.data[i].menuList = JSON.parse(JSON.stringify(menuList));
            // outermost:for(let j in json.data[i].menuList){
            //   for(let k in json.data[i].menus){
            //     console.log(json.data[i].menus[k]);
            //     if(json.data[i].menuList[j].id === json.data[i].menus[k].menuId){
            //       json.data[i].menuList[j].checked = true;
            //       break ;
            //     }
            //   }
            // }
          }
          // console.log(json.data);
          _this.setState({
            authorityList: json.data,
            total: json.total,
            changeMenuData: [],
            authorityChange: false
          })
        } else if (json.msg == '未登录') {
          window.initLogin();
        }
      }).catch(function (ex) {
        console.log('parsing failed', ex)
      })
  }

  add = ()=>{
    this.setState({modalVisible:true})
  }
  
  save = ()=>{
    const { changeMenuData,authorityChange } = this.state;
    if(!authorityChange){
      return;
    }
    let formData = new FormData();
    formData.append('permissions',changeMenuData);
    fetch(editMenu,{
      method:'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(changeMenuData)
    }).then(response=>{
      return response.json()
    }).then(json=>{
      if (json.success) {
        console.log(json.data);
        message.info("保存成功")
      }else if (json.msg == '未登录') {
        window.initLogin();
      }
    })
  }
  confirm = async()=>{
    console.log(this.props.basic)
    console.log(this.formRef.current.validateFields);
    // this.formRef.current.validateFields((value,err)=>{
    //   console.log(value)
    // })
    // this.formRef.current.resetFields()
    // const values = await form.validateFields();
  }

  render() {

    let { total, authorityList,menuList } = this.state;
    return (
      <div className="appPage">
        <HeaderTabbar current='action' />
        <div className="fiter-list">
          <Row className="row" type="flex">
            <Col className="authority-title">
              项目成员
            </Col>
          </Row>
          <Row className="row btn-wrap" type="flex">
            <Col className="mr-12">
              <Button onClick={this.add}>新增</Button>
            </Col>
            <Col>
              <Button type={this.state.authorityChange?'primary':''} onClick={this.save}>保存</Button>
            </Col>
          </Row>
        </div>
        <div className="articleTable">
          <div className="articleTable_header">
            <div className="articleTable_header_text w_180">管理账号</div>
            {
              menuList.map(item => {
                return <div className="articleTable_header_text w_100" key={item.id}>{item.menuName}</div>
              })
            }
            <div className="articleTable_header_text w_160">状态</div>
            <div className="articleTable_header_text w_160">操作</div>
          </div>
          <div className="articleTable_table_list">
            {
              authorityList.map(item => {
                return <AuthorityItem key={item.id} data={item} onChange={this.changeMenu} changeStatus={this.changeStatus} deleteLine={this.deleteLine} />
              })
            }
          </div>
          <Pagination showQuickJumper defaultPageSize={20} defaultCurrent={1} total={total} onChange={this.onChange} />
        </div>
        <Modal title="新增账号"
          visible={this.state.modalVisible}
          onCancel={()=>{
            this.setState({modalVisible: false})
          }}
          onOk={this.confirm}
          okText="确认"
          cancelText="取消"
        >
          <Form
            {...layout}
            name="basic"
            ref={this.formRef}
            // onFinish={onFinish}
            // onFinishFailed={onFinishFailed}
          >
            <Form.Item
              label="账号"
              name="username"
              rules={[{ required: true, message: '请输入账号!' }]}
            >
              <Input autoComplete="false" />
            </Form.Item>

            <Form.Item
              label="密码"
              name="password"
              rules={[{ required: true, message: '请输入密码!' }]}
            >
              <Input.Password autoComplete="new-password"/>
            </Form.Item>

            
          </Form>



          {/* <Row type="flex" className="edit-line">
            <span>账号：</span><Input/>
          </Row>
          <Row type="flex" className="edit-line">
            <span>密码：</span><Input type="password" autoComplete="new-password"/>
          </Row> */}
        </Modal>
      </div>
      
    );
  }
}

export default AuhorityManage;