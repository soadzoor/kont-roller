var t = getApp(), e = require("../../utils/chikoUtil.js"), a = "", o = "", s = "", n = "", l = "", c = 0, i = "", r = 0;

function h(e, a) {
    wx.showModal({
        title: t.alert,
        content: e,
        showCancel: !1,
        confirmColor: a
    });
}

Page({
    data: {},
    onLoad: function(e) {
        var s = this;
        l = e.type, console.log(l), s.setData({
            oneMessage: "",
            twoMessage: ""
        }), a = "", o = "", "yj2" == l && wx.request({
            url: t.vehiUrl + "/vehicle/getOutCount",
            data: {
                targe: 3
            },
            header: {
                "Content-Type": "application/json"
            },
            success: function(t) {
                console.log(t.data), c = t.data, s.setData({
                    countMess: "当天出货数量：" + c,
                    showModal1: !0,
                    changeBox: !0
                });
            }
        });
    },
    onShareAppMessage: function() {},
    qrCdoe1: function() {
        var e = this;
        wx.scanCode({
            success: function(o) {
                (a = o.result).startsWith("https") ? e.setData({
                    oneMessage: "第一个扫描结果: " + a.split("/")[4]
                }) : (wx.showModal({
                    title: t.alert,
                    content: "请检查是否扫错码",
                    showCancel: !1
                }), a = "");
            }
        });
    },
    qrCdoe2: function() {
        var e = this;
        "" == a ? wx.showModal({
            title: t.alert,
            content: "请先扫描第一个二维码",
            showCancel: !1
        }) : wx.scanCode({
            success: function(s) {
                if ((o = s.result).startsWith("https")) if (e.setData({
                    twoMessage: "第二个扫描结果: " + o.split("/")[4]
                }), o == a) {
                    if ("yj2" == l || "xwd" == l || "qr" == l || wx.showModal({
                        title: t.alert,
                        confirmColor: "#00AA00",
                        content: "√√√√√对比通过",
                        showCancel: !1
                    }), "qr" == l) wx.request({
                        url: t.vehiUrl + "/auto/addData",
                        data: {
                            url2: o
                        },
                        header: {
                            "Content-Type": "application/json"
                        },
                        success: function(e) {
                            console.log(e.data), "100" == e.data ? wx.showModal({
                                title: t.alert,
                                content: "对比通过，已添加到数据库",
                                confirmColor: "#008000",
                                showCancel: !1
                            }) : "101" == e.data ? wx.showModal({
                                title: t.alert,
                                content: "判定不良，对比通过，添加失败",
                                confirmColor: "#FF0000",
                                showCancel: !1
                            }) : "200" == e.data ? wx.showModal({
                                title: t.alert,
                                content: "判定不良，对比通过，不存在于数据库",
                                confirmColor: "#FF0000",
                                showCancel: !1
                            }) : "102" == e.data && wx.showModal({
                                title: t.alert,
                                content: "该二维码已曾经入过库，属重复数据",
                                confirmColor: "#FF0000",
                                showCancel: !1
                            });
                        }
                    }), e.setData({
                        oneMessage: "",
                        twoMessage: ""
                    }), l = "qr", a = "", o = ""; else if ("yj" == l) wx.redirectTo({
                        url: "../checkData/checkData?url=" + o
                    }), l = ""; else if ("tf" == l) wx.redirectTo({
                        url: "../changeData/changeData?url=" + o
                    }), l = ""; else if ("gc" == l) wx.redirectTo({
                        url: "../insertData/insertData?url=" + o
                    }), l = ""; else if ("yj2" == l) {
                        if ("" == i) return void wx.showModal({
                            title: t.alert,
                            content: "请先输入箱号",
                            showCancel: !1
                        });
                        20 == r ? wx.showModal({
                            title: t.alert,
                            content: "当前箱号已录入20个，请更换箱号",
                            showCancel: !1
                        }) : (wx.request({
                            url: t.vehiUrl + "/vehicle/yjCtarge",
                            data: {
                                url: o,
                                targe: 3,
                                box: i
                            },
                            header: {
                                "Content-Type": "application/json"
                            },
                            success: function(t) {
                                console.log(t.data), "success" == t.data ? (wx.vibrateLong(), h("出货录入成功", "#008800"), 
                                c += 1, r += 1, e.setData({
                                    countMess: "当天出货数量：" + c,
                                    outCountMess: "当前箱号:" + i + ",已录入:" + r
                                })) : "error" == t.data ? h("数据库出错", "#FF0000") : "not exist" == t.data ? h("设备不存在", "#FF0000") : "104" == t.data ? h("已有录入箱号", "#FF0000") : "105" == t.data && h("必须为上位机数据才能出货", "#FF0000");
                            }
                        }), l = "yj2", a = "", o = "", e.setData({
                            oneMessage: "",
                            twoMessage: ""
                        }));
                    }
                } else wx.showModal({
                    title: t.alert,
                    confirmColor: "#FF0000",
                    content: "×××××对比不通过",
                    showCancel: !1
                }), e.setData({
                    oneMessage: "",
                    twoMessage: ""
                }), a = "", o = ""; else wx.showModal({
                    title: t.alert,
                    content: "请检查是否扫错码",
                    showCancel: !1
                }), o = "";
            }
        });
    },
    toggle: function() {
        a == o && "" != a && "" != o ? (wx.setNavigationBarTitle({
            title: "数据录入"
        }), this.setData({
            showOrHide1: !1,
            showOrHide2: !0
        })) : wx.showModal({
            title: t.alert,
            content: "对比不通过，无法录入",
            showCancel: !1
        });
    },
    insert: function() {
        "" != o && "" != s && "" != n ? wx.request({
            url: t.url + "",
            data: {
                url: url,
                imei: s,
                mac: n
            },
            header: {
                "Content-Type": "application/json"
            },
            success: function(t) {
                console.log(t.data);
            }
        }) : "" == o ? wx.showModal({
            title: t.alert,
            content: "把头二维码有误",
            showCancel: !1
        }) : "" == s ? wx.showModal({
            title: t.alert,
            content: "imei码有误",
            showCancel: !1
        }) : "" == n && wx.showModal({
            title: t.alert,
            content: "mac码有误",
            showCancel: !1
        });
    },
    reset: function() {
        this.setData({
            oneMessage: "",
            twoMessage: "",
            compareMessage: "",
            imeiMess: "",
            macMess: "",
            showOrHide1: !0,
            showOrHide2: !1
        }), a = "", o = "", s = "", n = "";
    },
    qrImei: function() {
        var e = this;
        wx.scanCode({
            success: function(a) {
                15 == (s = a.result).length ? e.setData({
                    imeiMess: "为:" + s
                }) : wx.showModal({
                    title: t.alert,
                    content: "imei码有误",
                    showCancel: !1
                });
            }
        });
    },
    qrMac: function() {
        var e = this;
        wx.scanCode({
            success: function(a) {
                12 == (n = a.result).length ? e.setData({
                    macMess: "MAC为:" + n
                }) : wx.showModal({
                    title: t.alert,
                    content: "mac码有误",
                    showCancel: !1
                });
            }
        });
    },
    goOut: function() {
        "" == n ? e.Alert("请先扫描MAC") : wx.request({
            url: t.vehiUrl + "/vehicle/nfcOut",
            data: {
                mac: n,
                box: i,
                frame: this.getDay()
            },
            header: {
                "Content-Type": "application/json"
            },
            success: function(t) {
                console.log(t.data), "100" == t.data.code ? e.Alert("出货成功") : e.Alert("出货失败！请联系大创员工");
            }
        });
    },
    changeBox: function() {
        this.setData({
            showModal1: !0
        });
    },
    input1: function(t) {
        var e = t.detail.value;
        i = e;
    },
    onCancel: function() {
        this.setData({
            showModal1: !1,
            outCountMess: ""
        }), i = "";
    },
    onConfirm: function() {
        var e = this;
        e.setData({
            showModal1: !1
        }), "" == i ? (wx.showModal({
            title: t.alert,
            content: "请输入箱号",
            showCancel: !1
        }), e.setData({
            showModal1: !0
        })) : wx.request({
            url: t.vehiUrl + "/vehicle/yjGetBoxCount",
            data: {
                box: i
            },
            header: {
                "Content-Type": "application/json"
            },
            success: function(t) {
                console.log(t.data), r = t.data, e.setData({
                    outCountMess: "当前箱号:" + i + ",已录入:" + r,
                    showModal1: !1
                });
            }
        });
    },
    getDay: function() {
        console.log("进来了");
        var t = new Date(), e = t.getFullYear(), a = t.getMonth() + 1, o = t.getDate();
        a < 10 && (a = "0" + a), o < 10 && (o = "0" + o);
        var s = e + "-" + a + "-" + o;
        return s = (s = s.replace("-", "")).replace("-", ""), this.today = s, s;
    }
});