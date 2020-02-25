import React, { Component } from 'react';
import { Button, Icon } from 'antd';
import moment from 'moment';

import './style.css';

const DATEFORMAT = "YYYY-MM-DD HH:mm:ss";

export default class BannerListItem extends Component {
  // eslint-disable-next-line no-useless-constructor
  constructor (props) {
    super(props)
  }

  editItem () {

  }

  render () {
    let { id, order, startTime, title, imageUrl, createTime} = this.props.data
    const { index, listLength, changeItem } = this.props
    createTime = moment(createTime).format(DATEFORMAT);
    if(title.length > 20) {
      title = title.substr(0, 21) + '...';
    }
    return (
      <div className="bannerListItem">
        <div className="w_150_n">{ order }</div>
        <div className="text_center width_120_n">
            <img className="width_120_n" src={ imageUrl } ></img>
        </div>
        <div className="flex_1 text_center">
            { title }
        </div>
        <div className="text_center  w_150_n">
            { startTime || createTime }
        </div>
        <div className="w_200_n item-action">
          <div>
            <Button type="primary" onClick={() => changeItem('edit', id)}>编辑</Button>&nbsp;&nbsp;
            <Button type="danger" onClick={ () => changeItem('del', id) }>删除</Button>
          </div>
          <div>
            <Button 
              type="primary" 
              disabled={ index === 0 } 
              onClick={ () => changeItem('up', id) }
            ><Icon type="arrow-up" /></Button>&nbsp;&nbsp;
            <Button 
              type="primary" 
              disabled={ index === listLength - 1 }
              onClick={  () => changeItem('down', id) }
              ><Icon type="arrow-down" /></Button>
          </div>
        </div>
      </div>
    )
  }
}