import React, { Component } from 'react';
import { Modal, Button, Input } from 'antd';
import './style.css';
import GetTagList from './../../pages/hooks/useGetTagList';

import cs from 'classnames';

const { Search } = Input;

class toastComponent extends React.Component {
    state = {
        visible: false,
        tagIdList: [],
        tagIdList2: [],
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

    isgetTagList = async () => {
        let tagList = await GetTagList(0);
        this.setState({
            tagIdList: tagList.data
        })
    }


    isgetTagList2 = async (id) => {
        let tagList = await GetTagList(id);
        this.setState({
            tagIdList2: tagList.data
        })
    }

    chhooseTag1 = (id) => {
        this.setState({
            showTag2: true
        })
        this.isgetTagList2(id);
    }

    chhooseTag2 = (id) => {
        this.props.getTagid(id);
    }

    searchFocus = () => {
        this.setState({
            showsearchTagList: true
        })
    }

    blurSearch = () => {
        this.setState({
            showsearchTagList: false,
            searchTagList: []
        })
    }


    //搜索all标签
    searchAllTag = (value) => {
        let _this = this;
        // fetch(`http://open.suwenyj.xyz:8080/tag/searchTag?tagName=${value}`)
        fetch(`/tag/searchTag?tagName=${value}`)
            .then(function (response) {
                return response.json()
            }).then(function (json) {            
                if (json.success) {
                    _this.setState({
                        searchTagList: json.data
                    })
                } else if (json.msg == '未登录') {
                   window.initLogin();
                }

                //隐藏弹窗
                // _this.handleCancel();

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
        // console.log(e.target.value)
        this.searchAllTag(e.target.value)
    }

    componentDidMount() {

        this.isgetTagList();

    }

    render() {

        let _this = this;
        let { tagIdList, tagIdList2, showTag2, searchTagList, showsearchTagList } = this.state;

        return (
            <div>
                <Modal
                    title="添加标签"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <div className="search_container">
                        <Search onFocus={this.searchFocus} placeholder="搜索标签" onInput={this.searchInput} onSearch={value => console.log(value)} enterButton />
                        <div className={cs("search_list_box", { "show": showsearchTagList })}>
                            {
                                searchTagList.length && searchTagList.map(item => {
                                    return <div onClick={_this.chhooseTag2.bind(null, item)} className="search_tag_item">#{item.tagName}#</div>
                                })
                            }
                            <div onClick={this.closeSearch} className="close_search_list_box">关闭</div>
                        </div>
                    </div>
                    <div className="table_header">
                        <div onClick={this.cheackBq1} className={cs("table_header_item", { "checked": !showTag2 })}>一级标签</div>
                        <div className={cs("table_header_item", { "checked": showTag2 })}>二级标签</div>
                        <div className="table_header_item"></div>
                        <div className="table_header_item bg_red_color">关闭</div>
                    </div>

                    {
                        !showTag2 && <div className="tag_list">
                            {
                                tagIdList.length && tagIdList.map((item) => {
                                    return <div onClick={this.chhooseTag1.bind(null, item.id)} className="tag_item">{item.tagName}</div>
                                })}
                        </div>
                    }
                    {
                        showTag2 &&
                        <div className="tag_list">
                            {
                                tagIdList.length && tagIdList2.map((item) => {
                                    return <div onClick={this.chhooseTag2.bind(null, {
                                        id: item.id,
                                        name: item.tagName
                                    })} className="tag_item">{item.tagName}</div>
                                })}
                        </div>
                    }


                </Modal>
            </div>
        );
    }
}

export default toastComponent;
