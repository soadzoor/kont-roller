var e = getApp(), t = "", o = "", a = "", c = "", l = "";

Page({
    data: {},
    onLoad: function(s) {
        var n = this;
        o = "", a = "";
        var r = (t = s.url).split("/")[4];
        wx.request({
            url: e.vehiUrl + "/vehicle/getCount",
            data: {
                url: t
            },
            header: {
                "Content-Type": "application/json"
            },
            success: function(e) {
                console.log(e.data), c = e.data.count, "all" == (l = e.data.iccid) ? n.setData({
                    iccMess: "该设备已加入iccid",
                    qrMessage: "该设备已加入IMEI及MAC",
                    iccColor: "blue",
                    qrMessageColor: "red"
                }) : "all null" == l || "iccid null" == l ? n.setData({
                    iccMess: "该设备未加入iccid",
                    iccColor: "red"
                }) : "imei null" == l ? n.setData({
                    iccMess: "该设备已加入iccid",
                    qrMessage: "该设备未加入IMEI及MAC",
                    iccColor: "blue",
                    qrMessageColor: "blue"
                }) : n.setData({
                    iccMess: "该设备不存在",
                    iccColor: "red"
                }), n.setData({
                    urlMess: ".../" + r,
                    dataCount: c
                });
            }
        });
    },
    qrImei: function() {
        var e = this;
        wx.scanCode({
            success: function(t) {
                o = t.result, console.log(o), 15 == o.length ? e.setData({
                    imeiMess: o
                }) : (wx.showToast({
                    title: "请确认IMEI无误",
                    icon: "loading",
                    duration: 2e3
                }), o = "");
            }
        });
    },
    qrMac: function() {
        var e = this;
        wx.scanCode({
            success: function(t) {
                a = t.result, console.log(a), 17 == a.length ? e.setData({
                    macMess: a
                }) : (wx.showToast({
                    title: "请确认MAC无误",
                    icon: "loading",
                    duration: 2e3
                }), a = "");
            }
        });
    },
    add: function() {
        "" == o ? wx.showModal({
            title: e.alert,
            content: "请先扫描IMEI码",
            showCancel: !1
        }) : "" == a ? wx.showModal({
            title: e.alert,
            content: "请先扫描MAC码",
            showCancel: !1
        }) : wx.request({
            url: e.vehiUrl + "/vehicle/addVehicle",
            data: {
                imei: o,
                mac: a,
                url: t
            },
            header: {
                "Content-Type": "application/json"
            },
            success: function(t) {
                console.log(t.data);
                var c = t.data;
                "success" == c ? (o = "", a = "", wx.vibrateLong(), wx.showModal({
                    title: e.alert,
                    content: "录入成功！是否返回上一级？",
                    cancelText: "否",
                    confirmText: "是",
                    success: function(e) {
                        e.cancel || e.confirm && wx.redirectTo({
                            url: "../qrCompare/qrCompare?type=yj"
                        });
                    }
                })) : "not exsit" == c ? wx.showModal({
                    title: e.alert,
                    content: "该设备不存在",
                    showCancel: !1
                }) : "error" == c || "undefind error" == c ? wx.showModal({
                    title: e.alert,
                    content: "系统正在维护，暂时无法入库",
                    showCancel: !1
                }) : "imei error" == c ? wx.showModal({
                    title: e.alert,
                    content: "IMEI码出现重复",
                    showCancel: !1
                }) : "mac error" == c ? wx.showModal({
                    title: e.alert,
                    content: "MAC码出现重复",
                    showCancel: !1
                }) : "url error" == c ? wx.showModal({
                    title: e.alert,
                    content: "把头二维码出现重复",
                    showCancel: !1
                }) : "iccid error" == c && wx.showModal({
                    title: e.alert,
                    content: "ICCID码出现重复",
                    showCancel: !1
                });
            }
        });
    }
});