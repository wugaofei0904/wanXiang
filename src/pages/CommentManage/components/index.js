import React, { Component } from 'react';
import { Button } from 'antd';
import './style.css';

import { withRouter } from 'react-router-dom';

import ToastComponent from './../../../components/toastComponent';
import { deleteComment } from './../../../utils/fetchApi';

class CommentItem extends Component {

    constructor(props) {
        super(props);
        this.state = {
            itemData: this.props.data,
            commentList: this.props.commentList
        };
    }

    delComment = (data) => {
        // debugger
        let {commentList,adlist } = this.state;
        console.log(commentList);
        const id = data.id;
        // console.log(id,inedx);
        commentList.remove(data);
        return;
        // adlist.remove(adlist[inedx]);
        let _this = this;
        // let _tags = tagList.join(',');
        fetch(`${deleteComment}?id=${id}`)
            .then(function (response) {
                return response.json()
            }).then(function (json) {
                if (json.success) {
                    console.log('操作成功')
                    _this.setState({
                        adlist: adlist
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
                    <div className="articleTable_header_text w_280">{itemData.body}</div>
                    <div className="articleTable_header_text w_180">{itemData.articleName}</div>
                    <div className="articleTable_header_text w_100">{itemData.createTime.substr(0,10)}<br/>{itemData.createTime.substr(11)}</div>
                    <div className="articleTable_header_text w_100">{itemData.likeNum}</div>
                    <div className="articleTable_header_text w_100">{itemData.appName}</div>
                    <div className="articleTable_header_text w_100">
                        <div className="m_b_4">
                            <Button type="danger"  onClick={this.delComment.bind(null, data)} className="delete_comment_btn">删除</Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(CommentItem);