import React, { Component } from 'react';
import { Modal, Form, Icon, Input, Button, Checkbox, message } from 'antd';
import { withRouter } from 'react-router-dom';
import './style.css';


class LoginPageForm extends Component {
    state = {
        visible: false,
        username: '',
        password: '',
    };


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

        let { username, password } = this.state;
        if (username == '') {
            message.error('请输入账号')
            return
        }
        if (password == '') {
            message.error('请输密码')
            return
        }
        // let { username, password } = values;
        var formdata = new FormData();
        formdata.append("username", username);
        formdata.append("password", password);
        let _this = this;

        if (username != '' && password != '') {
            // fetch(`http://open.suwenyj.xyz:8080/login`, {
            fetch(`/open/login`, {
                method: 'post',
                body: formdata,
            })
                .then(function (response) {
                    return response.json()
                }).then(function (json) {

                    if (json.success) {
                        _this.props.history.push('articleManage');
                    } else {
                        message.error(json.msg);
                    }
                }).catch(function (ex) {
                    console.log('parsing failed', ex)
                })
        }

        // if (!err) {
        //     console.log('Received values of form: ', values);
        // }



        // console.log(name, pass)

        // e.preventDefault();
        // debugger
        // this.props.form.validateFields((err, values) => {

        //     let { username, password } = values;
        //     var formdata = new FormData();
        //     formdata.append("username", username);
        //     formdata.append("password", password);
        //     let _this = this;

        //     if (username != '' && password != '') {
        //         fetch(`http://open.suwenyj.xyz:8080/login`, {
        //             method: 'post',
        //             body: formdata,
        //         })
        //             .then(function (response) {
        //                 return response.json()
        //             }).then(function (json) {

        //                 if (json.success) {
        //                     _this.props.history.push('articleManage');
        //                 } else {
        //                     message.error(json.msg);
        //                 }
        //             }).catch(function (ex) {
        //                 console.log('parsing failed', ex)
        //             })
        //     }

        //     if (!err) {
        //         console.log('Received values of form: ', values);
        //     }
        // });
    };


    nameChange = e => {
        this.setState({
            username: e.target.value
        })
    }

    passChange = e => {
        this.setState({
            password: e.target.value
        })
    }

    render() {

        const { getFieldDecorator } = this.props.form;

        return (
            <div className="loginPage">
                <img className="bg_img" src="./../../img/login_bg.jpg" />
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


                    <Input
                        className="name_input"
                        onChange={this.nameChange}
                        prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                        placeholder="请输入用户名"
                    />

                    <Input
                        onChange={this.passChange}
                        prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                        type="password"
                        placeholder="请输入密码"
                    />

                    <div className="btn_container">
                        <Button onClick={this.handleSubmit} type="primary" width="120" className="login-form-button">  登录 </Button>
                    </div>

                    {/* <Form className="login-form">
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
                            <Button onClick={this.handleSubmit} type="primary" width="120" htmlType="submit" className="login-form-button">  登录 </Button>
                        </div>

                    </Form> */}

                </div>

            </div>
        );
    }
}

const LoginPage = Form.create({ name: 'normal_login' })(LoginPageForm)

export default withRouter(LoginPage);