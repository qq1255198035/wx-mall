var util = require('../../utils/util.js');
var api = require('../../config/api.js');

Page({
  data: {
   
    navList: [],
    goodsList: [],
    id: 0,
    currentCategory: {},
    scrollLeft: 0,
    scrollTop: 0,
    scrollHeight: 0,
    page: 1,
    size: 10,
    loadmoreText: '正在加载更多数据',
    nomoreText: '全部加载完成',
    nomore: false,
    totalPages: 1,
    
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    
    var that = this;
    if (options.id) {
      that.setData({
        id: options.id
      });
    }
      console.log(options)
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight
        });
      }
    });


    this.getCategoryInfo();

  },
  getCategoryInfo: function () {
    let that = this;
    util.request(api.GoodsCategory, { id: that.data.id })
      .then(function (res) {

        if (res.errno == 0) {
          that.setData({
            navList: res.data.brotherCategory,
            currentCategory: res.data.currentCategory
          });

          //nav位置
          let currentIndex = 0;
          let navListCount = that.data.navList.length;
          for (let i = 0; i < navListCount; i++) {
            currentIndex += 1;
            if (that.data.navList[i].id == that.data.id) {
              break;
            }
          }
          if (currentIndex > navListCount / 2 && navListCount > 5) {
            that.setData({
              scrollLeft: currentIndex * 60
            });
          }
          that.getGoodsList();

        } else {
          //显示错误信息
        }
        
      });
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },

  /**
     * 页面上拉触底事件的处理函数
     */
  onReachBottom: function () {
    this.getGoodsList()
  },

  getGoodsList: function () {
    var that = this;

    if (that.data.totalPages <= that.data.page-1) {
      that.setData({
        nomore: true
      })
      return;
    }

    util.request(api.GoodsList, {categoryId: that.data.id, page: that.data.page, size: that.data.size})
      .then(function (res) {
        that.setData({
          goodsList: that.data.goodsList.concat(res.data.goodsList),        
          page: res.data.currentPage+1,
          totalPages: res.data.totalPages
        });
      });
  },
  onUnload: function () {
    // 页面关闭
  },
  switchCate: function (event) {
    if (this.data.id == event.currentTarget.dataset.id) {
      return false;
    }
    var that = this;
    var clientX = event.detail.x;
    var currentTarget = event.currentTarget;
    if (clientX < 60) {
      that.setData({
        scrollLeft: currentTarget.offsetLeft - 60
      });
    } else if (clientX > 330) {
      that.setData({
        scrollLeft: currentTarget.offsetLeft
      });
    }
    this.setData({
      id: event.currentTarget.dataset.id,
      page:1,
      totalPages: 1,
      goodsList: [],
      nomore: false
    });
    
    this.getCategoryInfo();
  }
})