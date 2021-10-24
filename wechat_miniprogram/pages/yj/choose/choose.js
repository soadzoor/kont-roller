getApp();

Page({
    data: {
        la_lib: []
    },
    onLoad: function(e) {
        e.user;
    },
    onShareAppMessage: function(e) {},
    blue: function() {
        wx.navigateTo({
            url: "../../blueOpen/blueOpen?type=flash"
        });
    },
    addUrl: function() {
        wx.navigateTo({
            url: "../insertUrl/insertUrl?type=tem"
        });
    },
    addIccid: function() {
        wx.navigateTo({
            url: "../insertIccid/insertIccid"
        });
    },
    out: function() {
        wx.navigateTo({
            url: "../../qrCompare/qrCompare?type=yj2"
        });
    },
    netUnlock: function() {
        wx.navigateTo({
            url: "../../yjTest/yjTest"
        });
    }
});