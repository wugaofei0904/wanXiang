import React, { Component } from 'react';
import { Button } from 'antd';
import './style.css';

import { withRouter } from 'react-router-dom';

import ToastComponent from '../../../../components/toastComponent';
import { articleEdit } from '../../../../utils/fetchApi';

class CommodityItem extends Component {

    constructor(props) {
        super(props);
        this.state = {
            itemData: this.props.data,
            status: 1,  //1 已发布 2 已删除
            tagList: this.props.data.tags.split(',') || []  //领域list
        };
    }

    addTag = () => {
        this.refs['toast'].showModal();
    }


    getTagid = (tag) => {
        // debugger
        // let newtagList = this.state.tagList;
        // newtagList.push(tag.name)
        this.addOrDelTag(tag.name || tag.tagName, 1);
        this.refs['toast'].initModal();
    }

    //文章标签添加删除
    addOrDelTag = (item, type) => {
        let { itemData, tagList } = this.state;
        if (type == 0) {
            tagList.remove(item);
        } else {
            tagList.push(item);
        }
        let _this = this;
        let _tags = tagList.join(',');
        fetch(`${articleEdit}?id=${itemData.id}&tags=${_tags}`)
            .then(function (response) {
                return response.json()
            }).then(function (json) {
                if (json.success) {
                    console.log('操作成功')
                    _this.setState({
                        tagList: tagList
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

    //文章编辑 删除、还原   type 1还原 2删除
    articleEditFunc = item => {
        // debugger
        let _this = this;
        let { itemData } = this.state;
        let _status = item.status == 1 ? 2 : 1;
        fetch(`${articleEdit}?id=${item.id}&status=${_status}`)
            .then(function (response) {
                return response.json()
            }).then(function (json) {

                if (json.success) {
                    _this.setState({
                        itemData: {
                            ...itemData,
                            status: itemData.status == '1' ? '2' : '1'
                        }
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

    editArticle = (data) => {

        console.log(123)
        // debugger
        // localStorage.setItem('edit_article', JSON.stringify(data))
        // this.props.history.push({ pathname: "/editPage/" + data.id });
        // this.props.history.push({
        //     pathname: '/editPage/1', state: {
        //         id: data.id
        //     }
        // })
    }

    render() {

        // console.log(this.props.data, '23')
        let { data } = this.props;
        console.log(data, 'http://localhost:3000/open/ad/ad-page-list?pageSize=20&pageNum=1')
        let { itemData, tagList } = this.state;

        let _tagList = itemData.tags.split(',');
        return (
            <div className="article_item">
                <ToastComponent getTagid={this.getTagid} ref="toast" />
                <div className="article_item_head">
                    <div className="articleTable_header_text w_160">
                        <p className="article_item_title">{data.goodsTag}</p>

                    </div>
                    <div className="articleTable_header_text w_180">
                        <img className="fm_logo_ad" src={data.goodsPic} />
                    </div>
                    <div className="articleTable_header_text pad_r_20 w_160">{data.goodsTitle}</div>
                    <div className="articleTable_header_text pad_r_20 w_280">{data.reason}</div>
                    <div className="articleTable_header_text w_80">
                        {data.price}/{data.salesPrice}
                    </div>
                    <div className="articleTable_header_text w_80">
                        {data.salePoint}
                    </div>
                    <div className="articleTable_header_text w_80">
                        <div className="m_b_4">
                            <Button onClick={this.editArticle.bind(null, data)} className="edit_article_btn">编辑</Button>
                        </div>
                        {
                            itemData.status == 1 ? <div><Button onClick={this.articleEditFunc.bind(null, itemData)} type="danger">下线</Button></div> : <Button onClick={this.articleEditFunc.bind(null, itemData)} type="primary">上线</Button>
                        }
                    </div>
                </div>
                <div className="article_item_bq_list m_t_16">
                    <div className="article_item_bq_list_item">{data.tags}</div>
                    <div className="article_item_bq_list_item">{data.authors}</div>
                    <div className="article_item_bq_list_item">{data.articleNum}篇文章</div>
                </div>
            </div>
        );
    }
}

export default withRouter(CommodityItem);