import React, { Component } from 'react';
import { Checkbox, Switch, Modal, Button, Row, Col, Select, Input, DatePicker, Pagination, Radio, Form, Icon, Divider, message } from 'antd';
import './style.css';
import HeaderTabbar from '../../components/headTabBar/index';
import moment from 'moment';
import cs from 'classnames';
// import ActionItem from './ActionItem/index'
import ImgCropperTwo from './../../components/imgCropperTwo'
import Ueditor from './components/ueditor';
import AuthorToast from './../../components/authorToast'
import ToastComponent from './../../components/toastComponent';
import { createAuthor, imgUpload, postArticle, articleEdit, initBaseImg, articleDetail } from './../../utils/fetchApi'
// import Editor from 'react-umeditor';
import { withRouter } from 'react-router-dom';
const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const { MonthPicker, RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';
const monthFormat = 'YYYY/MM';
const dateFormatList = ['DD/MM/YYYY', 'DD/MM/YY'];


let imgArrHasWH = [];

class EditForm extends Component {


    constructor(props) {
        super(props);
        this.state = {
            id: '',
            author: {},
            authorName: '无',  //作者名
            articleTitle: '',  //文章title
            showAuthorMsg: false,
            authorMsg: '',
            authorRadioValue: 1,
            textNumber: 0,
            textAreavalue: '',  //核心
            tagList: [],
            content: '',
            imgModelVisible: false,
            baseImgList: [
                // './../../img/test1.jpg',
                // './../../img/test2.jpg',
                // './../../img/test3.jpg',
                // 'http://pic1.58cdn.com.cn/p1/big/n_v2066985acab204602b8e156ee453fb3f7_7fa21218dfb7b68c.jpg',
                // 'http://pic1.58cdn.com.cn/p1/big/n_v2066985acab204602b8e156ee453fb3f7_7fa21218dfb7b68c.jpg',
            ],
            lastImgList: [
                '', '', ''
            ],
            editImgIdx: 0,
            baseImgChecked: 0,
            imgTwoVisible: false,
            qingwuzhuanzai: true,
            // qingwuzhuanzai: true,
            localImgValue: '',
            isEdit: false,
            shiXiao: false,
            imgWhArr: []

        };
    }

    initEditPage = () => {
        this.setState({
            articleTitle: '',  //文章title
            showAuthorMsg: false,
            authorMsg: '',
            authorRadioValue: 1,
            textNumber: 0,
            textAreavalue: '',  //核心
            tagList: [],
            content: '',
            imgModelVisible: false,
            baseImgList: [],
            lastImgList: [
                '', '', ''
            ],
            editImgIdx: 0,
            baseImgChecked: 0,
            imgTwoVisible: false,
            qingwuzhuanzai: true,
            localImgValue: '',
            isEdit: false
        })

        this.setdefaultContent('');

    }

    handleChange(content) {
        this.setState({
            content: content
        })
    }
    getIcons() {
        var icons = [
            "source | undo redo | bold italic underline strikethrough fontborder emphasis | ",
            "paragraph fontfamily fontsize | superscript subscript | ",
            "forecolor backcolor | removeformat | insertorderedlist insertunorderedlist | selectall | ",
            "cleardoc  | indent outdent | justifyleft justifycenter justifyright | touppercase tolowercase | ",
            "horizontal date time  | image emotion spechars | inserttable"
        ]
        return icons;
    }

    authorRadioChange = e => {
        console.log(e.target.value)
        this.setState({
            authorRadioValue: e.target.value
        })
    }



    titleChange = e => {
        console.log(e.target.value)
        this.setState({
            articleTitle: e.target.value
        })
    }


    onTextAreaChange = ({ target: { value } }) => {
        console.log(value.length)
        this.setState({
            textAreavalue: value,
            textNumber: value.length,
        });
    }

    onChange = (e) => {
        console.log('radio checked', e.target.value);
        this.setState({
            value: e.target.value,
        });
    }




    getImgurl = (item) => {
        let imgReg = /<img.*?(?:>|\/>)/gi //匹配图片中的img标签
        let str = item.content
        let arr = str.match(imgReg) || [];  //筛选出所有的img
        let srcArr = []
        let gotSrc = new RegExp(" src=");
        for (let i = 0; i < arr.length; i++) {
            let srcReg=''
            if(gotSrc.test(arr[i])){ //有src标签
                 srcReg = / src=[\'\"]?([^\'\"]*)[\'\"]?/i // 匹配图片中的src

            }else{
                 srcReg = /data-src=[\'\"]?([^\'\"]*)[\'\"]?/i // 匹配图片中的data-src
            }
            let src = arr[i].match(srcReg)
            // 获取图片地址
            if (src[1].indexOf('http') == -1) {
                srcArr.push('https:' + src[1])
            } else if (src[1].indexOf('https') == -1) {
                srcArr.push(src[1].replace('http', 'https'))
            } else {
                srcArr.push(src[1])
            }
        }
        // item.dataValues.imgList = srcArr
        // console.log(srcArr, 'httppppppp');
        // if(){}
        return srcArr.length > 0 ? srcArr : null;
        // this.baseImgList
    }



    //获取图片宽高
    getImgWh = url => {
        let _this = this
        // let { imgWhArr } = this.state;
        let width = 0;
        let height = 0;
        // 通过定时循环检测获取
        var start_time = new Date().getTime();
        //图片地址后加时间戳，是为了避免缓存
        var img_url = url
        // 创建对象
        var img = new Image()
        // 改变图片的src
        img.src = img_url;
        // 定时执行获取宽高
        var check = function () {
            //  只要任何一方大于0 表示服务器已经返回宽高
            if (img.width > 0 || img.height > 0) {
                // var diff = new Date().getTime() - start_time;
                // document.body.innerHTML += 'from: check : width:' + img.width + ',height:' + img.height + ',time:' + diff + 'ms';
                clearInterval(set);
                imgArrHasWH.push({
                    width: img.width,
                    height: img.height,
                    url: url
                })
                // console.log(imgArrHasWH, 'imgArrHasWH')
                // _this.setState({
                //     imgWhArr: imgWhArr.concat([])
                //     // baseImgList: ['https://pic6.58cdn.com.cn/p1/big/n_v295572420aadf4f7191007842243a7cae_2be2453a997c206e.jpg'],
                // }, () => {
                //     console.log(_this.state.imgWhArr, 'imgWhArr')
                // })
            }
        }
        var set = setInterval(check, 40)
        //加载完成获取宽高
        // img.onload = function () {
        //     return {
        //         width: img.width,
        //         height: img.height
        //     }
        //     // var diff = new Date().getTime() - start_time;
        //     // document.body.innerHTML += 'from:onload : width:' + img.width + ',height:' + img.height + ',time:' + diff + 'ms';
        // }
    }


    filtImgArr = (arrImg = []) => {
        imgArrHasWH.length = 0
        arrImg.map((item) => {
            this.getImgWh(item)
        })

        setTimeout(() => {
            console.log(imgArrHasWH)
            var _arr = imgArrHasWH.filter(item => {
                if (item.width <= 218 && item.height <= 146) {
                    return false
                } else {
                    return true
                }
            })

            let _arr2 = []
            _arr.map((item) => {
                _arr2.push(item.url)
            })

            this.setState({
                baseImgList: _arr2
            })
            // console.log(_arr)
        }, 1000)
    }

    // 372  248


    handleSubmit = (cb) => {
        // debugger
        let _this = this;
        let { baseImgList } = this.state;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                // debugger
                values.content = this.refs.content1.getVal();
                // console.log(_this.getImgurl(values))
                this.filtImgArr(_this.getImgurl(values))
                // debugger
                this.setState({
                    content: values.content,
                    // baseImgList: _this.getImgurl(values) || baseImgList,
                    // baseImgList: ['https://pic6.58cdn.com.cn/p1/big/n_v295572420aadf4f7191007842243a7cae_2be2453a997c206e.jpg'],
                }, () => {
                    cb && cb();
                })
            }
        });
    }

    changeAnthor = () => {
        this.refs['authorToast'].showModal();
    }

    checkboxChange = (e) => {
        this.setState({
            shiXiao: e.target.checked
        })
        console.log(`checked = ${e.target.checked}`);
    }

    updateAuthor = item => {
        // debugger
        this.setState({
            author: item,
            authorName: item.name,
        })
    }

    authorMsgChange = e => {
        this.setState({
            authorMsg: e.target.value
        })
        console.log(e.target.value)
    }

    showBqToast = () => {
        this.refs['tagToast'].showModal();
    }

    getTagid = (tag) => {

        if (!tag.name) {
            tag.name = tag.tagName
        }

        // console.log(tag)
        // debugger
        let newtagList = this.state.tagList;
        // debugger
        newtagList.push(tag)
        this.setState({
            tagList: newtagList
        })
        this.refs['tagToast'].initModal();
    }



    showImgChooseModel = idx => {
        this.handleSubmit(() => {
            this.setState({
                editImgIdx: idx
            })
            this.imgModelOk();
        })
    }

    imgModelOk = () => {
        this.setState({ imgModelVisible: true });
    }

    imgModelCancel = () => {
        this.setState({ imgModelVisible: false });
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

    getCropData = (imgdata) => {
        let _this = this;
        let { lastImgList, editImgIdx } = this.state;

        lastImgList[editImgIdx] = imgdata;
        _this.setState({
            lastImgList: [...lastImgList]
        })
        //隐藏弹窗
        _this.imgModelCancel();
        _this.imgTwoCancel();
    }


    handleCancel = () => {


    }

    imgTwoOk = () => {
        this.setState({
            imgTwoVisible: true
        })
    }
    imgTwoCancel = () => {
        this.setState({
            imgTwoVisible: false
        })
    }

    nextCjImg = () => {

    }

    chooseFmImg = idx => {
        this.setState({
            baseImgChecked: idx
        })
    }


    checkForm = () => {

        let { authorMsg, author, authorName, content, articleTitle, lastImgList, tagList } = this.state;
        let _msg = '';
        if (authorName == '无') {
            _msg = '请选择作者';
            message.error(_msg);
            return false
        }

        if (articleTitle == '') {
            _msg = '请输入文章标题';
            message.error(_msg);
            return false
        }


        if (JSON.stringify(lastImgList) == '["","",""]') {
            _msg = '请选择封面图';
            message.error(_msg);
            return false
        }

        if (tagList.length == 0) {
            _msg = '请选择文章标签';
            message.error(_msg);
            return false
        }

        if (content == '') {
            _msg = '请输入文章内容';
            message.error(_msg);
            return false
        }

        return true

    }


    debounce(func, wait, immediate) {
        let timer;

        return function () {
            let context = this;
            let args = arguments;

            if (timer) clearTimeout(timer);
            if (immediate) {
                var callNow = !timer;
                timer = setTimeout(() => {
                    timer = null;
                }, wait)
                if (callNow) func.apply(context, args)
            } else {
                timer = setTimeout(function () {
                    func.apply(context, args)
                }, wait);
            }
        }
    }

    submitDebounce = () => {
        this.debounce(this.submitAllData, 1000, false)
        // this.debounce(this.submitAllData, 5000)
    }

    submitAllData = () => {
        let that = this;
        if (!this.checkForm()) return;

        let { baseImgList } = that.state;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let content1 = that.refs.content1.getVal();
                console.log(values)
                that.setState({
                    content: content1
                }, () => {
                    let { shiXiao, id, isEdit, authorMsg, authorRadioValue, author, authorName, content, articleTitle, lastImgList, tagList, textAreavalue, qingwuzhuanzai } = this.state;

                    let _arr = [];
                    tagList.map(item => {
                        // _arr.push(item.id);
                        _arr.push(item.name);
                    })

                    let _new_list = [];
                    for (var i = 0; i < 3; i++) {
                        if (lastImgList[i] !== '') {
                            _new_list.push(lastImgList[i]);
                        }
                    }

                    var formdata = new FormData();
                    formdata.append("title", articleTitle);
                    formdata.append("picUrl", _new_list.join(','));

                    formdata.append("tags", _arr.join(','));
                    formdata.append("body", content);
                    formdata.append("authorId", author.id);

                    formdata.append("isOwn", authorRadioValue);
                    formdata.append("otherAuthorName", authorMsg);
                    formdata.append("otherImg", '');

                    formdata.append("corePoint", textAreavalue);
                    formdata.append("isReprint", qingwuzhuanzai);

                    formdata.append("isTop", shiXiao ? '1' : '0');


                    let _this = this;
                    if (isEdit) {
                        formdata.append("id", id);
                        fetch(`${articleEdit}`, {
                            method: 'post',
                            body: formdata,
                        })
                            .then(function (response) {
                                return response.json()
                            }).then(function (json) {
                                if (json.success) {
                                    message.success('编辑成功！')
                                    setTimeout(() => {
                                        _this.props.history.push('/articleManage')
                                    }, 1500)
                                } else if (json.code == '506') {
                                    alert(json.msg)
                                    window.initLogin();
                                } else {
                                    alert(json.msg)
                                }
                            }).catch(function (ex) {
                                console.log('parsing failed', ex)
                            })

                    } else {
                        fetch(`${postArticle}`, {
                            method: 'post',
                            body: formdata,
                        })
                            .then(function (response) {
                                return response.json()
                            }).then(function (json) {
                                if (json.success) {
                                    message.success('发布成功！')
                                    // setTimeout(() => {
                                    //     _this.props.history.push('/articleManage')
                                    // }, 1500)
                                    //清空页面 保留作者
                                    _this.initEditPage();
                                } else if (json.code == '506') {
                                    alert(json.msg)
                                    window.initLogin();
                                } else {
                                    alert(json.msg)
                                }
                            }).catch(function (ex) {
                                console.log('parsing failed', ex)
                            })
                    }
                })
            }
        });
    }

    deleteTag = (idx) => {
        let { tagList } = this.state;
        tagList.splice(idx, 1);
        this.setState({
            tagList
        })

    }

    switchChange = value => {
        // debugger
        this.setState({
            qingwuzhuanzai: value
        })
    }

    componentDidMount() {
        // debugger
        // console.log(this.props.match.params.edit)

        let _that = this;
        if (this.props.match.params.edit && this.props.match.params.edit != '') {
            let id = this.props.match.params.edit;
            // let id = this.props.location.state.id;

            fetch(`${articleDetail}?id=${id}`)
                .then(function (response) {
                    return response.json()
                }).then(function (json) {
                    // debugger
                    if (json.success) {
                        //回填数据
                        let _data = json.data;
                        // let _data = JSON.parse(localStorage.getItem('edit_article'));


                        console.log(_data)
                        let _list = _data.tags.split(',')
                        let new_list = []
                        for (var i = 0; i < _list.length; i++) {
                            new_list.push({
                                name: _list[i]
                            })
                        }

                        // debugger
                        // console.log([_data.picUrl])

                        _that.setState({
                            id: _data.id,
                            isEdit: !!1,
                            authorName: _data.authorName,
                            articleTitle: _data.title,
                            authorRadioValue: _data.isOwn == '1' ? 1 : 2,
                            textAreavalue: _data.corePoint,
                            textNumber:_data.corePoint.length || 0,
                            tagList: new_list,
                            content: _data.body,
                            lastImgList: _data.picUrl.split(','),
                            baseImgList: _data.picUrl.split(','),
                            // baseImgList: ['https://pic7.58cdn.com.cn/p1/big/n_v23efc0ca43c7645c0b01e30ead7b93b78_06b3edb661442446.jpg'],
                            // baseImgChecked: 0,
                            author: {
                                name: _data.authorName,
                                id: _data.authorId,
                            },
                            authorMsg: _data.otherAuthorName,
                            qingwuzhuanzai: _data.isReprint == '1' ? false : true,
                            shiXiao: _data.isTop == '1' ? true : false
                        })

                        _that.setdefaultContent(_data.body);
                    } else if (json.code == '506') {
                        alert(json.msg)
                        window.initLogin();
                    } else {
                        alert(json.msg)
                    }
                }).catch(function (ex) {
                    console.log('parsing failed', ex)
                })

            // articleDetail

        }

        Array.prototype.indexOf = function (val) {
            for (var i = 0; i < this.length; i++) {
                if (this[i] == val) return i;
            }
            return -1;
        };
        Array.prototype.remove = function (val) {
            var index = this.indexOf(val);
            if (index > -1) {
                this.splice(index, 1);
            }
        };

    }
    parse2dom(str){
        let div = document.createElement("div");
        if(typeof str == "string")
            div.innerHTML = str;
        return div.childNodes[0];
    };

    parse2Str(dom){
        let tmpNode = document.createElement('div')
        tmpNode.appendChild(dom)
        let str = tmpNode.innerHTML
        tmpNode = dom = null;
        return str;
    };


    setdefaultContent = (data) => {

        this.refs['content1'].setVal(data)

    }

    imgChange(e) {
        // console.log(e.target.value)
        let _this = this;

        let { baseImgList } = this.state;

        let file_head = e.target;
        let picture = e.target.value;
        if (!picture.match(/.jpg|.gif|.png|.bmp/i)) {
            alert("您上传的图片格式不正确，请重新选择！")
            _this.setState({
                localImgValue: ''
            })
            return false
        }
        if (file_head.files && file_head.files[0]) {
            var a = window.navigator.userAgent.indexOf("Chrome") >= 1 || window.navigator.userAgent.indexOf("Safari") >= 1 ? window.webkitURL.createObjectURL(file_head.files[0]) : window.URL.createObjectURL(file_head.files[0]);
            // console.log(a,'23')
            // debugger
            baseImgList.push(a);
            _this.setState({
                localImgValue: a,
                baseImgList: baseImgList
            }, () => {
                _this.imgTwoOk();
            })
        }
    }


    /**
     * 获取宽高
     * @param url
     * @returns {Promise<any>}
     */
    getInchImg(url){
        return new Promise((resolve, reject) => {
            let img = new Image();
            img.src = url;
            img.onload = function () {
                resolve({
                    width: img.width,
                    height: img.height
                });
            };
            img.onerror = function () {
                reject(new Error("图片加载错误！"));
            }

        });
    }

    /**
     * 格式化图片
     **/
    initBaseImgList = () => {
        let _this = this;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                values.content = this.refs.content1.getVal();
                let _arr = _this.getImgurl(values);

                if (!_arr) {
                    alert('暂无图片');
                }
                let _content = values.content;
                let imgReg = /<img.*?(?:>|\/>)/gi //匹配图片中的img标签
                let arr = _content.match(imgReg) || [];  //筛选出所有的img

                var formdata = new FormData();
                formdata.append("url", _arr.join(','));
                // let _this = this;
                fetch(`${initBaseImg}`, {
                    method: 'post',
                    body: formdata,
                })
                    .then(function (response) {
                        return response.json()
                    }).then(function (json) {
                        if (json.success) {
                            let data = json.data;
                            let gotSrc = new RegExp(" src=");
                            for (let i = 0; i < data.length; i++) {
                                if(gotSrc.test(arr[i])){ //有src标签
                                    _content = _content.replace(_arr[i], data[i] + '?time=' + new Date().valueOf()); //re:/w/g

                                }else{  //data-src
                                    _this.getInchImg(data[i]).then(val=>{
                                        let imgWidth=val.width
                                        let imgHeight=val.height
                                        if(imgWidth>720){  //大于editor宽度
                                            let times=Number(imgWidth/720).toFixed(2);
                                            let showHeight=Math.round(imgHeight/times)
                                            let currentDom=_this.parse2dom(arr[i]);
                                            currentDom.style.width='720px';
                                            currentDom.style.height=showHeight+'px';
                                            currentDom.setAttribute('src',data[i]+'?time='+new Date().valueOf())
                                            let newDomStr=_this.parse2Str(currentDom)
                                            _content = _content.replace(arr[i], newDomStr); //re:/w/g
                                            _this.refs.content1.setVal(`${_content}`)
                                        }else{
                                            _content = _content.replace(_arr[i], _arr[i]+'" src="'+data[i] + '?time=' + new Date().valueOf()+'"'); //re:/w/g
                                            _this.refs.content1.setVal(`${_content}`)
                                        }
                                    })
                                }
                            }
                            _this.refs.content1.setVal(`${_content}`)
                        } else if (json.code == '506') {
                            alert(json.msg)
                            window.initLogin();
                        } else {
                            alert(json.msg)
                        }


                    }).catch(function (ex) {
                        console.log('parsing failed', ex)
                    })
            }
        });
    }

    render() {

        let editConfig = {

        };

        let { content, qingwuzhuanzai, authorMsg, articleTitle, localImgValue, lastImgList, baseImgChecked, baseImgList, imgModelVisible, textAreavalue, authorName, showAuthorMsg, authorRadioValue, textNumber, tagList } = this.state;

        return (
            <div className="appPage">

                <Modal
                    className="img_modal"
                    visible={imgModelVisible}
                    title="选择封面图"
                    onOk={this.imgModelOk}
                    onCancel={this.imgModelCancel}
                    footer={null}
                >
                    <div className="img_list_container">
                        <div className="img_scroll_box">
                            {
                                baseImgList.map((item, index) => {
                                    return <div onClick={this.chooseFmImg.bind(null, index)} className={cs("toast_img_box", { "checked": baseImgChecked == index })}>
                                        <img src={item} />
                                    </div>
                                })
                            }
                        </div>
                    </div>
                    <div className="bottom_btn_list">

                        <div className="sc_btn">
                            <Input onChange={this.imgChange.bind(this)} className="hidden_input" type="file" placeholder="Basic usage" />
                            <Button type="primary">另选图片</Button>
                        </div>

                        {/* <Button onClick={this.getLocalImg} size="default" type="primary">另选图片</Button> */}
                        <Button onClick={this.imgTwoOk} size="default" type="primary">下一步</Button>
                    </div>
                    <Modal
                        title="裁剪图片"
                        visible={this.state.imgTwoVisible}
                        onOk={this.imgTwoOk}
                        onCancel={this.imgTwoCancel}
                        footer={null}
                    >
                        <ImgCropperTwo getCropData={this.getCropData} src={baseImgList[baseImgChecked]} />
                    </Modal>
                </Modal>

                <AuthorToast changeAuthor={this.updateAuthor} ref='authorToast' />
                <ToastComponent getTagid={this.getTagid} ref='tagToast' />
                <h1 className="m_t_16">编辑器</h1>
                <div className="edit_header">
                    <Row className="row" type="flex">
                        <Col className="mr-12 flex_hc color_red">
                            发布作者：{authorName}
                        </Col>
                        <Col className="mr-12">
                            <Button onClick={this.changeAnthor} size="default" type="primary">更换</Button>
                        </Col>
                    </Row>
                    <Input value={articleTitle} onChange={this.titleChange} className="edit_title" placeholder="请输入文章标题" />
                    <Row className="row color_hui flex_hc" type="flex">
                        <Col className="mr-12 flex_hc">
                            请选择：
                        </Col>
                        <Col className="mr-12">
                            <Radio.Group onChange={this.authorRadioChange} value={authorRadioValue}>
                                <Radio value={1}>我是原创作者</Radio>
                                <Radio value={2}>输入作者信息</Radio>
                            </Radio.Group>
                        </Col>
                        {
                            authorRadioValue == 2 && <Col className="mr-12 w_300 flex_hc">
                                <Input value={authorMsg} onChange={this.authorMsgChange} width="200" placeholder="1-10字 示例：厉以宁经济学教授" />
                            </Col>
                        }
                    </Row>
                </div>
                <Ueditor defaultData={content} config={editConfig} id="content1" height="1000" ref="content1" />
                {/* <Button type={'primary'} onClick={this.handleSubmit.bind(this)}>格式化图片</Button> */}
                <Button type={'primary'} onClick={this.initBaseImgList.bind(this)}>格式化图片</Button>


                <div className="hxgd_container">
                    <div className="fmt_container_title edit_title">核心观点 <span className="font_color_grid">(推荐填写，有助于提升阅读量和点赞，不少于50字)</span></div>
                    <div className="hx_box">
                        <TextArea
                            className="hxText"
                            value={textAreavalue}
                            rows={4}
                            onChange={this.onTextAreaChange}
                            placeholder="Controlled autosize"
                            autoSize={{ minRows: 3, maxRows: 5 }}
                        />
                        <div className={cs("hx_box_num", { "color_red": textNumber > 140 })}>{textNumber}/140</div>
                    </div>
                </div>

                <div className="fmt_container">
                    <div className="fmt_container_title edit_title">封面图(必填项<span className="fmt_container_tips">图片最低尺寸要求 450像素*270像素</span>)</div>
                    <Row className="row color_hui flex_hc" type="flex">
                        {
                            lastImgList.map((item, idx) =>
                                <Col onClick={this.showImgChooseModel.bind(null, idx)} className="mr-12">
                                    {
                                        item === '' ? <div className="img_add_box">+</div> :
                                            <img className="last_img_item" src={item} />
                                    }
                                </Col>
                            )
                        }
                    </Row>

                </div>


                <div className="addBq_container">
                    <div className="fmt_container_title edit_title">添加标签 <span className="font_color_grid">文章审核通过后不可再修改关联话题。</span></div>
                    <div className="bq_list">
                        {
                            tagList.map((item, idx) => {
                                return <div className="bq_list_item"><span onClick={this.deleteTag.bind(null, idx)} className="cancle_btn"></span> {item.name}</div>
                            })
                        }

                        <Button onClick={this.showBqToast} > + 添加标签</Button>
                    </div>
                </div>

                <div className="submit_btn">
                    <Checkbox checked={this.state.shiXiao} onChange={this.checkboxChange}>时效内容</Checkbox>
                    <Button onClick={this.debounce(this.submitAllData, 3000, true)} size="large" type="primary">发布</Button>
                </div>
                <div className="qingwuzhuanzai">
                    <Switch checked={qingwuzhuanzai} onChange={this.switchChange} /> 请勿转载
                </div>

            </div>
        );
    }
}

const EditPage = Form.create()(EditForm);

export default withRouter(EditPage);
