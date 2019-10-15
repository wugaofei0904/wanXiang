import React, { Component } from 'react';
import { Button } from 'antd';
import './style.css';
import HeaderTabbar from '../../components/headTabBar/index';

class ActionHistory extends Component {
  render() {
    return (
      <div className="App">
         <HeaderTabbar current='action' />
        ActionHistory
      </div>
    );
  }
}

export default ActionHistory;