var a = getApp();

Page({
    data: {
        mac: ""
    },
    onLoad: function(a) {
        this.setData({
            mac: "请先扫描"
        });
    },
    onReady: function() {},
    scanMac: function() {
        var a = this;
        this.setData({
            mac: "请先扫描"
        }), wx.scanCode({
            success: function(t) {
                var o = t.result;
                12 == o.length ? (wx.vibrateShort(), console.log(o), a.setData({
                    mac: o
                })) : (wx.vibrateLong(), wx.showToast({
                    title: "格式错误",
                    icon: "loading",
                    duration: 2e3
                }));
            }
        });
    },
    addData: function() {
        var t = this;
        "请先扫描" == this.data.mac ? wx.showModal({
            content: "还未扫描MAC",
            showCancel: !1
        }) : wx.request({
            url: a.temUrl + "/temInfo/addTem",
            data: {
                mac: t.data.mac
            },
            success: function(a) {
                "100" == a.data.code ? (wx.vibrateShort(), wx.showToast({
                    icon: "success",
                    title: "添加成功",
                    duration: 1e3
                })) : "102" == a.data.code ? (wx.vibrateLong(), wx.showToast({
                    icon: "loading",
                    title: "重复添加",
                    duration: 2e3
                })) : (wx.vibrateLong(), wx.showToast({
                    icon: "loading",
                    title: "添加失败",
                    duration: 2e3
                })), t.setData({
                    mac: "请先扫描"
                });
            }
        });
    }
});