/*
 * 
 * WordPres版微信小程序
 * author: jianbo
 * organization: 守望轩  www.watch-life.net
 * github:    https://github.com/iamxjb/winxin-app-watch-life.net
 * 技术支持微信号：iamxjb
 * 开源协议：MIT
 * 
 *  *Copyright (c) 2017 https://www.watch-life.net All rights reserved.
 */

var Api = require('../../utils/api.js');
var util = require('../../utils/util.js');
var WxParse = require('../../wxParse/wxParse.js');
var wxApi = require('../../es6-promise/utils/wxApi.js')
var wxRequest = require('../../es6-promise/utils/wxRequest.js')


Page({
  data: {
    title: '文章列表',
    postsList: {},
    pagesList: {},
    categoriesList: {},
    postsShowSwiperList: {},
    isLastPage: false,
    page: 1,
    search: '',
    categories: 0,
    categoriesName:'',
    categoriesImage:"",
    showerror:"none",
    isCategoryPage:"none",
    isSearchPage:"none",
    showallDisplay: "block",
    displaySwiper: "block",
    floatDisplay: "none",
    searchKey:"",
    topBarItems: [
        // id name selected 选中状态
        { id: '1', name: '本年度最受欢迎', selected: true },
        { id: '2', name: '最受欢迎总排行', selected: false }
    ],
    tab: '1',

  },
  formSubmit: function (e) {
    var url = '../list/list'
    if (e.detail.value.input != '') {
      url = url + '?search=' + e.detail.value.input;
    }
    wx.navigateTo({
      url: url
    })
  },
  onShareAppMessage: function () {

    var title = "分享“守望轩”的热点文章。";
    var path ="pages/hot/hot";
    return {
      title: title,
      path: path,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  reload:function(e)
  {
    var self = this;
   
    self.fetchPostsData(self.data);
  },

  onTapTag: function (e) {
    var self = this;
    var tab = e.currentTarget.id;
    var topBarItems = self.data.topBarItems;
    // 切换topBarItem 
    for (var i = 0; i < topBarItems.length; i++) {
      if (tab == topBarItems[i].id) {
        topBarItems[i].selected = true;
      } else {
        topBarItems[i].selected = false;
      }
    }
    self.setData({
        topBarItems: topBarItems, 
        tab: tab

    })
    if (tab !== 0) {
      this.fetchPostsData(tab);
    } else {
      this.fetchPostsData("1");
    }
  },
  
  onLoad: function (options) {
    var self = this;
    this.fetchPostsData("1");
        
  },
  //获取文章列表数据
  fetchPostsData: function (tab) {
    var self = this;  
    self.setData({
        postsList: []
    });
    
    wx.showLoading({
      title: '正在加载',
      mask:true
    });
    var getTopHotPostsRequest = wxRequest.getRequest(Api.getTopHotPosts(tab));

    getTopHotPostsRequest.then(response =>{

        if (response.statusCode === 201) {

            self.setData({
                showallDisplay: "block",
                postsList: self.data.postsList.concat(response.data.map(function (item) {
                    var strdate = item.post_date


                    if (item.post_thumbnail_image == null || item.post_thumbnail_image == '') {
                        item.post_thumbnail_image = '../../images/watch-life-logo-128.jpg';
                    }
                    item.post_date = util.cutstr(strdate, 10, 1);
                    return item;
                })),

            });


        } else if (response.statusCode === 404) {
            wx.showModal({
                title: '加载失败',
                content: '加载数据失败,可能没有文章评论。',
                showCancel: false,
            });
        }

        setTimeout(function () {
            wx.hideLoading();

        }, 1500);

    })
    .catch(function () {
        wx.hideLoading();
        if (data.page == 1) {

            self.setData({
                showerror: "block",
                floatDisplay: "none"
            });

        }
        else {
            wx.showModal({
                title: '加载失败',
                content: '加载数据失败,请重试.',
                showCancel: false,
            });
        }
    })    
  }, 
  // 跳转至查看文章详情
  redictDetail: function (e) {
    // console.log('查看文章');
    var id = e.currentTarget.id,
      url = '../detail/detail?id=' + id;
    wx.navigateTo({
      url: url
    })
  },


})


