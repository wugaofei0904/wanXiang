import React, { Component } from 'react';
import { Button } from 'antd';
import './style.css';

class ArticleItem extends Component {

    render() {
        return (
            <div className="article_item">
                <div className="article_item_head">
                    <div className="articleTable_header_text w_280">
                        <p className="item_title">关于麻醉的种种真想</p>
                        <div className="y_z_num">阅读：0 点赞：0</div>
                    </div>
                    <div className="articleTable_header_text w_180">
                        <img className="fm_logo" src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1571247881954&di=dc65a607807f71f3b00a79c71ff2f9da&imgtype=0&src=http%3A%2F%2Fwx2.sinaimg.cn%2Fcrop.0.0.1797.1009.1000%2F005NLzplly1fvf2rfe838j31jm0s2gv8.jpg" />
                    </div>
                    <div className="articleTable_header_text w_160">飞飞飞</div>
                    <div className="articleTable_header_text w_160">发布成功</div>
                    <div className="articleTable_header_text w_160">
                        <div>2019-10-19</div>
                        <div>23:52:45</div>
                    </div>
                    <div className="articleTable_header_text w_160">
                        <div className="m_b_4">
                            <Button>编辑</Button>
                        </div>
                        {/* <Button type="primary">还原</Button> */}
                        <div><Button type="danger">删除</Button></div>
                    </div>
                </div>
                <div className="article_item_bq_list m_t_16">
                    <div className="article_item_bq_list_item">标签1</div>
                    <div className="article_item_bq_list_item">标签1</div>
                    <div className="article_item_bq_list_item">标签1</div>
                    <div className="article_item_bq_list_item">标签1</div>
                    <div className="article_item_bq_list_item">标签1</div>
                    <div className="article_item_bq_list_item">+添加标签</div>
                </div>
            </div>
        );
    }
}

export default ArticleItem;