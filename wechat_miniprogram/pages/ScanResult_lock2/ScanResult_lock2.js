var t, e, a = require("../../@babel/runtime/helpers/defineProperty"), s = require("../AES/aes"), n = require("../language/language"), o = "", i = getApp(), c = "", d = "", l = "", r = "", h = "", u = "", _ = "", g = void 0;

Page((a(t = {
    data: {
        language_lib: [],
        cmd_timer: 0,
        navbar: [ "操作页", "配置页" ],
        currentTab: 0,
        lmt_speed_modal_show: !1,
        input_lmt_speed_value: 0,
        mac: "",
        name: "",
        state: "",
        deviceId: "",
        services: "",
        writechar: "",
        readchar: "",
        sendcmd: "unkown",
        token: [ 0, 0, 0, 0 ],
        version: "",
        batt: 0,
        batt_soh: 0,
        lock_state: "",
        mode: "",
        ledband_state: "",
        sensor: "",
        act_rt_int: 0,
        stop_rt_int: 0,
        low_batt_per_c1: 10,
        low_batt_per_c2: 10,
        cruise: "",
        no_zero_act: "",
        acc_speed: 0,
        lmt_speed: 0,
        cur_speed: 0,
        cur_mil: 0,
        charging: "",
        sensor_alarm: "",
        err_info: "",
        aes_L: [],
        aes_H: [],
        aes: [],
        tmp_rev_buf: [],
        server_addr: "",
        server_apn: "",
        iccid: "",
        imei: "",
        server_user: "",
        server_pwd: "",
        gprs_csq: "",
        apn_set_window_show: !1,
        input_apn_value: "",
        server_addr_set_window_show: !1,
        input_server_addr_value: ""
    },
    onLoad: function(t) {
        var a, d = this;
        a = n.Fetch_language_lib(), d.setData({
            language_lib: a
        }), c = t.type, u = t.resMac, h = t.mac, "" != t.mac ? (0 == t.flag ? d.ScanAndConnect(t.mac) : d.DirectConnect(t.mac, t.dev, t.name), 
        "Victor" == c ? d.setData({
            otherMenu: !1
        }) : d.setData({
            otherMenu: !0
        }), wx.onBLEConnectionStateChange(function(t) {
            t.connected ? (d.setData({
                state: d.data.language_lib.connected
            }), wx.stopBluetoothDevicesDiscovery({
                success: function(t) {}
            })) : d.setData({
                state: d.data.language_lib.disconnected
            }), console.log("device ".concat(t.deviceId, " state has changed, connected: ").concat(t.connected));
        }), wx.onBLECharacteristicValueChange(function(t) {
            if (t.characteristicId == d.data.readchar) {
                var a = "", n = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], o = Array.prototype.map.call(new Uint8Array(t.value), function(t) {
                    return ("00" + t.toString(16)).slice(-2);
                }).join("");
                console.log("apphexxx" + i.globalData.aes), e = s.SetAeskey(i.globalData.aes), a = s.Decrypt(o, e), 
                console.log("hex", o), console.log("rev", a);
                for (var c = 0; c < a.length; c += 2) n[c / 2] = parseInt(a.substr(c, 2), 16);
                d.parseCmd(n);
            }
        }), "tf" == c && d.setData({
            aesBtn: !0
        }), "yj" == c && (wx.request({
            url: i.vehiUrl + "/vehicle/checkALL",
            data: {
                mac: u
            },
            header: {
                "Content-Type": "application/json"
            },
            success: function(t) {
                console.log(t.data), "not exist" == t.data ? wx.showModal({
                    title: i.alert,
                    confirmColor: "#FF0000",
                    content: "该设备不存在数据库，请返修",
                    showCancel: !1
                }) : "url null" == t.data ? wx.showModal({
                    title: i.alert,
                    confirmColor: "#FF0000",
                    content: "把头二维码为空，请返修",
                    showCancel: !1
                }) : "imei null" == t.data ? wx.showModal({
                    title: i.alert,
                    confirmColor: "#FF0000",
                    content: "IMEI为空，请返修",
                    showCancel: !1
                }) : "mac null" == t.data ? wx.showModal({
                    title: i.alert,
                    confirmColor: "#FF0000",
                    content: "MAC为空，请返修",
                    showCancel: !1
                }) : "ok" == t.data && wx.showModal({
                    title: i.alert,
                    content: "数据完整，通过",
                    showCancel: !1
                });
            }
        }), d.setData({
            aesBtn: !0
        }), wx.request({
            url: i.vehiUrl + "/vehicle/retUserKey",
            data: {
                mac: u
            },
            header: {
                "Content-Type": "application/json"
            },
            success: function(t) {
                console.log(t.data), "200" == t.data.code ? wx.showModal({
                    title: i.alert,
                    content: "该车不存在数据库",
                    showCancel: !1
                }) : "100" == t.data.code && (o = t.data.userKey, console.log("userAes:" + o));
            },
            fail: function() {
                console.log("程序出错");
            }
        }))) : console.log("mac error");
    },
    DirectConnect: function(t, e, a) {
        var s = this;
        s.setData({
            deviceId: e,
            mac: i.globalData.mac1,
            name: a,
            rssi: i.globalData.rssi1,
            state: s.data.language_lib.connecting
        }), wx.createBLEConnection({
            deviceId: s.data.deviceId,
            success: function(t) {
                console.log("connected"), wx.getBLEDeviceServices({
                    deviceId: s.data.deviceId,
                    success: function(t) {
                        for (var e = 0; e < t.services.length; e++) console.log("device services:", t.services[e]), 
                        "0000FEE7-0000-1000-8000-00805F9B34FB" == t.services[e].uuid && (console.log("find service"), 
                        s.setData({
                            services: t.services[e].uuid
                        }));
                        wx.getBLEDeviceCharacteristics({
                            deviceId: s.data.deviceId,
                            serviceId: s.data.services,
                            success: function(t) {
                                for (var e = 0; e < t.characteristics.length; e++) console.log("uuid:", t.characteristics[e].uuid), 
                                "000036F6-0000-1000-8000-00805F9B34FB" == t.characteristics[e].uuid ? (s.setData({
                                    readchar: t.characteristics[e].uuid
                                }), console.log("read characteristic", s.data.readchar)) : "000036F5-0000-1000-8000-00805F9B34FB" == t.characteristics[e].uuid && (s.setData({
                                    writechar: t.characteristics[e].uuid
                                }), console.log("write characteristic", s.data.writechar));
                                console.log("device getBLEDeviceCharacteristics:", t.characteristics), "000036F6-0000-1000-8000-00805F9B34FB" == s.data.readchar ? (console.log("notifyBLECharacteristicValueChange"), 
                                wx.notifyBLECharacteristicValueChange({
                                    state: !0,
                                    deviceId: s.data.deviceId,
                                    serviceId: s.data.services,
                                    characteristicId: s.data.readchar,
                                    success: function(t) {
                                        console.log("notifyBLECharacteristicValueChange success", t.errMsg), s.GetToken();
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
    },
    ScanAndConnect: function(t) {
        var e = this;
        e.setData({
            mac: t
        }), console.log("mac:", e.data.mac), 12 == e.data.mac.length ? (wx.startBluetoothDevicesDiscovery({
            services: [ "FEE7" ],
            success: function(t) {
                console.log("-----startBluetoothDevicesDiscovery--success----------"), console.log(t), 
                e.setData({
                    state: e.data.language_lib.scanning
                });
            },
            fail: function(t) {
                console.log(t);
            },
            complete: function(t) {
                console.log(t);
            }
        }), setTimeout(function() {
            e.GetAppointedDevice();
        }, 1e3)) : wx.showModal({
            title: "二维码格式错误",
            content: e.data.mac,
            showCancel: !1,
            duration: 2e3
        });
    },
    GetAppointedDevice: function() {
        var t = this;
        wx.getBluetoothDevices({
            success: function(e) {
                if (console.log("getBluetoothDevices"), e.devices.length) for (var a = 0; a < e.devices.length; a++) {
                    for (var s = new Int8Array(e.devices[a].advertisData), n = "", o = 2; o < 8; o++) n += t.GetMac(s[o]);
                    if (t.data.mac == n) return console.log("advdata_len:", e.devices[a].advertisData.byteLength), 
                    t.setData({
                        deviceId: e.devices[a].deviceId,
                        name: e.devices[a].name,
                        rssi: e.devices[a].RSSI,
                        state: t.data.language_lib.connecting
                    }), void wx.createBLEConnection({
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
    Popup_cur_state: function() {
        var t = this.data.low_batt_per_c1.toString(), e = this.data.acc_speed.toString(), a = this.data.lmt_speed.toString(), s = this.data.act_rt_int.toString(), n = (this.data.stop_rt_int.toString(), 
        this.data.language_lib.work_mode + ":" + this.data.mode + "       sensor：" + this.data.sensor + "\n" + this.data.language_lib.batt_low + ":" + t + "     " + this.data.language_lib.cruise + ":" + this.data.cruise + "\n" + this.data.language_lib.nz_act + ":" + this.data.no_zero_act + "      " + this.data.language_lib.acc_spd_lv + ":" + e + "\n" + this.data.language_lib.lmt_spd + ":" + a + "   " + this.data.language_lib.rt_interval + ":" + s + "\n");
        wx.showModal({
            title: this.data.language_lib.cur_sys_cfg,
            content: n,
            showCancel: !1,
            duration: 2e3
        });
    },
    Popup_rt_state: function() {},
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
            this.setData({
                sendcmd: "unkown"
            }), this.sendBleCmd(e);
        }
    },
    Ledband_ctr: function(t) {
        console.log("Ledband_open", t);
        if (this.data.state == this.data.language_lib.connected) {
            var e = "c_ledband", a = [ 2, 4, 1, 0, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0 ];
            a[4] = this.data.token[0], a[5] = this.data.token[1], a[6] = this.data.token[2], 
            a[7] = this.data.token[3], "led_o" == t.target.id ? (a[3] = 1, e = "o_ledband") : a[3] = 0, 
            this.setData({
                sendcmd: e
            });
            var s = this.encodeBuffer(a);
            this.sendBleCmd(s);
        }
    }
}, "Ledband_ctr", function(t) {
    console.log("Ledband_open", t);
    if (this.data.state == this.data.language_lib.connected) {
        var e = "c_ledband", a = [ 2, 9, 1, 0, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0 ];
        a[4] = this.data.token[0], a[5] = this.data.token[1], a[6] = this.data.token[2], 
        a[7] = this.data.token[3], "led_o" == t.target.id ? (a[3] = 7, e = "o_ledband") : "led_c" == t.target.id ? (a[3] = 6, 
        e = "c_ledband") : "flight_o" == t.target.id ? (a[1] = 9, a[3] = 1, e = "o_ledfront") : "flight_c" == t.target.id ? (a[1] = 9, 
        a[3] = 0, e = "c_ledfront") : "blight_o" == t.target.id ? (a[1] = 9, a[3] = 5, e = "o_ledbottom") : "blight_c" == t.target.id ? (a[1] = 9, 
        a[3] = 4, e = "c_ledbottom") : "tlight_o" == t.target.id ? (a[1] = 9, a[3] = 3, 
        e = "o_ledtail") : "tlight_c" == t.target.id ? (a[1] = 9, a[3] = 2, e = "c_ledtail") : a[3] = 0, 
        this.setData({
            sendcmd: e
        });
        var s = this.encodeBuffer(a);
        this.sendBleCmd(s);
    }
}), a(t, "Lock_ctr", function(t) {
    console.log("lock_ctr", t);
    if (this.data.state == this.data.language_lib.connected) {
        var e = "lock", a = [ 2, 3, 1, 0, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0 ];
        a[4] = this.data.token[0], a[5] = this.data.token[1], a[6] = this.data.token[2], 
        a[7] = this.data.token[3], "lock_o" == t.target.id ? (a[3] = 0, e = "unlock", _ = "tf") : a[3] = 1, 
        this.setData({
            sendcmd: e
        });
        var s = this.encodeBuffer(a);
        this.sendBleCmd(s);
    } else wx.showModal({
        title: this.data.language_lib.send_cmd_failed,
        content: this.data.state,
        showCancel: !1,
        duration: 2e3
    });
    if ("tf" == c && "tf" == _) {
        if (console.log("type is tf and targe is tf"), h.indexOf(":") >= 0) {
            for (var n = "", o = 0; o < h.length; o++) {
                var i = h[o];
                if (":" != i) {
                    if (!(i >= "0" && i <= "9" || i >= "A" && i <= "F")) return wx.showModal({
                        title: "二维码格式错误",
                        content: mac,
                        showCancel: !1,
                        duration: 2e3
                    }), !1;
                    n += i;
                }
            }
            h = n;
        }
        _ = "", setTimeout(function() {
            wx.redirectTo({
                url: "../ScanResult_lock2/ScanResult_lock2?mac=" + h + "&flag=0&type=" + c + "&resMac=" + u
            });
        }, 1e3);
    }
}), a(t, "Mode_ctr", function(t) {
    console.log("mode_ctr", t);
    if (this.data.state == this.data.language_lib.connected) {
        var e = "normal_mode", a = [ 4, 1, 1, 0, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0 ];
        a[4] = this.data.token[0], a[5] = this.data.token[1], a[6] = this.data.token[2], 
        a[7] = this.data.token[3], "mode_o" == t.target.id ? (e = "trans_mode", a[3] = 1) : a[3] = 0, 
        this.setData({
            sendcmd: e
        });
        var s = this.encodeBuffer(a);
        this.sendBleCmd(s);
    }
}), a(t, "Rst_server", function(t) {
    console.log("Rst_factory", t);
    if (this.data.state == this.data.language_lib.connected) {
        var e = "normal_mode", a = [ 4, 2, 1, 0, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0 ];
        a[4] = this.data.token[0], a[5] = this.data.token[1], a[6] = this.data.token[2], 
        a[7] = this.data.token[3], "mode_o" == t.target.id ? (e = "trans_mode", a[3] = 1) : a[3] = 0, 
        this.setData({
            sendcmd: e
        });
        var s = this.encodeBuffer(a);
        this.sendBleCmd(s);
    }
}), a(t, "Fetch_cfg_state", function() {
    console.log("Fetch_cfg_state");
    if (this.data.state == this.data.language_lib.connected) {
        var t = [ 4, 10, 1, 0, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0 ];
        t[4] = this.data.token[0], t[5] = this.data.token[1], t[6] = this.data.token[2], 
        t[7] = this.data.token[3];
        var e = this.encodeBuffer(t);
        this.setData({
            sendcmd: "unkown"
        }), this.sendBleCmd(e);
    }
}), a(t, "Change_aes1", function() {
    var t = this;
    if (console.log("Change_aes1"), "" == o) wx.showModal({
        title: "",
        content: t.data.language_lib.notAES,
        confirmText: "OK",
        showCancel: !1
    }); else {
        for (var e = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], a = (t = this, 
        []), s = 0; s < o.length; s += 2) e[s / 2] = parseInt(o.substr(s, 2), 16);
        if (console.log("arrayaes1", e), t.data.state == t.data.language_lib.connected) {
            var n = [ 6, 1, 8, 0, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0 ];
            for (s = 0; s < 8; s++) a[s] = e[s], n[3 + s] = a[s];
            t.setData({
                aes_L: a
            }), n[11] = t.data.token[0], n[12] = t.data.token[1], n[13] = t.data.token[2], n[14] = t.data.token[3], 
            console.log("data", n);
            var i = t.encodeBuffer(n);
            t.sendBleCmd(i);
        }
    }
}), a(t, "Change_aes2", function() {
    console.log("Change_aes2");
    for (var t = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], e = [], a = 0; a < o.length; a += 2) t[a / 2] = parseInt(o.substr(a, 2), 16);
    if (console.log("arrayaes2", t), this.data.state == this.data.language_lib.connected) {
        var s = [ 6, 2, 8, 0, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0 ];
        for (a = 0; a < 8; a++) e[a] = t[8 + a], s[3 + a] = e[a];
        this.setData({
            aes_H: e
        }), s[11] = this.data.token[0], s[12] = this.data.token[1], s[13] = this.data.token[2], 
        s[14] = this.data.token[3], console.log("data", s);
        var n = this.encodeBuffer(s);
        this.sendBleCmd(n);
    }
}), a(t, "Change_default", function() {
    o = i.defaultAES, this.Change_aes1();
}), a(t, "Rst_factory", function() {
    console.log("Rst_factory");
    if (this.data.state == this.data.language_lib.connected) {
        var t = [ 4, 11, 1, 0, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0 ];
        t[4] = this.data.token[0], t[5] = this.data.token[1], t[6] = this.data.token[2], 
        t[7] = this.data.token[3];
        var e = this.encodeBuffer(t);
        this.setData({
            sendcmd: "unkown"
        }), this.sendBleCmd(e);
    }
}), a(t, "Fetch_cur_batt_state", function() {
    console.log("Fetch_cur_batt_state");
    if (this.data.state == this.data.language_lib.connected) {
        var t = [ 3, 2, 1, 0, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0 ];
        t[4] = this.data.token[0], t[5] = this.data.token[1], t[6] = this.data.token[2], 
        t[7] = this.data.token[3];
        var e = this.encodeBuffer(t);
        this.setData({
            sendcmd: "unkown"
        }), this.sendBleCmd(e);
    }
}), a(t, "sendBleCmd", function(t) {
    var e = this;
    wx.writeBLECharacteristicValue({
        deviceId: e.data.deviceId,
        serviceId: e.data.services,
        characteristicId: e.data.writechar,
        value: t,
        success: function(t) {
            console.log("writeBLECharacteristicValue success"), clearTimeout(e.data.cmd_timer);
            var a = setTimeout(function() {
                e.sendBleCmdTimeout();
            }, 6e3);
            e.setData({
                cmd_timer: a
            });
        }
    });
}), a(t, "sendBleCmdTimeout", function() {
    console.log("sendBleCmdTimeout");
    var t = this, e = t.data.language_lib.nulls;
    "lock" == t.data.sendcmd && t.data.lock_state == t.data.language_lib.unlock ? (e = t.data.language_lib.ctr_com_err, 
    t.setData({
        err_info: e
    }), setTimeout(function() {
        t.setData({
            err_info: t.data.language_lib.nulls
        });
    }, 2e3)) : "unlock" == t.data.sendcmd && t.Fetch_cur_batt_state(), clearTimeout(t.data.cmd_timer);
}), a(t, "encodeBuffer", function(t) {
    var a = "", n = [];
    console.log(t);
    for (var o = 0; o < t.length; o++) {
        var c = t[o].toString(16);
        c.length < 2 && (a += "0"), a += c;
    }
    console.log("str", a), console.log("apphexxx", i.globalData.aes), e = s.SetAeskey(i.globalData.aes);
    var d = s.Encrypt(a, e);
    console.log(d);
    for (o = 0; o < d.length; o += 2) n.push(parseInt(d.substr(o, 2), 16));
    var l = new ArrayBuffer(16), r = new DataView(l);
    for (o = 0; o < 16; o++) r.setUint8(o, n[o]);
    return l;
}), a(t, "decodebuffer", function(t) {}), a(t, "parseCmd", function(t) {
    switch (console.log("parseCmd:", t), t[0]) {
      case 1:
        this.parseTokenCmd(t[1], t[2], t.slice(3, t.length));
        break;

      case 2:
        this.parseCtrCmd(t[1], t[2], t.slice(3, t.length));
        break;

      case 3:
        this.parseBattCmd(t[1], t[2], t.slice(3, t.length));
        break;

      case 4:
        this.parseSyscfgCmd(t[1], t[2], t.slice(3, t.length));
        break;

      case 5:
        this.parseMt2503Cmd(t[1], t[2], t.slice(3, t.length));
        break;

      case 6:
        this.parseAesCmd(t[1], t[2], t.slice(3, t.length));
        break;

      case 7:
        this.parseBleRspCmd(t[1], t[2], t.slice(3, t.length));
    }
}), a(t, "parseTokenCmd", function(t, e, a) {
    switch (console.log("parseTokenCmd:", t, a), t) {
      case 1:
        var s = [], n = [], o = this.data.language_lib.lock, i = this.data.language_lib.nulls;
        if (8 != e) break;
        s.push(a[0]), s.push(a[1]), s.push(a[2]), s.push(a[3]), n.push(a[5]), n.push(a[4]), 
        0 == a[6] && (o = this.data.language_lib.unlock), this.setData({
            token: s,
            version: n.toString(10),
            lock_state: o,
            batt: a[7],
            err_info: i
        }), 0 == a[7] && this.setData({
            batt: "-"
        }), this.fetch_ctr_state();
    }
}), a(t, "parseCtrCmd", function(t, e, a) {
    switch (console.log("parseCtrCmd:", t, a), t) {
      case 2:
        var s = this.data.language_lib.lock, n = this.data.language_lib.off, o = this.data.language_lib.off, i = this.data.language_lib.on, c = 2, d = 25;
        a[0] && (1 & a[1] || (s = this.data.language_lib.unlock), 128 & a[1] && (n = this.data.language_lib.on), 
        8 & a[1] && (o = this.data.language_lib.on), 4 & a[1] || (i = this.data.language_lib.off), 
        c = 96 & a[1], c >>= 5, d = a[3]), this.setData({
            lock_state: s,
            ledband_state: n,
            cruise: o,
            no_zero_act: i,
            acc_speed: c,
            lmt_speed: d,
            sendcmd: "unkown"
        }), this.Fetch_cfg_state();
        break;

      case 3:
        s = this.data.language_lib.unlock;
        "lock" == this.data.sendcmd && (s = this.data.language_lib.lock), this.setData({
            lock_state: s,
            sendcmd: "unkown"
        });
        break;

      case 5:
        s = this.data.language_lib.on;
        "c_nz" == this.data.sendcmd && (s = this.data.language_lib.off), this.setData({
            no_zero_act: s,
            sendcmd: "unkown"
        });
        break;

      case 6:
        s = this.data.language_lib.on;
        "c_cruise" == this.data.sendcmd && (s = this.data.language_lib.off), this.setData({
            cruise: s,
            sendcmd: "unkown"
        });
        break;

      case 9:
        console.log("led cmd:", this.data.sendcmd);
        s = this.data.language_lib.on;
        "c_ledband" == this.data.sendcmd && (s = this.data.language_lib.off), this.setData({
            ledband_state: s,
            sendcmd: "unkown"
        });
        break;

      case 10:
        this.setData({
            lmt_speed: this.data.input_lmt_speed_value
        });
    }
}), a(t, "parseBattCmd", function(t, e, a) {
    var s = this;
    switch (console.log("parseBattCmd:", t, a), t) {
      case 2:
        var n = s.data.language_lib.uncharged, o = 112 & a[6], i = s.data.err_info;
        5 == (o >>= 4) && (n = s.data.language_lib.charging), i = 0 == a[4] ? s.data.language_lib.batt_com_err : s.data.language_lib.ctr_com_err, 
        s.setData({
            batt: a[4],
            charging: n,
            err_info: i
        }), setTimeout(function() {
            s.setData({
                err_info: s.data.language_lib.nulls
            });
        }, 2e3);
    }
}), a(t, "parseSyscfgCmd", function(t, e, a) {
    switch (console.log("parseSyscfgCmd:", t, a), t) {
      case 1:
        var s = this.data.language_lib.normal;
        "trans_mode" == this.data.sendcmd && (s = this.data.language_lib.transport), this.setData({
            mode: s,
            sendcmd: "unkown"
        });
        break;

      case 2:
        break;

      case 3:
        console.log("122221111111111111111111:" + a[0]);
        var n = "";
        0 == a[0] ? n = this.data.language_lib.chiko_sensor_close : 1 == a[0] ? n = this.data.language_lib.chiko_sensor_high : 2 == a[0] ? n = this.data.language_lib.chiko_sensor_midding : 3 == a[0] && (n = this.data.language_lib.chiko_sensor_low), 
        this.setData({
            sensor: n
        });
        break;

      case 6:
        this.setData({
            low_batt_per_c1: d,
            low_batt_per_c2: l,
            sendcmd: "unkown"
        });
        break;

      case 10:
        console.log("22222222222222222222" + a[1]);
        s = this.data.language_lib.normal;
        1 == a[0] && (s = this.data.language_lib.transport);
        n = "";
        0 == a[1] ? n = this.data.language_lib.chiko_sensor_close : 1 == a[1] ? n = this.data.language_lib.chiko_sensor_high : 2 == a[1] ? n = this.data.language_lib.chiko_sensor_midding : 3 == a[1] && (n = this.data.language_lib.chiko_sensor_low), 
        this.setData({
            mode: s,
            sensor: n,
            act_rt_int: a[3],
            stop_rt_int: a[2],
            low_batt_per_c1: a[4],
            low_batt_per_c2: a[5]
        }), d = this.data.low_batt_per_c1, l = this.data.low_batt_per_c2;
    }
}), a(t, "parseMt2503Cmd", function(t, e, a) {
    switch (console.log("parseMt2503Cmd:", t, a), t) {
      case 1:
        console.log("server addr write success:"), wx.showModal({
            title: "success",
            content: "服务器地址设置成功",
            showCancel: !1,
            duration: 2e3
        });
        break;

      case 2:
        console.log("server addr:", a);
        var s = "";
        if (o = (o = this.data.tmp_rev_buf).concat(a.slice(0, e - 1)), this.setData({
            tmp_rev_buf: o
        }), 0 == a[e - 1]) {
            console.log(o);
            for (var n = 0; n < o.length; n++) s += String.fromCharCode(o[n]);
            this.setData({
                server_addr: s,
                tmp_rev_buf: []
            }), wx.showModal({
                title: "服务器地址",
                content: this.data.server_addr,
                showCancel: !1,
                duration: 2e3
            });
        }
        break;

      case 3:
        console.log("server apn write success:"), wx.showModal({
            title: "success",
            content: "APN设置成功",
            showCancel: !1,
            duration: 2e3
        });
        break;

      case 4:
        console.log("server apn:", a);
        s = "";
        if (o = (o = this.data.tmp_rev_buf).concat(a.slice(0, e - 1)), this.setData({
            tmp_rev_buf: o
        }), 0 == a[e - 1]) {
            console.log(o);
            for (n = 0; n < o.length; n++) s += String.fromCharCode(o[n]);
            this.setData({
                server_apn: s,
                tmp_rev_buf: []
            }), wx.showModal({
                title: "APN",
                content: this.data.server_apn,
                showCancel: !1,
                duration: 2e3
            });
        }
        break;

      case 5:
        console.log("server user:", a);
        s = "";
        if (o = (o = this.data.tmp_rev_buf).concat(a.slice(0, e - 1)), this.setData({
            tmp_rev_buf: o
        }), 0 == a[e - 1]) {
            console.log(o);
            for (n = 0; n < o.length; n++) s += String.fromCharCode(o[n]);
            this.setData({
                server_user: s,
                tmp_rev_buf: []
            }), wx.showModal({
                title: "用户名",
                content: this.data.server_user,
                showCancel: !1,
                duration: 2e3
            });
        }
        break;

      case 6:
        console.log("server pwd:", a);
        s = "";
        if (o = (o = this.data.tmp_rev_buf).concat(a.slice(0, e - 1)), this.setData({
            tmp_rev_buf: o
        }), 0 == a[e - 1]) {
            console.log(o);
            for (n = 0; n < o.length; n++) s += String.fromCharCode(o[n]);
            this.setData({
                server_pwd: s,
                tmp_rev_buf: []
            }), wx.showModal({
                title: "密码",
                content: this.data.server_pwd,
                showCancel: !1,
                duration: 2e3
            });
        }
        break;

      case 7:
        console.log("server iccid:", a);
        s = "";
        if (o = (o = this.data.tmp_rev_buf).concat(a.slice(0, e - 1)), this.setData({
            tmp_rev_buf: o
        }), 0 == a[e - 1]) {
            console.log(o);
            for (n = 0; n < o.length; n++) s += String.fromCharCode(o[n]);
            console.log("iccid:", s), this.setData({
                iccid: s,
                tmp_rev_buf: []
            });
        }
        break;

      case 8:
        console.log("server imei:", a);
        var o;
        s = "";
        if (o = (o = this.data.tmp_rev_buf).concat(a.slice(0, e - 1)), this.setData({
            tmp_rev_buf: o
        }), 0 == a[e - 1]) {
            console.log(o);
            for (n = 0; n < o.length; n++) s += String.fromCharCode(o[n]);
            this.setData({
                imei: s,
                tmp_rev_buf: []
            });
        }
        break;

      case 9:
        console.log("csq:", a[0]), this.setData({
            gprs_csq: a[0].toString()
        }), wx.showModal({
            title: "CSQ",
            content: this.data.gprs_csq,
            showCancel: !1,
            duration: 2e3
        });
    }
}), a(t, "parseAesCmd", function(t, e, a) {
    switch (console.log("parseAesCmd:", t, a), t) {
      case 1:
        this.Change_aes2();
        break;

      case 2:
        var s = this.data.aes_L.concat(this.data.aes_H);
        this.setData({
            aes: s
        }), i.globalData.aes = o, console.log("newAES:" + i.globalData.aes), console.log("AES update success:", this.data.aes), 
        wx.request({
            url: i.vehiUrl + "/vehicle/updateKey",
            data: {
                mac: u,
                key: o
            },
            header: {
                "Content-Type": "application/json"
            },
            success: function(t) {
                console.log(t.data), "100" == t.data ? wx.showModal({
                    title: i.alert,
                    content: "修改成功！",
                    showCancel: !1
                }) : wx.showModal({
                    title: i.alert,
                    content: "云端修改失败！",
                    showCancel: !1
                });
            },
            fail: function() {
                console.log("程序出错");
            }
        });
    }
}), a(t, "parseBleRspCmd", function(t, e, a) {
    var s = this;
    switch (console.log("parseAesCmd:", t, a), t) {
      case 1:
        var n = s.data.language_lib.lock, o = s.data.language_lib.off;
        1 == a[0] && (1 & a[3] || (n = s.data.language_lib.unlock), 128 & a[3] && (o = s.data.language_lib.on));
        var i = s.data.language_lib.uncharged, c = 112 & a[7];
        5 == (c >>= 4) && (i = s.data.language_lib.charging), s.setData({
            lock_state: n,
            ledband_state: o,
            cur_speed: a[1],
            cur_mil: a[2],
            batt: a[4],
            batt_soh: a[5],
            charging: i
        });
        break;

      case 2:
        var d = s.data.language_lib.nulls;
        0 == a[0] && (d = s.data.language_lib.nulls), 16 & a[0] && (d = s.data.language_lib.batt_com_err), 
        32 & a[0] ? (console.log("异常了"), g = 1, setTimeout(function() {
            1 == g && (console.log("真的异常了"), d = s.data.language_lib.ctr_com_err);
        }, 3e3)) : (g = 0, console.log("恢复了"), s.setData({
            err_info: s.data.language_lib.nulls
        })), s.setData({
            err_info: d
        });
    }
}), a(t, "navbarTap", function(t) {
    if ("yj" == c) console.log("this is yj"); else if ("customer" == c) console.log("this is Customer"); else {
        console.log("navbarTap:", t);
        this.setData({
            currentTab: t.currentTarget.dataset.idx
        });
    }
}), a(t, "cruise_switch", function(t) {
    console.log("cruise_switch", t);
    if (this.data.state == this.data.language_lib.connected) {
        var e = "o_cruise", a = [ 2, 6, 1, 0, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0 ];
        a[4] = this.data.token[0], a[5] = this.data.token[1], a[6] = this.data.token[2], 
        a[7] = this.data.token[3], a[3] = 1, t.detail.value || (e = "c_cruise", a[3] = 0), 
        this.setData({
            sendcmd: e
        });
        var s = this.encodeBuffer(a);
        this.sendBleCmd(s);
    }
}), a(t, "nz_act_switch", function(t) {
    console.log("nz_act_switch", t);
    if (this.data.state == this.data.language_lib.connected) {
        var e = "o_nz", a = [ 2, 5, 1, 0, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0 ];
        a[4] = this.data.token[0], a[5] = this.data.token[1], a[6] = this.data.token[2], 
        a[7] = this.data.token[3], a[3] = 1, t.detail.value || (e = "c_nz", a[3] = 0), this.setData({
            sendcmd: e
        });
        var s = this.encodeBuffer(a);
        this.sendBleCmd(s);
    }
}), a(t, "sensor_alarm_switch", function(t) {
    console.log("sensor_alarm_switch", t);
    if (this.data.state == this.data.language_lib.connected) {
        var e = "open_alram", a = [ 4, 3, 1, 0, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0 ];
        a[4] = this.data.token[0], a[5] = this.data.token[1], a[6] = this.data.token[2], 
        a[7] = this.data.token[3], a[3] = 1, t.detail.value || (e = "close_alram", a[3] = 0), 
        this.setData({
            sendcmd: e
        });
        var s = this.encodeBuffer(a);
        this.sendBleCmd(s);
    }
}), a(t, "low_batt_set", function() {
    console.log("low_batt_set");
    if (this.data.state == this.data.language_lib.connected) {
        var t = [ 4, 6, 2, 0, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0 ];
        t[5] = this.data.token[0], t[6] = this.data.token[1], t[7] = this.data.token[2], 
        t[8] = this.data.token[3], t[3] = parseInt(d), t[4] = parseInt(l), this.setData({
            sendcmd: "low_batt"
        });
        var e = this.encodeBuffer(t);
        this.sendBleCmd(e);
    }
}), a(t, "Lmt_speed_set", function() {
    this.setData({
        lmt_speed_modal_show: !0
    });
}), a(t, "lmt_speed_input", function(t) {
    console.log("lmt_speed_input：", t.detail.value), this.setData({
        input_lmt_speed_value: parseInt(t.detail.value)
    });
}), a(t, "lmt_speed_set_cancel", function() {
    this.setData({
        lmt_speed_modal_show: !1
    });
}), a(t, "lmt_speed_set_confirm", function() {
    if (console.log("lmt_speed_set_confirm", this.data.input_lmt_speed_value), this.data.input_lmt_speed_value > 30) wx.showModal({
        title: this.data.language_lib.input_err,
        content: this.data.language_lib.lmt_spd + ":30km/h",
        showCancel: !1,
        duration: 2e3
    }); else if (0 != this.data.input_lmt_speed_value) {
        if (this.setData({
            lmt_speed_modal_show: !1
        }), this.data.state == this.data.language_lib.connected) {
            var t = [ 2, 10, 1, 0, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0 ];
            t[4] = this.data.token[0], t[5] = this.data.token[1], t[6] = this.data.token[2], 
            t[7] = this.data.token[3], t[3] = this.data.input_lmt_speed_value;
            var e = this.encodeBuffer(t);
            this.sendBleCmd(e);
        }
    } else wx.showModal({
        title: this.data.language_lib.input_err,
        content: this.data.language_lib.chiko_max_speed,
        showCancel: !1
    });
}), a(t, "onReady", function() {}), a(t, "onShow", function() {}), a(t, "onHide", function() {
    console.log("onHide");
}), a(t, "onUnload", function() {
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
}), a(t, "onPullDownRefresh", function() {}), a(t, "onReachBottom", function() {}), 
a(t, "onShareAppMessage", function() {}), a(t, "GetMac", function(t) {
    var e = (parseInt(t, 10) >>> 0).toString(16).toUpperCase(), a = e.substring(e.length - 2, e.length);
    return 1 == a.length && (a = "0" + a), a;
}), a(t, "fetch_iccid", function() {
    console.log("fetch_iccid");
    if (this.data.state == this.data.language_lib.connected) {
        var t = [ 5, 7, 1, 0, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0 ];
        t[4] = this.data.token[0], t[5] = this.data.token[1], t[6] = this.data.token[2], 
        t[7] = this.data.token[3];
        var e = this.encodeBuffer(t);
        this.sendBleCmd(e);
    }
}), a(t, "fetch_imei", function() {
    console.log("fetch_imei");
    if ("" != this.data.imei) return r = this.data.imei, void console.log("imei is : " + r);
    if (this.data.state == this.data.language_lib.connected) {
        var t = [ 5, 8, 1, 0, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0 ];
        t[4] = this.data.token[0], t[5] = this.data.token[1], t[6] = this.data.token[2], 
        t[7] = this.data.token[3];
        var e = this.encodeBuffer(t);
        this.sendBleCmd(e);
    }
}), a(t, "showDialogBtn1", function() {
    this.setData({
        showModal1: !0,
        va1: d,
        va2: l
    });
}), a(t, "preventTouchMove1", function() {}), a(t, "hideModal1", function() {
    this.setData({
        showModal1: !1
    });
}), a(t, "onCancel1", function() {
    this.hideModal1();
}), a(t, "input1", function(t) {
    var e = t.detail.value;
    d = e;
}), a(t, "input2", function(t) {
    var e = t.detail.value;
    l = e;
}), a(t, "onConfirm1", function() {
    console.log(d), console.log(l), this.low_batt_set(), wx.showToast({
        title: "success",
        icon: "success",
        duration: 800
    }), this.hideModal1();
}), a(t, "request", function() {
    wx.showModal({
        title: "",
        content: "   " + r
    });
}), a(t, "setSensor", function(t) {
    console.log("sensor_alarm_switch", t);
    var e = this;
    wx.showActionSheet({
        itemList: [ "close", "high", "middling", "low" ],
        success: function(a) {
            if (!a.cancel) if (0 == a.tapIndex) {
                if (e.data.state == e.data.language_lib.connected) {
                    var s = "open_alram";
                    (o = [ 4, 3, 1, 0, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0 ])[4] = e.data.token[0], 
                    o[5] = e.data.token[1], o[6] = e.data.token[2], o[7] = e.data.token[3], o[3] = 1, 
                    t.detail.value || (s = "close_alram", o[3] = 0), e.setData({
                        sendcmd: s
                    });
                    var n = e.encodeBuffer(o);
                    e.sendBleCmd(n);
                }
            } else if (1 == a.tapIndex) {
                if (e.data.state == e.data.language_lib.connected) {
                    s = "open_alram";
                    (o = [ 4, 3, 1, 0, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0 ])[4] = e.data.token[0], 
                    o[5] = e.data.token[1], o[6] = e.data.token[2], o[7] = e.data.token[3], o[3] = 1, 
                    t.detail.value || (s = "close_alram", o[3] = 1), e.setData({
                        sendcmd: s
                    });
                    n = e.encodeBuffer(o);
                    e.sendBleCmd(n);
                }
            } else if (2 == a.tapIndex) {
                if (e.data.state == e.data.language_lib.connected) {
                    s = "open_alram";
                    (o = [ 4, 3, 1, 0, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0 ])[4] = e.data.token[0], 
                    o[5] = e.data.token[1], o[6] = e.data.token[2], o[7] = e.data.token[3], o[3] = 1, 
                    t.detail.value || (s = "close_alram", o[3] = 2), e.setData({
                        sendcmd: s
                    });
                    n = e.encodeBuffer(o);
                    e.sendBleCmd(n);
                }
            } else if (3 == a.tapIndex && e.data.state == e.data.language_lib.connected) {
                var o;
                s = "open_alram";
                (o = [ 4, 3, 1, 0, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0 ])[4] = e.data.token[0], 
                o[5] = e.data.token[1], o[6] = e.data.token[2], o[7] = e.data.token[3], o[3] = 1, 
                t.detail.value || (s = "close_alram", o[3] = 3), e.setData({
                    sendcmd: s
                });
                n = e.encodeBuffer(o);
                e.sendBleCmd(n);
            }
        }
    });
}), a(t, "Lock_wheel", function(t) {
    console.log("Lock_wheel", t);
    if (this.data.state == this.data.language_lib.connected) {
        var e = [ 2, 11, 1, 0, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0 ];
        e[4] = this.data.token[0], e[5] = this.data.token[1], e[6] = this.data.token[2], 
        e[7] = this.data.token[3], "wheel_o" == t.target.id ? e[3] = 0 : e[3] = 1, this.setData({});
        var a = this.encodeBuffer(e);
        this.sendBleCmd(a);
    }
}), a(t, "Lock_battery", function(t) {
    console.log("Lock_battery", t);
    if (this.data.state == this.data.language_lib.connected) {
        var e = [ 2, 12, 1, 0, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0 ];
        e[4] = this.data.token[0], e[5] = this.data.token[1], e[6] = this.data.token[2], 
        e[7] = this.data.token[3], "battery_o" == t.target.id ? e[3] = 0 : e[3] = 1, this.setData({});
        var a = this.encodeBuffer(e);
        this.sendBleCmd(a);
    }
}), a(t, "fetch_iccid", function() {
    console.log("fetch_iccid");
    var t = this;
    if ("" != t.data.iccid && wx.request({
        url: i.vehiUrl + "/vehicle/insertIccid",
        data: {
            mac: u,
            iccid: t.data.iccid
        },
        header: {
            "Content-Type": "application/json"
        },
        success: function(e) {
            console.log(e.data), "success" == e.data ? wx.showModal({
                title: "上传成功！",
                content: "ICCID:" + t.data.iccid,
                showCancel: !1
            }) : "iccid error" == e.data ? wx.showModal({
                title: i.alert,
                content: "ICCID重复",
                showCancel: !1
            }) : wx.showModal({
                title: i.alert,
                content: "系统错误",
                showCancel: !1
            });
        }
    }), t.data.state == t.data.language_lib.connected) {
        var e = [ 5, 7, 1, 0, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0 ];
        e[4] = t.data.token[0], e[5] = t.data.token[1], e[6] = t.data.token[2], e[7] = t.data.token[3];
        var a = t.encodeBuffer(e);
        t.sendBleCmd(a);
    }
}), t));