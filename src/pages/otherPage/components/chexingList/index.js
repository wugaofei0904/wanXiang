import React, { Component } from 'react';
import { Modal, Form, Icon, Input, Button, Checkbox, message, Tabs, Select, Table, Pagination } from 'antd';

import './style.scss';
import cs from 'classnames'

class ChexingCom extends Component {
    state = {
        visible: false,
        username: '',

    };

    toggleList = () => {

        let { visible } = this.state;
        console.log(!visible)
        this.setState({
            visible: !visible
        })
    }


    render() {
        let { visible } = this.state;
        return (
            <div className="chexing_list flex-hc">
                <span onClick={this.toggleList} className="header_text flex-1">全部车型</span>
                <div className={cs("position_box", { "show": visible })}>
                    <div className="chexing_list_box">

                        <div className="chexing_item flex-hc">
                            <div className="check_box checked"> </div>
                            <div className="item_text flex-1">全部车型</div>
                        </div>

                        <div className="year_item">2019款</div>
                        <div className="chexing_item flex-hc">
                            <div className="check_box checked"> </div>
                            <div className="item_text flex-1">2019款 35 TFSI 进取型</div>
                        </div>
                        <div className="chexing_item flex-hc">
                            <div className="check_box"> </div>
                            <div className="item_text flex-1">2019款 35 TFSI 进取型</div>
                        </div>
                        <div className="chexing_item flex-hc">
                            <div className="check_box"> </div>
                            <div className="item_text flex-1">2019款 35 TFSI 进取型进取型进取型</div>
                        </div>
                        <div className="chexing_item flex-hc">
                            <div className="check_box"> </div>
                            <div className="item_text flex-1">2019款 35 TFSI 进取型</div>
                        </div>
                        <div className="year_item">2019款</div>
                        <div className="chexing_item flex-hc">
                            <div className="check_box"> </div>
                            <div className="item_text flex-1">2019款 35 TFSI 进取型</div>
                        </div>

                        <div className="btn_bottom">
                            <div className="btn_cancel">取消</div>
                            <div className="btn_submit">确定</div>
                        </div>
                    </div>
                </div>
            </div >
        );
    }
}

export default ChexingCom;