var e, t = require("../../../AES/aes2.js"), a = require("../../../language/language"), o = (require("../../../../utils/time.js"), 
require("../../../../utils/chikoUtil"), require("../../../../utils/md5Util")), c = getApp();

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
    onLoad: function(e) {
        var t, o = this;
        t = a.Fetch_language_lib(), console.log(e.macs), o.setData({
            language_lib: t
        }), o.data.macs = e.macs, o.Fixed_password(o.data.macs), o.sendUnlockToGateway(e.userName, e.userStore), 
        null != e.new_macs && (o.data.new_macs = e.new_macs, o.setData({
            staff: !0
        })), "" != o.data.macs && null != o.data.macs ? (o.data.mac = o.setMac(e.macs), 
        o.onBLEConnectionStateChange(), o.onBLECharacteristicValueChange(), o.checkConnectState(), 
        0 == o.data.connectState ? (console.log("状态为0"), wx.getSystemInfo({
            success: function(e) {
                console.log(e), console.log("手机型号:" + e.platform), "android" == e.platform ? (o.data.phoneModel = "安卓", 
                o.data.deviceId = o.data.macs2, o.setData({
                    state: o.data.language_lib.connecting,
                    mac: o.data.mac
                }), o.createBLEConnection()) : (o.data.phoneModel = "苹果", o.startBluetoothDevicesDiscovery());
            }
        })) : 1 == o.data.connectState && (console.log("状态为1"), o.startBluetoothDevicesDiscovery()), 
        wx.onBluetoothAdapterStateChange(function(e) {
            console.log("adapterState changed, now is", e);
        })) : console.log("mac error");
    },
    createBLEConnection: function() {
        var e = this;
        console.log(e.data.deviceId, "deviceId"), wx.createBLEConnection({
            deviceId: e.data.deviceId,
            success: function(t) {
                console.log("connected"), wx.getBLEDeviceServices({
                    deviceId: e.data.deviceId,
                    success: function(t) {
                        for (var a = 0; a < t.services.length; a++) console.log("device services:", t.services[a]), 
                        "0000FEE7-0000-1000-8000-00805F9B34FB" == t.services[a].uuid && (console.log("find service"), 
                        e.setData({
                            services: t.services[a].uuid
                        }));
                        wx.getBLEDeviceCharacteristics({
                            deviceId: e.data.deviceId,
                            serviceId: e.data.services,
                            success: function(t) {
                                for (var a = 0; a < t.characteristics.length; a++) console.log("uuid:", t.characteristics[a].uuid), 
                                "000036F6-0000-1000-8000-00805F9B34FB" == t.characteristics[a].uuid ? (e.setData({
                                    readchar: t.characteristics[a].uuid
                                }), console.log("read characteristic", e.data.readchar)) : "000036F5-0000-1000-8000-00805F9B34FB" == t.characteristics[a].uuid && (e.setData({
                                    writechar: t.characteristics[a].uuid
                                }), console.log("write characteristic", e.data.writechar));
                                console.log("device getBLEDeviceCharacteristics:", t.characteristics), "000036F6-0000-1000-8000-00805F9B34FB" == e.data.readchar ? (console.log("notifyBLECharacteristicValueChange"), 
                                wx.notifyBLECharacteristicValueChange({
                                    state: !0,
                                    deviceId: e.data.deviceId,
                                    serviceId: e.data.services,
                                    characteristicId: e.data.readchar,
                                    success: function(t) {
                                        console.log("notifyBLECharacteristicValueChange success", t.errMsg), e.GetToken();
                                    },
                                    fail: function(e) {
                                        console.log("fail", e.errMsg);
                                    }
                                })) : console.log("fail");
                            }
                        });
                    }
                });
            },
            fail: function(e) {
                10012 == e.errCode || console.log(e, "errCode");
            }
        });
    },
    startBluetoothDevicesDiscovery: function() {
        var e = this;
        wx.startBluetoothDevicesDiscovery({
            services: [ "FEE7" ],
            success: function(t) {
                e.ScanAndConnect(e.data.mac), console.log("-----startBluetoothDevicesDiscovery--success----------"), 
                console.log(t), e.setData({
                    state: e.data.language_lib.scanning
                });
            },
            fail: function(e) {
                console.log(e);
            },
            complete: function(e) {
                console.log(e);
            }
        });
    },
    startBluetoothDevicesDiscovery2: function() {
        wx.startBluetoothDevicesDiscovery({
            services: [ "FEE7" ],
            success: function(e) {
                console.log("-----startBluetoothDevicesDiscovery--success----------"), console.log(e);
            },
            fail: function(e) {
                console.log(e);
            },
            complete: function(e) {
                console.log(e);
            }
        });
    },
    onBLEConnectionStateChange: function() {
        var e = this;
        wx.onBLEConnectionStateChange(function(t) {
            t.connected ? (e.setData({
                state: e.data.language_lib.connected
            }), wx.stopBluetoothDevicesDiscovery({
                success: function(e) {}
            })) : e.setData({
                state: e.data.language_lib.disconnected
            }), console.log("device ".concat(t.deviceId, " state has changed, connected: ").concat(t.connected));
        });
    },
    onBLECharacteristicValueChange: function() {
        var a = this;
        wx.onBLECharacteristicValueChange(function(o) {
            if (o.characteristicId == a.data.readchar) {
                var n = "", s = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], i = Array.prototype.map.call(new Uint8Array(o.value), function(e) {
                    return ("00" + e.toString(16)).slice(-2);
                }).join("");
                console.log("apphexxx", c.globalData.aes2), e = t.SetAeskey(c.globalData.aes2), 
                n = t.Decrypt(i, e), console.log("hex", i), console.log("rev", n);
                for (var l = 0; l < n.length; l += 2) s[l / 2] = parseInt(n.substr(l, 2), 16);
                a.parseCmd(s);
            }
        });
    },
    setMac: function(e) {
        var t = e, a = "";
        console.log("二维码：", t);
        for (var o = 0; o < t.length; o++) {
            var c = t[o];
            if (":" != c) {
                if (!(c >= "0" && c <= "9" || c >= "A" && c <= "F")) return wx.showModal({
                    title: "二维码格式错误",
                    content: t,
                    showCancel: !1,
                    duration: 2e3
                }), !1;
                a += c;
            }
        }
        return console.log("mac:", a), a;
    },
    Fixed_password: function(e) {
        console.log("Fixed_password");
        for (var t = "", a = 0; a < e.length; a++) {
            var o = e[a];
            if (":" != o) {
                if (!(o >= "0" && o <= "9" || o >= "A" && o <= "F")) return void wx.showModal({
                    title: "MAC格式错误",
                    content: e
                });
                t += o;
            }
        }
        var c = [ 0, 0, 0, 0, 0, 0 ];
        for (a = 0; a < t.length; a += 2) c[a / 2] = parseInt(t.substr(a, 2), 16);
        console.log("mac:", t), console.log("array1:", c);
        var n = 5 * (c[0] + c[1] + c[2] + c[3] + c[4] + c[5]) & 255;
        console.log("password_byte:", n);
        var s, i = 1 + (n >> 2 & 3), l = 1 + (n >> 4 & 3), r = 1 + (n >> 6 & 3);
        s = (1 + (n >> 0 & 3)).toString(10) + i.toString(10) + l.toString(10) + r.toString(10), 
        console.log("password:", s), this.data.cpwd = s, this.setData({
            pwd: s
        });
    },
    reSet: function() {
        wx.redirectTo({
            url: "../ble/ble?macs=" + this.data.macs
        });
    },
    DirectConnect: function(e, t, a) {
        this.setData({
            deviceId: t,
            mac: c.globalData.mac1,
            name: a,
            rssi: c.globalData.rssi1,
            state: this.data.language_lib.connecting
        });
    },
    ScanAndConnect: function(e) {
        this.setData({
            mac: e
        }), console.log("mac:", this.data.mac), 12 == this.data.mac.length ? this.GetAppointedDevice() : wx.showModal({
            title: "二维码格式错误",
            content: this.data.mac,
            showCancel: !1,
            duration: 2e3
        });
    },
    GetAppointedDevice: function() {
        var e = this;
        wx.getBluetoothDevices({
            success: function(t) {
                if (console.log("getBluetoothDevices"), t.devices.length) for (var a = 0; a < t.devices.length; a++) {
                    for (var o = new Int8Array(t.devices[a].advertisData), c = "", n = 2; n < 8; n++) c += e.GetMac(o[n]);
                    if (e.data.mac == c) return console.log("advdata_len:", t.devices[a].advertisData.byteLength), 
                    e.setData({
                        deviceId: t.devices[a].deviceId,
                        name: t.devices[a].name,
                        rssi: t.devices[a].RSSI,
                        state: e.data.language_lib.connecting
                    }), e.data.state = e.data.language_lib.connecting, e.data.crssi = t.devices[a].RSSI, 
                    void wx.createBLEConnection({
                        deviceId: e.data.deviceId,
                        success: function(t) {
                            console.log("connected"), wx.getBLEDeviceServices({
                                deviceId: e.data.deviceId,
                                success: function(t) {
                                    for (var a = 0; a < t.services.length; a++) console.log("device services:", t.services[a]), 
                                    "0000FEE7-0000-1000-8000-00805F9B34FB" == t.services[a].uuid && (console.log("find service"), 
                                    e.setData({
                                        services: t.services[a].uuid
                                    }));
                                    wx.getBLEDeviceCharacteristics({
                                        deviceId: e.data.deviceId,
                                        serviceId: e.data.services,
                                        success: function(t) {
                                            for (var a = 0; a < t.characteristics.length; a++) console.log("uuid:", t.characteristics[a].uuid), 
                                            "000036F6-0000-1000-8000-00805F9B34FB" == t.characteristics[a].uuid ? (e.setData({
                                                readchar: t.characteristics[a].uuid
                                            }), console.log("read characteristic", e.data.readchar)) : "000036F5-0000-1000-8000-00805F9B34FB" == t.characteristics[a].uuid && (e.setData({
                                                writechar: t.characteristics[a].uuid
                                            }), console.log("write characteristic", e.data.writechar));
                                            console.log("device getBLEDeviceCharacteristics:", t.characteristics), "000036F6-0000-1000-8000-00805F9B34FB" == e.data.readchar ? (console.log("notifyBLECharacteristicValueChange"), 
                                            wx.notifyBLECharacteristicValueChange({
                                                state: !0,
                                                deviceId: e.data.deviceId,
                                                serviceId: e.data.services,
                                                characteristicId: e.data.readchar,
                                                success: function(t) {
                                                    console.log("notifyBLECharacteristicValueChange success", t.errMsg), e.GetToken();
                                                },
                                                fail: function(e) {
                                                    console.log("fail", e.errMsg);
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
                    e.data.state == e.data.language_lib.scanning && e.GetAppointedDevice();
                }, 1e3);
            },
            fail: function(e) {},
            complete: function(e) {}
        });
    },
    checkConnectState: function() {},
    GetToken: function() {
        console.log("GetToken");
        if (this.data.state == this.data.language_lib.connected) {
            var e = this.encodeBuffer([ 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]);
            this.sendBleCmd(e);
        }
    },
    Default_Mac: function() {
        if (this.data.state == this.data.language_lib.connected) {
            var e = [ 4, 0, 0, 0, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0 ];
            e[1] = 11, e[3] = this.data.token[0], e[4] = this.data.token[1], e[5] = this.data.token[2], 
            e[6] = this.data.token[3];
            var t = this.encodeBuffer(e);
            this.sendBleCmd(t);
        }
    },
    requestPwd: function(e) {
        var t = this;
        wx.request({
            url: c.lockUrl + "/lock/retPwd",
            data: {
                mac: t.data.macs,
                date: e
            },
            header: {
                "Content-Type": "application/json"
            },
            success: function(e) {
                console.log(e.data), t.data.cpwd = e.data, t.setData({
                    pwd: t.data.cpwd
                });
            }
        });
    },
    Lock_ctr: function(e) {
        console.log("lock_ctr", e);
        if (this.data.state == this.data.language_lib.connected) {
            var t = "lock", a = [ 2, 3, 1, 0, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0 ];
            a[4] = this.data.token[0], a[5] = this.data.token[1], a[6] = this.data.token[2], 
            a[7] = this.data.token[3], "lock_o" == e.target.id ? (a[3] = 0, t = "unlock") : a[3] = 1, 
            this.setData({
                sendcmd: t
            });
            var o = this.encodeBuffer(a);
            this.sendBleCmd(o);
        }
    },
    unlock_Btn: function() {
        if (this.data.state == this.data.language_lib.connected) {
            var e = [ 2, 3, 1, 0, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0 ];
            e[4] = this.data.token[0], e[5] = this.data.token[1], e[6] = this.data.token[2], 
            e[7] = this.data.token[3], e[3] = 0, "unlock", this.setData({
                sendcmd: "unlock"
            });
            var t = this.encodeBuffer(e);
            this.sendBleCmd(t);
        }
    },
    sendBleCmd: function(e) {
        return wx.writeBLECharacteristicValue({
            deviceId: this.data.deviceId,
            serviceId: this.data.services,
            characteristicId: this.data.writechar,
            value: e,
            success: function(e) {
                return console.log("writeBLECharacteristicValue success"), !0;
            }
        }), !1;
    },
    encodeBuffer: function(a) {
        var o = "", n = [];
        console.log(a);
        for (var s = 0; s < a.length; s++) {
            var i = a[s].toString(16);
            i.length < 2 && (o += "0"), o += i;
        }
        console.log("str", o), console.log("apphexxx", c.globalData.aes2), e = t.SetAeskey(c.globalData.aes2);
        var l = t.Encrypt(o, e);
        console.log(l);
        for (s = 0; s < l.length; s += 2) n.push(parseInt(l.substr(s, 2), 16));
        var r = new ArrayBuffer(16), d = new DataView(r);
        for (s = 0; s < 16; s++) d.setUint8(s, n[s]);
        return r;
    },
    decodebuffer: function(e) {},
    parseCmd: function(e) {
        switch (console.log("parseCmd:", e), e[0]) {
          case 1:
            this.parseTokenCmd(e[1], e[2], e.slice(3, e.length));
            break;

          case 2:
            this.parseCtrCmd(e[1], e[2], e.slice(3, e.length));
        }
    },
    parseTokenCmd: function(e, t, a) {
        switch (console.log("parseTokenCmd:", e, a), e) {
          case 1:
            var o = [], n = [], s = this.data.language_lib.lock;
            if (8 != t) break;
            o.push(a[0]), o.push(a[1]), o.push(a[2]), o.push(a[3]), n.push(a[5]), n.push(a[4]), 
            0 == a[6] && (s = this.data.language_lib.unlock), this.setData({
                token: o,
                version: n.toString(10),
                lock_state: s,
                batt: a[7]
            }), this.data.cbatt = a[7], this.data.cversion = n.toString(10), 0 != a[6] && 1 != a[6] || this.setData({
                com: "通信成功"
            }), clearInterval(c.globalData.timer2), this.unlock_Btn();
        }
    },
    parseCtrCmd: function(e, t, a) {
        var o = this;
        switch (console.log("parseCtrCmd:", e, a), e) {
          case 3:
            var n = o.data.language_lib.unlock;
            0 == a[0] ? (n = o.data.language_lib.unlock, o.setData({
                lockS: "开锁成功"
            }), clearInterval(this.timeInterval), o.UnlockSuccess(), setTimeout(function() {
                o.unConnect();
            }, 500)) : n = o.data.language_lib.lock, o.setData({
                lock_state: n,
                sendcmd: "unkown"
            }), clearInterval(c.globalData.timer2);
        }
    },
    navbarTap: function(e) {
        console.log("navbarTap:", e);
        var t = this;
        wx.closeBluetoothAdapter({
            success: function(e) {
                console.log("先关闭蓝牙模块");
            }
        }), setTimeout(function() {
            wx.openBluetoothAdapter({
                success: function(e) {
                    console.log("-----success----------"), console.log(e), t.state = 1;
                },
                fail: function(e) {
                    console.log("-----fail----------"), console.log(e), t.state = 0, wx.showModal({
                        title: c.alert,
                        content: "请先打开蓝牙",
                        showCancel: !1,
                        confirmText: "我已打开"
                    });
                },
                complete: function(e) {
                    console.log("-----complete----------"), console.log(e);
                }
            });
        }, 100);
    },
    onReady: function() {
        var e = wx.createAnimation({
            duration: 1e3,
            timingFunction: "ease"
        });
        this.animation = e, this.refreshList(), this.checkRedis();
    },
    checkRedis: function() {
        var e = this, t = this;
        c.globalData.timer1 = setInterval(function() {
            console.log(e.data.mac + " xxx"), wx.request({
                url: c.lockUrl + "/lock/checkRedis",
                data: {
                    mac: e.data.mac
                },
                success: function(e) {
                    console.log(e.data), "100" == e.data.code && (t.stopRefresh(), t.setData({
                        unlocking: !0,
                        pwdDisplay: !1,
                        lockS: "开锁成功"
                    }), clearInterval(t.timeInterval), clearInterval(c.globalData.timer1), t.UnlockSuccess(), 
                    setTimeout(function() {
                        t.unConnect();
                    }, 500));
                }
            });
        }, 1e3);
    },
    refreshList: function() {
        this.timeInterval = setInterval(function() {
            var e = this;
            this.data.rotateIndex = this.data.rotateIndex + 1, this.data.timerCount += 1, this.animation.rotate(360 * this.data.rotateIndex).step(), 
            this.setData({
                animationData: this.animation.export()
            }), 15 == this.data.timerCount ? (this.setData({
                unlocking: !1,
                pwdDisplay: !0
            }), setTimeout(function() {
                e.slideupshow(), e.unConnect();
            }, 500)) : 40 == this.data.timerCount && (clearInterval(c.globalData.timer1), this.stopRefresh());
        }.bind(this), 1e3);
    },
    slideupshow: function() {
        var e = wx.createAnimation({
            duration: 1e3,
            timingFunction: "ease"
        });
        e.translateY(100).step(), this.setData({
            animationData2: e.export()
        });
    },
    stopRefresh: function() {
        console.log("停止计数"), clearInterval(this.timeInterval), this.timeInterval = 0;
    },
    onShow: function() {},
    onHide: function() {
        console.log("onHide");
    },
    onUnload: function() {
        this.unConnect(), clearInterval(c.globalData.timer1), setTimeout(function() {
            wx.openBluetoothAdapter({
                success: function(e) {
                    console.log("打开蓝牙模块"), console.log(e);
                },
                fail: function(e) {
                    console.log("-----fail----------"), console.log(e);
                },
                complete: function(e) {
                    console.log("-----complete----------"), console.log(e);
                }
            });
        }, 100), clearInterval(this.data.t1), clearInterval(c.globalData.timer2);
    },
    unConnect: function() {
        var e = this;
        wx.stopBluetoothDevicesDiscovery({
            success: function(t) {
                console.log("停止扫描"), e.setData({
                    state: "停止扫描"
                });
            }
        }), wx.closeBLEConnection({
            deviceId: e.data.deviceId,
            success: function(e) {
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
            url: c.lockUrl + "/lock/bindBleData",
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
            success: function(e) {
                console.log(e.data), "100" == e.data.code ? wx.showModal({
                    title: c.alert,
                    content: "录入成功",
                    showCancel: !1
                }) : wx.showModal({
                    title: c.alert,
                    content: "系统出错，请重新录入",
                    showCancel: !1
                });
            }
        });
    },
    GetMac: function(e) {
        var t = (parseInt(e, 10) >>> 0).toString(16).toUpperCase(), a = t.substring(t.length - 2, t.length);
        return 1 == a.length && (a = "0" + a), a;
    },
    changePwd: function() {
        this.Set_timestamp();
    },
    getRanNum: function() {
        var e = Math.random();
        return e *= 1e3, e = Math.floor(e);
    },
    sendUnlockToGateway: function(e, t) {
        var a = this;
        wx.request({
            url: c.lockUrl + "/gateway/reListForUser",
            data: {
                user: e,
                store: t
            },
            success: function(e) {
                if (console.log(e.data), "100" == e.data.code) for (var t = e.data.Gmacs, o = function(e) {
                    setTimeout(function() {
                        wx.request({
                            url: c.url + "/g4/MunLock",
                            data: {
                                mac: a.data.mac,
                                userId: 10086,
                                gMac: t[e]
                            },
                            header: {
                                "Content-Type": "application/json"
                            },
                            success: function(e) {
                                console.log(e.data);
                            }
                        });
                    }, a.getRanNum());
                }, n = 0; n < t.length; n++) o(n);
            }
        });
    },
    UnlockSuccess: function() {
        var e = c.globalData.userid;
        e.startsWith("sanqian") && (e = e.substring(7, e.length), console.log(e), wx.request({
            url: "https://www.huinengsoft.cn/api/sanqiankey/index",
            data: {
                token: o.hexMD5("gwche888888" + e),
                keystate: 2,
                keycode: this.data.macs,
                userid: e,
                openstate: 1
            },
            success: function(e) {
                console.log(e.data), e.data.code;
            }
        }));
    }
});