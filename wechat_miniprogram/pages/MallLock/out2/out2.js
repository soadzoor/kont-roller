var t = getApp(), o = require("../../../utils/chikoUtil.js");

Page({
    data: {
        order: "",
        store: "",
        box: void 0,
        url: "",
        mac: "",
        today: "",
        storeCount: "",
        boxCount: "",
        maxCount: 0,
        yOrg: 0
    },
    onLoad: function(o) {
        clearInterval(t.globalData.timer2);
        var e = o.type;
        console.log(this.getDay()), "lock" == e ? (this.yOrg = 1, this.setData({
            setMaxCount: !0,
            lock: !0,
            store: void 0,
            maxCount: void 0
        })) : "gate" == e && (this.yOrg = 2, this.setData({
            setMaxCount: !0,
            gate: !0
        }));
    },
    onShow: function() {},
    getDay: function() {
        console.log("进来了");
        var t = new Date(), o = t.getFullYear(), e = t.getMonth() + 1, a = t.getDate();
        e < 10 && (e = "0" + e), a < 10 && (a = "0" + a);
        var l = o + "-" + e + "-" + a;
        return l = (l = l.replace("-", "")).replace("-", ""), this.today = l, l;
    },
    alert: function(o) {
        wx.showModal({
            title: t.alert,
            content: o,
            showCancel: !1
        });
    },
    storeInput: function(o) {
        var e = this;
        e.store = o.detail.value, "" != e.store && (1 == e.yOrg ? wx.request({
            url: t.lockUrl + "/lock/retStoreCount",
            data: {
                store: e.store
            },
            header: {
                "Content-Type": "application/json"
            },
            success: function(t) {
                e.storeCount = t.data, e.setData({
                    storeCount: e.storeCount
                });
            }
        }) : 2 == e.yOrg && wx.request({
            url: t.lockUrl + "/gateway/getStoreCount",
            data: {
                store: e.store
            },
            header: {
                "Content-Type": "application/json"
            },
            success: function(t) {
                e.storeCount = t.data, e.setData({
                    storeCount: e.storeCount
                });
            }
        }));
    },
    boxInput: function(t) {
        this.box = t.detail.value, this.checkBoxCount();
    },
    checkBoxCount: function() {
        var o = this;
        wx.request({
            url: t.lockUrl + "/sLock/getBoxCount",
            data: {
                store: o.store + "-" + o.box
            },
            success: function(t) {
                o.boxCount = t.data, o.setData({
                    boxCount: o.boxCount
                });
            }
        });
    },
    scanUrl: function() {
        var e = this, a = "";
        wx.scanCode({
            success: function(l) {
                (a = l.result).startsWith("YSL") ? wx.request({
                    url: t.lockUrl + "/lock/checkData",
                    data: {
                        url: a
                    },
                    header: {
                        "Content-Type": "application/json"
                    },
                    success: function(o) {
                        console.log(o.data), "101" == o.data.code ? (e.alert("没有该设备数据"), e.url = void 0) : "102" == o.data.code ? (e.alert("MAC数据为空，请返修"), 
                        e.url = void 0) : "103" == o.data.code ? (e.alert("URL数据为空，请返修"), e.url = void 0) : "104" == o.data.code ? (e.alert("密码数据为空，请返修"), 
                        e.url = void 0) : "106" == o.data.code ? (e.alert("电量数据为空，请返修"), e.url = void 0) : "107" == o.data.code ? (e.alert("蓝牙版本数据为空，请返修"), 
                        e.url = void 0) : "108" == o.data.code ? (e.alert("该设备已有订单号"), e.url = void 0) : "100" == o.data.code && (e.url = a, 
                        wx.request({
                            url: t.lockUrl + "/url/getId",
                            data: {
                                url: e.url
                            },
                            header: {
                                "Content-Type": "application/json"
                            },
                            success: function(t) {
                                console.log(t.data), "100" == t.data.code || "105" == t.data.code ? e.setData({
                                    url: t.data.lockId
                                }) : "101" == t.data.code ? e.alert("没有记录") : "102" == t.data.code ? e.setData({
                                    url: t.data.lockId
                                }) : "200" == t.data.code ? e.alert("接口出错") : e.alert("系统出错，请稍后再试");
                            }
                        }));
                    }
                }) : 1 == o.checkUrlComplete(a) ? (a = o.Url_updateMac(a), e.url = a, wx.request({
                    url: t.lockUrl + "/url/getId",
                    data: {
                        url: e.url
                    },
                    header: {
                        "Content-Type": "application/json"
                    },
                    success: function(o) {
                        console.log(o.data), null == o.data.lockId ? e.alert("没有记录") : wx.request({
                            url: t.lockUrl + "/sLock/checkStore",
                            data: {
                                url: e.url
                            },
                            success: function(t) {
                                "100" == t.data.code ? e.setData({
                                    url: o.data.lockId
                                }) : e.alert("已有门店信息");
                            }
                        });
                    }
                })) : o.Alert("二维码异常，请退回");
            }
        });
    },
    scanMac: function() {
        var o = this, e = "";
        wx.scanCode({
            success: function(a) {
                17 == (e = a.result).length ? wx.request({
                    url: t.lockUrl + "/gateway/getDataComplete",
                    data: {
                        mac: e
                    },
                    header: {
                        "Content-Type": "application/json"
                    },
                    success: function(t) {
                        console.log(t.data.code), "101" == t.data.code ? o.alert("没有该网关数据") : "200" == t.data.code ? o.alert("系统出错，请联系大创员工") : "105" == t.data.code ? wx.showModal({
                            title: "已有出货记录",
                            content: t.data.order,
                            showCancel: !1
                        }) : "100" == t.data.code && (o.mac = e, o.setData({
                            mac: o.mac
                        }));
                    }
                }) : wx.showModal({
                    title: t.alert,
                    content: "MAC格式错误",
                    showCancel: !1
                });
            }
        });
    },
    lockOut: function() {
        var e = this;
        if (null == e.url || null == e.store || null == e.box) wx.showModal({
            title: t.alert,
            content: "请补全数据再出货",
            showCancel: !1
        }); else if (36 == e.boxCount) wx.showModal({
            title: t.alert,
            content: "箱号设备已满，请更换箱号",
            showCancel: !1
        }); else if (e.storeCount == e.maxCount || e.storeCount > e.maxCount) wx.showModal({
            title: t.alert,
            content: "该门店入库已达到" + e.maxCount + "个",
            showCancel: !1
        }); else if (console.log(e.url), e.url.startsWith("YSL")) {
            var a = e.url.split("-")[2];
            console.log(a + "num"), wx.request({
                url: t.lockUrl + "/lock/checkYslNum",
                data: {
                    id: a,
                    store: e.store
                },
                success: function(a) {
                    "100" == a.data.code ? wx.request({
                        url: t.lockUrl + "/lock/yjOut",
                        data: {
                            url: e.url,
                            order: e.store + "-" + e.box + "-" + e.today
                        },
                        header: {
                            "Content-Type": "application/json"
                        },
                        success: function(t) {
                            console.log(t.data), "100" == t.data.code ? (e.boxCount = e.boxCount + 1, e.storeCount = e.storeCount + 1, 
                            e.alert("出货成功"), e.setData({
                                boxCount: e.boxCount,
                                storeCount: e.storeCount
                            }), e.checkBoxCount()) : e.alert("系统出错，请重新录入"), e.url = void 0, e.setData({
                                url: ""
                            });
                        }
                    }) : o.Alert("同门店已出过相同id的锁");
                }
            });
        } else wx.request({
            url: t.lockUrl + "/sLock/setStore",
            data: {
                url: e.url,
                store: e.store + "-" + e.box + "-" + e.today
            },
            success: function(t) {
                console.log(t.data), "100" == t.data.code ? (e.boxCount = e.boxCount + 1, e.storeCount = e.storeCount + 1, 
                e.alert("出货成功"), e.setData({
                    boxCount: e.boxCount,
                    storeCount: e.storeCount
                }), e.checkBoxCount()) : e.alert("系统出错，请重新录入"), e.url = void 0, e.setData({
                    url: ""
                });
            }
        });
    },
    gateOut: function() {
        var o = this;
        null == o.mac ? wx.showModal({
            title: t.alert,
            content: "请补全数据再出货",
            showCancel: !1
        }) : o.maxCount == o.storeCount || o.maxCount < o.storeCount ? o.alert("已达到入库数量") : wx.request({
            url: t.lockUrl + "/gateway/yjOut",
            data: {
                mac: o.mac,
                order: o.store + o.getDay()
            },
            header: {
                "Content-Type": "application/json"
            },
            success: function(t) {
                console.log(t.data), "100" == t.data.code ? (o.storeCount += 1, o.alert("出货成功")) : o.alert("系统出错，请重新录入"), 
                o.mac = void 0, o.order = void 0, o.setData({
                    mac: "",
                    storeCount: o.storeCount
                });
            }
        });
    },
    maxCount_input: function(t) {
        this.maxCount = parseInt(t.detail.value);
    },
    orderInput: function(t) {
        this.order = t.detail.value;
    },
    setMaxCount_cancel: function() {
        wx.showModal({
            title: t.alert,
            content: "必须设置总数量",
            showCancel: !1
        });
    },
    setMaxCount_confirm: function() {
        null == this.store || null == this.maxCount ? wx.showModal({
            title: t.alert,
            content: "请把数据写完整再点确定",
            showCancel: !1
        }) : this.setData({
            setMaxCount: !1,
            maxCount: this.maxCount,
            storeName: this.store
        });
    }
});