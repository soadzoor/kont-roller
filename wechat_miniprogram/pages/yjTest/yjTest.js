var e = getApp(), t = "", o = 1;

function n() {
    wx.showModal({
        title: "",
        content: "请先扫描二维码",
        showCancel: !1
    });
}

Page({
    data: {
        message: "请先扫描二维码",
        chiko: ""
    },
    onLoad: function() {
        this.setData({
            BtnTest: !1
        });
    },
    qr: function() {
        var e = this;
        wx.scanCode({
            success: function(o) {
                console.log(o.result), null != (t = o.result) ? e.setData({
                    message: t
                }) : e.setData({
                    message: "有误"
                });
            }
        });
    },
    goTest: function() {
        var e = this;
        console.log("正在开锁"), e.setData({
            BtnTest: !0
        }), setTimeout(function() {
            o = 1, e.open(), e.setData({
                testMess: "正在开锁"
            }), setTimeout(function() {
                e.data.chiko = setInterval(function() {
                    console.log("当前step:" + o), 1 == o ? (o = 2, console.log("正在开启前灯"), e.setData({
                        testMess: "正在开前灯"
                    }), e.ofd()) : 2 == o ? (o = 3, console.log("正在开启尾灯"), e.setData({
                        testMess: "正在开尾灯"
                    }), e.otd()) : 3 == o ? (o = 4, console.log("正在关闭全灯"), e.setData({
                        testMess: "正在关全灯"
                    }), e.cad()) : 4 == o ? (o = 5, console.log("正在开启全灯"), e.setData({
                        testMess: "正在开全灯"
                    }), e.oad(), setTimeout(function() {
                        e.setData({
                            testMess: "测试结束"
                        });
                    }, 1e3)) : 5 == o && (console.log("停止循环"), e.setData({
                        BtnTest: !1
                    }), clearInterval(e.data.chiko));
                }, 4e3);
            }, 5e3);
        }, 2e3);
    },
    refState: function() {
        var o = this;
        wx.request({
            url: e.vehiUrl + "/Picasau/ctrl/checkOnline",
            data: {
                mac: t
            },
            header: {
                "Content-Type": "application/json"
            },
            success: function(e) {
                console.log(e.data), "online" == e.data ? o.setData({
                    state: "当前状态：在线",
                    stateCol: "green"
                }) : "offLine" == e.data ? o.setData({
                    state: "当前状态：离线",
                    stateCol: "red"
                }) : "error" == e.data && o.setData({
                    state: "接口暂停使用",
                    stateCol: "red"
                });
            }
        });
    },
    location: function() {
        var o = this;
        wx.request({
            url: e.url + "/mq/ExistGnss",
            data: {
                iotCode: t
            },
            header: {
                "Content-Type": "application/json"
            },
            success: function(e) {
                console.log(e.data), "n" == e.data ? o.setData({
                    locaMess: "已上报位置信息",
                    locaCol: "green"
                }) : o.setData({
                    locaMess: "未上报位置信息",
                    locaCol: "red"
                });
            }
        });
    },
    open: function() {
        "" == t || null == t ? n() : wx.request({
            url: e.url + "/vehicle/unLock",
            data: {
                iotCode: t
            },
            header: {
                "Content-Type": "application/json"
            },
            success: function(e) {
                console.log(e.data);
            }
        });
    },
    lock: function() {
        "" == t || null == t ? n() : (clearInterval(this.data.chiko), wx.request({
            url: e.url + "/vehicle/lock",
            data: {
                iotCode: t
            },
            header: {
                "Content-Type": "application/json"
            },
            success: function(e) {
                console.log(e.data);
            }
        }));
    },
    ofd: function() {
        "" == t || null == t ? n() : wx.request({
            url: e.url + "/vehicle/openOrCloseLED",
            data: {
                iotCode: t,
                opration: 1
            },
            header: {
                "Content-Type": "application/json"
            },
            success: function(e) {
                console.log(e.data);
            }
        });
    },
    cfd: function() {
        "" == t || null == t ? n() : wx.request({
            url: e.url + "/vehicle/openOrCloseLED",
            data: {
                iotCode: t,
                opration: 0
            },
            header: {
                "Content-Type": "application/json"
            },
            success: function(e) {
                console.log(e.data);
            }
        });
    },
    otd: function() {
        "" == t || null == t ? n() : wx.request({
            url: e.url + "/vehicle/openOrCloseLED",
            data: {
                iotCode: t,
                opration: 3
            },
            header: {
                "Content-Type": "application/json"
            },
            success: function(e) {
                console.log(e.data);
            }
        });
    },
    ctd: function() {
        "" == t || null == t ? n() : wx.request({
            url: e.url + "/vehicle/openOrCloseLED",
            data: {
                iotCode: t,
                opration: 2
            },
            header: {
                "Content-Type": "application/json"
            },
            success: function(e) {
                console.log(e.data);
            }
        });
    },
    obd: function() {
        "" == t || null == t ? n() : wx.request({
            url: e.url + "/vehicle/openOrCloseLED",
            data: {
                iotCode: t,
                opration: 5
            },
            header: {
                "Content-Type": "application/json"
            },
            success: function(e) {
                console.log(e.data);
            }
        });
    },
    cbd: function() {
        "" == t || null == t ? n() : wx.request({
            url: e.url + "/vehicle/openOrCloseLED",
            data: {
                iotCode: t,
                opration: 4
            },
            header: {
                "Content-Type": "application/json"
            },
            success: function(e) {
                console.log(e.data);
            }
        });
    },
    oad: function() {
        "" == t || null == t ? n() : wx.request({
            url: e.url + "/vehicle/openOrCloseLED",
            data: {
                iotCode: t,
                opration: 7
            },
            header: {
                "Content-Type": "application/json"
            },
            success: function(e) {
                console.log(e.data);
            }
        });
    },
    cad: function() {
        "" == t || null == t ? n() : wx.request({
            url: e.url + "/vehicle/openOrCloseLED",
            data: {
                iotCode: t,
                opration: 6
            },
            header: {
                "Content-Type": "application/json"
            },
            success: function(e) {
                console.log(e.data);
            }
        });
    }
});