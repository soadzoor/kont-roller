var e = getApp(), o = "";

function n() {
    wx.showModal({
        title: "",
        content: "请先扫描二维码",
        showCancel: !1
    });
}

function t(n) {
    wx.request({
        url: e.url + "/vehicle/vehicleStatus",
        data: {
            iotCode: o,
            second: n
        },
        header: {
            "Content-Type": "application/json"
        },
        success: function(e) {
            console.log(e.data), wx.navigateTo({
                url: "../stat/stat?result=" + o
            });
        }
    });
}

function s(n) {
    wx.request({
        url: e.url + "/vehicle/reportGNSS",
        data: {
            iotCode: o,
            second: n
        },
        header: {
            "Content-Type": "application/json"
        },
        success: function(e) {
            console.log(e.data), wx.navigateTo({
                url: "../gps/gps?result=" + o
            });
        }
    });
}

Page({
    data: {
        message: "请先扫描二维码"
    },
    onLoad: function() {},
    qr: function() {
        var e = this;
        wx.scanCode({
            success: function(n) {
                console.log(n.result), null != (o = n.result) ? e.setData({
                    message: o
                }) : e.setData({
                    message: "有误"
                });
            }
        });
    },
    open: function() {
        "" == o || null == o ? n() : wx.request({
            url: e.url + "/vehicle/unLock",
            data: {
                iotCode: o
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
        "" == o || null == o ? n() : wx.request({
            url: e.url + "/vehicle/lock",
            data: {
                iotCode: o
            },
            header: {
                "Content-Type": "application/json"
            },
            success: function(e) {
                console.log(e.data);
            }
        });
    },
    alert: function() {
        "" == o || null == o ? n() : wx.request({
            url: e.url + "/vehicle/sendAlert",
            data: {
                iotCode: o,
                type: 1
            },
            header: {
                "Content-Type": "application/json"
            },
            success: function(e) {
                console.log(e.data);
            }
        });
    },
    restart: function() {
        "" == o || null == o ? n() : wx.request({
            url: e.url + "/vehicle/sendRestart",
            data: {
                iotCode: o
            },
            header: {
                "Content-Type": "application/json"
            },
            success: function(e) {
                console.log(e.data);
            }
        });
    },
    stat: function() {
        "" == o || null == o ? n() : wx.showActionSheet({
            itemList: [ "1秒", "5秒", "10秒", "单次" ],
            success: function(e) {
                e.cancel || (0 == e.tapIndex ? t(1) : 1 == e.tapIndex ? t(5) : 2 == e.tapIndex ? t(10) : 3 == e.tapIndex && t(0));
            }
        });
    },
    gps: function() {
        "" == o || null == o ? n() : wx.showActionSheet({
            itemList: [ "1秒", "5秒", "10秒", "单次" ],
            success: function(e) {
                e.cancel || (0 == e.tapIndex ? s(1) : 1 == e.tapIndex ? s(5) : 2 == e.tapIndex ? s(10) : 3 == e.tapIndex && s(0));
            }
        });
    },
    openLED: function() {
        "" == o || null == o ? n() : wx.request({
            url: e.url + "/vehicle/openOrCloseLED",
            data: {
                iotCode: o,
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
    closeLED: function() {
        "" == o || null == o ? n() : wx.request({
            url: e.url + "/vehicle/openOrCloseLED",
            data: {
                iotCode: o,
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
    openHold: function() {
        "" == o || null == o ? n() : wx.request({
            url: e.url + "/vehicle/openOrCloseHoldSpeed",
            data: {
                iotCode: o,
                mode: 1
            },
            header: {
                "Content-Type": "application/json"
            },
            success: function(e) {
                console.log(e.data);
            }
        });
    },
    closeHold: function() {
        "" == o || null == o ? n() : wx.request({
            url: e.url + "/vehicle/openOrCloseHoldSpeed",
            data: {
                iotCode: o,
                mode: 0
            },
            header: {
                "Content-Type": "application/json"
            },
            success: function(e) {
                console.log(e.data);
            }
        });
    },
    lowSpeed: function() {
        "" == o || null == o ? n() : wx.request({
            url: e.url + "/vehicle/setSpeedMode",
            data: {
                iotCode: o,
                mode: 10
            },
            header: {
                "Content-Type": "application/json"
            },
            success: function(e) {
                console.log(e.data);
            }
        });
    },
    goodSpeed: function() {
        "" == o || null == o ? n() : wx.request({
            url: e.url + "/vehicle/setSpeedMode",
            data: {
                iotCode: o,
                mode: 20
            },
            header: {
                "Content-Type": "application/json"
            },
            success: function(e) {
                console.log(e.data);
            }
        });
    },
    highSpeed: function() {
        "" == o || null == o ? n() : wx.request({
            url: e.url + "/vehicle/setSpeedMode",
            data: {
                iotCode: o,
                mode: 30
            },
            header: {
                "Content-Type": "application/json"
            },
            success: function(e) {
                console.log(e.data);
            }
        });
    },
    setSpeed: function() {
        "" == o || null == o ? n() : wx.showActionSheet({
            itemList: [ "低速", "中速", "高速" ],
            success: function(n) {
                n.cancel || (0 == n.tapIndex ? wx.request({
                    url: e.url + "/vehicle/setSpeedMode",
                    data: {
                        iotCode: o,
                        mode: 10
                    },
                    header: {
                        "Content-Type": "application/json"
                    },
                    success: function(e) {
                        console.log(e.data);
                    }
                }) : 1 == n.tapIndex ? wx.request({
                    url: e.url + "/vehicle/setSpeedMode",
                    data: {
                        iotCode: o,
                        mode: 20
                    },
                    header: {
                        "Content-Type": "application/json"
                    },
                    success: function(e) {
                        console.log(e.data);
                    }
                }) : 2 == n.tapIndex && wx.request({
                    url: e.url + "/vehicle/setSpeedMode",
                    data: {
                        iotCode: o,
                        mode: 30
                    },
                    header: {
                        "Content-Type": "application/json"
                    },
                    success: function(e) {
                        console.log(e.data);
                    }
                }));
            }
        });
    },
    notPush: function() {
        "" == o || null == o ? n() : wx.request({
            url: e.url + "/vehicle/openOrClosePush",
            data: {
                iotCode: o,
                mode: 1
            },
            header: {
                "Content-Type": "application/json"
            },
            success: function(e) {
                console.log(e.data);
            }
        });
    },
    needPush: function() {
        "" == o || null == o ? n() : wx.request({
            url: e.url + "/vehicle/openOrClosePush",
            data: {
                iotCode: o,
                mode: 0
            },
            header: {
                "Content-Type": "application/json"
            },
            success: function(e) {
                console.log(e.data);
            }
        });
    },
    openORclose: function() {
        "" == o || null == o ? n() : wx.showActionSheet({
            itemList: [ "开锁", "关锁" ],
            success: function(n) {
                n.cancel || (0 == n.tapIndex ? wx.request({
                    url: e.FlashUrl + "/" + o + "?command=UNLOCK",
                    data: {},
                    header: {
                        "Content-Type": "application/json"
                    },
                    success: function(e) {
                        console.log(e.data);
                    }
                }) : 1 == n.tapIndex && wx.request({
                    url: e.FlashUrl + "/" + o + "?command=LOCK",
                    data: {},
                    header: {
                        "Content-Type": "application/json"
                    },
                    success: function(e) {
                        console.log(e.data);
                    }
                }));
            }
        });
    },
    newStat: function() {
        "" == o || null == o ? n() : wx.request({
            url: e.FlashUrl + "/" + o + "?command=STATUS",
            data: {},
            header: {
                "Content-Type": "application/json"
            },
            success: function(e) {
                console.log(e.data);
            }
        });
    },
    newAlert: function() {
        "" == o || null == o ? n() : wx.request({
            url: e.FlashUrl + "/" + o + "?command=AUDIO_PLAY",
            data: {},
            header: {
                "Content-Type": "application/json"
            },
            success: function(e) {
                console.log(e.data);
            }
        });
    },
    newGps: function() {
        "" == o || null == o ? n() : wx.request({
            url: e.FlashUrl + "/" + o + "?command=GNSS",
            data: {},
            header: {
                "Content-Type": "application/json"
            },
            success: function(e) {
                console.log(e.data);
            }
        });
    }
});