var t = require("../AES/aes"), e = require("../language/language"), a = getApp(), s = "", n = "", o = "", i = "";

Page({
    data: {
        language_lib: [],
        navbar: [ "操作页", "配置页", "服务器" ],
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
        token: [],
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
    onLoad: function(a) {
        var s, o = this;
        s = e.Fetch_language_lib(), o.setData({
            language_lib: s
        }), "flash" == (n = a.type) ? o.setData({
            showOrHidden: !1,
            hiddenOrShow: !0
        }) : "tf" == n ? o.setData({
            showOrHidden: !0,
            hiddenOrShow: !1
        }) : "yj" == n && o.setData({
            showOrHidden: !1
        }), "" != a.mac ? (0 == a.flag ? o.ScanAndConnect(a.mac) : o.DirectConnect(a.mac, a.dev, a.name), 
        wx.onBLEConnectionStateChange(function(t) {
            t.connected ? (o.setData({
                state: o.data.language_lib.connected
            }), wx.stopBluetoothDevicesDiscovery({
                success: function(t) {}
            })) : o.setData({
                state: o.data.language_lib.disconnected
            }), console.log("device ".concat(t.deviceId, " state has changed, connected: ").concat(t.connected));
        }), wx.onBLECharacteristicValueChange(function(e) {
            if (e.characteristicId == o.data.readchar) {
                var a = "", s = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], n = Array.prototype.map.call(new Uint8Array(e.value), function(t) {
                    return ("00" + t.toString(16)).slice(-2);
                }).join("");
                a = t.Decrypt(n), console.log("hex", n), console.log("rev", a);
                for (var i = 0; i < a.length; i += 2) s[i / 2] = parseInt(a.substr(i, 2), 16);
                o.parseCmd(s);
            }
        })) : console.log("mac error");
    },
    DirectConnect: function(t, e, a) {
        var s = this;
        s.setData({
            deviceId: e,
            name: a,
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
        var t = i, e = this.data.acc_speed.toString(), a = this.data.lmt_speed.toString(), s = this.data.act_rt_int.toString(), n = (this.data.stop_rt_int.toString(), 
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
            this.sendBleCmd(e);
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
    Mode_ctr: function(t) {
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
    },
    Rst_server: function(t) {
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
    },
    Fetch_cfg_state: function() {
        console.log("Fetch_cfg_state");
        if (this.data.state == this.data.language_lib.connected) {
            var t = [ 4, 10, 1, 0, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0 ];
            t[4] = this.data.token[0], t[5] = this.data.token[1], t[6] = this.data.token[2], 
            t[7] = this.data.token[3];
            var e = this.encodeBuffer(t);
            this.sendBleCmd(e);
        }
    },
    Change_aes1: function() {
        console.log("Fetch_cfg_state");
        var t = [];
        if (this.data.state == this.data.language_lib.connected) {
            for (var e = [ 6, 1, 8, 0, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0 ], a = 0; a < 8; a++) {
                var s = Math.floor(1e3 * Math.random() % 255);
                t[a] = s, e[3 + a] = s;
            }
            this.setData({
                aes_L: t
            }), e[11] = this.data.token[0], e[12] = this.data.token[1], e[13] = this.data.token[2], 
            e[14] = this.data.token[3];
            var n = this.encodeBuffer(e);
            this.sendBleCmd(n);
        }
    },
    Change_aes2: function() {
        console.log("Fetch_cfg_state");
        var t = [];
        if (this.data.state == this.data.language_lib.connected) {
            for (var e = [ 6, 2, 8, 0, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0 ], a = 0; a < 8; a++) {
                var s = Math.floor(1e3 * Math.random() % 255);
                t[a] = s, e[3 + a] = s;
            }
            this.setData({
                aes_H: t
            }), e[11] = this.data.token[0], e[12] = this.data.token[1], e[13] = this.data.token[2], 
            e[14] = this.data.token[3];
            var n = this.encodeBuffer(e);
            this.sendBleCmd(n);
        }
    },
    Rst_factory: function() {
        console.log("Rst_factory");
        if (this.data.state == this.data.language_lib.connected) {
            var t = [ 4, 11, 1, 0, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0 ];
            t[4] = this.data.token[0], t[5] = this.data.token[1], t[6] = this.data.token[2], 
            t[7] = this.data.token[3];
            var e = this.encodeBuffer(t);
            this.sendBleCmd(e);
        }
    },
    fetch_server_addr: function() {
        console.log("fetch_server_addr");
        if ("" == this.data.server_addr) {
            if (this.data.state == this.data.language_lib.connected) {
                var t = [ 5, 2, 1, 0, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0 ];
                t[4] = this.data.token[0], t[5] = this.data.token[1], t[6] = this.data.token[2], 
                t[7] = this.data.token[3];
                var e = this.encodeBuffer(t);
                this.sendBleCmd(e);
            }
        } else wx.showModal({
            title: "服务器地址",
            content: this.data.server_addr,
            showCancel: !1,
            duration: 2e3
        });
    },
    set_server_addr: function() {
        console.log("set_server_addr"), this.setData({
            server_addr_set_window_show: !0
        });
    },
    server_addr_input: function(t) {
        console.log("server_addr_input", t.detail.value), this.setData({
            input_server_addr_value: t.detail.value
        });
    },
    server_addr_set_cancel: function() {
        console.log("server_addr_set_cancel"), this.setData({
            server_addr_set_window_show: !1
        });
    },
    server_addr_set_confirm: function() {
        console.log("server_addr_set_confirm:", this.data.input_server_addr_value), this.setData({
            server_addr_set_window_show: !1,
            server_addr: ""
        }), console.log(this.data.server_addr), this.sendLongBuffer(5, 1, this.data.input_server_addr_value.length, this.data.input_server_addr_value);
    },
    fetch_server_apn: function() {
        console.log("fetch_server_apn");
        if ("" == this.data.server_apn) {
            if (this.data.state == this.data.language_lib.connected) {
                var t = [ 5, 4, 1, 0, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0 ];
                t[4] = this.data.token[0], t[5] = this.data.token[1], t[6] = this.data.token[2], 
                t[7] = this.data.token[3];
                var e = this.encodeBuffer(t);
                this.sendBleCmd(e);
            }
        } else wx.showModal({
            title: "APN",
            content: this.data.server_apn,
            showCancel: !1,
            duration: 2e3
        });
    },
    set_server_apn: function() {
        console.log("set_server_apn"), this.setData({
            apn_set_window_show: !0
        });
    },
    apn_input: function(t) {
        console.log("apn_input", t.detail.value), this.setData({
            input_apn_value: t.detail.value
        });
    },
    apn_set_cancel: function() {
        console.log("apn_set_cancel"), this.setData({
            apn_set_window_show: !1
        });
    },
    apn_set_confirm: function() {
        console.log("apn_set_confirm"), this.setData({
            apn_set_window_show: !1,
            server_apn: ""
        }), this.sendLongBuffer(5, 3, this.data.input_apn_value.length, this.data.input_apn_value);
    },
    fetch_iccid: function() {
        console.log("fetch_iccid");
        if ("" == this.data.iccid) {
            if (this.data.state == this.data.language_lib.connected) {
                var t = [ 5, 7, 1, 0, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0 ];
                t[4] = this.data.token[0], t[5] = this.data.token[1], t[6] = this.data.token[2], 
                t[7] = this.data.token[3];
                var e = this.encodeBuffer(t);
                this.sendBleCmd(e);
            }
        } else wx.showModal({
            title: "ICCID",
            content: this.data.iccid,
            showCancel: !1,
            duration: 2e3
        });
    },
    fetch_imei: function() {
        console.log("fetch_imei");
        if ("" == this.data.imei) {
            if (this.data.state == this.data.language_lib.connected) {
                var t = [ 5, 8, 1, 0, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0 ];
                t[4] = this.data.token[0], t[5] = this.data.token[1], t[6] = this.data.token[2], 
                t[7] = this.data.token[3];
                var e = this.encodeBuffer(t);
                this.sendBleCmd(e);
            }
        } else wx.showModal({
            title: "IMEI",
            content: this.data.imei,
            showCancel: !1,
            duration: 2e3
        });
    },
    fetch_server_user: function() {
        console.log("fetch_server_user");
        if ("" == this.data.server_user) {
            if (this.data.state == this.data.language_lib.connected) {
                var t = [ 5, 5, 1, 0, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0 ];
                t[4] = this.data.token[0], t[5] = this.data.token[1], t[6] = this.data.token[2], 
                t[7] = this.data.token[3];
                var e = this.encodeBuffer(t);
                this.sendBleCmd(e);
            }
        } else wx.showModal({
            title: "用户名",
            content: this.data.server_user,
            showCancel: !1,
            duration: 2e3
        });
    },
    fetch_server_psd: function() {
        console.log("fetch_server_psd");
        if ("" == this.data.server_pwd) {
            if (this.data.state == this.data.language_lib.connected) {
                var t = [ 5, 6, 1, 0, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0 ];
                t[4] = this.data.token[0], t[5] = this.data.token[1], t[6] = this.data.token[2], 
                t[7] = this.data.token[3];
                var e = this.encodeBuffer(t);
                this.sendBleCmd(e);
            }
        } else wx.showModal({
            title: "密码",
            content: this.data.server_pwd,
            showCancel: !1,
            duration: 2e3
        });
    },
    fetch_gprs_csq: function() {
        console.log("fetch_gprs_csq");
        if (this.data.state == this.data.language_lib.connected) {
            var t = [ 5, 9, 1, 0, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0 ];
            t[4] = this.data.token[0], t[5] = this.data.token[1], t[6] = this.data.token[2], 
            t[7] = this.data.token[3];
            var e = this.encodeBuffer(t);
            this.sendBleCmd(e);
        }
    },
    sendLongBuffer: function(t, e, a, s) {
        var n = a, o = [ 5, 9, 1, 0, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0 ];
        for (o[0] = t, o[1] = e, console.log("sendLongBuffer", t, e, a, s); n > 8; ) {
            o[2] = 9;
            for (var i = 0; i < 8; i++) o[3 + i] = s.charCodeAt(a - n + i);
            o[11] = 1, o[12] = this.data.token[0], o[13] = this.data.token[1], o[14] = this.data.token[2], 
            o[15] = this.data.token[3];
            var c = this.encodeBuffer(o);
            this.sendBleCmd(c), n -= 8;
        }
        o[2] = n + 1;
        for (i = 0; i < n; i++) o[3 + i] = s.charCodeAt(a - n + i);
        o[3 + n] = 0, o[4 + n] = this.data.token[0], o[5 + n] = this.data.token[1], o[6 + n] = this.data.token[2], 
        o[7 + n] = this.data.token[3];
        c = this.encodeBuffer(o);
        this.sendBleCmd(c);
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
    encodeBuffer: function(e) {
        var a = "", s = [];
        console.log(e);
        for (var n = 0; n < e.length; n++) {
            var o = e[n].toString(16);
            o.length < 2 && (a += "0"), a += o;
        }
        console.log(a);
        var i = t.Encrypt(a);
        console.log(i);
        for (n = 0; n < i.length; n += 2) s.push(parseInt(i.substr(n, 2), 16));
        var c = new ArrayBuffer(16), d = new DataView(c);
        for (n = 0; n < 16; n++) d.setUint8(n, s[n]);
        return c;
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
    },
    parseTokenCmd: function(t, e, a) {
        switch (console.log("parseTokenCmd:", t, a), t) {
          case 1:
            var s = [], n = [], o = this.data.language_lib.lock;
            if (8 != e) break;
            s.push(a[0]), s.push(a[1]), s.push(a[2]), s.push(a[3]), n.push(a[5]), n.push(a[4]), 
            0 == a[6] && (o = this.data.language_lib.unlock), this.setData({
                token: s,
                version: n.toString(10),
                lock_state: o,
                batt: a[7]
            }), this.fetch_ctr_state();
        }
    },
    parseCtrCmd: function(t, e, a) {
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
    },
    parseSyscfgCmd: function(t, e, a) {
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
            s = this.data.language_lib.off;
            "open_alram" == this.data.sendcmd && (s = this.data.language_lib.on), this.setData({
                sensor: s,
                low_batt_per_c1: o,
                low_batt_per_c2: i,
                sendcmd: "unkown"
            }), console.log("hhhhhhhhhhhhhhhh" + o + "hhhhhhhhhhh" + i);
            break;

          case 10:
            console.log("11111111111111111111111111" + a[4]);
            s = this.data.language_lib.normal;
            1 == a[0] && (s = this.data.language_lib.transport);
            var n = this.data.language_lib.off;
            1 == a[1] && (n = this.data.language_lib.on), this.setData({
                mode: s,
                sensor: n,
                act_rt_int: a[3],
                stop_rt_int: a[2],
                low_batt_per_c1: a[4],
                low_batt_per_c2: a[5]
            }), o = this.data.low_batt_per_c1, i = this.data.low_batt_per_c2;
        }
    },
    parseMt2503Cmd: function(t, e, a) {
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
                }), wx.showModal({
                    title: "ICCID",
                    content: this.data.iccid,
                    showCancel: !1,
                    duration: 2e3
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
                }), wx.showModal({
                    title: "IMEI",
                    content: this.data.imei,
                    showCancel: !1,
                    duration: 2e3
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
    },
    parseAesCmd: function(e, a, s) {
        switch (console.log("parseAesCmd:", e, s), e) {
          case 1:
            this.Change_aes2();
            break;

          case 2:
            var n = this.data.aes_L.concat(this.data.aes_H);
            this.setData({
                aes: n
            }), t.SetAes(n), console.log("AES update success:", this.data.aes);
        }
    },
    parseBleRspCmd: function(t, e, a) {
        switch (console.log("parseAesCmd:", t, a), t) {
          case 1:
            var s = this.data.language_lib.lock, n = this.data.language_lib.off;
            1 == a[0] && (1 & a[3] || (s = this.data.language_lib.unlock), 128 & a[3] && (n = this.data.language_lib.on));
            var o = this.data.language_lib.uncharged, i = 112 & a[7];
            5 == (i >>= 4) && (o = this.data.language_lib.charging), this.setData({
                lock_state: s,
                ledband_state: n,
                cur_speed: a[1],
                cur_mil: a[2],
                batt: a[4],
                batt_soh: a[5],
                charging: o
            });
        }
    },
    navbarTap: function(t) {
        if ("yj" == n) console.log("this is yj"); else {
            console.log("navbarTap:", t);
            this.setData({
                currentTab: t.currentTarget.dataset.idx
            });
        }
    },
    cruise_switch: function(t) {
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
    },
    nz_act_switch: function(t) {
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
    },
    sensor_alarm_switch: function(t) {
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
    },
    low_batt_set: function() {
        console.log("low_batt_set");
        if (this.data.state == this.data.language_lib.connected) {
            var t = [ 4, 6, 2, 0, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0 ];
            t[5] = this.data.token[0], t[6] = this.data.token[1], t[7] = this.data.token[2], 
            t[8] = this.data.token[3], t[3] = parseInt(o), t[4] = parseInt(i), this.setData({
                sendcmd: "low_batt"
            });
            var e = this.encodeBuffer(t);
            this.sendBleCmd(e);
        }
    },
    Lmt_speed_set: function() {
        this.setData({
            lmt_speed_modal_show: !0
        });
    },
    lmt_speed_input: function(t) {
        console.log("lmt_speed_input：", t.detail.value), this.setData({
            input_lmt_speed_value: parseInt(t.detail.value)
        });
    },
    lmt_speed_set_cancel: function() {
        this.setData({
            lmt_speed_modal_show: !1
        });
    },
    lmt_speed_set_confirm: function() {
        if (console.log("lmt_speed_set_confirm", this.data.input_lmt_speed_value), this.data.input_lmt_speed_value > 30) wx.showModal({
            title: this.data.language_lib.input_err,
            content: this.data.language_lib.lmt_spd + ":30km/h",
            showCancel: !1,
            duration: 2e3
        }); else if (this.setData({
            lmt_speed_modal_show: !1
        }), this.data.state == this.data.language_lib.connected) {
            var t = [ 2, 10, 1, 0, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0 ];
            t[4] = this.data.token[0], t[5] = this.data.token[1], t[6] = this.data.token[2], 
            t[7] = this.data.token[3], t[3] = this.data.input_lmt_speed_value;
            var e = this.encodeBuffer(t);
            this.sendBleCmd(e);
        }
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {
        console.log("onHide");
    },
    onUnload: function() {
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
    GetMac: function(t) {
        var e = (parseInt(t, 10) >>> 0).toString(16).toUpperCase(), a = e.substring(e.length - 2, e.length);
        return 1 == a.length && (a = "0" + a), a;
    },
    qrUrl: function() {
        "flash" == n ? wx.showModal({
            title: "",
            confirmText: "ok",
            content: "No authority",
            showCancel: !1
        }) : "tf" == n && wx.scanCode({
            success: function(t) {
                console.log(t.result), (s = t.result).startsWith("https") ? wx.showModal({
                    title: a.alert,
                    content: "确定判为不良品吗？",
                    cancelText: "我再想想",
                    confirmText: "确定",
                    success: function(t) {
                        t.cancel || t.confirm && wx.request({
                            url: a.vehiUrl + "/vehicle/changeTarge",
                            data: {
                                url: s,
                                targe: 1
                            },
                            header: {
                                "Content-Type": "application/json"
                            },
                            success: function(t) {
                                console.log(t.data), "success" == t.data ? wx.showModal({
                                    title: a.alert,
                                    content: "修改成功！",
                                    showCancel: !1
                                }) : "not exist" == t.data && wx.showModal({
                                    title: a.alert,
                                    content: "该设备不存在",
                                    showCancel: !1
                                });
                            }
                        });
                    }
                }) : (wx.showModal({
                    title: a.alert,
                    content: "请检查是否扫错码",
                    showCancel: !1
                }), one = "");
            }
        });
    },
    showDialogBtn1: function() {
        this.setData({
            showModal1: !0,
            va1: o,
            va2: i
        });
    },
    preventTouchMove1: function() {},
    hideModal1: function() {
        this.setData({
            showModal1: !1
        });
    },
    onCancel1: function() {
        this.hideModal1();
    },
    input1: function(t) {
        var e = t.detail.value;
        o = e;
    },
    input2: function(t) {
        var e = t.detail.value;
        i = e;
    },
    onConfirm1: function() {
        console.log(o), console.log(i), this.low_batt_set(), wx.showToast({
            title: "success",
            icon: "success",
            duration: 800
        }), this.hideModal1();
    },
    setSensor: function(t) {
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
    }
});