import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Button, message } from "antd";
import "./style.css";

import HeaderTabbar from "../../components/headTabBar";
import BannerModal from "./component/bannerModal";
import BannerListItem from './component/bannerListItem';
import { getBannerList, deleteBanner, moveBannerOrder, addBanner, editBanner }  from "../../utils/fetchApi";

// import { adpageList } from "./../../utils/fetchApi";

class BannerManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bannerList: [],
      isShowBannerModal: false,
      isFetching: false
    }
    this.showBannerModal = this.showBannerModal.bind(this);
    this.changeBannerItem = this.changeBannerItem.bind(this);
    this.addBanner = this.addBanner.bind(this);
  }

  componentWillMount () {
    this.fetchBannerList()
  }

  fetchBannerList(messageText) {
    // message.loading('稍等，请求中...')
    if (this.state.isFetching) return;
    this.setState({isFetching: true})
    fetch(getBannerList)
    .then(res => res.json())
    .then(res => {
      const { success, data } = res;
      if (success) {
        let bannersId = data.map(item => item.id)
        this.setState({ bannerList: data, bannersId, isFetching: false});
        if (messageText) message.success(messageText);
      }
      
    })
  }

  showBannerModal() {
    this.setState({editItemData: ''})
    this.bannerModal.toggleBannerModal();
  }

  addBanner ({ articleId, title, startTime, endTime, url, imageUrl, bannerId }) {
    let _url = '';
    let text = '';
    if (bannerId) { //编辑
      _url =  `${editBanner}?id=${bannerId}&articleId=${articleId}&title=${title}&startTime=${startTime}&endTime=${endTime}&url=${url}&imageUrl=${imageUrl}`;
      text = '修改banner成功～';
    } else {
      _url = `${addBanner}?articleId=${articleId}&title=${title}&startTime=${startTime}&endTime=${endTime}&url=${url}&imageUrl=${imageUrl}`;
      text = '增加banner成功～'
    }
    fetch(_url)
    .then(res => res.json())
    .then(res => {
      if (res.success) this.fetchBannerList(text)
      this.setState({ editItemData: ''}, () => {
        this.bannerModal.toggleBannerModal();
      })
    })
    
  }

  // 编辑banner
  changeBannerItem (type, id) {
    if (this.state.isFetching) return;
    const _this = this;
    if (type === 'edit') {
      let { bannerList } = this.state;
      let itemData = ''
      bannerList.forEach(item => {
        if (item.id === id) itemData = item
      })
      this.setState({ editItemData: itemData }, () => {
        this.bannerModal.toggleBannerModal(itemData, true);
      })
    } else if (type === 'del') {
      console.log('del', id)
      fetch(`${deleteBanner}?id=${id}`)
      .then(res => res.json())
      .then(res => {
        console.log('del-res', res)
        if (res.success) {
          this.fetchBannerList('删除成功');
        }
      })
    } else if (type === 'up') {
      const { bannersId } = this.state;
      const idIndex = bannersId.indexOf(id);
      const preId = bannersId[idIndex-1];
      fetch(`${moveBannerOrder}?first=${preId}&second=${id}`)
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          _this.fetchBannerList('移动成功');
        }
      })
    } else if (type === 'down') {
      const { bannersId } = this.state;
      const idIndex = bannersId.indexOf(id);
      const afterId = bannersId[idIndex+1];
      fetch(`${moveBannerOrder}?first=${id}&second=${afterId}`)
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          _this.fetchBannerList('移动成功');
        }
      })
    }
  }

  render() {
    const { bannerList } = this.state
    const { changeBannerItem } = this
    return (
      <div className="appPage">
        <HeaderTabbar current="banner" />
        <div class="bannerManage">
          <div className="addBanner_btn">
            <Button onClick={this.showBannerModal} type="primary" disabled={ bannerList.length >= 8 }>
              新配置
            </Button>
          </div>
          {/* 增加banner */}
          <BannerModal 
            ref={ bannerModal => { this.bannerModal = bannerModal }}  
            addBanner={ this.addBanner }
            />
        </div>
        <div className="bannerList">
          <div className="articleTable_header">
            <div className="w_150_n text_center">顺序</div>
            <div className="text_center width_120_n">
              头图
            </div>
            <div className="flex_1 text_center">
              标题
            </div>
            <div className="text_center  w_150_n">
              生效时间
            </div>
            <div className="w_200_n text_center">
              操作
            </div>
          </div>
          <div className="articleTable_table_list">
            {bannerList.map((item, index) => {
              return (
                <BannerListItem
                  // searchList={_this.searchList}
                  key={item.id}
                  data={item}
                  index={index}
                  listLength={ bannerList.length }
                  changeItem={ changeBannerItem }
                />
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(BannerManage);
