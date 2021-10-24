var t = getApp();

Page({
    data: {
        mac: ""
    },
    onLoad: function(t) {},
    onReady: function() {},
    scan: function() {
        var t = this;
        wx.scanCode({
            success: function(a) {
                var o = a.result;
                12 == o.length ? (wx.vibrateShort(), t.setData({
                    mac: o
                })) : (wx.vibrateLong(), wx.showToast({
                    title: "格式错误",
                    icon: "loading",
                    duration: 2e3
                }));
            }
        });
    },
    drop: function() {
        var a = this;
        wx.request({
            url: t.temUrl + "/temInfo/dropTem",
            data: {
                mac: this.data.mac
            },
            success: function(t) {
                "100" == t.data.code ? (a.setData({
                    mac: ""
                }), wx.vibrateShort(), wx.showToast({
                    title: "删除成功",
                    icon: "success",
                    duration: 1e3
                })) : (wx.vibrateLong(), wx.showToast({
                    title: "删除失败",
                    icon: "loading",
                    duration: 2e3
                }));
            }
        });
    }
});