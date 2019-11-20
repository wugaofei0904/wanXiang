import React, { Component } from 'react';
import { Button } from 'antd';
import './style.css';

class ArticleItem extends Component {

    render() {
        let { data } = this.props;

        let text = '';
        switch (data.type) {
            case '0':
                text = '作者创建';
                break;
            case '1':
                text = '作者编辑';
                break;
            case '2':
                text = '作者删除';
                break;
            case '3':
                text = '文章发布';
                break;
            case '4':
                text = '文章代发';
                break;
            case '5':
                text = '文章删除';
                break;
        }

        let time = data.createTime;
        // let time2 = data.createTime.split('T')[1].split('.')[0];


        return (
            <div className="article_item">
                <div className="article_item_head">
                    <div className="articleTable_header_text w_280">
                        <p className="articleTable_item_title">{data.tdesc}</p>
                        <div className="y_z_num">{data.remark}</div>
                    </div>
                    <div className="articleTable_header_text w_180">{text}</div>
                    {/* <div className="articleTable_header_text w_160">无</div> */}
                    <div className="articleTable_header_text w_160">
                        <div>{time}</div>
                        {/* <div>{time2}</div> */}
                    </div>
                    <div className="articleTable_header_text w_160">{data.userId}</div>
                </div>
            </div>
        );
    }
}

export default ArticleItem;