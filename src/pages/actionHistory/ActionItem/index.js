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
                        <div className="y_z_num">作者：飞飞飞</div>
                    </div>                
                    <div className="articleTable_header_text w_180">授权代发</div>
                    <div className="articleTable_header_text w_160">无</div>
                    <div className="articleTable_header_text w_160">
                        <div>2019-10-19</div>
                        <div>23:52:45</div>
                    </div>
                    <div className="articleTable_header_text w_160">飞飞飞</div>
                </div>            
            </div>
        );
    }
}

export default ArticleItem;