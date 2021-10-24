var t, e = require("../../../AES/aes2.js"), a = require("../../../language/language"), s = require("../../../../utils/time.js"), o = require("../../../../utils/chikoUtil"), n = getApp();

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
        yj: void 0,
        dcTest: void 0,
        phoneModel: void 0,
        t1: void 0,
        t2: void 0,
        timerCount: 0,
        gateway: void 0,
        timerTxt: !1,
        timer_s: 0,
        timer_ss: 0,
        rotateIndex: 0,
        unlocking: !0,
        pwdDisplay: !1,
        lockS: "正在开锁"
    },
    onLoad: function(t) {
        var e, s = this;
        e = a.Fetch_language_lib(), console.log(t.macs), s.setData({
            language_lib: e
        }), s.data.macs = t.macs, s.data.gateway = parseInt(t.gateway), s.Fixed_password(s.data.macs), 
        null != t.new_macs && (s.data.new_macs = t.new_macs, s.setData({
            staff: !0
        })), "" != s.data.macs && null != s.data.macs ? (s.data.macs2 = s.reSetMac(t.macs), 
        s.data.mac = s.setMac(t.macs), s.onBLEConnectionStateChange(), s.onBLECharacteristicValueChange(), 
        s.checkConnectState(), 0 == s.data.connectState ? (console.log("状态为0"), wx.getSystemInfo({
            success: function(t) {
                console.log(t), console.log("手机型号:" + t.platform), "android" == t.platform ? (s.data.phoneModel = "安卓", 
                s.data.deviceId = s.data.macs2, s.setData({
                    state: s.data.language_lib.connecting,
                    mac: s.data.mac
                }), s.createBLEConnection()) : (s.data.phoneModel = "苹果", s.startBluetoothDevicesDiscovery());
            }
        })) : 1 == s.data.connectState && (console.log("状态为1"), s.startBluetoothDevicesDiscovery()), 
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
        wx.onBLECharacteristicValueChange(function(s) {
            if (s.characteristicId == a.data.readchar) {
                var o = "", i = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], c = Array.prototype.map.call(new Uint8Array(s.value), function(t) {
                    return ("00" + t.toString(16)).slice(-2);
                }).join("");
                console.log("apphexxx", n.globalData.aes2), t = e.SetAeskey(n.globalData.aes2), 
                o = e.Decrypt(c, t), console.log("hex", c), console.log("rev", o);
                for (var l = 0; l < o.length; l += 2) i[l / 2] = parseInt(o.substr(l, 2), 16);
                a.parseCmd(i);
            }
        });
    },
    setMac: function(t) {
        var e = t, a = "";
        console.log("二维码：", e);
        for (var s = 0; s < e.length; s++) {
            var o = e[s];
            if (":" != o) {
                if (!(o >= "0" && o <= "9" || o >= "A" && o <= "F")) return wx.showModal({
                    title: "二维码格式错误",
                    content: e,
                    showCancel: !1,
                    duration: 2e3
                }), !1;
                a += o;
            }
        }
        return console.log("mac:", a), a;
    },
    Fixed_password: function(t) {
        console.log("Fixed_password");
        for (var e = "", a = 0; a < t.length; a++) {
            var s = t[a];
            if (":" != s) {
                if (!(s >= "0" && s <= "9" || s >= "A" && s <= "F")) return void wx.showModal({
                    title: "MAC格式错误",
                    content: t
                });
                e += s;
            }
        }
        var o = [ 0, 0, 0, 0, 0, 0 ];
        for (a = 0; a < e.length; a += 2) o[a / 2] = parseInt(e.substr(a, 2), 16);
        console.log("mac:", e), console.log("array1:", o);
        var n = 5 * (o[0] + o[1] + o[2] + o[3] + o[4] + o[5]) & 255;
        console.log("password_byte:", n);
        var i, c = 1 + (n >> 2 & 3), l = 1 + (n >> 4 & 3), d = 1 + (n >> 6 & 3);
        i = (1 + (n >> 0 & 3)).toString(10) + c.toString(10) + l.toString(10) + d.toString(10), 
        console.log("password:", i), this.data.cpwd = i, this.setData({
            pwd: i
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
                    for (var s = new Int8Array(e.devices[a].advertisData), o = "", n = 2; n < 8; n++) o += t.GetMac(s[n]);
                    if (t.data.mac == o) return console.log("advdata_len:", e.devices[a].advertisData.byteLength), 
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
        for (var e = t.split(":"), a = "", s = e.length - 1; s >= 0; s--) a += e[s], 0 != s && (a += ":");
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
            var s = this.encodeBuffer(a);
            this.requestPwd(e), this.sendBleCmd(s);
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
            var s = this.encodeBuffer(a);
            this.sendBleCmd(s);
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
            var s = this.encodeBuffer(a);
            this.sendBleCmd(s);
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
        if (this.mac_type = 1, 17 == this.data.new_macs.length) {
            if (this.data.state == this.data.language_lib.connected) {
                var e = [ 4, 21, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
                e[3] = parseInt(this.data.new_macs.substr(0, 2), 16), e[4] = parseInt(this.data.new_macs.substr(3, 2), 16), 
                e[5] = parseInt(this.data.new_macs.substr(6, 2), 16), e[6] = parseInt(this.data.new_macs.substr(9, 2), 16), 
                e[7] = parseInt(this.data.new_macs.substr(12, 2), 16), e[8] = parseInt(this.data.new_macs.substr(15, 2), 16), 
                e[9] = this.data.token[0], e[10] = this.data.token[1], e[11] = this.data.token[2], 
                e[12] = this.data.token[3];
                var a = this.encodeBuffer(e);
                this.sendBleCmd(a);
            }
        } else wx.showModal({
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
        var s = "", o = [];
        console.log(a);
        for (var i = 0; i < a.length; i++) {
            var c = a[i].toString(16);
            c.length < 2 && (s += "0"), s += c;
        }
        console.log("str", s), console.log("apphexxx", n.globalData.aes2), t = e.SetAeskey(n.globalData.aes2);
        var l = e.Encrypt(s, t);
        console.log(l);
        for (i = 0; i < l.length; i += 2) o.push(parseInt(l.substr(i, 2), 16));
        var d = new ArrayBuffer(16), r = new DataView(d);
        for (i = 0; i < 16; i++) r.setUint8(i, o[i]);
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
            var s = [], o = [], i = this.data.language_lib.lock;
            if (8 != e) break;
            s.push(a[0]), s.push(a[1]), s.push(a[2]), s.push(a[3]), o.push(a[5]), o.push(a[4]), 
            0 == a[6] && (i = this.data.language_lib.unlock), this.setData({
                token: s,
                version: o.toString(10),
                lock_state: i,
                batt: a[7]
            }), clearInterval(n.globalData.timer2), this.data.cbatt = a[7], this.data.cbatt < 98 && 41 == n.userMess.role && wx.showModal({
                title: n.alert,
                content: "电量已低于98%！判为不良品！",
                showCancel: !1
            }), this.data.cversion = o.toString(10), 0 != a[6] && 1 != a[6] || this.setData({
                com: "通信成功"
            }), clearInterval(n.globalData.timer2), this.unlock_Btn();
        }
    },
    parseCtrCmd: function(t, e, a) {
        var s = this, o = 0;
        switch (console.log("parseCtrCmd:", t, a), t) {
          case 3:
            var i = s.data.language_lib.unlock;
            0 == a[0] ? (i = s.data.language_lib.unlock, s.setData({
                lockS: "开锁成功"
            }), clearInterval(this.timeInterval), setTimeout(function() {
                s.unConnect();
            }, 5e3)) : i = s.data.language_lib.lock, s.setData({
                lock_state: i,
                sendcmd: "unkown"
            }), clearInterval(n.globalData.timer2);
            break;

          case 5:
            o = a[3] << 24 | a[2] << 16 | a[1] << 8 | a[0], o >>>= 0, console.log("userid：", o), 
            s.setData({
                user_id: o.toString(10)
            });
        }
    },
    parseSyscfgCmd: function(t, e, a) {
        var i, c = this;
        switch (console.log("parseSyscfgCmd:", t, a), t) {
          case 17:
            i = a[3] << 24 | a[2] << 16 | a[1] << 8 | a[0], console.log(s.formatTime(i, "Y/M/D h:m:s")), 
            c.setData({
                timestamp: i,
                time: s.formatTime(i, "Y/M/D h:m:s")
            });
            break;

          case 18:
            0 == a[0] ? c.setData({
                hall: "闭合"
            }) : c.setData({
                hall: "打开"
            }), console.log("状态:" + a[0]), c.data.chall = 0;
            break;

          case 20:
            var l = a[0], d = a[1], r = a[2], h = a[3];
            c.setData({
                name_time: l + ":" + d + "-" + r + ":" + h
            });
            break;

          case 21:
            for (var u = "", g = 0; g < 6; g++) u += c.GetMac(a[g]);
            c.setData({
                set_mac: u
            }), console.log(u), 1 == c.mac_type ? u == c.data.mac || "000000000000" == u ? (console.log("没写成功"), 
            setTimeout(function() {
                c.Set_MAC();
            }, 300)) : o.Set_Mac(c.data.new_macs) == u && (console.log("重写成功了！"), wx.request({
                url: n.lockUrl + "/lock/bindUrl",
                data: {
                    mac: c.data.macs,
                    url: c.data.new_macs,
                    lockId: c.data.lockId
                },
                header: {
                    "Content-Type": "application/json"
                },
                success: function(t) {
                    console.log(t.data), "100" == t.data.code ? (c.Reset_Lock(), o.Alert("入库成功！")) : wx.showModal({
                        title: n.alert,
                        content: "更新数据库出错，请通知大创员工",
                        showCancel: !1
                    });
                }
            })) : 2 == c.mac_type && ("000000000000" == u ? (console.log("恢复成功了！"), wx.request({
                url: n.lockUrl + "/lock/cleary",
                data: {
                    url: c.data.macs
                },
                header: {
                    "Content-Type": "application/json"
                },
                success: function(t) {
                    console.log(t.data), "100" == t.data.code ? (c.setData({
                        set_mac: "恢复成功"
                    }), c.Reset_Lock(), wx.showToast({
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
                c.Default_Mac();
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
    onReady: function() {
        var t = wx.createAnimation({
            duration: 1e3,
            timingFunction: "ease"
        });
        this.animation = t, this.refreshList();
    },
    refreshList: function() {
        this.timeInterval = setInterval(function() {
            var t = this;
            this.data.rotateIndex = this.data.rotateIndex + 1, this.data.timerCount += 1, this.animation.rotate(360 * this.data.rotateIndex).step(), 
            this.setData({
                animationData: this.animation.export()
            }), this.data.timerCount > 10 && (this.setData({
                unlocking: !1,
                pwdDisplay: !0
            }), setTimeout(function() {
                t.stopRefresh(), t.slideupshow(), t.unConnect();
            }, 500));
        }.bind(this), 1e3);
    },
    slideupshow: function() {
        var t = wx.createAnimation({
            duration: 1e3,
            timingFunction: "ease"
        });
        t.translateY(100).step(), this.setData({
            animationData2: t.export()
        });
    },
    stopRefresh: function() {
        clearInterval(this.timeInterval), this.timeInterval = 0;
    },
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
        });
    },
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {},
    addBleData: function() {
        console.log(this.data.macs), console.log(this.data.unLockCount + "," + this.data.lockCount), 
        wx.request({
            url: n.lockUrl + "/lock/bindBleData",
            data: {
                url: this.data.macs,
                batt: this.data.cbatt,
                version: this.data.cversion,
                pwd: this.data.cpwd,
                count: this.data.unLockCount + "," + this.data.lockCount
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
        });
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