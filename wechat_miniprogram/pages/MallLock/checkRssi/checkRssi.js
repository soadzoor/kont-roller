var t = getApp(), s = require("../../../utils/chikoUtil.js");

Page({
    data: {
        macs: "",
        rssiList: [],
        mac: "",
        scanCount: 0,
        rssi: 0,
        rssi_ave: 0,
        state: 0,
        setRssiCount: 15
    },
    onLoad: function(t) {},
    onShow: function() {},
    onUnload: function() {
        clearInterval(t.globalData.time1), wx.closeBluetoothAdapter({
            success: function(t) {
                console.log("已关闭蓝牙模块");
            }
        }), setTimeout(function() {
            wx.openBluetoothAdapter({
                success: function(t) {
                    console.log("打开蓝牙模块"), console.log(t);
                },
                fail: function(t) {
                    console.log("-----fail----------"), console.log(t);
                },
                complete: function(t) {
                    console.log("-----complete----------"), console.log(t);
                }
            });
        }, 300);
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
    startScan: function() {
        this.data.state = 1, this.setData({
            scanNo: !0,
            startScanBtn: !1
        });
    },
    setRssi_cancel: function() {
        s.Alert("请先设置信号值");
    },
    setRssi_confirm: function() {
        0 == parseInt(this.data.rssi_ave) ? s.Alert("请先设置信号值") : this.setData({
            setRssiAve: !1
        });
    },
    rssi_input: function(t) {
        this.data.rssi_ave = t.detail.value;
    },
    BLEscan: function() {
        var s = this;
        wx.getBluetoothDevices({
            success: function(a) {
                console.log("getBluetoothDevices");
                var e = [];
                if (a.devices.length) {
                    var o = [];
                    console.log("dev num:", a.devices.length);
                    for (var n = 0; n < a.devices.length; n++) {
                        var c = new Uint8Array(a.devices[n].advertisData), i = "";
                        if (16 == c.byteLength) {
                            e.push(a.devices[n]);
                            for (var l = 2; l < 8; l++) i += s.GetMac(c[l]);
                            if (i == s.mac) {
                                if (1 == s.data.state) {
                                    console.log("已搜索到记录");
                                    var r = "";
                                    s.data.scanCount = s.data.scanCount + 1, console.log(a.devices[n].RSSI + "pppppppp"), 
                                    console.log("搜索次数:" + s.data.setRssiCount + "已搜索:" + s.data.scanCount + "次"), r = (r = a.devices[n].RSSI.toString()).substr(1, r.length - 1);
                                    for (l = 0; l < s.data.setRssiCount; l++) if (null == s.data.rssiList[l]) {
                                        s.data.rssiList[l] = parseInt(r);
                                        break;
                                    }
                                    s.setData({
                                        scanNo: !1,
                                        scanYes: !0,
                                        count: s.data.scanCount,
                                        rssiMess: a.devices[n].RSSI
                                    });
                                }
                                "15" == s.data.scanCount && (console.log("列表:" + s.data.rssiList), s.data.scanCount = 0, 
                                s.data.state = 0, clearInterval(t.globalData.time1), s.Ave_Rssi());
                            }
                            o.push(i);
                        }
                    }
                    s.setData({
                        addrs: o,
                        list: e
                    }), console.log("设备列表：", s.data.list);
                }
            },
            fail: function(t) {},
            complete: function(t) {}
        });
    },
    Ave_Rssi: function() {
        for (var s = this, a = 0; a < s.data.rssiList.length; a++) s.data.rssi = s.data.rssi + s.data.rssiList[a], 
        console.log("目前值:" + s.data.rssi);
        s.data.rssi = s.data.rssi / s.data.rssiList.length, s.data.rssi = parseInt(s.data.rssi), 
        console.log("平均值：" + s.data.rssi), s.data.rssi < s.data.rssi_ave ? wx.request({
            url: t.lockUrl + "/lock/aveRssi",
            data: {
                mac: s.data.macs,
                rssi: s.data.rssi
            },
            header: {
                "Content-Type": "application/json"
            },
            success: function(t) {
                console.log(t.data), "100" == t.data.code ? s.setData({
                    resultMess: !0,
                    succseeOrfail: "上传成功",
                    txtColor: "green"
                }) : "101" == t.data.code ? s.setData({
                    resultMess: !0,
                    succseeOrfail: "上传失败",
                    txtColor: "red"
                }) : s.setData({
                    resultMess: !0,
                    succseeOrfail: "程序错误",
                    txtColor: "red"
                }), s.data.rssiList = [];
            }
        }) : (s.setData({
            resultMess: !0,
            succseeOrfail: "平均值高于设置的值",
            txtColor: "red"
        }), s.data.rssiList = []);
    },
    GetMac: function(t) {
        var s = (parseInt(t, 10) >>> 0).toString(16).toUpperCase(), a = s.substring(s.length - 2, s.length);
        return 1 == a.length && (a = "0" + a), a;
    },
    scanMac: function() {
        var t = this, a = "";
        wx.scanCode({
            success: function(e) {
                17 == (a = e.result).length ? (t.data.macs = a, t.setData({
                    macTxt: "MAC:" + a
                })) : s.Alert("MAC格式错误");
            }
        });
    },
    addData: function() {
        var a = this;
        wx.request({
            url: t.lockUrl + "/lock/addData",
            data: {
                mac: a.data.macs,
                order: "dc-000071,11.14"
            },
            header: {
                "Content-Type": "application/json"
            },
            success: function(t) {
                console.log(t.data), "100" == t.data.code ? (a.setData({
                    macTxt: ""
                }), s.Alert("入库成功")) : "201" == t.data.code ? s.Alert("MAC重复！") : "200" != t.data.code && "101" != t.data.code || s.Alert("接口出错！");
            }
        });
    }
});