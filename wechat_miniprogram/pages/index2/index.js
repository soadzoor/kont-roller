var t = require("../../@babel/runtime/helpers/typeof"), a = getApp();

Page({
    data: {
        disabled: !1,
        no: "",
        pwd: "",
        noinput: !1,
        pwdinput: !1
    },
    noinput: function(t) {
        this.setData({
            no: t.detail.value
        }), this.setData({
            noinput: !0
        }), 1 == this.data.noinput && 1 == this.data.pwdinput && this.setData({
            disabled: !1
        });
    },
    pwdinput: function(t) {
        this.setData({
            pwd: t.detail.value
        }), this.setData({
            pwdinput: !0
        }), 1 == this.data.noinput && 1 == this.data.pwdinput && this.setData({
            disabled: !1
        });
    },
    formSubmit: function(t) {
        wx.showLoading({
            title: "登录中..."
        }), console.log(t), this.setData({
            disabled: !0
        }), wx.request({
            url: a.globalData.url.login,
            data: {
                no: t.detail.value.no,
                pwd: t.detail.value.pwd
            },
            header: {
                "content-type": "application/json"
            },
            success: function(t) {
                console.log(t), 200 == t.statusCode ? 1 == t.data.error ? wx.showToast({
                    title: t.data.msg,
                    icon: "none",
                    duration: 2e3
                }) : (wx.setStorageSync("student", t.data.data), wx.showToast({
                    title: t.data.msg,
                    icon: "success",
                    duration: 2e3
                }), setTimeout(function() {
                    wx.switchTab({
                        url: "../teacher/teacher"
                    });
                }, 2e3)) : wx.showToast({
                    title: "服务器出现错误",
                    icon: "none",
                    duration: 2e3
                });
            }
        });
    },
    onLoad: function(a) {
        this.setData({
            disabled: !1
        });
        var e = wx.getStorageSync("student");
        "object" == t(e) && "" != e.no && "" != e.classid && wx.switchTab({
            url: "../teacher/teacher"
        });
    },
    onReady: function() {},
    onShow: function() {
        "" == this.data.no || "" == this.data.pwd ? this.setData({
            disabled: !0
        }) : this.setData({
            disabled: !1
        });
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {}
});