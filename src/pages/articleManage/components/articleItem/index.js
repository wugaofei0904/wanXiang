import React, { Component } from 'react';
import { Button } from 'antd';
import './style.css';

import ToastComponent from './../../../../components/toastComponent';
import { articleEdit } from './../../../../utils/fetchApi';

class ArticleItem extends Component {

    constructor(props) {
        super(props);
        this.state = {
            itemData: this.props.data,
            status: 1,  //1 已发布 2 已删除
            tagList: ['生活', '生活', '生活', '生活']  //领域list
        };
    }

    addTag = () => {
        this.refs['toast'].showModal();
    }


    getTagid = (tag) => {
        let newtagList = this.state.tagList;
        newtagList.push(tag.name)
        this.setState({
            tagList: newtagList
        })
        this.refs['toast'].initModal();
    }

    //文章编辑 删除、还原   type 1还原 2删除
    articleEditFunc = item => {
        let _this = this;
        let { itemData } = this.state;  
        fetch(`${articleEdit}?id=${item.id}`)
            .then(function (response) {
                return response.json()
            }).then(function (_json) {

                let json = {
                    "data": null,
                    "total": null,
                    "success": true,
                    "msg": "成功"
                }
                if (json.success) {
                    _this.setState({
                        itemData: {
                            ...itemData,
                            status: itemData.status == '1' ? '2' : '1'
                        }
                    })
                }
            }).catch(function (ex) {
                console.log('parsing failed', ex)
            })
    }

    render() {
        let { itemData } = this.state;
        // let { data } = this.props;
        let _tagList = itemData.tags.split(',');
        // console.log(data)
        return (
            <div className="article_item">
                <ToastComponent getTagid={this.getTagid} ref="toast" />
                <div className="article_item_head">
                    <div className="articleTable_header_text w_280">
                        <p className="article_item_title">{itemData.title}</p>
                        <div className="y_z_num">阅读：{itemData.readNum} 点赞：{itemData.likeNum}</div>
                    </div>
                    <div className="articleTable_header_text w_180">
                        <img className="fm_logo" src={itemData.picUrl} />
                    </div>
                    <div className="articleTable_header_text w_160">{itemData.authorName}</div>
                    <div className="articleTable_header_text w_160">{itemData.status == 1 ? '发布成功' : '已删除'}</div>
                    <div className="articleTable_header_text w_160">
                        <div>{itemData.updateTime.split('T')[0]}</div>
                        <div>{itemData.updateTime.split('T')[1].split('.')[0]}</div>
                    </div>
                    <div className="articleTable_header_text w_160">
                        <div className="m_b_4">
                            <Button>编辑</Button>
                        </div>
                        {
                            itemData.status == 1 ? <div><Button onClick={this.articleEditFunc.bind(null, itemData)} type="danger">删除</Button></div> : <Button onClick={this.articleEditFunc.bind(null, itemData)} type="primary">还原</Button>
                        }
                    </div>
                </div>
                <div className="article_item_bq_list m_t_16">
                    {
                        _tagList.map((item) => {
                            return <div className="article_item_bq_list_item">{item}</div>
                        })
                    }
                    <div onClick={this.addTag} className="article_item_bq_list_item">+添加标签</div>
                </div>
            </div>
        );
    }
}

export default ArticleItem;