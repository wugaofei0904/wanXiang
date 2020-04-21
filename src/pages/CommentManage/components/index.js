import React, { Component } from 'react';
import { Button } from 'antd';
import './style.css';

import { withRouter } from 'react-router-dom';

import ToastComponent from '../../../components/toastComponent';
import { deleteComment,recoverComment } from '../../../utils/fetchApi';

class CommentItem extends Component {

    constructor(props) {
        super(props);
        this.state = {
            itemData: this.props.data,
            commentList: this.props.commentList
        };
    }

    delComment = (data) => {
        let {commentList } = this.state;
        const id = data.id;
        

        if(data.status == 0){
            fetch(`${deleteComment}?id=${id}`)
            .then(function (response) {
                return response.json()
            }).then(function (json) {
                if (json.success) {
                    data.status = 1;
                    commentList.changeDelete(JSON.parse(JSON.stringify(data)));
                } else if (json.msg == '未登录') {
                    alert(json.msg)
                    window.initLogin();
                } else {
                    alert(json.msg)
                }
            }).catch(function (ex) {
                console.log('parsing failed', ex)
            })
        }else{
            fetch(`${recoverComment}?id=${id}`)
            .then(function (response) {
                return response.json()
            }).then(function (json) {
                if (json.success) {
                    data.status = 0;
                    commentList.changeDelete(JSON.parse(JSON.stringify(data)));
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
    }

    render() {

        // console.log(this.props.data, '23')
        let { data } = this.props;
        let { itemData } = this.state;
        return (
            <div className="comment_item">
                <ToastComponent getTagid={this.getTagid} ref="toast" />
                <div className="article_item_head">
                    <div className="articleTable_header_text w_100">
                        <p className="articleTable_header_text">{itemData.nickname}</p>
                    </div>
                    <div className="articleTable_header_text w_100">
                        {itemData.typeName}
                    </div>
                    <div className="articleTable_header_text w_400 p_l_10">{itemData.body}</div>
                    <div className="articleTable_header_text w_180">{itemData.articleName}</div>
                    <div className="articleTable_header_text w_100">{itemData.createTime.substr(0,10)}<br/>{itemData.createTime.substr(11)}</div>
                    <div className="articleTable_header_text w_100">{itemData.likeNum}</div>
                    <div className="articleTable_header_text w_100">{itemData.appName}</div>
                    <div className="articleTable_header_text w_100">
                        <div className="m_b_4">
                            <Button type={itemData.status==0?'danger':'primary'}  onClick={this.delComment.bind(null, data)} className="delete_comment_btn">{itemData.status==0?'删除':'恢复'}</Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(CommentItem);