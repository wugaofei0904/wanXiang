import React, { Component } from 'react';
import { Button } from 'antd';
import { Menu, Icon } from 'antd';
import { withRouter } from 'react-router-dom';
class HeaderTabbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            current: props.current,
        };
    }


    handleClick = e => {
        let _router = '';
        switch (e.key) {
            case 'article':
                _router = 'articleManage';
                break;
            case 'anthor':
                _router = 'anthorManage';
                break;
            case 'action':
                _router = 'actionHistory';
                break;
            case 'commodity':
                _router = 'commoditySet';
                break;
            case 'banner':
                _router = 'bannerManage';
                break;    
        }
        this.props.history.push(_router)
    };

    render() {
        return (
            <Menu theme="dark" className="top_header" onClick={this.handleClick} selectedKeys={[this.state.current]} mode="horizontal">
                <Menu.Item key="article">文章管理</Menu.Item>
                <Menu.Item key="anthor">作者管理</Menu.Item>
                <Menu.Item key="action">操作管理</Menu.Item>
                <Menu.Item key="commodity">商品配置</Menu.Item>
                <Menu.Item key="banner">Banner</Menu.Item>
            </Menu>
        );
    }
}

export default withRouter(HeaderTabbar);