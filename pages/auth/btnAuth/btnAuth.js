const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');

//获取应用实例
const app = getApp()
Page({
    data: {
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        navUrl: ''
    },

    onLoad: function (options) {
        let that = this;
        console.log(options)
        if (wx.getStorageSync("navUrl")) {
            that.setData(
                {
                    navUrl: wx.getStorageSync("navUrl")
                }
            )
        } else {
            that.setData(
                {
                    navUrl: './../../../pages/topic/topic'
                }
            )    
        }
    },
    bindGetUserInfo: function (e) {
        let that = this;
        wx.login({
            success: function (res) {
                console.log(res)
                if (res.code) {
                    //登录远程服务器
                    console.log(11)
                    util.request(api.AuthLoginByWeixin, {
                        code: res.code,
                        userInfo: e.detail
                    }, 'POST', 'application/json').then(res => {
                        console.log(res)
                        if (res.errno == 0) {
                            //存储用户信息
                            wx.setStorageSync('userInfo', res.data.userInfo);
                            wx.setStorageSync('token', res.data.token);
                            wx.setStorageSync('userId', res.data.userId);
                            util.showSuccessToast("登录成功")
                        } else {
                            console.log(22)
                            //util.showErrorToast(res.errmsg)
                            wx.showModal({
                                title: '提示',
                                content: res.errmsg,
                                showCancel: false
                            });
                        }
                    });
                }
            }
        });

        if (that.data.navUrl && that.data.navUrl == './../../../pages/topic/topic') {
            wx.switchTab({
                url: that.data.navUrl,
            })
        } else if (that.data.navUrl) {
            wx.redirectTo({
                url: that.data.navUrl,
            })
        }
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
    onUnload: function () {
        // 页面关闭
    }
})
