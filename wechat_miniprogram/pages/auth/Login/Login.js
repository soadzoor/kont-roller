var a = getApp(), t = require("../../language/loginLang"), e = "";

Page({
    data: {
        la_lib: []
    },
    onLoad: function(n) {
        var o = this, l = t.Fetch_language_lib();
        e = n.master, wx.request({
            url: a.vehiUrl + "/share/checkCount",
            data: {
                account: e
            },
            header: {
                "Content-Type": "application/json"
            },
            success: function(a) {
                console.log(a.data), "100" == a.data ? o.setData({
                    yes: !0,
                    no: !1
                }) : "200" == a.data && o.setData({
                    yes: !1,
                    no: !0
                });
            }
        }), console.log("language:", l.username), o.setData({
            la_lib: l
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
        if (null != this.data.uname) var n = this.data.uname.trim();
        if (null != this.data.pword) var o = this.data.pword.trim();
        console.log(n), console.log(o);
        var l = this;
        "" == n || "" == o || null == n || null == o ? wx.showModal({
            title: "error",
            content: l.data.la_lib.alertaccount,
            showCancel: !1,
            confirmText: l.data.la_lib.confiem
        }) : wx.request({
            url: a.vehiUrl + "/share/setShare",
            data: {
                account: n,
                pass: o,
                master: e
            },
            header: {
                "Content-Type": "application/json"
            },
            success: function(a) {
                console.log(a.data), "100" == a.data ? (wx.showModal({
                    title: "",
                    content: l.data.la_lib.authSuccess,
                    confirmText: l.data.la_lib.confiem,
                    showCancel: !1
                }), setTimeout(function() {
                    wx.redirectTo({
                        url: "../../index/index"
                    });
                }, 1e3)) : "101" == a.data ? wx.showModal({
                    title: "",
                    content: l.data.la_lib.countOver,
                    confirmText: l.data.la_lib.confiem,
                    showCancel: !1
                }) : "102" == a.data ? wx.showModal({
                    title: "",
                    content: l.data.la_lib.authEror,
                    confirmText: l.data.la_lib.confiem,
                    showCancel: !1
                }) : "200" == a.data ? l.setData({
                    no: !0,
                    yes: !1
                }) : "201" == a.data ? wx.showModal({
                    title: "",
                    content: l.data.la_lib.accError,
                    confirmText: l.data.la_lib.confiem,
                    showCancel: !1
                }) : "202" == a.data && wx.showModal({
                    title: "",
                    content: l.data.la_lib.myself,
                    confirmText: l.data.la_lib.confiem,
                    showCancel: !1
                });
            }
        });
    }
});