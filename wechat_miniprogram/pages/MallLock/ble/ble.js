var t, e = require("../../AES/aes2.js"), a = require("../../language/language"), o = require("../../../utils/time.js"), s = require("../../../utils/chikoUtil.js"), n = getApp();

Page({
    data: {
        language_lib: [],
        currentTab: 0,
        lmt_speed_modal_show: !1,
        input_lmt_speed_value: 0,
        mac: "",
        macs: "",
        macs2: "",
        connectState: 0,
        name: "",
        state: "",
        services: "",
        writechar: "",
        readchar: "",
        sendcmd: "unkown",
        token: [ 0, 0, 0, 0, 0 ],
        version: "",
        batt: 0,
        batt_soh: 0,
        lock_state: "",
        aes_L: [],
        aes_H: [],
        aes: [],
        cbatt: null,
        chall: null,
        cversion: null,
        cpwd: null,
        crssi: null,
        ctimestamp: null,
        unLockCount: 0,
        lockCount: 0,
        deviceId: "",
        new_mac: void 0,
        mac_type: void 0,
        lockId: "",
        url: void 0,
        yj: void 0,
        dcTest: void 0,
        phoneModel: void 0,
        t1: void 0,
        t2: void 0,
        timerCount: 0,
        gateway: void 0,
        timerTxt: !1,
        timer_s: 0,
        timer_ss: 0
    },
    onLoad: function(t) {
        var e, o = this;
        e = a.Fetch_language_lib(), console.log(t.macs), o.setData({
            language_lib: e
        }), o.data.macs = t.macs, o.data.unLockCount = parseInt(t.a), o.data.lockCount = parseInt(t.b), 
        o.data.dcTest = parseInt(t.c), o.data.gateway = parseInt(t.gateway), o.Fixed_password(o.data.macs), 
        null == t.connectState ? o.data.connectState = 0 : o.data.connectState = t.connectState, 
        null != t.new_macs && (o.data.new_macs = t.new_macs, o.setData({
            staff: !0
        })), null != t.yj && (o.data.lockId = t.lockId, o.data.yj = t.yj, "add" == o.data.yj ? o.setData({
            add: !0,
            lockId: o.data.lockId
        }) : "del" == o.data.yj && (1 == t.ysl ? o.setData({
            del: !0,
            lockId: "YSL-" + o.data.lockId
        }) : o.setData({
            del: !0,
            lockId: o.data.lockId
        }))), "" != o.data.macs && null != o.data.macs ? (o.data.macs2 = o.reSetMac(t.macs), 
        o.data.mac = o.setMac(t.macs), 1 == o.data.dcTest && (o.setData({
            timerTxt: !0
        }), o.data.t2 = setInterval(function() {
            o.setData({
                timer_ss: o.data.timer_ss + 10
            }), o.data.timer_ss >= 100 && o.setData({
                timer_s: o.data.timer_s + 1,
                timer_ss: 0
            });
        }, 100), o.data.t1 = setInterval(function() {
            o.data.timerCount += 1, wx.request({
                url: n.lockUrl + "/gateway/checkLastData",
                data: {
                    mac: o.data.mac
                },
                header: {
                    "Content-Type": "application/json"
                },
                success: function(t) {
                    (console.log(t.data), "100" == t.data.code) ? "phone" == t.data.type ? (s.Alert("蓝牙开锁"), 
                    clearInterval(o.data.t1), clearInterval(o.data.t2)) : "gateway" == t.data.type && (wx.request({
                        url: n.lockUrl + "/lock/checkData",
                        data: {
                            url: o.data.macs
                        },
                        success: function(t) {
                            console.log(t.data), t.data.powerbatt, s.Alert("网关开锁,电量:" + t.data.powerbatt);
                        }
                    }), clearInterval(o.data.t1), clearInterval(o.data.t2)) : "101" != t.data.code && "200" != t.data.code || (s.Alert("没有数据"), 
                    clearInterval(o.data.t1), clearInterval(o.data.t2));
                }
            }), 30 == o.data.timerCount && wx.request({
                url: n.lockUrl + "/gateway/changeOutTime",
                data: {},
                header: {
                    "Content-Type": "application/json"
                },
                success: function(t) {
                    console.log(t.data), "100" == t.data.code && (o.data.timerCount = 0, clearInterval(o.data.t1), 
                    clearInterval(o.data.t2), o.setData({
                        timer_s: 30,
                        timer_ss: 0
                    }), s.Alert("已超时"));
                }
            });
        }, 1e3)), o.onBLEConnectionStateChange(), o.onBLECharacteristicValueChange(), o.checkConnectState(), 
        0 == o.data.connectState ? (console.log("状态为0"), wx.getSystemInfo({
            success: function(t) {
                console.log(t), console.log("手机型号:" + t.platform), "android" == t.platform ? (o.data.phoneModel = "安卓", 
                o.data.deviceId = o.data.macs2, o.setData({
                    state: o.data.language_lib.connecting,
                    mac: o.data.mac
                }), o.createBLEConnection()) : (o.data.phoneModel = "苹果", o.startBluetoothDevicesDiscovery());
            }
        })) : 1 == o.data.connectState && (console.log("状态为1"), o.startBluetoothDevicesDiscovery()), 
        wx.onBluetoothAdapterStateChange(function(t) {
            console.log("adapterState changed, now is", t);
        })) : console.log("mac error");
    },
    createBLEConnection: function() {
        var t = this;
        console.log(t.data.deviceId, "deviceId"), wx.createBLEConnection({
            deviceId: t.data.deviceId,
            success: function(e) {
                console.log("connected"), wx.getBLEDeviceServices({
                    deviceId: t.data.deviceId,
                    success: function(e) {
                        for (var a = 0; a < e.services.length; a++) console.log("device services:", e.services[a]), 
                        "0000FEE7-0000-1000-8000-00805F9B34FB" == e.services[a].uuid && (console.log("find service"), 
                        t.setData({
                            services: e.services[a].uuid
                        }));
                        wx.getBLEDeviceCharacteristics({
                            deviceId: t.data.deviceId,
                            serviceId: t.data.services,
                            success: function(e) {
                                for (var a = 0; a < e.characteristics.length; a++) console.log("uuid:", e.characteristics[a].uuid), 
                                "000036F6-0000-1000-8000-00805F9B34FB" == e.characteristics[a].uuid ? (t.setData({
                                    readchar: e.characteristics[a].uuid
                                }), console.log("read characteristic", t.data.readchar)) : "000036F5-0000-1000-8000-00805F9B34FB" == e.characteristics[a].uuid && (t.setData({
                                    writechar: e.characteristics[a].uuid
                                }), console.log("write characteristic", t.data.writechar));
                                console.log("device getBLEDeviceCharacteristics:", e.characteristics), "000036F6-0000-1000-8000-00805F9B34FB" == t.data.readchar ? (console.log("notifyBLECharacteristicValueChange"), 
                                wx.notifyBLECharacteristicValueChange({
                                    state: !0,
                                    deviceId: t.data.deviceId,
                                    serviceId: t.data.services,
                                    characteristicId: t.data.readchar,
                                    success: function(e) {
                                        console.log("notifyBLECharacteristicValueChange success", e.errMsg), t.GetToken();
                                    },
                                    fail: function(t) {
                                        console.log("fail", t.errMsg);
                                    }
                                })) : console.log("fail");
                            }
                        });
                    }
                });
            },
            fail: function(t) {
                10012 == t.errCode || console.log(t, "errCode");
            }
        });
    },
    startBluetoothDevicesDiscovery: function() {
        var t = this;
        wx.startBluetoothDevicesDiscovery({
            services: [ "FEE7" ],
            success: function(e) {
                t.ScanAndConnect(t.data.mac), console.log("-----startBluetoothDevicesDiscovery--success----------"), 
                console.log(e), t.setData({
                    state: t.data.language_lib.scanning
                });
            },
            fail: function(t) {
                console.log(t);
            },
            complete: function(t) {
                console.log(t);
            }
        });
    },
    startBluetoothDevicesDiscovery2: function() {
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
    onBLEConnectionStateChange: function() {
        var t = this;
        wx.onBLEConnectionStateChange(function(e) {
            e.connected ? (t.setData({
                state: t.data.language_lib.connected
            }), wx.stopBluetoothDevicesDiscovery({
                success: function(t) {}
            })) : t.setData({
                state: t.data.language_lib.disconnected
            }), console.log("device ".concat(e.deviceId, " state has changed, connected: ").concat(e.connected));
        });
    },
    onBLECharacteristicValueChange: function() {
        var a = this;
        wx.onBLECharacteristicValueChange(function(o) {
            if (o.characteristicId == a.data.readchar) {
                var s = "", c = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], i = Array.prototype.map.call(new Uint8Array(o.value), function(t) {
                    return ("00" + t.toString(16)).slice(-2);
                }).join("");
                console.log("apphexxx", n.globalData.aes2), t = e.SetAeskey(n.globalData.aes2), 
                s = e.Decrypt(i, t), console.log("hex", i), console.log("rev", s);
                for (var l = 0; l < s.length; l += 2) c[l / 2] = parseInt(s.substr(l, 2), 16);
                a.parseCmd(c);
            }
        });
    },
    setMac: function(t) {
        var e = t, a = "";
        console.log("二维码：", e);
        for (var o = 0; o < e.length; o++) {
            var s = e[o];
            if (":" != s) {
                if (!(s >= "0" && s <= "9" || s >= "A" && s <= "F")) return wx.showModal({
                    title: "二维码格式错误",
                    content: e,
                    showCancel: !1,
                    duration: 2e3
                }), !1;
                a += s;
            }
        }
        return console.log("mac:", a), a;
    },
    Fixed_password: function(t) {
        console.log("Fixed_password");
        for (var e = "", a = 0; a < t.length; a++) {
            var o = t[a];
            if (":" != o) {
                if (!(o >= "0" && o <= "9" || o >= "A" && o <= "F")) return void wx.showModal({
                    title: "MAC格式错误",
                    content: t
                });
                e += o;
            }
        }
        var s = [ 0, 0, 0, 0, 0, 0 ];
        for (a = 0; a < e.length; a += 2) s[a / 2] = parseInt(e.substr(a, 2), 16);
        console.log("mac:", e), console.log("array1:", s);
        var n = 5 * (s[0] + s[1] + s[2] + s[3] + s[4] + s[5]) & 255;
        console.log("password_byte:", n);
        var c, i = 1 + (n >> 2 & 3), l = 1 + (n >> 4 & 3), d = 1 + (n >> 6 & 3);
        c = (1 + (n >> 0 & 3)).toString(10) + i.toString(10) + l.toString(10) + d.toString(10), 
        console.log("password:", c), this.data.cpwd = c, this.setData({
            pwd: c
        });
    },
    reSet: function() {
        wx.redirectTo({
            url: "../ble/ble?macs=" + this.data.macs
        });
    },
    DirectConnect: function(t, e, a) {
        this.setData({
            deviceId: e,
            mac: n.globalData.mac1,
            name: a,
            rssi: n.globalData.rssi1,
            state: this.data.language_lib.connecting
        });
    },
    ScanAndConnect: function(t) {
        this.setData({
            mac: t
        }), console.log("mac:", this.data.mac), 12 == this.data.mac.length ? this.GetAppointedDevice() : wx.showModal({
            title: "二维码格式错误",
            content: this.data.mac,
            showCancel: !1,
            duration: 2e3
        });
    },
    GetAppointedDevice: function() {
        var t = this;
        wx.getBluetoothDevices({
            success: function(e) {
                if (console.log("getBluetoothDevices"), e.devices.length) for (var a = 0; a < e.devices.length; a++) {
                    for (var o = new Int8Array(e.devices[a].advertisData), s = "", n = 2; n < 8; n++) s += t.GetMac(o[n]);
                    if (t.data.mac == s) return console.log("advdata_len:", e.devices[a].advertisData.byteLength), 
                    t.setData({
                        deviceId: e.devices[a].deviceId,
                        name: e.devices[a].name,
                        rssi: e.devices[a].RSSI,
                        state: t.data.language_lib.connecting
                    }), t.data.state = t.data.language_lib.connecting, t.data.crssi = e.devices[a].RSSI, 
                    void wx.createBLEConnection({
                        deviceId: t.data.deviceId,
                        success: function(e) {
                            console.log("connected"), wx.getBLEDeviceServices({
                                deviceId: t.data.deviceId,
                                success: function(e) {
                                    for (var a = 0; a < e.services.length; a++) console.log("device services:", e.services[a]), 
                                    "0000FEE7-0000-1000-8000-00805F9B34FB" == e.services[a].uuid && (console.log("find service"), 
                                    t.setData({
                                        services: e.services[a].uuid
                                    }));
                                    wx.getBLEDeviceCharacteristics({
                                        deviceId: t.data.deviceId,
                                        serviceId: t.data.services,
                                        success: function(e) {
                                            for (var a = 0; a < e.characteristics.length; a++) console.log("uuid:", e.characteristics[a].uuid), 
                                            "000036F6-0000-1000-8000-00805F9B34FB" == e.characteristics[a].uuid ? (t.setData({
                                                readchar: e.characteristics[a].uuid
                                            }), console.log("read characteristic", t.data.readchar)) : "000036F5-0000-1000-8000-00805F9B34FB" == e.characteristics[a].uuid && (t.setData({
                                                writechar: e.characteristics[a].uuid
                                            }), console.log("write characteristic", t.data.writechar));
                                            console.log("device getBLEDeviceCharacteristics:", e.characteristics), "000036F6-0000-1000-8000-00805F9B34FB" == t.data.readchar ? (console.log("notifyBLECharacteristicValueChange"), 
                                            wx.notifyBLECharacteristicValueChange({
                                                state: !0,
                                                deviceId: t.data.deviceId,
                                                serviceId: t.data.services,
                                                characteristicId: t.data.readchar,
                                                success: function(e) {
                                                    console.log("notifyBLECharacteristicValueChange success", e.errMsg), t.GetToken();
                                                },
                                                fail: function(t) {
                                                    console.log("fail", t.errMsg);
                                                }
                                            })) : console.log("fail");
                                        }
                                    });
                                }
                            });
                        }
                    });
                } else console.log("未扫描到设备");
                setTimeout(function() {
                    t.data.state == t.data.language_lib.scanning && t.GetAppointedDevice();
                }, 1e3);
            },
            fail: function(t) {},
            complete: function(t) {}
        });
    },
    checkConnectState: function() {},
    GetToken: function() {
        console.log("GetToken");
        if (this.data.state == this.data.language_lib.connected) {
            var t = this.encodeBuffer([ 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]);
            this.sendBleCmd(t);
        }
    },
    fetch_ctr_state: function() {
        console.log("fetch_ctr_state");
        if (this.data.state == this.data.language_lib.connected) {
            var t = [ 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
            t[4] = this.data.token[0], t[5] = this.data.token[1], t[6] = this.data.token[2], 
            t[7] = this.data.token[3];
            var e = this.encodeBuffer(t);
            this.sendBleCmd(e);
        }
    },
    reSetMac: function(t) {
        for (var e = t.split(":"), a = "", o = e.length - 1; o >= 0; o--) a += e[o], 0 != o && (a += ":");
        return a;
    },
    Lock_sys: function(t) {
        console.log("lock_sys", t);
        if (this.data.state == this.data.language_lib.connected) {
            var e = [ 4, 0, 0, 0, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0 ];
            e[3] = this.data.token[0], e[4] = this.data.token[1], e[5] = this.data.token[2], 
            e[6] = this.data.token[3], "lock_fac" == t.target.id && (this.mac_type = 2, e[1] = 11), 
            "lock_re" == t.target.id && (e[1] = 12), "lock_dfu" == t.target.id && (e[1] = 15);
            var a = this.encodeBuffer(e);
            this.sendBleCmd(a);
        }
    },
    Reset_Lock: function() {
        if (this.data.state == this.data.language_lib.connected) {
            var t = [ 4, 0, 0, 0, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0 ];
            t[1] = 12, t[3] = this.data.token[0], t[4] = this.data.token[1], t[5] = this.data.token[2], 
            t[6] = this.data.token[3];
            var e = this.encodeBuffer(t);
            this.sendBleCmd(e);
        }
    },
    Default_Mac: function() {
        if (this.data.state == this.data.language_lib.connected) {
            var t = [ 4, 0, 0, 0, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0 ];
            t[1] = 11, t[3] = this.data.token[0], t[4] = this.data.token[1], t[5] = this.data.token[2], 
            t[6] = this.data.token[3];
            var e = this.encodeBuffer(t);
            this.sendBleCmd(e);
        }
    },
    Set_dfu: function(t) {
        console.log("Set_dfu", t);
        if (this.data.state == this.data.language_lib.connected) {
            var e = [ 4, 31, 1, 1, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0 ];
            e[4] = this.data.token[0], e[5] = this.data.token[1], e[6] = this.data.token[2], 
            e[7] = this.data.token[3];
            var a = this.encodeBuffer(e);
            this.sendBleCmd(a);
        }
    },
    requestPwd: function(t) {
        var e = this;
        wx.request({
            url: n.lockUrl + "/lock/retPwd",
            data: {
                mac: e.data.macs,
                date: t
            },
            header: {
                "Content-Type": "application/json"
            },
            success: function(t) {
                console.log(t.data), e.data.cpwd = t.data, e.setData({
                    pwd: e.data.cpwd
                });
            }
        });
    },
    Set_timestamp: function(t) {
        console.log("Set_timestamp", t);
        var e = Date.parse(new Date());
        if (e /= 1e3, console.log("当前时间戳为：" + e), this.requestPwd(e), this.data.state == this.data.language_lib.connected) {
            var a = [ 4, 16, 4, 0, 0, 0, 0, 48, 48, 0, 0, 0, 0, 0, 0, 0 ];
            a[3] = 255 & e, a[4] = e >> 8 & 255, a[5] = e >> 16 & 255, a[6] = e >> 24 & 255, 
            a[7] = this.data.token[0], a[8] = this.data.token[1], a[9] = this.data.token[2], 
            a[10] = this.data.token[3];
            var o = this.encodeBuffer(a);
            this.requestPwd(e), this.sendBleCmd(o);
        }
        console.log("蓝牙版本:" + this.data.cversion + "电量：" + this.data.cbatt + "密码:" + this.data.cpwd);
    },
    timestamp_in: function(t) {
        if (console.log("当前时间戳为：1568818780"), this.data.state == this.data.language_lib.connected) {
            var e = [ 4, 16, 4, 0, 0, 0, 0, 48, 48, 0, 0, 0, 0, 0, 0, 0 ];
            e[3] = 92, e[4] = 70, e[5] = 130, e[6] = 93, e[7] = this.data.token[0], e[8] = this.data.token[1], 
            e[9] = this.data.token[2], e[10] = this.data.token[3];
            var a = this.encodeBuffer(e);
            this.requestPwd(1568818780), this.sendBleCmd(a);
        }
    },
    timestamp_in2: function(t) {
        if (console.log("当前时间戳为：1568820580"), this.data.state == this.data.language_lib.connected) {
            var e = [ 4, 16, 4, 0, 0, 0, 0, 48, 48, 0, 0, 0, 0, 0, 0, 0 ];
            e[3] = 100, e[4] = 77, e[5] = 130, e[6] = 93, e[7] = this.data.token[0], e[8] = this.data.token[1], 
            e[9] = this.data.token[2], e[10] = this.data.token[3];
            var a = this.encodeBuffer(e);
            this.requestPwd(1568820580), this.sendBleCmd(a);
        }
    },
    timestamp_in3: function(t) {
        if (console.log("当前时间戳为：1568820960"), this.data.state == this.data.language_lib.connected) {
            var e = [ 4, 16, 4, 0, 0, 0, 0, 48, 48, 0, 0, 0, 0, 0, 0, 0 ];
            e[3] = 224, e[4] = 78, e[5] = 130, e[6] = 93, e[7] = this.data.token[0], e[8] = this.data.token[1], 
            e[9] = this.data.token[2], e[10] = this.data.token[3];
            var a = this.encodeBuffer(e);
            this.requestPwd(1568820960), this.sendBleCmd(a);
        }
    },
    Get_timestamp: function(t) {
        console.log("Get_timestamp", t);
        if (this.data.state == this.data.language_lib.connected) {
            var e = [ 4, 17, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
            e[3] = this.data.token[0], e[4] = this.data.token[1], e[5] = this.data.token[2], 
            e[6] = this.data.token[3];
            var a = this.encodeBuffer(e);
            this.sendBleCmd(a);
        }
    },
    Lock_ctr: function(t) {
        console.log("lock_ctr", t);
        if (this.data.state == this.data.language_lib.connected) {
            var e = "lock", a = [ 2, 3, 1, 0, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0 ];
            a[4] = this.data.token[0], a[5] = this.data.token[1], a[6] = this.data.token[2], 
            a[7] = this.data.token[3], "lock_o" == t.target.id ? (a[3] = 0, e = "unlock") : a[3] = 1, 
            this.setData({
                sendcmd: e
            });
            var o = this.encodeBuffer(a);
            this.sendBleCmd(o);
        }
    },
    unlock_Btn: function() {
        if (this.data.state == this.data.language_lib.connected) {
            var t = [ 2, 3, 1, 0, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0 ];
            t[4] = this.data.token[0], t[5] = this.data.token[1], t[6] = this.data.token[2], 
            t[7] = this.data.token[3], t[3] = 0, "unlock", this.setData({
                sendcmd: "unlock"
            });
            var e = this.encodeBuffer(t);
            this.sendBleCmd(e);
        }
    },
    Set_userid: function(t) {
        console.log("Set_userid", t);
        var e = this.RandomNum(9);
        if (console.log("adv_userid：", e), this.data.state == this.data.language_lib.connected) {
            var a = [ 2, 4, 4, 0, 0, 0, 0, 48, 48, 0, 0, 0, 0, 0, 0, 0 ];
            a[3] = 255 & e, a[4] = e >> 8 & 255, a[5] = e >> 16 & 255, a[6] = e >> 24 & 255, 
            a[7] = this.data.token[0], a[8] = this.data.token[1], a[9] = this.data.token[2], 
            a[10] = this.data.token[3];
            var o = this.encodeBuffer(a);
            this.sendBleCmd(o);
        }
    },
    Get_userid: function(t) {
        console.log("Get_userid", t);
        if (this.data.state == this.data.language_lib.connected) {
            var e = [ 2, 5, 0, 0, 0, 0, 0, 48, 48, 0, 0, 0, 0, 0, 0, 0 ];
            e[1] = 5, e[2] = 0, e[3] = this.data.token[0], e[4] = this.data.token[1], e[5] = this.data.token[2], 
            e[6] = this.data.token[3];
            var a = this.encodeBuffer(e);
            this.sendBleCmd(a);
        }
    },
    Get_hall: function(t) {
        console.log("Get_hall", t);
        if (this.data.state == this.data.language_lib.connected) {
            var e = [ 4, 18, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
            e[1] = 18, e[3] = this.data.token[0], e[4] = this.data.token[1], e[5] = this.data.token[2], 
            e[6] = this.data.token[3];
            var a = this.encodeBuffer(e);
            this.sendBleCmd(a);
        }
    },
    Set_MAC: function(t) {
        console.log("Set_MAC", t);
        var e = this;
        if (e.mac_type = 1, console.log(e.data.new_macs + "vvvvvvvvvvvv"), 17 == e.data.new_macs.length) {
            if (e.data.state == e.data.language_lib.connected) {
                var a = [ 4, 21, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
                a[3] = parseInt(e.data.new_macs.substr(0, 2), 16), a[4] = parseInt(e.data.new_macs.substr(3, 2), 16), 
                a[5] = parseInt(e.data.new_macs.substr(6, 2), 16), a[6] = parseInt(e.data.new_macs.substr(9, 2), 16), 
                a[7] = parseInt(e.data.new_macs.substr(12, 2), 16), a[8] = parseInt(e.data.new_macs.substr(15, 2), 16), 
                a[9] = e.data.token[0], a[10] = e.data.token[1], a[11] = e.data.token[2], a[12] = e.data.token[3];
                var o = e.encodeBuffer(a);
                e.sendBleCmd(o);
            }
        } else e.data.new_macs.startsWith("YSL") ? (console.log("进来了"), wx.request({
            url: n.lockUrl + "/lock/bindUrl",
            data: {
                mac: e.data.macs,
                url: e.data.new_macs,
                lockId: e.data.lockId
            },
            header: {
                "Content-Type": "application/json"
            },
            success: function(t) {
                console.log(t.data), "100" == t.data.code ? (e.Reset_Lock(), s.Alert("入库成功！")) : wx.showModal({
                    title: n.alert,
                    content: "更新数据库出错，请通知大创员工",
                    showCancel: !1
                });
            }
        })) : wx.showModal({
            title: n.alert,
            content: "二维码中MAC错误",
            showCancel: !1
        });
    },
    sendBleCmd: function(t) {
        return wx.writeBLECharacteristicValue({
            deviceId: this.data.deviceId,
            serviceId: this.data.services,
            characteristicId: this.data.writechar,
            value: t,
            success: function(t) {
                return console.log("writeBLECharacteristicValue success"), !0;
            }
        }), !1;
    },
    Set_name_time: function(t) {
        console.log("Set_name_time", t);
        if (this.data.state == this.data.language_lib.connected) {
            var e = [ 4, 19, 4, 0, 0, 0, 0, 48, 48, 0, 0, 0, 0, 0, 0, 0 ];
            e[3] = 23, e[4] = 33, e[5] = 23, e[6] = 40, e[7] = this.data.token[0], e[8] = this.data.token[1], 
            e[9] = this.data.token[2], e[10] = this.data.token[3];
            var a = this.encodeBuffer(e);
            this.sendBleCmd(a);
        }
    },
    Get_name_time: function(t) {
        console.log("Get_name_time", t);
        if (this.data.state == this.data.language_lib.connected) {
            var e = [ 4, 20, 0, 0, 0, 0, 0, 48, 48, 0, 0, 0, 0, 0, 0, 0 ];
            e[3] = this.data.token[0], e[4] = this.data.token[1], e[5] = this.data.token[2], 
            e[6] = this.data.token[3];
            var a = this.encodeBuffer(e);
            this.sendBleCmd(a);
        }
    },
    encodeBuffer: function(a) {
        var o = "", s = [];
        console.log(a);
        for (var c = 0; c < a.length; c++) {
            var i = a[c].toString(16);
            i.length < 2 && (o += "0"), o += i;
        }
        console.log("str", o), console.log("apphexxx", n.globalData.aes2), t = e.SetAeskey(n.globalData.aes2);
        var l = e.Encrypt(o, t);
        console.log(l);
        for (c = 0; c < l.length; c += 2) s.push(parseInt(l.substr(c, 2), 16));
        var d = new ArrayBuffer(16), r = new DataView(d);
        for (c = 0; c < 16; c++) r.setUint8(c, s[c]);
        return d;
    },
    decodebuffer: function(t) {},
    parseCmd: function(t) {
        switch (console.log("parseCmd:", t), t[0]) {
          case 1:
            this.parseTokenCmd(t[1], t[2], t.slice(3, t.length));
            break;

          case 2:
            this.parseCtrCmd(t[1], t[2], t.slice(3, t.length));
            break;

          case 4:
            this.parseSyscfgCmd(t[1], t[2], t.slice(3, t.length));
        }
    },
    parseTokenCmd: function(t, e, a) {
        switch (console.log("parseTokenCmd:", t, a), t) {
          case 1:
            var o = [], s = [], c = this.data.language_lib.lock;
            if (8 != e) break;
            o.push(a[0]), o.push(a[1]), o.push(a[2]), o.push(a[3]), s.push(a[5]), s.push(a[4]), 
            0 == a[6] && (c = this.data.language_lib.unlock), this.setData({
                token: o,
                version: s.toString(10),
                lock_state: c,
                batt: a[7]
            }), clearInterval(n.globalData.timer2), this.data.cbatt = a[7], this.data.cbatt < 98 && 41 == n.userMess.role && wx.showModal({
                title: n.alert,
                content: "电量已低于98%！判为不良品！",
                showCancel: !1
            }), this.data.cversion = s.toString(10), 0 != a[6] && 1 != a[6] || this.setData({
                com: "通信成功"
            }), this.setData({
                add: !0
            }), clearInterval(n.globalData.timer2), 1 == this.data.dcTest && this.unlock_Btn();
        }
    },
    parseCtrCmd: function(t, e, a) {
        var o = this, s = 0;
        switch (console.log("parseCtrCmd:", t, a), t) {
          case 3:
            var c = o.data.language_lib.unlock;
            0 == a[0] ? (c = o.data.language_lib.unlock, o.data.unLockCount = o.data.unLockCount + 1, 
            o.setData({
                ulCount: o.data.unLockCount
            }), 1 == o.data.dcTest && wx.request({
                url: n.lockUrl + "/gateway/updateRecord",
                data: {
                    lockMac: o.data.mac,
                    type: o.data.phoneModel
                },
                header: {
                    "Content-Type": "application/json"
                },
                success: function(t) {
                    console.log(t.data), "100" == t.data.code || t.data.code;
                }
            }), setTimeout(function() {
                o.unConnect();
            }, 1e4)) : (c = o.data.language_lib.lock, o.data.lockCount = o.data.lockCount + 1, 
            o.setData({
                lCount: o.data.lockCount
            })), o.setData({
                lock_state: c,
                sendcmd: "unkown"
            }), clearInterval(n.globalData.timer2);
            break;

          case 5:
            s = a[3] << 24 | a[2] << 16 | a[1] << 8 | a[0], s >>>= 0, console.log("userid：", s), 
            o.setData({
                user_id: s.toString(10)
            });
        }
    },
    parseSyscfgCmd: function(t, e, a) {
        var c, i = this;
        switch (console.log("parseSyscfgCmd:", t, a), t) {
          case 17:
            c = a[3] << 24 | a[2] << 16 | a[1] << 8 | a[0], console.log(o.formatTime(c, "Y/M/D h:m:s")), 
            i.setData({
                timestamp: c,
                time: o.formatTime(c, "Y/M/D h:m:s")
            });
            break;

          case 18:
            0 == a[0] ? i.setData({
                hall: "闭合"
            }) : i.setData({
                hall: "打开"
            }), console.log("状态:" + a[0]), i.data.chall = 0;
            break;

          case 20:
            var l = a[0], d = a[1], r = a[2], u = a[3];
            i.setData({
                name_time: l + ":" + d + "-" + r + ":" + u
            });
            break;

          case 21:
            for (var h = "", g = 0; g < 6; g++) h += i.GetMac(a[g]);
            i.setData({
                set_mac: h
            }), console.log(h), 1 == i.mac_type ? h == i.data.mac || "000000000000" == h ? (console.log("没写成功"), 
            setTimeout(function() {
                i.Set_MAC();
            }, 300)) : s.Set_Mac(i.data.new_macs) == h && (console.log("重写成功了！"), wx.request({
                url: n.lockUrl + "/lock/bindUrl",
                data: {
                    mac: i.data.macs,
                    url: i.data.new_macs,
                    lockId: i.data.lockId
                },
                header: {
                    "Content-Type": "application/json"
                },
                success: function(t) {
                    console.log(t.data), "100" == t.data.code ? (i.Reset_Lock(), s.Alert("入库成功！")) : wx.showModal({
                        title: n.alert,
                        content: "更新数据库出错，请通知大创员工",
                        showCancel: !1
                    });
                }
            })) : 2 == i.mac_type && ("000000000000" == h ? (console.log("恢复成功了！" + i.data.lockId), 
            i.data.lockId.startsWith("YSL") ? i.data.url = i.data.lockId : i.data.url = i.data.macs, 
            wx.request({
                url: n.lockUrl + "/lock/cleary",
                data: {
                    url: i.data.url
                },
                header: {
                    "Content-Type": "application/json"
                },
                success: function(t) {
                    console.log(t.data), "100" == t.data.code ? (i.setData({
                        set_mac: "恢复成功"
                    }), i.Reset_Lock(), wx.showToast({
                        title: "删除成功",
                        icon: "success",
                        duration: 2e3
                    })) : wx.showModal({
                        title: n.alert,
                        content: "删除失败，请通知大创员工",
                        showCancel: !1
                    });
                }
            })) : (console.log("没恢复成功"), setTimeout(function() {
                i.Default_Mac();
            }, 300)));
        }
    },
    navbarTap: function(t) {
        console.log("navbarTap:", t);
        var e = this;
        wx.closeBluetoothAdapter({
            success: function(t) {
                console.log("先关闭蓝牙模块");
            }
        }), setTimeout(function() {
            wx.openBluetoothAdapter({
                success: function(t) {
                    console.log("-----success----------"), console.log(t), e.state = 1;
                },
                fail: function(t) {
                    console.log("-----fail----------"), console.log(t), e.state = 0, wx.showModal({
                        title: n.alert,
                        content: "请先打开蓝牙",
                        showCancel: !1,
                        confirmText: "我已打开"
                    });
                },
                complete: function(t) {
                    console.log("-----complete----------"), console.log(t);
                }
            });
        }, 100);
    },
    onReady: function() {},
    onShow: function() {
        0 == n.userMess.role ? (0 == n.timeMessage.endHour || 0 == n.timeMessage.endMin ? this.setData({
            setTime_txt: "未设置时间"
        }) : this.setData({
            setTime_txt: n.timeMessage.goHour + ":" + n.timeMessage.goMin + "-" + n.timeMessage.endHour + ":" + n.timeMessage.endMin
        }), this.setData({
            master: !0
        })) : 41 == n.userMess.role ? this.setData({
            staff: !0,
            ulCount: this.data.unLockCount,
            lCount: this.data.lockCount
        }) : 3 == n.userMess.role && this.setData({
            staff: !1,
            master: !1
        });
    },
    onHide: function() {
        console.log("onHide");
    },
    onUnload: function() {
        var t = this;
        t.unConnect(), setTimeout(function() {
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
        }, 100), clearInterval(t.data.t1), clearInterval(n.globalData.timer2), setTimeout(function() {
            1 == t.data.gateway || (n.globalData.timer2 = setInterval(function() {
                t.startBluetoothDevicesDiscovery2();
            }, 1e3));
        }, 300);
    },
    unConnect: function() {
        var t = this;
        wx.stopBluetoothDevicesDiscovery({
            success: function(e) {
                console.log("停止扫描"), t.setData({
                    state: "停止扫描"
                });
            }
        }), wx.closeBLEConnection({
            deviceId: t.data.deviceId,
            success: function(t) {
                console.log("断开连接");
            }
        }), wx.closeBluetoothAdapter({
            success: function(t) {
                console.log("已关闭蓝牙模块");
            }
        });
    },
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {},
    addBleData: function() {
        var t = this;
        console.log(t.data.macs), console.log(t.data.unLockCount + "," + t.data.lockCount), 
        console.log(t.data.cversion + "," + t.data.cpwd + "," + t.data.batt);
        var e = t.data.new_macs;
        e.startsWith("YSL") ? "YSL_test" == e ? wx.request({
            url: n.lockUrl + "/lock/bindBleData",
            data: {
                url: t.data.macs,
                batt: t.data.cbatt,
                version: t.data.cversion,
                pwd: t.data.cpwd,
                count: t.data.unLockCount + "," + t.data.lockCount
            },
            header: {
                "Content-Type": "application/json"
            },
            success: function(t) {
                console.log(t.data), "100" == t.data.code ? wx.showModal({
                    title: n.alert,
                    content: "录入成功",
                    showCancel: !1
                }) : wx.showModal({
                    title: n.alert,
                    content: "系统出错，请重新录入",
                    showCancel: !1
                });
            }
        }) : wx.request({
            url: n.lockUrl + "/lock/bindUrl",
            data: {
                mac: t.data.macs,
                url: t.data.new_macs,
                lockId: t.data.lockId
            },
            header: {
                "Content-Type": "application/json"
            },
            success: function(e) {
                console.log(e.data), "100" == e.data.code ? (t.Reset_Lock(), s.Alert("入库成功！")) : wx.showModal({
                    title: n.alert,
                    content: "更新数据库出错，请通知大创员工",
                    showCancel: !1
                });
            }
        }) : (t.data.new_macs.startsWith("YSL") && (t.data.macs = t.data.new_macs), wx.request({
            url: n.lockUrl + "/lock/bindBleData",
            data: {
                url: t.data.macs,
                batt: t.data.cbatt,
                version: t.data.cversion,
                pwd: t.data.cpwd,
                count: t.data.unLockCount + "," + t.data.lockCount
            },
            header: {
                "Content-Type": "application/json"
            },
            success: function(t) {
                console.log(t.data), "100" == t.data.code ? wx.showModal({
                    title: n.alert,
                    content: "录入成功",
                    showCancel: !1
                }) : wx.showModal({
                    title: n.alert,
                    content: "系统出错，请重新录入",
                    showCancel: !1
                });
            }
        }));
    },
    GetMac: function(t) {
        var e = (parseInt(t, 10) >>> 0).toString(16).toUpperCase(), a = e.substring(e.length - 2, e.length);
        return 1 == a.length && (a = "0" + a), a;
    },
    goHour: function(t) {
        var e = t.detail.value;
        n.timeMessage.goHour = e;
    },
    goMin: function(t) {
        var e = t.detail.value;
        n.timeMessage.goMin = e;
    },
    endHour: function(t) {
        var e = t.detail.value;
        n.timeMessage.endHour = e;
    },
    endMin: function(t) {
        var e = t.detail.value;
        n.timeMessage.endMin = e;
    },
    setTime_Btn: function(t) {
        console.log("Set_name_Btn", t);
        if (this.data.state == this.data.language_lib.connected) {
            this.setData({
                setTime_txt: n.timeMessage.goHour + ":" + n.timeMessage.goMin + "-" + n.timeMessage.endHour + ":" + n.timeMessage.endMin
            });
            var e = [ 4, 19, 4, 0, 0, 0, 0, 48, 48, 0, 0, 0, 0, 0, 0, 0 ];
            e[3] = parseInt(n.timeMessage.goHour), e[4] = parseInt(n.timeMessage.goMin), e[5] = parseInt(n.timeMessage.endHour), 
            e[6] = parseInt(n.timeMessage.endMin), e[7] = this.data.token[0], e[8] = this.data.token[1], 
            e[9] = this.data.token[2], e[10] = this.data.token[3];
            var a = this.encodeBuffer(e);
            this.sendBleCmd(a);
        }
    },
    RandomNum: function(t) {
        return t > 21 ? null : parseInt((Math.random() + 1) * Math.pow(10, t - 1));
    },
    changePwd: function() {
        this.Set_timestamp();
    }
});