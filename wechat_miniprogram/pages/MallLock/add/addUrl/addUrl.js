var t = getApp();

Page({
    data: {
        count: 0
    },
    onLoad: function(o) {
        var a = this;
        wx.request({
            url: t.lockUrl + "/url/getCount",
            data: {},
            header: {
                "Content-Type": "application/json"
            },
            success: function(t) {
                console.log(t.data), a.count = t.data, a.setData({
                    count: a.count
                });
            }
        });
    },
    onShow: function() {},
    scanUrl: function() {
        var o = this, a = "";
        wx.scanCode({
            success: function(n) {
                (a = n.result).startsWith("https://static.dmall.com/") ? wx.request({
                    url: t.lockUrl + "/url/addUrl",
                    data: {
                        url: a
                    },
                    header: {
                        "Content-Type": "application/json"
                    },
                    success: function(a) {
                        console.log(a.data), "100" == a.data.code ? (o.count = o.count + 1, o.setData({
                            count: o.count
                        }), wx.showToast({
                            title: "入库成功",
                            icon: "success",
                            duration: 2e3
                        })) : "201" == a.data.code ? wx.showModal({
                            title: t.alert,
                            content: "URL重复",
                            showCancel: !1
                        }) : o.alert("系统出错，请重新录入");
                    }
                }) : wx.showModal({
                    title: t.alert,
                    content: "URL格式错误",
                    showCancel: !1
                });
            }
        });
    }
});