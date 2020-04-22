import React, { Component } from 'react';
import { Form, Icon, Input } from 'antd';
 
const FormItem = Form.Item;
//form代码，没有什么改进，把下面的提交按钮去掉就行
class NormalLoginForm extends Component {
 
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form className="login-form">
        <FormItem>
          {getFieldDecorator('username', {
            rules: [
                { required: true, message: '请输入用户名!' },
                { min: 6, message: '用户名长度不能小于6位!'},
                {pattern: /^[a-zA-Z]/,message: '用户名要以字母开头!'}
            ],
          })(
            <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="用户名" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [
                { required: true, message: '请输入密码!' },
                { min: 6, message: '密码长度不能小于6位!'},
                {pattern: /^(?=.*[a-zA-Z])(?=.*\d)/,message: '密码需包含字母和数字!'}
            ],
          })(
            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="reset-password" placeholder="密码" />
          )}
        </FormItem>
      </Form>
    );
  }
}
 
const WrappedNormalLoginForm = Form.create()(NormalLoginForm);
 
export default WrappedNormalLoginForm;