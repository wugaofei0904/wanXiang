import React, { Component } from "react";
import { Modal, Tabs, Button, LocaleProvider, DatePicker, Input,
  message } from "antd";
import ArticleToast from "./../../../../components/articleToast";
import "./style.css";
import zh_CN from "antd/lib/locale-provider/zh_CN";
import moment from "moment";
import ImgCropper from './../../../../components/imgCropper';
import { imgUpload } from './../../../../utils/fetchApi';
import { randomString, dataURLtoFile } from '../../../../utils/utils';
 
const { TabPane } = Tabs;

class BannerModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabActiveKey: '1',
      articleTitleShow: false,
      article: "",
      effectTime: "",
      effectTimeShow: "",
      adTitle: "",
      linkTitle: "",
      linkUrl: "",
      linkImg: "",
      imgVisible: false,
      linkImgUrl: "",
      localImg: '',
      linkEffectTimeShow: ""
    };
    this.changeTab = this.changeTab.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleAddArticle = this.handleAddArticle.bind(this);
    this.updateArticle = this.updateArticle.bind(this);
    this.effectTimeChange = this.effectTimeChange.bind(this);
    this.effectTimeOk = this.effectTimeOk.bind(this);
    this.addBannerOk = this.addBannerOk.bind(this);
    this.linkTitleChange = this.linkTitleChange.bind(this);
    this.linkUrlChange = this.linkUrlChange.bind(this);
    this.linkImgChange = this.linkImgChange.bind(this);
    this.imghandleOk = this.imghandleOk.bind(this);
    this.imghandleCancel = this.imghandleCancel.bind(this);
    this.otherLinkEffectTimeChange = this.otherLinkEffectTimeChange.bind(this);
  }

  changeTab(tabKey) {
    this.setState({ tabActiveKey: tabKey });
  }

  handleCancel() {
    this.setState({ visible: false });
  }

  handleAddArticle() {
    this.refs["ArticleToast"].showModal();
  }

  updateArticle = item => {
    console.log(item);
    this.setState({
      article: item,
      articleTitleShow: true
    });
  };

  deleteArticle() {
    this.setState({
      article: "",
      articleTitleShow: false
    });
  }

  effectTimeChange(date, datestring) {
    console.log(date, datestring);
    this.setState({ effectTime: datestring });
  }

  // eslint-disable-next-line no-dupe-class-members
  effectTimeOk() {
    this.setState({ effectTime: this.state.effectTimeShow });
  }

  linkTitleChange(e) {
    this.setState({
      linkTitle: e.target.value
    });
    //   this.setState({ })
  }

  linkUrlChange(e) {
    this.setState({
      linkUrl: e.target.value
    });
  }

  linkImgChange(e) {
      console.log(e.target.value)

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
              localImg: a,
              imgVisible: true,
          }, () => {
              this.setState({
                  adimgUrl: ''
              })
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
                  linkImgUrl: json.data
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

  otherLinkEffectTimeChange(date, datestring) {
    console.log(datestring);
    this.setState({ linkEffectTimeShow: datestring });
  }


  addBannerOk() {
    // const { tabActiveKey, article, effectTime } = this.state;
  }

  render() {
    let {
      articleTitleShow,
      article,
      effectTimeShow,
      tabActiveKey,
      linkTitle,
      linkUrl,
      linkImgUrl,
      linkEffectTimeShow,
      imgVisible,
      localImg
    } = this.state;
    const { visible } = this.props;

    const { imghandleOk, imghandleCancel } = this;

    let effectTime_init = moment(effectTimeShow, "YYYY-MM-DD HH:mm:ss");
    let linkEffectTime_init = moment(linkEffectTimeShow, "YYYY-MM-DD HH:mm:ss");

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
            <ImgCropper getCropData={this.getCropData} src={localImg} />
        </Modal>
        <Modal
          title="banner位配置"
          visible={visible}
          onCancel={this.handleCancel}
          // onOk={ this.addBannerOk }
          footer={[
            <Button type="primary" key="back" onClick={this.addBannerOk}>
              确认
            </Button>
          ]}
        >
          <div class="tabWrapper">
            <Tabs
              defaultActiveKey={tabActiveKey}
              onChange={this.changeTab}
              tabBarStyle={{
                width: "200px",
                margin: "auto",
                marginBottom: "10px"
              }}
            >
              <TabPane tab="文章" key="1">
                <div className="form_item">
                  <div className="item_title_1 f_b">文章</div>
                  <div className="item_content">
                    {articleTitleShow ? (
                      <div className="bq_list_item text_120_hide">
                        <span
                          onClick={this.deleteArticle}
                          className="cancle_btn"
                        ></span>
                        <div className="text_hidden">{article.title}</div>
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
                      <DatePicker
                        value={effectTime_init}
                        onChange={this.effectTimeChange}
                        onOk={this.effectTimeOk}
                        format="YYYY-MM-DD HH:mm:ss"
                        showTime={{
                          defaultValue: moment("00:00:00", "HH:mm:ss")
                        }}
                        // getCalendarContainer={trigger => trigger.parentNode}
                      />
                    </LocaleProvider>
                  </div>
                </div>
              </TabPane>
              <TabPane tab="其他链接" key="2">
                <div className="form_item">
                  <div className="item_title_1 f_b">标题</div>
                  <div className="item_content">
                    <Input
                      className="w_300"
                      value={linkTitle}
                      onChange={this.linkTitleChange}
                      placeholder="最多36字，必填"
                    />
                  </div>
                </div>
                <div className="form_item">
                  <div className="item_title_1 f_b">链接</div>
                  <div className="item_content">
                    <Input
                      className="w_300"
                      value={linkUrl}
                      onChange={this.linkUrlChange}
                      placeholder="必填"
                    />
                  </div>
                </div>
                <div className="form_item">
                  <div className="item_title_1 f_b">图片</div>
                  <div className="item_content">
                    <div className="ad_anthor_touxaing">
                      {linkImgUrl && <img src={ linkImgUrl } />}
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
                    <span className="m_l_20">图片比例1：1，必填</span>
                  </div>
                </div>
                <div className="form_item">
                  <div className="item_title_1 f_b">生效时间</div>
                  <div className="item_content">
                    <LocaleProvider locale={zh_CN}>
                      <DatePicker
                        value={linkEffectTime_init}
                        onChange={this.otherLinkEffectTimeChange}
                        format="YYYY-MM-DD HH:mm:ss"
                        showTime={{
                          defaultValue: moment("00:00:00", "HH:mm:ss")
                        }}
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
