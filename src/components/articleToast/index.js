import React, { Component } from 'react';
import { Modal, Button, Input } from 'antd';
import './style.css';
import getAuthorList from '../../pages/hooks/useGetAnthor';

import cs from 'classnames';

import { authorListNoPage, articleList } from '../../utils/fetchApi';

const { Search } = Input;

class ArticleToast extends React.Component {
    state = {
        visible: false,
        authorList: [], //作者列表
        articleListdata: [],
        // tagIdList2: [],
        showTag2: false,
        searchTagList: [],
        showsearchTagList: false,
    };



    initModal = () => {
        this.setState({
            // tagIdList: [],
            tagIdList2: [],
            visible: false,
            showTag2: false,
            searchTagList: [],
            showsearchTagList: false,
        });
    }

    showModal = () => {
        this.setState({
            visible: true,
        });
    };

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
    };

    isGetAuthorList = async () => {
        // debugger
        let tagList = await getAuthorList();

        if (tagList.msg == "未登录") {
            window.initLogin();
        }
        // debugger
        this.setState({
            authorList: tagList.data || []
        })
    }


    // isgetTagList2 = async (id) => {
    //     let tagList = await GetTagList(id);
    //     this.setState({
    //         tagIdList2: tagList.data
    //     })
    // }

    // chhooseTag1 = (id) => {
    //     this.setState({
    //         showTag2: true
    //     })
    //     this.isgetTagList2(id);
    // }

    // chhooseTag2 = (id) => {
    //     this.props.getTagid(id);
    // }

    searchFocus = () => {
        this.setState({
            showsearchTagList: true
        })
    }

    blurSearch = () => {
        // debugger
        this.setState({
            showsearchTagList: false,
            searchTagList: []
        })
    }


    searchList = (e) => {

        let _this = this;
        let _url = `${articleList}?pageSize=50&pageNum=1&title=${e}`

        fetch(_url)
            .then(function (response) {
                return response.json()
            }).then(function (json) {

                if (json.success) {
                    //更新当前列表
                    _this.setState({
                        articleListdata: json.data
                    })
                    // window.scrollTo(0, 0);
                } else if (json.code == '506') {
                    window.initLogin();
                }
            }).catch(function (ex) {
                console.log('parsing failed', ex)
            })
    }


    cheackBq1 = () => {
        this.setState({
            showTag2: false
        })
    }

    closeSearch = () => {
        this.blurSearch();
    }

    searchInput = (e) => {
        this.searchList(e)
    }

    chooseAuthor = (item) => {
        // console.log(item)
        this.handleCancel();
        this.props.changeArticle(item);
    }

    componentDidMount() {

        this.isGetAuthorList();

    }

    render() {

        let _this = this;
        let { articleListdata } = this.state;
        return (
            <div>
                <Modal
                    title="添加文章"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={null}
                >
                    <div className="search_container">
                        {/* <Search onFocus={this.searchFocus} placeholder="搜索文章" onSearch={value => this.searchInput.bind(this,value)} enterButton /> */}
                        <Search onFocus={this.searchFocus} placeholder="搜索文章" onSearch={this.searchInput} enterButton />
                    </div>

                    <div className="tag_list">
                        {articleListdata.map((item) => {
                            return <div onClick={this.chooseAuthor.bind(null, item)} className="tag_item w_bfb_100">{item.title}</div>
                        })}
                    </div>

                </Modal>
            </div>
        );
    }
}

export default ArticleToast;
