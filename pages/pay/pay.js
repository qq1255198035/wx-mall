var app = getApp();
var util = require('../../utils/util.js');
var api = require('../../config/api.js');

Page({
  data: {
    orderId: 0,
    actualPrice: 0.00,
    orderNumber:0,
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      orderId: options.orderId,
      actualPrice: options.actualPrice,
        orderNumber: options.orderNumber
    })
      console.log(options);
  },
  onReady: function () {

  },
  onShow: function () {
    // 页面显示

  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

  },
  //向服务请求支付参数
  requestPayParam() {
    let that = this;
    util.request(api.PayPrepayId, { orderId: that.data.orderId, payType: 1 }).then(function (res) {
      if (res.errno === 0) {
        let payParam = res.data;
         // console.log(22);
        wx.requestPayment({
          'timeStamp': payParam.timeStamp,
            'nonceStr': payParam.nonceStr,
            'package': payParam.package,
          'signType': payParam.signType,
          'paySign': payParam.paySign,
          'success': function (res) {
            wx.redirectTo({
              url: './../payResult/payResult?status=true',
            })
          },
          'fail': function (res) {
            wx.redirectTo({
                url: './../payResult/payResult?status=false&orderId='+that.data.orderId,
            })
          }
        })
          
      }
    });
  },
  startPay() {
    this.requestPayParam();
    //console.log(11);
  }
})