var a = getApp(), e = "", t = "";

Page({
    data: {},
    onLoad: function(a) {},
    reset: function() {
        e = "", t = "", this.setData({
            idMess: "",
            macMess: "",
            imeiMess: "",
            iccidMess: ""
        });
    },
    scanUrl: function() {
        var t = this;
        wx.scanCode({
            success: function(s) {
                (e = s.result).startsWith("https://app.goflash.com/vehicle/") ? wx.request({
                    url: a.vehiUrl + "/vehicle/checkData",
                    data: {
                        url: e
                    },
                    header: {
                        "Content-Type": "application/json"
                    },
                    success: function(e) {
                        console.log(e.data), "not exist" == e.data ? wx.showModal({
                            title: a.alert,
                            content: "数据不存在",
                            showCancel: !1
                        }) : t.setData({
                            idMess: e.data.vehicleId,
                            macMess: e.data.mac,
                            imeiMess: e.data.imei,
                            iccidMess: e.data.iccid
                        });
                    }
                }) : wx.showModal({
                    title: a.alert,
                    content: "URL格式错误",
                    showCancel: !1
                });
            }
        });
    },
    scanMac: function() {
        var e = this;
        wx.scanCode({
            success: function(s) {
                t = s.result, wx.request({
                    url: a.vehiUrl + "/vehicle/checkDataForMac",
                    data: {
                        mac: t
                    },
                    header: {
                        "Content-Type": "application/json"
                    },
                    success: function(t) {
                        console.log(t.data), "not exist" == t.data ? wx.showModal({
                            title: a.alert,
                            content: "数据不存在",
                            showCancel: !1
                        }) : e.setData({
                            idMess: t.data.vehicleId,
                            macMess: t.data.mac,
                            imeiMess: t.data.imei,
                            iccidMess: t.data.iccid
                        });
                    }
                });
            }
        });
    }
});