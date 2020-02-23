import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Button } from "antd";
import "./style.css";

import HeaderTabbar from "../../components/headTabBar";
import BannerModal from "./component/addBanner";
import BannerListItem from './component/bannerListItem';

// import { adpageList } from "./../../utils/fetchApi";

class BannerManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bannerList: [
        {
          id: 123,
          imgUrl: 'https://pub.suwenyj.xyz/headimg/1581685252434.jpg',
          title: '古代没有空调, 如eee何降温避暑? 康熙的方法最奢侈',
          effectTime: '2020-02-14 21:00:54',
        },
        {
          id: 12344,
          imgUrl: 'https://pub.suwenyj.xyz/headimg/1581685252434.jpg',
          title: '古代没有空调, 如何降温ttt避暑? 康熙的方法最奢侈',
          effectTime: '2020-02-14 21:00:54',
        },
        {
          id: 12355,
          imgUrl: 'https://pub.suwenyj.xyz/headimg/1581685252434.jpg',
          title: '古代没有空调, 如何降温避666暑? 康熙的方法最奢侈',
          effectTime: '2020-02-14 21:00:54',
        },
        {
          id: 12366,
          imgUrl: 'https://pub.suwenyj.xyz/headimg/1581685252434.jpg',
          title: '古代没有空调, 如何降温避777暑? 康熙的方法最奢侈',
          effectTime: '2020-02-14 21:00:54',
        }
      ],
      isShowBannerModal: false
    }
    this.addBanner = this.addBanner.bind(this);
    this.changeBannerItem = this.changeBannerItem.bind(this);
  }

  addBanner() {

  }

  fetch() {}

  // 编辑banner
  changeBannerItem (type, id) {
    console.log(type, id)
    if (type === 'edit') {
      let { bannerList } = this.state;
      let itemData = ''
      bannerList.forEach(item => {
        if (item.id === id) itemData = item
      })
      this.setState({ editItemData: itemData, isShowBannerModal: true })
    }
  }

  render() {
    const { bannerList, isShowBannerModal, editItemData } = this.state
    const { changeBannerItem } = this
    return (
      <div className="appPage">
        <HeaderTabbar current="banner" />
        <div class="bannerManage">
          <div className="addBanner_btn">
            <Button onClick={this.addBanner} type="primary">
              新配置
            </Button>
          </div>
          <BannerModal visible={ isShowBannerModal } data={ editItemData } />
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
