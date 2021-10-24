getApp();

var e = require("../../language/loginLang");

Page({
    data: {
        la_lib: []
    },
    onLoad: function(n) {
        var a = e.Fetch_language_lib();
        this.setData({
            la_lib: a
        }), n.user;
    },
    onShareAppMessage: function(e) {},
    net: function() {
        wx.navigateTo({
            url: "../netUnlock/netUnlock"
        });
    },
    blue: function() {
        wx.navigateTo({
            url: "../../blueOpen/blueOpen?type=flash"
        });
    }
});