import React, { Component } from 'react';
import { Modal, Form, Icon, Input, Button, Checkbox ,message} from 'antd';
import { withRouter } from 'react-router-dom';
import './style.css';


class LoginPageForm extends Component {
    state = { visible: false };


    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    handleOk = e => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };

    handleCancel = e => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };

    handleSubmit = e => {
        e.preventDefault();
        // debugger
        this.props.form.validateFields((err, values) => {

            let { username, password } = values;
            var formdata = new FormData();
            formdata.append("username", username);
            formdata.append("password", password);
            let _this = this;

            if (username != '' && password != '') {
                fetch(`http://open.suwenyj.xyz:8080/login`, {
                    method: 'post',
                    body: formdata,
                })
                    .then(function (response) {
                        return response.json()
                    }).then(function (json) {
                        if(json.success){
                            _this.props.history.push('articleManage');
                        }else{
                            message.error(json.msg);
                        }           
                    }).catch(function (ex) {
                        console.log('parsing failed', ex)
                    })
            }

            console.log(values)

            // this.props.history.push('articleManage');
            // this.showModal();
            if (!err) {
                console.log('Received values of form: ', values);
            }
        });
    };

    render() {

        const { getFieldDecorator } = this.props.form;

        return (
            <div className="loginPage">

                <Modal
                    title="错误"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <div className="error_info">
                        <Icon type="info-circle" className="m_r_12" style={{ fontSize: '16px', color: '#ff552e' }} />
                        <p>请输入正确的账号和密码！</p>
                    </div>

                </Modal>

                <div className="login_container">
                    <div className="login_title">管理员登录</div>
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <Form.Item>
                            {getFieldDecorator('username', {
                                rules: [{ required: true, message: '请输入用户名!' }],
                            })(
                                <Input
                                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    placeholder="请输入用户名"
                                />,
                            )}
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator('password', {
                                rules: [{ required: true, message: '请输入密码!' }],
                            })(
                                <Input
                                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    type="password"
                                    placeholder="请输入密码"
                                />,
                            )}
                        </Form.Item>
                        <div className="btn_container">
                            <Button type="primary" width="120" htmlType="submit" className="login-form-button">  登录 </Button>
                        </div>

                    </Form>

                </div>

            </div>
        );
    }
}

const LoginPage = Form.create({ name: 'normal_login' })(LoginPageForm)

export default withRouter(LoginPage);