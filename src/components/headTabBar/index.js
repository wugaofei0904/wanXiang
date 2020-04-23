import React, { Component } from 'react';
import { Button } from 'antd';
import { Menu, Icon } from 'antd';
import { withRouter } from 'react-router-dom';
class HeaderTabbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            current: props.current
        };
    }
    handleClick = e => {
        this.props.history.push(e.key);
        // let _router = '';
        // switch (e.key) {
        //     case 'article':
        //         _router = 'articleManage';
        //         break;
        //     case 'comment':
        //         _router = 'commentManage';
        //         break;
        //     case 'anthor':
        //         _router = 'anthorManage';
        //         break;
        //     case 'action':
        //         _router = 'actionHistory';
        //         break;
        //     case 'commodity':
        //         _router = 'commoditySet';
        //         break;
        //     case 'banner':
        //         _router = 'bannerManage';
        //         break;
        //     case 'cost':
        //         _router = 'costCenter';
        //         break;
        // }
        // this.props.history.push(_router)
    };
    compare = property=>{
        return function(a,b){
            var value1 = a[property];
            var value2 = b[property];
            return value1 - value2;
        }
    };
    render() {
        let authority = JSON.parse(sessionStorage.getItem("authority"));
        authority = authority.sort(this.compare("sort"));
        for(let i in authority){
            if(authority[i].menuIndex === '/authorityManage'){
                authority.splice(i,1);
                break;
            }
        }

        return (
            <Menu theme="dark" className="top_header" onClick={this.handleClick} selectedKeys={[this.state.current]} mode="horizontal">
                {
                    authority.map(item=>{
                        if(item.status == 1){
                            return <Menu.Item key={item.menuIndex.substr(1)}>{item.menuName}</Menu.Item>
                        }
                        
                    })
                }
                {/* <Menu.Item key="comment">评论管理</Menu.Item>
                <Menu.Item key="anthor">作者管理</Menu.Item>
                <Menu.Item key="action">操作管理</Menu.Item>
                <Menu.Item key="commodity">商品配置</Menu.Item>
                <Menu.Item key="banner">Banner</Menu.Item>
                <Menu.Item key="cost">成本中心</Menu.Item> */}
            </Menu>
        );
    }
}

export default withRouter(HeaderTabbar);