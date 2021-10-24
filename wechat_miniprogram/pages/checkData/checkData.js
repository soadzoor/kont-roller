var t = getApp(), e = "", o = "", a = "", n = "";

Page({
    data: {},
    onLoad: function(t) {
        var o = (e = t.url).split("/")[4];
        this.setData({
            urlMess: ".../" + o
        });
    },
    qrImei: function() {
        var t = this;
        wx.scanCode({
            success: function(e) {
                o = e.result, console.log(o), 15 == o.length ? t.setData({
                    imeiMess: o
                }) : (wx.vibrateLong(), wx.showToast({
                    title: "请确认IMEI无误",
                    icon: "loading",
                    duration: 2e3
                }), o = "");
            }
        });
    },
    qrMac: function() {
        var t = this;
        wx.scanCode({
            success: function(e) {
                a = e.result, console.log(a), 17 == a.length ? t.setData({
                    macMess: a
                }) : (wx.vibrateLong(), wx.showToast({
                    title: "请确认MAC无误",
                    icon: "loading",
                    duration: 2e3
                }), a = "");
            }
        });
    },
    qrIccid: function() {
        var t = this;
        wx.scanCode({
            success: function(e) {
                n = e.result, console.log(n), 20 == n.length ? (t.setData({
                    iccidMess: n
                }), t.add()) : (wx.vibrateLong(), wx.showToast({
                    title: "请确认ICCID无误",
                    icon: "loading",
                    duration: 2e3
                }), n = "");
            }
        });
    },
    add: function() {
        "" == o ? wx.showModal({
            title: t.alert,
            content: "请先扫描IMEI码",
            showCancel: !1
        }) : "" == a ? wx.showModal({
            title: t.alert,
            content: "请先扫描MAC码",
            showCancel: !1
        }) : "" == n ? wx.showModal({
            title: t.alert,
            content: "请先扫描ICCID码",
            showCancel: !1
        }) : wx.request({
            url: t.vehiUrl + "/vehicle/checkData",
            data: {
                url: e
            },
            header: {
                "Content-Type": "application/json"
            },
            success: function(e) {
                console.log(e.data), "not exist" == e.data ? (wx.vibrateLong(), wx.showModal({
                    title: t.alert,
                    content: "该设备不存在于数据库",
                    showCancel: !1
                })) : e.data.mac != a ? (wx.vibrateLong(), wx.showModal({
                    title: t.alert,
                    content: "MAC与数据库不符",
                    showCancel: !1
                })) : e.data.imei != o ? (wx.vibrateLong(), wx.showModal({
                    title: t.alert,
                    content: "IMEI与数据库不符",
                    showCancel: !1
                })) : e.data.iccid != n ? (wx.vibrateLong(), wx.showModal({
                    title: t.alert,
                    content: "ICCID与数据库不符",
                    showCancel: !1
                })) : (wx.vibrateLong(), wx.showModal({
                    title: t.alert,
                    content: "验证成功！是否返回上个界面？",
                    confirmText: "是",
                    cancelText: "否",
                    success: function(t) {
                        t.cancel || t.confirm && wx.redirectTo({
                            url: "../qrCompare/qrCompare?type=yj"
                        });
                    }
                }));
            }
        });
    }
});