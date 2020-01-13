import React, { Component } from 'react';
import { Modal, Button, Input, DatePicker, Checkbox, LocaleProvider, message } from 'antd';


import moment from 'moment';
import ImgCropper from './../../../../components/imgCropper'
import AuthorToast from './../../../../components/authorToast'
import ToastComponent from './../../../../components/toastComponent';
import ArticleToast from './../../../../components/articleToast';

import './style.css';
// import getAuthorList from '../../pages/hooks/useGetAnthor';

import cs from 'classnames';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import { imgUpload, addAdItem } from './../../../../utils/fetchApi'


// import { authorListNoPage } from '../../utils/fetchApi';
const { MonthPicker, RangePicker } = DatePicker;

const { Search, TextArea } = Input;

class CommpToast extends React.Component {
    state = {
        visible: false,
        imgVisible: false,
        adTitle: '', //广告标题
        adimgUrl: '', //广告头图
        resultImg: '',//广告头图
        localImg: '',
        tzly: '', //推荐理由
        adBiaoq: '',//广告标签
        xaixianTime: "", //下线时间
        maidianList: [],
        tagList: [],
        authorList: [],
        priceMin: '',//现价
        basePrice: '',//原价
        adLink: "", //广告链接
        biaoqianList: "", //标签列表
        zuozheList: "", //作者列表
        wenzhangList: [], //文章ad
        checkboxOptions: [
            { label: '优惠券', value: '1' },
            { label: '满减', value: '2' },
            { label: '有赠品', value: '3' },
        ],
        autoTime: '', //自动下线时间
    };

    checkForm = () => {

        let { adTitle, resultImg, tzly, adBiaoq, priceMin, basePrice, adLink, biaoqianList, zuozheList, wenzhang, autoTime } = this.state;
        let _msg = '';
        if (adTitle == '') {
            _msg = '请输入广告标题';
            message.error(_msg);
            return false
        }

        if (resultImg == '') {
            _msg = '请选择广告头图';
            message.error(_msg);
            return false
        }

        if (tzly == '') {
            _msg = '请输入推荐理由';
            message.error(_msg);
            return false
        }
        if (adBiaoq == '') {
            _msg = '请输入广告标签';
            message.error(_msg);
            return false
        }

        if (priceMin == '' || basePrice == '') {
            _msg = '请输入价格';
            message.error(_msg);
            return false
        }

        if (adLink == '') {
            _msg = '请输入广告链接';
            message.error(_msg);
            return false
        }

        if (autoTime == '') {
            _msg = '请选择下线时间';
            message.error(_msg);
            return false
        }

        return true

    }

    submitAllData = () => {
        let that = this;
        if (!this.checkForm()) return;

        let { tagList, authorList, maidianList, adTitle, resultImg, tzly, adBiaoq, priceMin, basePrice, adLink, biaoqianList, zuozheList, wenzhangList, autoTime } = this.state;

        // authorList.push({
        //     author: item,
        //     authorName: item.name,
        // })
        var formdata = new FormData();

        formdata.append("goodsTag", adBiaoq);
        formdata.append("goodsPic", resultImg);
        formdata.append("goodsTitle", adTitle);
        formdata.append("reason", tzly);
        formdata.append("price", basePrice);
        formdata.append("salesPrice", priceMin);
        formdata.append("offlineTime", autoTime);
        formdata.append("adUrl", adLink);

        if (maidianList.length) {
            formdata.append("salePoint", maidianList.join(','));
        }

        if (tagList.length) {
            let tagListstr = []
            tagList.map(item => {
                tagListstr.push(item.name)
                // tagListstr.push(item.id)
            })
            formdata.append("tags", tagListstr.join(','));
        }


        if (authorList.length) {
            let authorNameList = []
            let authoridList = []
            authorList.map(item => {
                // debugger
                authorNameList.push(item.authorName)
                authoridList.push(item.author.id)
            })
            formdata.append("authors", authorNameList.join(','));
            formdata.append("authorId", authoridList.join(','));
        }

        if (wenzhangList.length) {
            let authorNameList = []
            let authoridList = []
            wenzhangList.map(item => {
                // debugger
                authorNameList.push(item.articleName)
                authoridList.push(item.articleId)
            })
            formdata.append("articleName", authorNameList.join('-'));
            formdata.append("articleId", authoridList.join(','));
        }

        let _this = this;
        let isEdit = false;
        if (isEdit) {
            // fetch(`${articleEdit}`, {
            //     method: 'post',
            //     body: formdata,
            // })
            //     .then(function (response) {
            //         return response.json()
            //     }).then(function (json) {
            //         if (json.success) {
            //             message.success('编辑成功！')
            //             setTimeout(() => {
            //                 _this.props.history.push('/articleManage')
            //             }, 1500)
            //         } else if (json.msg == '未登录') {
            //             alert(json.msg)
            //             window.initLogin();
            //         } else {
            //             alert(json.msg)
            //         }
            //     }).catch(function (ex) {
            //         console.log('parsing failed', ex)
            //     })

        } else {
            fetch(`${addAdItem}`, {
                method: 'post',
                body: formdata,
            })
                .then(function (response) {
                    return response.json()
                }).then(function (json) {
                    if (json.success) {
                        message.success('发布成功！')
                        this.setState({
                            visible: false
                        })
                        //清空页面 保留作者
                        _this.initEditPage();

                    } else if (json.msg == '未登录') {
                        alert(json.msg)
                        window.initLogin();
                    } else {
                        alert(json.msg)
                    }
                }).catch(function (ex) {
                    console.log('parsing failed', ex)
                })
        }


    }


    initModal = () => {
        this.setState({
            visible: false,
            imgVisible: false,
            adTitle: '', //广告标题
            adimgUrl: '', //广告头图
            resultImg: '',//广告头图
            localImg: '',
            tzly: '', //推荐理由
            adBiaoq: '',//广告标签
            xaixianTime: "", //下线时间
            maidianList: [],
            tagList: [],
            authorList: [],
            priceMin: '',//现价
            basePrice: '',//原价
            adLink: "", //广告链接
            biaoqianList: "", //标签列表
            zuozheList: "", //作者列表
            wenzhang: "", //文章ad
            checkboxOptions: [
                { label: '优惠券', value: '1' },
                { label: '满减', value: '2' },
                { label: '有赠品', value: '3' },
            ],
            autoTime: '', //自动下线时间
        });
    }


    submitAll = () => {

    }

    showModal = (data) => {
        this.setState({
            visible: true,
        });

        if (data) {


            let tagList = [];
            let authorList = [];
            let wenzhangList = [];

            //存在作者
            if (data.authors) {

                let authors_list = data.authors.split(',');
                let authors_list_id = data.authorId.split(',');
                authors_list.map((item, idx) => {
                    authorList.push({
                        author: authors_list_id[idx],
                        authorName: item,
                    })
                })
            }


            //存在标签
            if (data.tags) {
                let tags_list = data.tags.split(',');
                tags_list.map(item => {
                    tagList.push(item)
                })
            }

            //存在文章
            if (data.articleName) {
                let articleName_list = data.articleName.split(',');
                let articleName_list_id = data.articleId.split(',');
                articleName_list.map((item, idx) => {
                    wenzhangList.push({
                        articleId: articleName_list_id[idx],
                        articleName: item,
                    })
                })
            }


            this.setState({
                adTitle: data.goodsTitle, //广告标题
                // adimgUrl: data, //广告头图
                resultImg: data.goodsPic,//广告头图
                // localImg: '',
                tzly: data.reason, //推荐理由
                adBiaoq: data.goodsTag,//广告标签
                xaixianTime: data.offlineTime, //下线时间
                maidianList: [],
                tagList: tagList,
                authorList: authorList,
                wenzhangList: wenzhangList, //文章ad
                priceMin: data.salesPrice,//现价
                basePrice: data.price,//原价
                adLink: data.adUrl, //广告链接
                // checkboxOptions: [
                //     { label: '优惠券', value: '1' },
                //     { label: '满减', value: '2' },
                //     { label: '有赠品', value: '3' },
                // ],
                autoTime: data.submitAllDataofflineTime, //自动下线时间
            })
        }
    };

    adTitleChange = (e) => {
        this.setState({
            adTitle: e.target.value
        })

        console.log(e.target.value)

    }


    textAreaChange = (e) => {
        this.setState({
            tzly: e.target.value
        })
    }



    adLinkChange = (e) => {
        this.setState({
            adLink: e.target.value
        })
    }

    adBiaoqChange = (e) => {
        this.setState({
            adBiaoq: e.target.value
        })
    }

    handleOk = e => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };



    handleCancel = e => {
        console.log(e);
        this.setState({
            visible: false,
        });
        this.initModal();
    };


    imghandleOk = e => {
        console.log(e);
        this.setState({
            imgVisible: false,
        });
    };

    imghandleCancel = e => {
        console.log(e);
        this.setState({
            imgVisible: false,
        });
    };

    checkboxonChange = checkedValues => {
        this.setState({
            maidianList: checkedValues
        })

        console.log('checked = ', checkedValues);
    }


    componentDidMount() {

    }


    autoTimeChange = (value, dateString) => {
        console.log('Selected Time: ', value);
        console.log('Formatted Selected Time: ', dateString);


        this.setState({
            autoTime: dateString
        })
    }

    imgChange(e) {
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


    //将base64码转化为FILE格式
    dataURLtoFile(dataurl, filename) {
        var arr = dataurl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
    }

    //生成随机字符串
    randomString = (len) => {
        len = len || 32;
        var _chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
        var maxPos = _chars.length;
        var pwd = '';
        for (var i = 0; i < len; i++) {
            pwd += _chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return pwd;
    }

    getCropData = (imgdata) => {
        // console.log('截取图片...');
        let _randomString = this.randomString();

        var formdata = new FormData();
        formdata.append("file", this.dataURLtoFile(imgdata, `img_${_randomString}.png`));
        let _this = this;
        message.loading('图片上传中...');
        fetch(`${imgUpload}`, {
            method: 'post',
            body: formdata,
        })
            .then(function (response) {
                return response.json()
            }).then(function (json) {
                message.success('上传成功！');

                if (json.success) {
                    _this.setState({
                        resultImg: json.data
                    })
                } else if (json.msg == '未登录') {
                    window.initLogin();
                }
                //隐藏弹窗
                _this.imghandleCancel();

            }).catch(function (ex) {
                console.log('parsing failed', ex)
            })
    }

    priceMinChange = (e) => {
        this.setState({
            priceMin: e.target.value
        })
    }

    priceMaxChange = (e) => {
        this.setState({
            basePrice: e.target.value
        })
    }


    onTextAreaChange = e => {
        this.setState({
            wenzhang: e.target.value
        })
    }

    deleteTag = (idx) => {
        let { tagList } = this.state;
        tagList.splice(idx, 1);
        this.setState({
            tagList
        })
    }

    deleteAuthor = idx => {
        let { authorList } = this.state;
        authorList.splice(idx, 1);
        this.setState({
            authorList
        })
    }

    deleteArticle = idx => {
        let { wenzhangList } = this.state;
        wenzhangList.splice(idx, 1);
        this.setState({
            wenzhangList
        })
    }


    showBqToast = () => {
        this.refs['tagToast'].showModal();
    }


    updateAuthor = item => {
        let { authorList } = this.state;
        authorList.push({
            author: item,
            authorName: item.name,
        })
        this.setState({
            authorList
        })
    }

    updateArticle = item => {
        let { wenzhangList } = this.state;
        wenzhangList.push({
            articleId: item.id,
            articleName: item.title,
        })
        this.setState({
            wenzhangList
        })
    }

    getTagid = (tag) => {
        
        if (!tag.name) {
            tag.name = tag.tagName
        }
        let newtagList = this.state.tagList;
        newtagList.push(tag.name)
        this.setState({
            tagList: newtagList
        })
        this.refs['tagToast'].initModal();
    }

    changeAnthor = () => {
        this.refs['authorToast'].showModal();
    }


    changeArticle = () => {
        this.refs['ArticleToast'].showModal();
    }


    render() {

        let _this = this;
        let { wenzhangList, authorList, tagList, wenzhang, maidianList, adLink, priceMin, basePrice, checkboxOptions, adTitle, resultImg, adimgUrl, localImg, tzly, adBiaoq } = this.state;
        return (
            <div id="shangpinToast">
                <Modal
                    title="裁剪图片"
                    visible={this.state.imgVisible}
                    onOk={this.imghandleOk}
                    onCancel={this.imghandleCancel}
                    footer={null}
                >
                    <ImgCropper getCropData={this.getCropData} src={localImg} />
                </Modal>
                <Modal
                    width={600}
                    title="商品集"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={[
                        <Button type='primary' key="back" onClick={this.submitAllData}>
                            确认
                        </Button>
                    ]}
                >
                    <div className="edit_set_container">

                        <AuthorToast changeAuthor={this.updateAuthor} ref='authorToast' />

                        <ArticleToast changeArticle={this.updateArticle} ref='ArticleToast' />

                        <ToastComponent getTagid={this.getTagid} ref='tagToast' />

                        <div className="form_item">
                            <div className="item_title_1 f_b">广告标题</div>
                            <div className="item_content">
                                <Input className="w_300" value={adTitle} onChange={this.adTitleChange} placeholder="最多36字，必填" />
                            </div>
                        </div>
                        <div className="form_item">
                            <div className="item_title_1 f_b">广告头图</div>
                            <div className="item_content">
                                <div className="ad_anthor_touxaing">
                                    {resultImg &&
                                        <img src={resultImg} />
                                    }
                                </div>
                                <div className="sc_btn">
                                    <Input value={adimgUrl} onChange={this.imgChange.bind(this)} className="hidden_input" type="file" placeholder="Basic usage" />
                                    <Button type="primary">选择图片</Button>
                                </div>
                                <span className='m_l_20'>图片比例1：1，必填</span>
                            </div>
                        </div>
                        <div className="form_item">
                            <div className="item_title_1 f_b">推荐理由</div>
                            <div className="item_content">
                                <TextArea value={tzly} onChange={this.textAreaChange} placeholder="最多30字，必填" className="w_300" rows={4} />
                            </div>
                        </div>
                        <div className="form_item">
                            <div className="item_title_1 f_b">广告标签</div>
                            <div className="item_content">
                                <Input className="w_300" value={adBiaoq} onChange={this.adBiaoqChange} placeholder="最多8字，必填" />
                            </div>
                        </div>
                        <div className="form_item">
                            <div className="item_title_1 f_b">价格</div>
                            <div className="item_content">
                                <Input className="w_100" value={priceMin} onChange={this.priceMinChange} placeholder="现价" />
                                <span className="m-l-r-30">/</span>
                                <Input className="w_100" value={basePrice} onChange={this.priceMaxChange} placeholder="原价" />
                            </div>
                        </div>
                        <div className="form_item">
                            <div className="item_title_1 f_b">广告链接</div>
                            <div className="item_content">
                                <Input className="w_300" value={adLink} onChange={this.adLinkChange} placeholder="必填" />
                            </div>
                        </div>

                        <div className="form_item">
                            <div className="item_title_1 f_b">广告自动下线时间</div>
                            <div className="item_content">
                                <LocaleProvider locale={zh_CN}>
                                    <DatePicker
                                        onChange={this.autoTimeChange}
                                        format="YYYY-MM-DD HH:mm:ss"
                                        showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                                    />
                                </LocaleProvider>
                            </div>
                        </div>

                        <div className="form_item">
                            <div className="item_title_1 f_b">卖点（非必填）</div>
                            <div className="item_content">
                                <Checkbox.Group options={checkboxOptions} value={maidianList} onChange={this.checkboxonChange} />
                            </div>
                            <Button onClick={this.showBqToasat} > + 添加</Button>
                        </div>

                        <span className="form_title f_b">绑定对象（非必填）</span>

                        <div className="addBq_container">
                            <div className="fmt_container_title edit_title">添加标签 <span className="font_color_grid">(通用广告，文章含有标签时展示该广告，优先级低)</span></div>
                            <div className="bq_list">
                                {
                                    tagList.map((item, idx) => {
                                        return <div className="bq_list_item"><span onClick={this.deleteTag.bind(null, idx)} className="cancle_btn"></span> {item}</div>
                                    })
                                }

                                <Button onClick={this.showBqToast} > + 添加标签</Button>
                            </div>
                        </div>

                        <div className="addBq_container">
                            <div className="fmt_container_title edit_title">作者 <span className="font_color_grid">(作者广告，以下文章仅展示该广告，多广告时随机展现，优选级中)</span></div>
                            <div className="bq_list">
                                {
                                    authorList.map((item, idx) => {
                                        return <div className="bq_list_item"><span onClick={this.deleteAuthor.bind(null, idx)} className="cancle_btn"></span> {item.authorName}</div>
                                    })
                                }

                                <Button onClick={this.changeAnthor} > + 添加作者</Button>
                            </div>
                        </div>


                        <div className="hxgd_container">
                            <div className="fmt_container_title edit_title">文章 <span className="font_color_grid">(文章广告，以下文章仅展示该广告，多广告时随机展现，优先级高)</span></div>
                            {/* <div className="hx_box">
                                <TextArea
                                    className="wenzhangText"
                                    value={wenzhang}
                                    rows={4}
                                    onChange={this.onTextAreaChange}
                                    placeholder="Controlled autosize"
                                    autoSize={{ minRows: 3, maxRows: 5 }}
                                />
                            </div> */}
                            <div className="bq_list">
                                {
                                    wenzhangList.map((item, idx) => {
                                        // console.log(item,'title...........articleId: 9254, articleName........')
                                        return <div className="bq_list_item text_120_hide"><span onClick={this.deleteArticle.bind(null, idx)} className="cancle_btn"></span> {item.articleName}</div>
                                    })
                                }
                                <Button onClick={this.changeArticle} > + 添加文章</Button>
                            </div>
                        </div>
                    </div>
                </Modal>
            </div >
        );
    }
}

export default CommpToast;
