import React, { Component } from 'react';
import { Button, Checkbox, Modal } from 'antd';
// import { ExclamationCircleOutlined } from '@ant-design/icons';
import './style.css';
import { editUser,deleteUser } from './../../../utils/fetchApi';

class AuthorityItem extends Component {
    constructor(props) {
        super(props);
    }
    // 修改下线上线状态
    changeLine = (userId,status) => {
        fetch(`${editUser}?id=${userId}&status=${Math.abs(status-1)}`)
        .then( response => {
            return response.json()
        }).then(json => {
        if (json.success) {
            this.props.changeStatus(userId,Math.abs(status-1))
        }else if (json.msg == '未登录') {
            window.initLogin();
        }
        })
    }
    // 删除
    deleteAuthority = userId => {
        Modal.confirm({
            title: '警告',
            content: '您确认删除该用户？',
            okText: '确认',
            cancelText: '取消',
            onOk:()=>{
                fetch(`${deleteUser}?userId=${userId}`)
                .then( response => {
                    return response.json()
                }).then(json => {
                    if (json.success) {
                        this.props.deleteLine(userId)
                    }else if (json.msg == '未登录') {
                        window.initLogin();
                    }
                })
            }
        });

        
    }
    // 权限改变
    menuChange(userid,e){
        this.props.onChange(userid,e)
    }
    render() {
        let { data } = this.props;


        return (
            <div className="authority_item">
                <div className="article_item_head">
                    <div className="articleTable_header_text w_180">
                    {data.userName}
                    </div>
                    <Checkbox.Group className="display-flex"  onChange={this.menuChange.bind(this,data.id)} name={String(data.id)} defaultValue={
                        data.menus.map(per=>{
                            return String(per.menuId);
                        })
                    }
                    >
                        {
                            data.menuList.map(manu=>{
                                return <div className="articleTable_header_text w_100 check_wrap" key={manu.id}><Checkbox value={String(manu.id)}/></div>
                            })
                        }
                    </Checkbox.Group>
                    <div className="articleTable_header_text w_160">{data.status?'正常':'下线'}</div>
                    <div className="articleTable_header_text w_160">
                        <Button type={data.status==1?'danger':'primary'}  onClick={this.changeLine.bind(null, data.id,data.status)} className="delete_comment_btn m_r_12">{data.status==1?'下线':'上线'}</Button>
                        <Button type='danger'  onClick={this.deleteAuthority.bind(null, data.id)} className="delete_comment_btn">删除</Button>
                    </div>
                </div>
            </div>
        );
    }
}

export default AuthorityItem;