var a = getApp(), t = require("../../language/loginLang"), e = "";

Page({
    data: {
        la_lib: []
    },
    onLoad: function(a) {
        var n = t.Fetch_language_lib();
        this.setData({
            la_lib: n
        }), e = a.user;
    },
    onShareAppMessage: function(a) {
        var t = {
            title: this.data.la_lib.bleAuth,
            path: "/pages/auth/Login/Login?master=" + e,
            imageUrl: "../../img/logo.jpg",
            success: function(a) {
                console.log("sdasdasd");
            }
        };
        if ("button" == a.from) {
            if (1 == a.target.id) return t;
        } else wx.showModal({
            title: "",
            content: "Error",
            showCancel: !1
        });
    },
    blue: function() {
        wx.navigateTo({
            url: "../../blueOpen/blueOpen?type=customer"
        });
    },
    share: function() {
        var t = this;
        wx.request({
            url: a.vehiUrl + "/share/addShare",
            data: {
                account: e,
                count: 10
            },
            header: {
                "Content-Type": "application/json"
            },
            success: function(a) {
                console.log(a.data), "100" == a.data ? wx.showModal({
                    title: "",
                    content: t.data.la_lib.authOK,
                    confirmText: t.data.la_lib.confiem,
                    showCancel: !1
                }) : "200" == a.data && wx.showModal({
                    title: "",
                    content: t.data.la_lib.authNO,
                    confirmText: t.data.la_lib.confiem,
                    showCancel: !1
                });
            }
        });
    }
});