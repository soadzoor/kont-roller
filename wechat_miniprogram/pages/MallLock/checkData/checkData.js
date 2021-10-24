var t = getApp(), a = require("../../../utils/chikoUtil.js");

Page({
    data: {
        url: "",
        mac: "",
        type: void 0
    },
    onLoad: function(t) {
        "lock" == t.type ? (this.data.type = 1, this.setData({
            LorG: "URL"
        })) : "gate" == t.type && (this.data.type = 2, this.setData({
            LorG: "MAC"
        }));
    },
    onShow: function() {},
    onUnload: function() {},
    alert: function(a) {
        wx.showModal({
            title: t.alert,
            content: a,
            showCancel: !1
        });
    },
    scan: function() {
        var e = this, o = "";
        wx.scanCode({
            success: function(s) {
                1 == e.data.type ? (e.url = a.Url_updateMac(s.result), console.log(e.url), 17 == e.url.length ? wx.request({
                    url: t.lockUrl + "/lock/getYD",
                    data: {
                        url: e.url
                    },
                    header: {
                        "Content-Type": "application/json"
                    },
                    success: function(t) {
                        console.log(t.data), "100" == t.data.code ? e.setData({
                            lockMessage: !0,
                            lockId: t.data.lockId,
                            store: t.data.store,
                            box: t.data.box,
                            outDate: t.data.outDate,
                            outCount: t.data.outCount
                        }) : "101" == t.data.code ? (e.setData({
                            lockMessage: !1
                        }), e.alert("没有记录")) : e.alert("系统出错，请稍后再试");
                    }
                }) : wx.showModal({
                    title: t.alert,
                    content: "URL格式错误",
                    showCancel: !1
                })) : 2 == e.data.type && (17 == (o = s.result).length ? (e.data.mac = o, wx.request({
                    url: t.lockUrl + "/gateway/checkData",
                    data: {
                        mac: e.data.mac
                    },
                    header: {
                        "Content-Type": "application/json"
                    },
                    success: function(t) {
                        console.log(t.data), "100" == t.data.code ? e.setData({
                            gateMessage: !0,
                            store: t.data.store,
                            imeiTxt: t.data.imei,
                            iccidTxt: t.data.iccid
                        }) : "101" == t.data.code ? (e.setData({
                            gateMessage: !1
                        }), e.alert("没有记录")) : e.alert("系统出错，请稍后再试");
                    }
                })) : a.ALert("MAC格式错误"));
            }
        });
    }
});