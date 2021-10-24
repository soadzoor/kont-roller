var t = getApp(), a = require("../../../utils/chikoUtil.js");

require("../../../utils/util");

Page({
    data: {
        url: "",
        state: 0
    },
    onLoad: function(t) {},
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    alert: function(a) {
        wx.showModal({
            title: t.alert,
            content: a,
            showCancel: !1
        });
    },
    scanUrl: function() {
        var e = this;
        wx.scanCode({
            success: function(o) {
                console.log(o);
                var l = o.result;
                if (l.startsWith("YSL")) e.url = l, wx.request({
                    url: t.lockUrl + "/url/getId",
                    data: {
                        url: e.url
                    },
                    header: {
                        "Content-Type": "application/json"
                    },
                    success: function(t) {
                        console.log(t.data), "100" == t.data.code ? e.setData({
                            lockId: "对应ID:" + t.data.lockId
                        }) : "101" == t.data.code ? e.alert("没有记录") : "102" == t.data.code ? e.alert("已经出过货！") : "105" == t.data.code ? e.alert("出现重码或已经出货！") : "200" == t.data.code ? e.alert("接口出错") : e.alert("系统出错，请稍后再试");
                    }
                }); else if (l.startsWith("https://samokat-rf")) e.setData({
                    lockId: l.split("/")[4]
                }); else {
                    1 == a.checkUrlComplete(l) ? (e.url = a.Url_updateMac(o.result), console.log(e.url), 
                    17 == e.url.length ? wx.request({
                        url: t.lockUrl + "/url/getId",
                        data: {
                            url: e.url
                        },
                        header: {
                            "Content-Type": "application/json"
                        },
                        success: function(t) {
                            console.log(t.data), "100" == t.data.code ? e.setData({
                                lockId: "对应ID:" + t.data.lockId
                            }) : "101" == t.data.code ? e.alert("没有记录") : "102" == t.data.code ? e.setData({
                                lockId: "对应ID:" + t.data.lockId
                            }) : "105" == t.data.code ? e.alert("出现重码或已经出货！") : "200" == t.data.code ? e.alert("接口出错") : e.alert("系统出错，请稍后再试");
                        }
                    }) : a.Alert("二维码不正确")) : l.startsWith("http://weixin.qq.com/q") ? (e.url = l, wx.request({
                        url: t.lockUrl + "/url/getId",
                        data: {
                            url: e.url
                        },
                        header: {
                            "Content-Type": "application/json"
                        },
                        success: function(t) {
                            console.log(t.data), "100" == t.data.code ? e.setData({
                                lockId: "对应ID:" + t.data.lockId
                            }) : "101" == t.data.code ? e.alert("没有记录") : "102" == t.data.code ? e.alert("已经出过货！") : "105" == t.data.code ? e.alert("出现重码或已经出货！") : "200" == t.data.code ? e.alert("接口出错") : e.alert("系统出错，请稍后再试");
                        }
                    })) : wx.showModal({
                        title: t.alert,
                        content: "二维码异常",
                        showCancel: !1
                    });
                }
            }
        });
    },
    changeType: function() {
        var a = this;
        wx.request({
            url: t.lockUrl + "/url/changeUT",
            data: {
                url: a.url
            },
            header: {
                "Content-Type": "application/json"
            },
            success: function(t) {
                console.log(t.data), "100" == t.data.code ? (wx.showToast({
                    title: "已通过",
                    icon: "success",
                    duration: 2e3
                }), a.setData({
                    lockId: ""
                })) : a.alert("系统出错，请稍后再试");
            }
        });
    },
    fall: function() {
        this.setData({
            lockId: ""
        }), wx.showToast({
            title: "成功",
            icon: "success",
            duration: 2e3
        });
    }
});