var e = getApp(), t = require("../../language/loginLang"), a = "", n = 0;

Page({
    data: {
        la_lib: []
    },
    onLoad: function(e) {
        var a = t.Fetch_language_lib();
        this.setData({
            la_lib: a
        });
    },
    oldAes: function() {
        wx.navigateTo({
            url: "../../blueOpen/blueOpen?type=tf2"
        });
    },
    newAes: function() {
        e.globalData.aes = "35B0B4C3DB1673DE379A60000D35DE11", wx.navigateTo({
            url: "../../blueOpen/blueOpen?type=tf2"
        });
    },
    changeAes: function() {
        this.setData({
            showModal1: !0
        });
    },
    input1: function(e) {
        a = e.detail.value;
    },
    check: function() {
        var t = this;
        wx.request({
            url: e.vehiUrl + "/user/retRemarks",
            data: {
                id: a
            },
            header: {
                "Content-Type": "application/json"
            },
            success: function(e) {
                "200" == e.data ? t.setData({
                    customer: "没找到客户"
                }) : (n = 1, t.setData({
                    customer: e.data
                }));
            }
        });
    },
    onCancel1: function() {
        this.setData({
            showModal1: !1
        });
    },
    preventTouchMove1: function() {},
    onConfirm1: function() {
        var t = this;
        1 == n ? wx.request({
            url: e.vehiUrl + "/user/changeKey",
            data: {
                id: a,
                account: e.userMess.account
            },
            header: {
                "Content-Type": "application/json"
            },
            success: function(a) {
                t.setData({
                    showModal1: !1
                }), "100" == a.data.code ? (e.userMess.master = a.data.master, e.globalData.aes = a.data.bleKey, 
                wx.showModal({
                    title: e.alert,
                    content: "添加成功",
                    showCancel: !1
                }), wx.navigateTo({
                    url: "../../blueOpen/blueOpen?type=tf2"
                })) : "101" == a.data.code ? wx.showModal({
                    title: e.alert,
                    content: "添加失败",
                    showCancel: !1
                }) : "200" == a.data.code && wx.showModal({
                    title: e.alert,
                    content: "找不到上级客户",
                    showCancel: !1
                });
            }
        }) : wx.showModal({
            title: e.alert,
            content: "请先按检查",
            showCancel: !1
        });
    },
    testNewAes: function() {
        wx.navigateTo({
            url: "../../blueOpen/blueOpen?type=tf2"
        });
    }
});