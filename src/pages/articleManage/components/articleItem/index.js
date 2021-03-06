import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button,message } from 'antd';
import './style.css';

import { withRouter } from 'react-router-dom';

import ToastComponent from './../../../../components/toastComponent';
import { articleEdit, deleteAdBq } from './../../../../utils/fetchApi';

class ArticleItem extends Component {

    constructor(props) {
        super(props);
        this.state = {
            itemData: this.props.data,
            adlist: this.props.data.ads,
            status: 1,  //1 已发布 2 已删除 3 待发布
            tagList: this.props.data.tags.split(',') || []  //领域list
        };

    }

    componentWillReceiveProps(props, oldProps){
        this.setState({
            itemData:props.data,
            adlist:props.data.ads,
            tagList: props.data.tags.split(',')
        })
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
                } else if (json.code == '506') {
                    alert(json.msg)
                    window.initLogin();
                } else {
                    alert(json.msg)
                }
            }).catch(function (ex) {
                console.log('parsing failed', ex)
            })
    }

    delAd = (id,inedx) => {
        // debugger
        let { itemData, adlist } = this.state;
        adlist.remove(adlist[inedx]);
        let _this = this;
        // let _tags = tagList.join(',');
        fetch(`${deleteAdBq}?adId=${id}&articleId=${itemData.id}`)
            .then(function (response) {
                return response.json()
            }).then(function (json) {
                if (json.success) {
                    console.log('操作成功')
                    _this.setState({
                        adlist: adlist
                    })
                } else if (json.code == '506') {
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
        let _status = (item.status == 1 || item.status==3 )? 2 : 1;

        fetch(`${articleEdit}?id=${item.id}&status=${_status}`)
            .then(function (response) {
                return response.json()
            }).then(function (json) {

                if (json.success) {
                    message.success(_status===2?'删除成功':'还原成功')
                    if(item.status==3){        //如果是待发布 刷新列表
                        let page=_this.props.pageNum
                            _this.props.searchListdata(page)
                    }else{
                        _this.setState({
                            itemData: {
                                ...itemData,
                                status: itemData.status == '1' ? '2' : '1'
                            }
                        })
                    }
                } else if (json.code == '506') {
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

        console.log(data)
        // debugger
        // localStorage.setItem('edit_article', JSON.stringify(data))
        this.props.history.push({ pathname: "/editPage/" + data.id });
        // this.props.history.push({
        //     pathname: '/editPage/1', state: {
        //         id: data.id
        //     }
        // })
    }

    // Interactive(props)
    // 跳转到评论列表

    render() {

        // console.log(this.props.data, '23')
        let { data } = this.props;
        let { itemData, tagList } = this.state;

        let _tagList = itemData.tags.split(',');
        let _adList = itemData.ads;
        return (
            <div className="article_item">
                <ToastComponent getTagid={this.getTagid} ref="toast" />
                <div className="article_item_head">
                    <div className="articleTable_header_text w_280">
                        <p className="article_item_title">{itemData.title}</p>
                        <div className="y_z_num">阅读：{itemData.readNum} 点赞：{itemData.likeNum}  <Link to={`/commentManage?articleId=${itemData.id}&articleTitle=${encodeURIComponent(itemData.title)}`} className={`hudong ${itemData.commentNum>0?'active':''}`}>互动：{itemData.commentNum}</Link></div>
                    </div>
                    <div className="articleTable_header_text w_180">
                        <img className="fm_logo" src={itemData.picUrl.split(',')[0]} />
                    </div>
                    <div className="articleTable_header_text w_160">{itemData.authorName}</div>
                    {itemData.status == 3 ?
                        <div className="articleTable_header_text w_160">待发布</div>
                    :
                    <div className="articleTable_header_text w_160">{itemData.status == 1 ? '发布成功' : '已删除'}{itemData.isTop == undefined ? '' : (itemData.isTop == '1' ? ' | 时效' : ' | 非时效')} </div>}
                    <div className="articleTable_header_text w_160">
                        <div>{itemData.publishTime}</div>
                        {/* <div>{itemData.updateTime.split('T')[1].split('.')[0]}</div> */}
                    </div>
                    <div className="articleTable_header_text w_160">
                        <div className="m_b_4">
                            <Button onClick={this.editArticle.bind(null, data)} className="edit_article_btn">编辑</Button>
                        </div>
                        {
                            (itemData.status == 1 || itemData.status == 3) ? <div><Button onClick={this.articleEditFunc.bind(null, itemData)} type="danger">删除</Button></div> : <Button onClick={this.articleEditFunc.bind(null, itemData)} type="primary">还原</Button>
                        }
                    </div>
                </div>
                <div className="article_item_bq_list m_t_16">
                    {
                        tagList.map((item) => {
                            return <div className="article_item_bq_list_item">
                                {item}
                                <div onClick={this.addOrDelTag.bind(null, item, 0)} className="tags_close_btn"></div>
                            </div>
                        })
                    }
                    <div onClick={this.addTag} className="article_item_bq_list_item">+添加标签</div>
                    |
                    {
                        _adList.map((item,idx) => {
                            return <div className="article_item_bq_list_item bg_blue">
                                {item.goodsTag}
                                <div onClick={this.delAd.bind(null, item.id,idx)} className="tags_close_btn"></div>
                            </div>
                        })
                    }

                </div>
            </div>
        );
    }
}

export default withRouter(ArticleItem);
