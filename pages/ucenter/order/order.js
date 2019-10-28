var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');

Page({
  data:{
    orderList: [],
    page: 1,
    size: 10,
    loadmoreText: '正在加载更多数据',
    nomoreText: '全部加载完成',
    nomore: false,
    totalPages: 1,
    goodsList:{}
    
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    // 页面显示

    wx.showLoading({
      title: '加载中...',
      success: function () {

      }
    });
    this.getOrderList();
   
  },

  /**
       * 页面上拉触底事件的处理函数
       */
  onReachBottom: function () {
    this.getOrderList()
  },
  getOrderList(){
    let that = this;
    if (that.data.totalPages <= that.data.page - 1) {
      that.setData({
        nomore: true
      })
      return;
    }
    util.request(api.OrderList, {page: that.data.page, size: that.data.size}).then(function (res) {
      if (res.errno === 0) {  
               
            that.setData({
                //合并json数据
                orderList: that.data.orderList.concat(res.data.data),
                page: res.data.currentPage + 1,
                totalPages: res.data.totalPages,
                //合并map数据方法assign
                goodsList: Object.assign(res.data.goodsList,that.data.goodsList)
            });
        wx.hideLoading();
      }   
    });
  },
  payOrder(event){
      let that = this;
      let orderIndex = event.currentTarget.dataset.orderIndex;
      let order = that.data.orderList[orderIndex];
      wx.navigateTo({
          url: '/pages/pay/pay?orderId=' + order.id + '&actualPrice=' + order.actual_price + '&orderNumber=' + order.order_sn,
      })
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){

  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  cancelOrder(e) {
      let that = this;
      var order_status = this.data.orderList.order_status;
        var errorMessage = '';
        switch (order_status) {
            case 300: {
                errorMessage = '订单已发货';
                break;
            }
            case 301: {
                errorMessage = '订单已收货';
                break;
            }
            case 101: {
                errorMessage = '订单已取消';
                break;
            }
            case 102: {
                errorMessage = '订单已删除';
                break;
            }
            case 401: {
                errorMessage = '订单已退款';
                break;
            }
            case 402: {
                errorMessage = '订单已退货';
                break;
            }
        }
        if (errorMessage != '') {
            util.showErrorToast(errorMessage);
            return false;
        }
        wx.showModal({
            title: '',
            content: '确定要取消此订单？',
            success: function (res) {
                if (res.confirm) {
                    console.log(that.data.orderList);
                    util.request(api.OrderCancel, {
                        orderId: e.target.dataset.id
                    }).then(function (res) {
                        if (res.errno === 0) {
                            wx.showModal({
                                title: '提示',
                                content: res.errmsg,
                                showCancel: false,
                                confirmText: '继续',
                                success: function (res) {
                                    util.redirect('/pages/ucenter/order/order');
                                    // wx.navigateBack({
                                    //     url: 'pages/ucenter/order/order',
                                    // });
                                }
                            });
                        }
                    });

                }
            }
        });
    },
})