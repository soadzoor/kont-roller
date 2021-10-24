var a = getApp(), t = require("../language/loginLang");

Page({
    data: {
        la_lib: []
    },
    onLoad: function(a) {
        var e = t.Fetch_language_lib();
        console.log("language:", e.username), this.setData({
            la_lib: e
        });
    },
    onShareAppMessage: function() {},
    uuInput: function(a) {
        this.setData({
            uname: a.detail.value
        });
    },
    pasWInput: function(a) {
        this.setData({
            pword: a.detail.value
        });
    },
    bindFormSubmit: function(t) {
        if (null != this.data.uname) var e = this.data.uname.trim();
        if (null != this.data.pword) var n = this.data.pword.trim();
        console.log(e), console.log(n);
        var l = this;
        "" == e || "" == n || null == e || null == n ? wx.showModal({
            title: "error",
            content: l.data.la_lib.alertaccount,
            showCancel: !1,
            confirmText: l.data.la_lib.confiem
        }) : wx.request({
            url: a.vehiUrl + "/user/addUser",
            data: {
                acc: e,
                pass: n,
                openid: a.openid
            },
            header: {
                "Content-Type": "application/json"
            },
            success: function(a) {
                console.log(a.data), "100" == a.data ? (wx.showModal({
                    title: "",
                    content: l.data.la_lib.addSuccess,
                    confirmText: l.data.la_lib.confiem,
                    showCancel: !1
                }), wx.navigateTo({
                    url: "../index/index"
                })) : "101" == a.data ? wx.showModal({
                    title: "",
                    content: l.data.la_lib.addError,
                    confirmText: l.data.la_lib.confiem,
                    showCancel: !1
                }) : "200" == a.data && wx.showModal({
                    title: "",
                    content: l.data.la_lib.existUser,
                    confirmText: l.data.la_lib.confiem,
                    showCancel: !1
                });
            }
        });
    }
});