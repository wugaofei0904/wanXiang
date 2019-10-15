import React, { Component } from 'react';
import { Button } from 'antd';
import './style.css';
import HeaderTabbar from '../../components/headTabBar/index';

class ArticleManage extends Component {
  render() {
    return (
      <div className="App">
         <HeaderTabbar current='anthor' />
        ArticleManage
      </div>
    );
  }
}

export default ArticleManage;