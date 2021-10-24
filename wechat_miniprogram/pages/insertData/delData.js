var t = getApp(), e = "", o = "", n = "";

Page({
    data: {},
    onLoad: function(t) {},
    qrUrl: function() {
        wx.scanCode({
            success: function(o) {
                console.log(o.result), (e = o.result).startsWith("https") ? wx.showModal({
                    title: t.alert,
                    content: "是否删除该设备",
                    cancelText: "否",
                    confirmText: "是",
                    success: function(o) {
                        o.cancel || o.confirm && wx.request({
                            url: t.vehiUrl + "/vehicle/dropData",
                            data: {
                                result: e,
                                type: 3
                            },
                            header: {
                                "Content-Type": "application/json"
                            },
                            success: function(o) {
                                console.log(o.data), "error" == o.data ? (wx.showModal({
                                    title: t.alert,
                                    content: "删除失败，请确认url是否存在数据库或是否已出货",
                                    showCancel: !1
                                }), e = "") : (wx.vibrateLong(), wx.showModal({
                                    title: t.alert,
                                    content: "删除成功",
                                    showCancel: !1
                                }), e = "");
                            }
                        });
                    }
                }) : (wx.showModal({
                    title: t.alert,
                    content: "请确认二维码是否正确",
                    showCancel: !1
                }), e = "");
            }
        });
    },
    qrMac: function() {
        wx.scanCode({
            success: function(e) {
                console.log(e.result), "" != (o = e.result) ? wx.showModal({
                    title: t.alert,
                    content: "是否删除该设备",
                    cancelText: "否",
                    confirmText: "是",
                    success: function(e) {
                        e.cancel || e.confirm && wx.request({
                            url: t.vehiUrl + "/vehicle/dropData",
                            data: {
                                result: o,
                                type: 1
                            },
                            header: {
                                "Content-Type": "application/json"
                            },
                            success: function(e) {
                                console.log(e.data), "error" == e.data ? (wx.showModal({
                                    title: t.alert,
                                    content: "删除失败，请确认mac地址是否存在数据库或是否已出货",
                                    showCancel: !1
                                }), o = "") : (wx.vibrateLong(), wx.showModal({
                                    title: t.alert,
                                    content: "删除成功",
                                    showCancel: !1
                                }), o = "");
                            }
                        });
                    }
                }) : (wx.showModal({
                    title: t.alert,
                    content: "请确认MAC二维码是否正确",
                    showCancel: !1
                }), o = "");
            }
        });
    },
    qrIccid: function() {
        wx.scanCode({
            success: function(e) {
                console.log(e.result), "" != (n = e.result) ? wx.showModal({
                    title: t.alert,
                    content: "是否删除该设备",
                    cancelText: "否",
                    confirmText: "是",
                    success: function(e) {
                        e.cancel || e.confirm && wx.request({
                            url: t.vehiUrl + "/vehicle/dropData",
                            data: {
                                result: n,
                                type: 2
                            },
                            header: {
                                "Content-Type": "application/json"
                            },
                            success: function(e) {
                                console.log(e.data), "error" == e.data ? (wx.showModal({
                                    title: t.alert,
                                    content: "删除失败，请确认iccid是否存在数据库或是否已出货",
                                    showCancel: !1
                                }), n = "") : (wx.vibrateLong(), wx.showModal({
                                    title: t.alert,
                                    content: "删除成功",
                                    showCancel: !1
                                }), n = "");
                            }
                        });
                    }
                }) : (wx.showModal({
                    title: t.alert,
                    content: "请确认MAC二维码是否正确",
                    showCancel: !1
                }), n = "");
            }
        });
    },
    cancelOut: function() {
        wx.scanCode({
            success: function(o) {
                (e = o.result).startsWith("https") ? wx.showModal({
                    title: t.alert,
                    content: "是否撤销出货？",
                    cancelText: "否",
                    confirmText: "是",
                    success: function(o) {
                        o.cancel ? e = "" : o.confirm && wx.request({
                            url: t.vehiUrl + "/vehicle/changeTarge",
                            data: {
                                url: e,
                                targe: 1,
                                box: ""
                            },
                            header: {
                                "Content-Type": "application/json"
                            },
                            success: function(e) {
                                console.log(e.data), "success" == e.data ? (wx.vibrateLong(), wx.showModal({
                                    title: t.alert,
                                    content: "撤销成功！",
                                    showCancel: !1
                                })) : "not exist" == e.data ? wx.showModal({
                                    title: t.alert,
                                    content: "设备不存在！",
                                    showCancel: !1
                                }) : "error" == e.data && wx.showModal({
                                    title: t.alert,
                                    content: "程序出错！",
                                    showCancel: !1
                                });
                            }
                        });
                    }
                }) : wx.showModal({
                    title: t.alert,
                    content: "请扫描正确的URL",
                    showCancel: !1
                });
            }
        });
    }
});