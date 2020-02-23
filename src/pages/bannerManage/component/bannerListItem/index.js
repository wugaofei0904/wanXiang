import React, { Component } from 'react';
import { Button, Icon } from 'antd';

import './style.css';

export default class BannerListItem extends Component {
  constructor (props) {
    super(props)
  }

  editItem () {

  }

  render () {
    console.log(this.props)
    const { imgUrl, title, effectTime, id} = this.props.data
    const { index, listLength, changeItem } = this.props
    return (
      <div className="bannerListItem">
        <div className="w_150_n">{ index }</div>
        <div className="text_center width_120_n">
            <img className="width_120_n" src={ imgUrl }></img>
        </div>
        <div className="flex_1 text_center">
            { title }
        </div>
        <div className="text_center  w_150_n">
            { effectTime }
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