var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');



var app = getApp();

Page({
  data: {
    array: ['请选择反馈类型', '商品相关', '物流状况', '客户服务', '优惠活动', '功能异常', '产品建议', '其他'],
    index: 0,
    content:'',
    contentLength:0,
    mobile:''
  },
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    });
  },
  mobileInput: function (e) {
    let that = this;
    this.setData({
      mobile: e.detail.value,
    });
  },
  contentInput: function (e) {
   
    let that = this;
    this.setData({
      contentLength: e.detail.cursor,
      content: e.detail.value,
    });
  },
  cleanMobile:function(){
    let that = this;

  },
    bindCheckMobile: function (mobile) {
        if (!mobile) {
            wx.showModal({
                title: '错误',
                content: '请输入手机号码'
            });
            return false
        }
        if (!mobile.match(/^1[3-9][0-9]\d{8}$/)) {
            wx.showModal({
                title: '错误',
                content: '手机号格式不正确，仅支持国内手机号码'
            });
            return false
        }
        return true
    },
  sbmitFeedback : function(e){
    let that = this;
    if (that.data.index == 0){
      util.showErrorToast('请选择反馈类型');
      return false;
    }

    if (that.data.content == '') {
      util.showErrorToast('请输入反馈内容');
      return false;
    }
      if (!this.bindCheckMobile(that.data.mobile)) {
          return
      }
    // if (that.data.mobile == '') {
    //   util.showErrorToast('请输入手机号码');
    //   return false;
    // }
    wx.showLoading({
      title: '提交中...',
      mask:true,
      success: function () {

      }
    });

    util.request(api.FeedbackAdd, { mobile: that.data.mobile, index: that.data.index, content: that.data.content}).then(function (res) {
        console.log(res.errmsg)
      if (res.errno == 0) {

        wx.hideLoading();
        
        wx.showToast({
          title: res.data,
          icon: 'success',
          duration: 2000,
          complete: function () {
            that.setData({
              index: 0,
              content: '',
              contentLength: 0,
              mobile: ''
            });
          }
        });
      } else {
        util.showErrorToast(res.data);
      }
      
    });
  },
  onLoad: function (options) {
  },
  onReady: function () {

  },
  onShow: function () {

  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭
  }
})