var t = getApp(), e = require("../../../utils/chikoUtil.js");

require("../../../utils/util");

Page({
    data: {
        state: 0,
        macs: "",
        conn_type: "",
        lockId: "",
        url: void 0,
        ysl: void 0
    },
    onLoad: function(a) {
        var o = this, c = a.type;
        3 == t.userMess.role ? o.setData({
            menu3: !0
        }) : 1 == c ? (o.setData({
            menu1: !0,
            menu3: !0
        }), 0 == t.userMess.role && o.setData({
            menu4: !0
        })) : 2 == c ? o.setData({
            menu2: !0
        }) : 3 == c && o.setData({
            menu4: !0
        }), e.Check_Ble(), setTimeout(function() {
            1 == t.globalData.ble_type && (t.globalData.timer2 = setInterval(function() {
                o.startBluetoothDevicesDiscovery();
            }, 1e3));
        }, 300);
    },
    onShow: function() {
        this.state = 0;
    },
    onUnload: function() {
        console.log("停止扫描"), clearInterval(t.globalData.timer2);
    },
    addLock: function() {
        wx.navigateTo({
            url: "../add/add?type=1"
        });
    },
    addGate: function() {
        wx.navigateTo({
            url: "../add/add?type=2"
        });
    },
    delLock: function() {
        var a = this, o = "";
        a.checkBle(), setTimeout(function() {
            1 == a.state && wx.scanCode({
                success: function(c) {
                    (o = c.result).startsWith("YSL") ? wx.request({
                        url: t.lockUrl + "/lock/retMac",
                        data: {
                            url: o
                        },
                        header: {
                            "Content-Type": "application/json"
                        },
                        success: function(t) {
                            console.log(t.data), console.log(t.data.mac), "100" == t.data.code ? (a.lockId = t.data.lockId, 
                            a.data.url = t.data.mac, a.data.ysl = !0) : "101" == t.data.code ? a.alert("没有记录") : "200" == t.data.code ? a.alert("接口出错") : a.alert("系统出错，请稍后再试");
                        }
                    }) : (a.data.url = e.Url_updateMac(o), wx.request({
                        url: t.lockUrl + "/url/getId",
                        data: {
                            url: a.data.url
                        },
                        header: {
                            "Content-Type": "application/json"
                        },
                        success: function(t) {
                            console.log(t.data), "100" == t.data.code ? a.lockId = t.data.lockId : "101" == t.data.code ? a.alert("没有记录") : "200" == t.data.code ? a.alert("接口出错") : a.alert("系统出错，请稍后再试");
                        }
                    })), setTimeout(function() {
                        1 == a.data.ysl ? wx.navigateTo({
                            url: "../ble/ble?macs=" + a.data.url + "&lockId=" + a.lockId + "&yj=del&ysl=1"
                        }) : wx.navigateTo({
                            url: "../ble/ble?macs=" + a.data.url + "&lockId=" + a.lockId + "&yj=del"
                        });
                    }, 500);
                }
            });
        }, 500);
    },
    delGateway: function() {
        clearInterval(t.globalData.timer2);
        var e = "";
        wx.scanCode({
            success: function(a) {
                17 == (e = a.result).length ? wx.showModal({
                    title: "确认删除此设备吗？",
                    content: e,
                    success: function(a) {
                        a.confirm && wx.request({
                            url: t.lockUrl + "/gateway/dropDataForMac",
                            data: {
                                mac: e
                            },
                            header: {
                                "Content-Type": "application/json"
                            },
                            success: function(e) {
                                console.log(e.data), "100" == e.data.code ? wx.showModal({
                                    title: t.alert,
                                    content: "删除成功",
                                    showCancel: !1
                                }) : wx.showModal({
                                    title: t.alert,
                                    content: "删除失败" + e.data.code,
                                    showCancel: !1
                                });
                            }
                        });
                    }
                }) : wx.showModal({
                    title: t.alert,
                    content: "MAC格式不正确",
                    showCancel: !1
                });
            }
        });
    },
    outLock: function() {
        wx.navigateTo({
            url: "../out2/out2?type=lock"
        });
    },
    outGate: function() {
        wx.navigateTo({
            url: "../out2/out2?type=gate"
        });
    },
    outSwitch: function() {
        wx.showActionSheet({
            itemList: [ "锁出货", "网关出货" ],
            success: function(t) {
                t.cancel || (0 == t.tapIndex ? wx.navigateTo({
                    url: "../out2/out2?type=lock"
                }) : 1 == t.tapIndex && wx.navigateTo({
                    url: "../out2/out2?type=gate"
                }));
            }
        });
    },
    outLockCancel: function() {
        clearInterval(t.globalData.timer2);
        var a = "", o = "";
        wx.scanCode({
            success: function(c) {
                (a = c.result).startsWith("https://") ? (a = e.Url_updateMac(a), wx.request({
                    url: t.lockUrl + "/url/getId",
                    data: {
                        url: a
                    },
                    header: {
                        "Content-Type": "application/json"
                    },
                    success: function(c) {
                        console.log(c.data), "100" == c.data.code || "102" == c.data.code ? (o = c.data.lockId, 
                        wx.showModal({
                            title: "确认撤销锁出货吗？",
                            content: o,
                            success: function(e) {
                                e.confirm && wx.request({
                                    url: t.lockUrl + "/lock/cYorder",
                                    data: {
                                        url: a
                                    },
                                    header: {
                                        "Content-Type": "application/json"
                                    },
                                    success: function(e) {
                                        console.log(e.data), "100" == e.data.code ? wx.showModal({
                                            title: t.alert,
                                            content: "撤销成功",
                                            showCancel: !1
                                        }) : wx.showModal({
                                            title: t.alert,
                                            content: "撤销失败",
                                            showCancel: !1
                                        });
                                    }
                                });
                            }
                        })) : e.Alert("找不到信息");
                    }
                })) : wx.showModal({
                    title: t.alert,
                    content: "URL格式不正确",
                    showCancel: !1
                });
            }
        });
    },
    cancelOutSwitch: function() {
        wx.showActionSheet({
            itemList: [ "锁撤销", "网关撤销" ],
            success: function(a) {
                if (!a.cancel) if (0 == a.tapIndex) {
                    clearInterval(t.globalData.timer2);
                    var o = "", c = "";
                    wx.scanCode({
                        success: function(a) {
                            (o = a.result).startsWith("https://") ? (o = e.Url_updateMac(o), wx.request({
                                url: t.lockUrl + "/url/getId",
                                data: {
                                    url: o
                                },
                                header: {
                                    "Content-Type": "application/json"
                                },
                                success: function(a) {
                                    console.log(a.data), "100" == a.data.code || "102" == a.data.code ? (c = a.data.lockId, 
                                    wx.showModal({
                                        title: "确认撤销锁出货吗？",
                                        content: c,
                                        success: function(e) {
                                            e.confirm && wx.request({
                                                url: t.lockUrl + "/lock/cYorder",
                                                data: {
                                                    url: o
                                                },
                                                header: {
                                                    "Content-Type": "application/json"
                                                },
                                                success: function(e) {
                                                    console.log(e.data), "100" == e.data.code ? wx.showModal({
                                                        title: t.alert,
                                                        content: "撤销成功",
                                                        showCancel: !1
                                                    }) : wx.showModal({
                                                        title: t.alert,
                                                        content: "撤销失败",
                                                        showCancel: !1
                                                    });
                                                }
                                            });
                                        }
                                    })) : e.Alert("找不到信息");
                                }
                            })) : wx.showModal({
                                title: t.alert,
                                content: "URL格式不正确",
                                showCancel: !1
                            });
                        }
                    });
                } else if (1 == a.tapIndex) {
                    clearInterval(t.globalData.timer2);
                    var l = "";
                    wx.scanCode({
                        success: function(a) {
                            17 == (l = a.result).length ? wx.showModal({
                                title: "确认撤销出货吗？",
                                content: l,
                                success: function(a) {
                                    a.confirm && wx.request({
                                        url: t.lockUrl + "/gateway/clearYorder",
                                        data: {
                                            mac: l
                                        },
                                        header: {
                                            "Content-Type": "application/json"
                                        },
                                        success: function(t) {
                                            console.log(t.data), "101" == t.data.code || "200" == t.data.code ? e.Alert("出错，请联系大创员工") : "100" == t.data.code && e.Alert("撤销成功");
                                        }
                                    });
                                }
                            }) : e.Alert("MAC格式错误");
                        }
                    });
                }
            }
        });
    },
    checkBle: function() {
        var e = this;
        console.log("检查蓝牙是否打开"), wx.openBluetoothAdapter({
            success: function(t) {
                console.log("-----success----------"), console.log(t), e.state = 1;
            },
            fail: function(a) {
                console.log("-----fail----------"), console.log(a), e.state = 0, wx.showModal({
                    title: t.alert,
                    content: "请先打开蓝牙",
                    showCancel: !1,
                    confirmText: "我已打开"
                });
            },
            complete: function(t) {
                console.log("-----complete----------"), console.log(t);
            }
        });
    },
    setMac: function(t) {
        var e = t, a = "";
        console.log("二维码：", e);
        for (var o = 0; o < e.length; o++) {
            var c = e[o];
            if (":" != c) {
                if (!(c >= "0" && c <= "9" || c >= "A" && c <= "F")) return wx.showModal({
                    title: "二维码格式错误",
                    content: e,
                    showCancel: !1,
                    duration: 2e3
                }), !1;
                a += c;
            }
        }
        return console.log("mac:", a), a;
    },
    goBle: function() {
        var a = this, o = "";
        a.checkBle(), setTimeout(function() {
            1 == a.state && wx.scanCode({
                success: function(c) {
                    (o = c.result).startsWith("YSL") ? (o = c.result, a.conn_type = "old") : 17 == (o = e.Url_updateMac(o)).length ? (a.conn_type = "new", 
                    a.macs = o) : (o = c.result, a.conn_type = "old"), console.log(o + a.conn_type), 
                    wx.request({
                        url: t.lockUrl + "/lock/retMac",
                        data: {
                            url: o
                        },
                        header: {
                            "Content-Type": "application/json"
                        },
                        success: function(e) {
                            console.log(e.data), "100" == e.data.code ? ("old" == a.conn_type && (a.macs = e.data.mac), 
                            o.startsWith("YSL") ? wx.navigateTo({
                                url: "../ble/ble?macs=" + a.macs + "&a=" + e.data.a + "&b=" + e.data.b + "&new_macs=" + o
                            }) : wx.navigateTo({
                                url: "../ble/ble?macs=" + a.macs + "&a=" + e.data.a + "&b=" + e.data.b
                            })) : wx.showModal({
                                title: t.alert,
                                content: "找不到该数据",
                                showCancel: !1
                            });
                        }
                    });
                }
            });
        }, 300);
    },
    foundLock: function() {
        wx.navigateTo({
            url: "../../devices/devices?type=mall"
        });
    },
    macInsertMao: function(t) {
        console.log("进来了！");
        for (var e = "", a = 0; a <= t.length; a++) 0 != e.length ? e.length % 3 != 0 ? (e += t[a - 1], 
        e += t[a]) : e += ":" : e += "-";
        return e = (e = e.substr(1, e.length)).substr(0, e.length - 1);
    },
    checkDataSwitch: function() {
        clearInterval(t.globalData.timer2), wx.showActionSheet({
            itemList: [ "锁抽检", "网关抽检" ],
            success: function(t) {
                t.cancel || (0 == t.tapIndex ? wx.navigateTo({
                    url: "../checkData/checkData?type=lock"
                }) : 1 == t.tapIndex && wx.navigateTo({
                    url: "../checkData/checkData?type=gate"
                }));
            }
        });
    },
    startBluetoothDevicesDiscovery: function() {
        wx.startBluetoothDevicesDiscovery({
            services: [ "FEE7" ],
            success: function(t) {
                console.log("-----startBluetoothDevicesDiscovery--success----------"), console.log(t);
            },
            fail: function(t) {
                console.log(t);
            },
            complete: function(t) {
                console.log(t);
            }
        });
    },
    goTest: function() {
        wx.navigateTo({
            url: "../out/out"
        });
    },
    Tem: function() {
        wx.navigateTo({
            url: "../../Temperature/index/index"
        });
    }
});