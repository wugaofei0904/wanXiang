import React, { Component } from "react";
import { Modal, Tabs, Button, LocaleProvider, DatePicker, Input,
  message } from "antd";
import "./style.css";
import zh_CN from "antd/lib/locale-provider/zh_CN";
import moment from "moment";
import ArticleToast from "../../../../components/articleToast";
import ImgCropper from '../../../../components/imgCropper';
import { imgUpload, addBanner } from '../../../../utils/fetchApi';
import { randomString, dataURLtoFile } from '../../../../utils/utils';
 
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const DATEFORMAT = "YYYY-MM-DD HH:mm:ss";

class BannerModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      tabActiveKey: '1',
      articleTitleShow: false, // 文章标题显隐
      articleId: '',    // 搜索文章id
      title: '',        // 文章标题
      startTime: '', 
      endTime: '',
      effectTimeShow: "",
      adTitle: "",
      url: "",
      linkImg: "",
      imgVisible: false,
      imageUrl: "",
      imgUrl: '',
      confirmBtnStatus: true // 提交按钮的状态
    };
    this.toggleBannerModal = this.toggleBannerModal.bind(this);
    this.changeTab = this.changeTab.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleAddArticle = this.handleAddArticle.bind(this);
    this.updateArticle = this.updateArticle.bind(this);
    this.deleteArticle = this.deleteArticle.bind(this);
    this.effectTimeChange = this.effectTimeChange.bind(this);
    this.effectTimeOk = this.effectTimeOk.bind(this);
    this.addBannerOk = this.addBannerOk.bind(this);
    this.linkTitleChange = this.linkTitleChange.bind(this);
    this.linkUrlChange = this.linkUrlChange.bind(this);
    this.linkImgChange = this.linkImgChange.bind(this);
    this.imghandleOk = this.imghandleOk.bind(this);
    this.imghandleCancel = this.imghandleCancel.bind(this);
    this.changeConfirmBtn = this.changeConfirmBtn.bind(this);
  }

  componentWillReceiveProps(props, oldProps) {
    // console.log('ss', props, oldProps);
    // if (props.data) {
    //   const {
    //     id,
    //     articleId,    // 搜索文章id
    //     title,        // 文章标题
    //     startTime, 
    //     endTime,
    //     url,
    //     imageUrl
    //   } = props.data;
    //   console.log( url === '' || url === 'null' )
    //   this.setState({
    //     isEdit: true,
    //     bannerId: id,
    //     tabActiveKey: url === '' || url === 'null' ? '1' : '2' ,
    //     articleId,
    //     title,
    //     startTime,
    //     endTime,
    //     imageUrl,
    //     url
    //   })
    // } else {
    //   console.log('ddddd')
    //   this.setState({ 
    //     isEdit: false,
    //     bannerId: '',
    //     tabActiveKey: '1' ,
    //     articleId: '',
    //     title: '',
    //     startTime: '',
    //     endTime: '',
    //     imageUrl: '',
    //     url: ''
    //   })
    // }
  }

  toggleBannerModal (data, isEdit) {
    if (isEdit) {
      const {
        id,
        articleId,    // 搜索文章id
        title,        // 文章标题
        startTime, 
        endTime,
        url = '',
        imageUrl
      } = data;
      this.setState({
        isEdit,
        visible: !!isEdit,
        tabActiveKey: url === 'null' || url == null ? '1' : '2',
        bannerId: id,
        articleId,    // 搜索文章id
        title,        // 文章标题
        startTime, 
        endTime,
        url,
        imageUrl
      })
    } else {
      this.setState({ 
        isEdit: !!isEdit,
        visible: !this.state.visible,
        tabActiveKey: '1',
        bannerId: '',
        articleId: '',    // 搜索文章id
        title: '',        // 文章标题
        startTime: '', 
        endTime: '',
        url: '',
        imageUrl: ''
      })
    }
  }

  changeTab(tabKey) {
    this.setState({ 
      tabActiveKey: tabKey,
      articleId: '',
      title: '',
      startTime: '',
      endTime: ''
     });
  }

  handleCancel() {
    this.setState({ visible: false });
  }

  handleAddArticle() {
    this.refs["ArticleToast"].showModal();
  }

  updateArticle = item => {
    let { id, title, picUrl } = item;
    this.setState({
      articleId: id,
      title: title,
      imageUrl: picUrl
    }, () => {
      this.changeConfirmBtn()
    });
  };

  deleteArticle() {
    this.setState({
      articleId: "",
      title: '',
      articleTitleShow: false
    }, () => {
      this.changeConfirmBtn()
    });
  }

  effectTimeChange(date, datestring) {
    let [ startTime, endTime ] = datestring;
    this.setState({ startTime, endTime });
  }

  // eslint-disable-next-line no-dupe-class-members
  effectTimeOk() {
    this.setState({ effectTime: this.state.effectTimeShow });
  }

  linkTitleChange(e) {
    if (e.target.value.length >= 20) return;
    this.setState({
      title: e.target.value
    });
  }

  linkUrlChange(e) {
    this.setState({
      url: e.target.value
    });
  }

  linkImgChange(e) {
      let file_head = e.target;
      let picture = e.target.value;
      if (!picture.match(/.jpg|.gif|.png|.bmp/i)) {
          alert("您上传的图片格式不正确，请重新选择！")
          this.setState({
              adimgUrl: ''
          })
          return false
      }
      if (file_head.files && file_head.files[0]) {
          var a = window.navigator.userAgent.indexOf("Chrome") >= 1 || window.navigator.userAgent.indexOf("Safari") >= 1 ? window.webkitURL.createObjectURL(file_head.files[0]) : window.URL.createObjectURL(file_head.files[0]);
          console.log(a)
          this.setState({
              imgUrl: a,
              imgVisible: true,
          })
      }
  }

  imghandleOk = e => {

      this.setState({
          imgVisible: false,
      });
  };

  imghandleCancel = e => {
      this.setState({
          imgVisible: false,
      });
  }

  getCropData = (imgdata) => {
    // console.log('截取图片...');
    let _randomString = randomString();

    var formdata = new FormData();
    formdata.append("file", dataURLtoFile(imgdata, `img_${_randomString}.png`));
    let _this = this;
    message.loading('图片上传中...');
    fetch(`${imgUpload}`, {
        method: 'post',
        body: formdata,
    })
        .then(function (response) {
            return response.json()
        }).then(function (json) {
          console.log('json', json);
            message.destroy()
            message.success('上传成功！');

            if (json.success) {
                _this.setState({
                  imageUrl: json.data
                }, () => {
                  _this.changeConfirmBtn()
                })
            } else if (json.msg === '未登录') {
                window.initLogin();
            }
            //隐藏弹窗
            _this.imghandleCancel();

        }).catch(function (ex) {
            console.log('parsing failed', ex)
        })
  }

  addBannerOk() {
    const { articleId, title, startTime, endTime, url = '', imageUrl, bannerId } = this.state;
    this.props.addBanner({ articleId, title, startTime, endTime, url, imageUrl, bannerId })
  }

  changeConfirmBtn () {
    let { articleId, url = '', imageUrl } = this.state;
    if ( (articleId ) || ( url && imageUrl ) ) {
      this.setState({ confirmBtnStatus: false })
    } else {
      this.setState({ confirmBtnStatus: true })
    }
  }

  render() {
    let {
      title,
      startTime,
      endTime,
      tabActiveKey,
      url,
      imageUrl,
      imgVisible,
      imgUrl,
      visible,
      isEdit,
      confirmBtnStatus
    } = this.state;

    const { imghandleOk, imghandleCancel } = this;

    let effectTime_init = null 
    if (startTime && endTime) {
      let startTimeObj = moment(startTime, DATEFORMAT);
      let endTimeObj = moment(endTime, DATEFORMAT);
      effectTime_init = [startTimeObj, endTimeObj];
    }
    return (
      <div className="bannerModal">
        <ArticleToast ref="ArticleToast" changeArticle={this.updateArticle} />
        <Modal
            title="裁剪图片"
            visible={imgVisible}
            onOk={imghandleOk}
            onCancel={imghandleCancel}
            footer={null}
        >
            <ImgCropper getCropData={this.getCropData} src={imgUrl} aspectRatio={ 1056/480 } />
        </Modal>
        <Modal
          title="banner位配置"
          visible={visible}
          onCancel={this.toggleBannerModal}
          footer={[
            <Button type="primary" key="back" disabled ={ confirmBtnStatus } onClick={this.addBannerOk}>
              提交
            </Button>
          ]}
        >
          <div class="tabWrapper">
            <Tabs
              activeKey={ tabActiveKey }
              onChange={this.changeTab}
              tabBarStyle={{
                width: "200px",
                margin: "auto",
                marginBottom: "10px"
              }}
            >
              <TabPane tab="文章" key="1" disabled={ isEdit && tabActiveKey === '2' }>
                <div className="form_item">
                  <div className="item_title_1 f_b">文章</div>
                  <div className="item_content">
                    {title ? (
                      <div className="bq_list_item text_120_hide">
                        <span
                          onClick={this.deleteArticle}
                          className="cancle_btn"
                        ></span>
                        <div className="text_hidden">{ title }</div>
                      </div>
                    ) : (
                      <Button type="default" onClick={this.handleAddArticle}>
                        +添加文章
                      </Button>
                    )}
                  </div>
                </div>
                <div className="form_item">
                  <div className="item_title_1 f_b">
                    {/* 商品自动下线时间 */}
                    生效时间
                  </div>
                  <div className="item_content">
                    <LocaleProvider locale={zh_CN}>
                      <RangePicker
                        value={effectTime_init}
                        onChange={this.effectTimeChange}
                        onOk={this.effectTimeOk}
                        format={ DATEFORMAT }
                        defaultValue={ effectTime_init }
                        // showTime={{
                        //   defaultValue: moment("00:00:00", "HH:mm:ss")
                        // }}
                        // getCalendarContainer={trigger => trigger.parentNode}
                      />
                    </LocaleProvider>
                  </div>
                </div>
              </TabPane>
              <TabPane tab="其他链接" key="2"  disabled={ isEdit && tabActiveKey === '1' }>
                <div className="form_item">
                  <div className="item_title_1 f_b">标题</div>
                  <div className="item_content">
                    <Input
                      className="w_300"
                      value={ title }
                      onChange={this.linkTitleChange}
                      placeholder="最多20字，必填"
                    />
                  </div>
                </div>
                <div className="form_item">
                  <div className="item_title_1 f_b required-icon">链接</div>
                  <div className="item_content">
                    <Input
                      className="w_300"
                      value={ url }
                      onChange={this.linkUrlChange}
                      onBlur={this.changeConfirmBtn}
                      placeholder="必填"
                    />
                  </div>
                </div>
                <div className="form_item">
                  <div className="item_title_1 f_b required-icon">图片</div>
                  <div className="item_content">
                    <div className="ad_anthor_touxaing">
                      {imageUrl && <img src={ imageUrl } />}
                    </div>
                    <div className="sc_btn">
                      <Input
                        onChange={this.linkImgChange.bind(this)}
                        className="hidden_input"
                        type="file"
                        placeholder="Basic usage"
                      />
                      <Button type="primary">选择图片</Button>
                    </div>
                    <span className="m_l_20">图片比例1056:480，必填</span>
                  </div>
                </div>
                <div className="form_item">
                  <div className="item_title_1 f_b">生效时间</div>
                  <div className="item_content">
                    <LocaleProvider locale={zh_CN}>
                      <RangePicker
                        value={effectTime_init}
                        onChange={this.effectTimeChange}
                        onOk={this.effectTimeOk}
                        format={ DATEFORMAT }
                        defaultValue={ effectTime_init }
                      />
                    </LocaleProvider>
                  </div>
                </div>
              </TabPane>
            </Tabs>
          </div>
        </Modal>
      </div>
    );
  }
}

export default BannerModal;
