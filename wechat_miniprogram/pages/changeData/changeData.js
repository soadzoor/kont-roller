var t = getApp(), e = "", a = "", o = "", n = "", s = 0;

Page({
    data: {},
    onLoad: function(t) {
        this.setData({
            showModal1: !0
        });
    },
    checkCount: function() {
        var e = this;
        wx.request({
            url: t.vehiUrl + "/vehicle/checkBoxCount",
            data: {
                box: o
            },
            header: {
                "Content-Type": "application/json"
            },
            success: function(t) {
                s = t.data, e.setData({
                    boxCount: s
                });
            },
            fail: function() {
                e.setData({
                    boxCount: "程序出错"
                });
            }
        });
    },
    qrUrl: function() {
        var a = this;
        wx.scanCode({
            success: function(o) {
                console.log(o.result), (e = o.result).startsWith("https") ? a.setData({
                    urlMess: "请扫描模块二维码"
                }) : wx.showModal({
                    title: t.alert,
                    content: "请确认二维码是否正确",
                    showCancel: !1
                });
            }
        });
    },
    qrUrl2: function() {
        var o = this;
        wx.scanCode({
            success: function(n) {
                if (console.log(n.result), (a = n.result).startsWith("https")) if (a == e) {
                    var s;
                    s = e.split("/")[4], o.setData({
                        urlMess: "该URL为:.../" + s + "\n 对比通过"
                    });
                } else wx.showModal({
                    title: t.alert,
                    content: "车头二维码与模块二维码不一致！",
                    showCancel: !1
                }), e = "", a = ""; else wx.showModal({
                    title: t.alert,
                    content: "请确认二维码是否正确",
                    showCancel: !1
                });
            }
        });
    },
    changeData: function() {
        var n = this;
        "" != e && "" != a ? "" == o ? (wx.showModal({
            title: t.alert,
            content: "请先输入货柜号",
            showCancel: !1
        }), o = "") : wx.request({
            url: t.vehiUrl + "/vehicle/changeTarge",
            data: {
                url: e,
                targe: 2,
                box: o
            },
            header: {
                "Content-Type": "application/json"
            },
            success: function(o) {
                console.log(o.data), "success" == o.data ? (wx.vibrateLong(), wx.showModal({
                    title: t.alert,
                    content: "出货成功！",
                    showCancel: !1
                }), n.checkCount(), e = "", a = "", n.setData({
                    urlMess: ""
                })) : "not exist" == o.data && wx.showModal({
                    title: t.alert,
                    content: "该设备不存在",
                    showCancel: !1
                });
            }
        }) : wx.showModal({
            title: t.alert,
            content: "请确认已经扫描车头及模块二维码",
            showCancel: !1
        });
    },
    changeData2: function() {
        var o = this;
        "" != a ? wx.request({
            url: t.vehiUrl + "/vehicle/changeTarge",
            data: {
                url: a,
                targe: 3,
                box: ""
            },
            header: {
                "Content-Type": "application/json"
            },
            success: function(n) {
                console.log(n.data), "success" == n.data ? (wx.vibrateLong(), wx.showModal({
                    title: t.alert,
                    content: "撤销成功！",
                    showCancel: !1
                }), o.checkCount(), e = "", a = "", o.setData({
                    urlMess: ""
                })) : "not exist" == n.data && wx.showModal({
                    title: t.alert,
                    content: "该设备不存在",
                    showCancel: !1
                });
            }
        }) : wx.showModal({
            title: t.alert,
            content: "请重新扫描模块二维码",
            showCancel: !1
        });
    },
    showDialogBtn1: function() {
        this.setData({
            showModal1: !0
        });
    },
    input1: function(t) {
        var e = t.detail.value;
        o = e, n = e;
    },
    onCancel: function() {
        this.setData({
            showModal1: !1
        });
    },
    onConfirm: function() {
        "" == n ? wx.showModal({
            title: t.alert,
            content: "请输入货柜号",
            showCancel: !1
        }) : 15 != n.length ? wx.showModal({
            title: t.alert,
            content: "请输入正确的货柜号",
            showCancel: !1
        }) : (console.log(o), this.setData({
            boxVal: o,
            showModal1: !1
        }), this.checkCount(), n = "");
    }
});