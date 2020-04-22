import React, { Component } from 'react';
import { Button } from 'antd';
import './style.css';

import { withRouter } from 'react-router-dom';
import CommpToast from './../editToast'
import ToastComponent from '../../../../components/toastComponent';
import { articleEdit, adChangeStatus } from '../../../../utils/fetchApi';

class CommodityItem extends Component {

    constructor(props) {
        super(props);
        this.state = {
            itemData: this.props.data,
            status: 1,  //1 已发布 2 已删除
            tagList: this.props.data.tags.split(',') || []  //领域list
        };
        this.showEditSet = this.showEditSet.bind(this);
    }

    showEditSet(data) {
        this.commpToast.showModal(data);
    }

    addTag = () => {
        this.refs['toast'].showModal();
    }


    //文章编辑 删除、还原   type 1还原 2删除
    articleEditFunc = item => {

        let _this = this;
        let { itemData } = this.state;
        let _status = item.status == 1 ? 0 : 1;

        console.log(_status)
        fetch(`${adChangeStatus}?id=${item.id}&status=${_status}`)
            .then(function (response) {
                return response.json()
            }).then(function (json) {

                if (json.success) {
                    _this.setState({
                        itemData: {
                            ...itemData,
                            status: itemData.status == '1' ? '0' : '1'
                        }
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
        let { data } = this.props;
        // console.log(data, 'http://localhost:3000/open/ad/ad-page-list?pageSize=20&pageNum=1')
        let { itemData } = this.state;
        let _pointList = []
        if ( data.salePoint && data.salePoint != '') {
            // debugger
            _pointList = data.salePoint.split(',');
        }


        return (
            <div className="article_item">
                <CommpToast searchList={this.props.searchList} ref={(commpToast) => { this.commpToast = commpToast }} />
                <div className="article_item_head">
                    <div className="articleTable_header_text w_160">
                        <p className="article_item_title">{data.goodsTag}</p>
                    </div>
                    <div className="articleTable_header_text w_160">
                        <img className="fm_logo_ad" src={data.goodsPic} />
                    </div>
                    <div className="articleTable_header_text pad_r_20 w_160">{data.goodsTitle}</div>
                    <div className="articleTable_header_text pad_r_20 w_280">{data.reason}</div>

                    <div className="articleTable_header_text w_74 pad_r_20">
                        {
                            _pointList.map(item => <div className="point_item_n">{item}</div>)
                        }
                    </div>
                    <div className="articleTable_header_text w_74">
                        {data.salesPrice}/{data.price}
                    </div>
                    <div className="articleTable_header_text w_74">
                        {data.offlineTime}
                    </div>
                    <div className="articleTable_header_text w_68 text_center">
                        {data.readNum}
                    </div>
                    <div className="articleTable_header_text w_68 m_l_20">
                        <div className="m_b_4">
                            <Button onClick={this.showEditSet.bind(null, data)} className="edit_article_btn">编辑</Button>
                        </div>
                        {
                            itemData.status == 1 ? <div><Button onClick={this.articleEditFunc.bind(null, itemData)} type="danger">下线</Button></div> : <Button onClick={this.articleEditFunc.bind(null, itemData)} type="primary">上线</Button>
                        }
                    </div>
                </div>
                <div className="article_item_bq_list m_t_16">
                    {
                        data.tags != '' &&
                        <div className="article_item_bq_list_item">{data.tags}</div>
                    }
                    {
                        data.authors != '' &&
                        <div className="article_item_bq_list_item">{data.authors}</div>
                    }

                    {
                        data.articleNum != 0 && <div className="article_item_bq_list_item">{data.articleNum}篇文章</div>
                    }

                </div>
            </div>
        );
    }
}

export default withRouter(CommodityItem);