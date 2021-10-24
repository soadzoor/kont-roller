var e, t = require("../AES/aes"), a = require("../language/language"), s = "036CD71F1A2A04BF30EF17F5BE184C79", n = getApp();

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
        low_batt_per: 10,
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
        version_dc: "",
        apn_set_window_show: !1,
        input_apn_value: "",
        server_addr_set_window_show: !1,
        server_username_set_window_show: !1,
        server_psw_set_window_show: !1,
        input_server_addr_value: "",
        input_server_username_value: "",
        input_server_psw_value: ""
    },
    onLoad: function(s) {
        var i, o = this;
        i = a.Fetch_language_lib(), o.setData({
            language_lib: i
        }), "" != s.mac ? (0 == s.flag ? o.ScanAndConnect(s.mac) : o.DirectConnect(s.mac, s.dev, s.name), 
        wx.onBLEConnectionStateChange(function(e) {
            e.connected ? (o.setData({
                state: o.data.language_lib.connected
            }), wx.stopBluetoothDevicesDiscovery({
                success: function(e) {}
            })) : o.setData({
                state: o.data.language_lib.disconnected
            }), console.log("device ".concat(e.deviceId, " state has changed, connected: ").concat(e.connected));
        }), wx.onBLECharacteristicValueChange(function(a) {
            if (a.characteristicId == o.data.readchar) {
                var s = "", i = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], c = Array.prototype.map.call(new Uint8Array(a.value), function(e) {
                    return ("00" + e.toString(16)).slice(-2);
                }).join("");
                console.log("apphexxx", n.globalData.aes), e = t.SetAeskey(n.globalData.aes), s = t.Decrypt(c, e), 
                console.log("hex", c), console.log("rev", s);
                for (var r = 0; r < s.length; r += 2) i[r / 2] = parseInt(s.substr(r, 2), 16);
                o.parseCmd(i);
            }
        })) : console.log("mac error");
    },
    DirectConnect: function(e, t, a) {
        var s = this;
        s.setData({
            deviceId: t,
            mac: n.globalData.mac1,
            name: a,
            rssi: n.globalData.rssi1,
            state: s.data.language_lib.connecting
        }), wx.createBLEConnection({
            deviceId: s.data.deviceId,
            success: function(e) {
                console.log("connected"), wx.getBLEDeviceServices({
                    deviceId: s.data.deviceId,
                    success: function(e) {
                        for (var t = 0; t < e.services.length; t++) console.log("device services:", e.services[t]), 
                        "0000FEE7-0000-1000-8000-00805F9B34FB" == e.services[t].uuid && (console.log("find service"), 
                        s.setData({
                            services: e.services[t].uuid
                        }));
                        wx.getBLEDeviceCharacteristics({
                            deviceId: s.data.deviceId,
                            serviceId: s.data.services,
                            success: function(e) {
                                for (var t = 0; t < e.characteristics.length; t++) console.log("uuid:", e.characteristics[t].uuid), 
                                "000036F6-0000-1000-8000-00805F9B34FB" == e.characteristics[t].uuid ? (s.setData({
                                    readchar: e.characteristics[t].uuid
                                }), console.log("read characteristic", s.data.readchar)) : "000036F5-0000-1000-8000-00805F9B34FB" == e.characteristics[t].uuid && (s.setData({
                                    writechar: e.characteristics[t].uuid
                                }), console.log("write characteristic", s.data.writechar));
                                console.log("device getBLEDeviceCharacteristics:", e.characteristics), "000036F6-0000-1000-8000-00805F9B34FB" == s.data.readchar ? (console.log("notifyBLECharacteristicValueChange"), 
                                wx.notifyBLECharacteristicValueChange({
                                    state: !0,
                                    deviceId: s.data.deviceId,
                                    serviceId: s.data.services,
                                    characteristicId: s.data.readchar,
                                    success: function(e) {
                                        console.log("notifyBLECharacteristicValueChange success", e.errMsg), s.GetToken();
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
    },
    ScanAndConnect: function(e) {
        var t = this;
        t.setData({
            mac: e
        }), console.log("mac:", t.data.mac), 12 == t.data.mac.length ? (wx.startBluetoothDevicesDiscovery({
            services: [ "FEE7" ],
            success: function(e) {
                console.log("-----startBluetoothDevicesDiscovery--success----------"), console.log(e), 
                t.setData({
                    state: t.data.language_lib.scanning
                });
            },
            fail: function(e) {
                console.log(e);
            },
            complete: function(e) {
                console.log(e);
            }
        }), setTimeout(function() {
            t.GetAppointedDevice();
        }, 1e3)) : wx.showModal({
            title: "二维码格式错误",
            content: t.data.mac,
            showCancel: !1,
            duration: 2e3
        });
    },
    GetAppointedDevice: function() {
        var e = this;
        wx.getBluetoothDevices({
            success: function(t) {
                if (console.log("getBluetoothDevices"), t.devices.length) for (var a = 0; a < t.devices.length; a++) {
                    for (var s = new Int8Array(t.devices[a].advertisData), n = "", i = 2; i < 8; i++) n += e.GetMac(s[i]);
                    if (e.data.mac == n) return console.log("advdata_len:", t.devices[a].advertisData.byteLength), 
                    e.setData({
                        deviceId: t.devices[a].deviceId,
                        name: t.devices[a].name,
                        rssi: t.devices[a].RSSI,
                        state: e.data.language_lib.connecting
                    }), void wx.createBLEConnection({
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
    Popup_cur_state: function() {
        var e = this.data.low_batt_per.toString(), t = this.data.acc_speed.toString(), a = this.data.lmt_speed.toString(), s = this.data.act_rt_int.toString(), n = (this.data.stop_rt_int.toString(), 
        this.data.language_lib.work_mode + ":" + this.data.mode + "       sensor：" + this.data.sensor + "\n" + this.data.language_lib.batt_low + ":" + e + "     " + this.data.language_lib.cruise + ":" + this.data.cruise + "\n" + this.data.language_lib.nz_act + ":" + this.data.no_zero_act + "      " + this.data.language_lib.acc_spd_lv + ":" + t + "\n" + this.data.language_lib.lmt_spd + ":" + a + "   " + this.data.language_lib.rt_interval + ":" + s + "\n");
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
            var e = this.encodeBuffer([ 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]);
            this.sendBleCmd(e);
        }
    },
    fetch_ctr_state: function() {
        console.log("fetch_ctr_state");
        if (this.data.state == this.data.language_lib.connected) {
            var e = [ 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
            e[4] = this.data.token[0], e[5] = this.data.token[1], e[6] = this.data.token[2], 
            e[7] = this.data.token[3];
            var t = this.encodeBuffer(e);
            this.sendBleCmd(t);
        }
    },
    Ledband_ctr: function(e) {
        console.log("Ledband_open", e);
        if (this.data.state == this.data.language_lib.connected) {
            var t = "c_ledband", a = [ 2, 9, 1, 0, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0 ];
            a[4] = this.data.token[0], a[5] = this.data.token[1], a[6] = this.data.token[2], 
            a[7] = this.data.token[3], "led_o" == e.target.id ? (a[3] = 7, t = "o_ledband") : "led_c" == e.target.id ? (a[3] = 6, 
            t = "c_ledband") : "flight_o" == e.target.id ? (a[1] = 9, a[3] = 1, t = "o_ledfront") : "flight_c" == e.target.id ? (a[1] = 9, 
            a[3] = 0, t = "c_ledfront") : "blight_o" == e.target.id ? (a[1] = 9, a[3] = 5, t = "o_ledbottom") : "blight_c" == e.target.id ? (a[1] = 9, 
            a[3] = 4, t = "c_ledbottom") : "tlight_o" == e.target.id ? (a[1] = 9, a[3] = 3, 
            t = "o_ledtail") : "tlight_c" == e.target.id ? (a[1] = 9, a[3] = 2, t = "c_ledtail") : a[3] = 0, 
            this.setData({
                sendcmd: t
            });
            var s = this.encodeBuffer(a);
            this.sendBleCmd(s);
        }
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
            var s = this.encodeBuffer(a);
            this.sendBleCmd(s);
        }
    },
    Mode_ctr: function(e) {
        console.log("mode_ctr", e);
        if (this.data.state == this.data.language_lib.connected) {
            var t = "normal_mode", a = [ 4, 1, 1, 0, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0 ];
            a[4] = this.data.token[0], a[5] = this.data.token[1], a[6] = this.data.token[2], 
            a[7] = this.data.token[3], "mode_o" == e.target.id ? (t = "trans_mode", a[3] = 1) : a[3] = 0, 
            this.setData({
                sendcmd: t
            });
            var s = this.encodeBuffer(a);
            this.sendBleCmd(s);
        }
    },
    Rst_server: function(e) {
        console.log("Rst_factory", e);
        if (this.data.state == this.data.language_lib.connected) {
            var t = "normal_mode", a = [ 4, 2, 1, 0, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0 ];
            a[4] = this.data.token[0], a[5] = this.data.token[1], a[6] = this.data.token[2], 
            a[7] = this.data.token[3], "mode_o" == e.target.id ? (t = "trans_mode", a[3] = 1) : a[3] = 0, 
            this.setData({
                sendcmd: t
            });
            var s = this.encodeBuffer(a);
            this.sendBleCmd(s);
        }
    },
    Fetch_cfg_state: function() {
        console.log("Fetch_cfg_state");
        if (this.data.state == this.data.language_lib.connected) {
            var e = [ 4, 10, 1, 0, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0 ];
            e[4] = this.data.token[0], e[5] = this.data.token[1], e[6] = this.data.token[2], 
            e[7] = this.data.token[3];
            var t = this.encodeBuffer(e);
            this.sendBleCmd(t);
        }
    },
    Change_aes1: function() {
        console.log("Change_aes1");
        for (var e = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], t = [], a = 0; a < s.length; a += 2) e[a / 2] = parseInt(s.substr(a, 2), 16);
        if (console.log("arrayaes1", e), this.data.state == this.data.language_lib.connected) {
            var n = [ 6, 1, 8, 0, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0 ];
            for (a = 0; a < 8; a++) t[a] = e[a], n[3 + a] = t[a];
            this.setData({
                aes_L: t
            }), n[11] = this.data.token[0], n[12] = this.data.token[1], n[13] = this.data.token[2], 
            n[14] = this.data.token[3], console.log("data", n);
            var i = this.encodeBuffer(n);
            this.sendBleCmd(i);
        }
    },
    Change_aes2: function() {
        console.log("Fetch_cfg_state");
        for (var e = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], t = [], a = 0; a < s.length; a += 2) e[a / 2] = parseInt(s.substr(a, 2), 16);
        if (console.log("arrayaes2", e), this.data.state == this.data.language_lib.connected) {
            var n = [ 6, 2, 8, 0, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0 ];
            for (a = 0; a < 8; a++) t[a] = e[8 + a], n[3 + a] = t[a];
            this.setData({
                aes_H: t
            }), n[11] = this.data.token[0], n[12] = this.data.token[1], n[13] = this.data.token[2], 
            n[14] = this.data.token[3], console.log("data", n);
            var i = this.encodeBuffer(n);
            this.sendBleCmd(i);
        }
    },
    Rst_factory: function() {
        console.log("Rst_factory");
        if (this.data.state == this.data.language_lib.connected) {
            var e = [ 4, 11, 1, 0, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0 ];
            e[4] = this.data.token[0], e[5] = this.data.token[1], e[6] = this.data.token[2], 
            e[7] = this.data.token[3];
            var t = this.encodeBuffer(e);
            this.sendBleCmd(t);
        }
    },
    fetch_server_addr: function() {
        console.log("fetch_server_addr");
        if ("" == this.data.server_addr) {
            if (this.data.state == this.data.language_lib.connected) {
                var e = [ 5, 2, 1, 0, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0 ];
                e[4] = this.data.token[0], e[5] = this.data.token[1], e[6] = this.data.token[2], 
                e[7] = this.data.token[3];
                var t = this.encodeBuffer(e);
                this.sendBleCmd(t);
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
    server_addr_input: function(e) {
        console.log("server_addr_input", e.detail.value), this.setData({
            input_server_addr_value: e.detail.value
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
    set_server_username: function() {
        console.log("set_server_username"), this.setData({
            server_username_set_window_show: !0
        });
    },
    server_username_input: function(e) {
        console.log("server_username_input", e.detail.value), this.setData({
            input_server_username_value: e.detail.value
        });
    },
    server_username_set_cancel: function() {
        console.log("server_username_set_cancel"), this.setData({
            server_username_set_window_show: !1
        });
    },
    server_username_set_confirm: function() {
        console.log("server_username_set_confirm:", this.data.input_server_username_value), 
        this.setData({
            server_username_set_window_show: !1,
            server_username: ""
        }), console.log(this.data.server_username), this.sendLongBuffer(5, 11, this.data.input_server_username_value.length, this.data.input_server_username_value);
    },
    set_server_psw: function() {
        console.log("set_server_psw"), this.setData({
            server_psw_set_window_show: !0
        });
    },
    server_psw_input: function(e) {
        console.log("server_psw_input", e.detail.value), this.setData({
            input_server_psw_value: e.detail.value
        });
    },
    server_psw_set_cancel: function() {
        console.log("server_psw_set_cancel"), this.setData({
            server_psw_set_window_show: !1
        });
    },
    server_psw_set_confirm: function() {
        console.log("server_psw_set_confirm:", this.data.input_server_psw_value), this.setData({
            server_psw_set_window_show: !1,
            server_psw: ""
        }), console.log(this.data.server_psw), this.sendLongBuffer(5, 12, this.data.input_server_psw_value.length, this.data.input_server_psw_value);
    },
    fetch_server_apn: function() {
        console.log("fetch_server_apn");
        if ("" == this.data.server_apn) {
            if (this.data.state == this.data.language_lib.connected) {
                var e = [ 5, 4, 1, 0, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0 ];
                e[4] = this.data.token[0], e[5] = this.data.token[1], e[6] = this.data.token[2], 
                e[7] = this.data.token[3];
                var t = this.encodeBuffer(e);
                this.sendBleCmd(t);
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
    apn_input: function(e) {
        console.log("apn_input", e.detail.value), this.setData({
            input_apn_value: e.detail.value
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
                var e = [ 5, 7, 1, 0, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0 ];
                e[4] = this.data.token[0], e[5] = this.data.token[1], e[6] = this.data.token[2], 
                e[7] = this.data.token[3];
                var t = this.encodeBuffer(e);
                this.sendBleCmd(t);
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
                var e = [ 5, 8, 1, 0, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0 ];
                e[4] = this.data.token[0], e[5] = this.data.token[1], e[6] = this.data.token[2], 
                e[7] = this.data.token[3];
                var t = this.encodeBuffer(e);
                this.sendBleCmd(t);
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
                var e = [ 5, 5, 1, 0, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0 ];
                e[4] = this.data.token[0], e[5] = this.data.token[1], e[6] = this.data.token[2], 
                e[7] = this.data.token[3];
                var t = this.encodeBuffer(e);
                this.sendBleCmd(t);
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
                var e = [ 5, 6, 1, 0, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0 ];
                e[4] = this.data.token[0], e[5] = this.data.token[1], e[6] = this.data.token[2], 
                e[7] = this.data.token[3];
                var t = this.encodeBuffer(e);
                this.sendBleCmd(t);
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
            var e = [ 5, 9, 1, 0, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0 ];
            e[4] = this.data.token[0], e[5] = this.data.token[1], e[6] = this.data.token[2], 
            e[7] = this.data.token[3];
            var t = this.encodeBuffer(e);
            this.sendBleCmd(t);
        }
    },
    fetch_version: function() {
        console.log("fetch_version");
        if (this.data.state == this.data.language_lib.connected) {
            var e = [ 5, 10, 1, 0, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0 ];
            e[4] = this.data.token[0], e[5] = this.data.token[1], e[6] = this.data.token[2], 
            e[7] = this.data.token[3];
            var t = this.encodeBuffer(e);
            this.sendBleCmd(t);
        }
    },
    sendLongBuffer: function(e, t, a, s) {
        var n = a, i = [ 5, 9, 1, 0, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0 ];
        for (i[0] = e, i[1] = t, console.log("sendLongBuffer", e, t, a, s); n > 8; ) {
            i[2] = 9;
            for (var o = 0; o < 8; o++) i[3 + o] = s.charCodeAt(a - n + o);
            i[11] = 1, i[12] = this.data.token[0], i[13] = this.data.token[1], i[14] = this.data.token[2], 
            i[15] = this.data.token[3];
            var c = this.encodeBuffer(i);
            this.sendBleCmd(c), n -= 8;
        }
        i[2] = n + 1;
        for (o = 0; o < n; o++) i[3 + o] = s.charCodeAt(a - n + o);
        i[3 + n] = 0, i[4 + n] = this.data.token[0], i[5 + n] = this.data.token[1], i[6 + n] = this.data.token[2], 
        i[7 + n] = this.data.token[3];
        c = this.encodeBuffer(i);
        this.sendBleCmd(c);
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
        var s = "", i = [];
        console.log(a);
        for (var o = 0; o < a.length; o++) {
            var c = a[o].toString(16);
            c.length < 2 && (s += "0"), s += c;
        }
        console.log("str", s), console.log("apphexxx", n.globalData.aes), e = t.SetAeskey(n.globalData.aes);
        var r = t.Encrypt(s, e);
        console.log(r);
        for (o = 0; o < r.length; o += 2) i.push(parseInt(r.substr(o, 2), 16));
        var d = new ArrayBuffer(16), l = new DataView(d);
        for (o = 0; o < 16; o++) l.setUint8(o, i[o]);
        return d;
    },
    decodebuffer: function(e) {},
    parseCmd: function(e) {
        switch (console.log("parseCmd:", e), e[0]) {
          case 1:
            this.parseTokenCmd(e[1], e[2], e.slice(3, e.length));
            break;

          case 2:
            this.parseCtrCmd(e[1], e[2], e.slice(3, e.length));
            break;

          case 4:
            this.parseSyscfgCmd(e[1], e[2], e.slice(3, e.length));
            break;

          case 5:
            this.parseMt2503Cmd(e[1], e[2], e.slice(3, e.length));
            break;

          case 6:
            this.parseAesCmd(e[1], e[2], e.slice(3, e.length));
            break;

          case 7:
            this.parseBleRspCmd(e[1], e[2], e.slice(3, e.length));
        }
    },
    parseTokenCmd: function(e, t, a) {
        switch (console.log("parseTokenCmd:", e, a), e) {
          case 1:
            var s = [], n = [], i = this.data.language_lib.lock;
            if (8 != t) break;
            s.push(a[0]), s.push(a[1]), s.push(a[2]), s.push(a[3]), n.push(a[5]), n.push(a[4]), 
            0 == a[6] && (i = this.data.language_lib.unlock), this.setData({
                token: s,
                version: n.toString(10),
                lock_state: i,
                batt: a[7]
            }), this.fetch_ctr_state();
        }
    },
    parseCtrCmd: function(e, t, a) {
        switch (console.log("parseCtrCmd:", e, a), e) {
          case 2:
            var s = this.data.language_lib.lock, n = this.data.language_lib.off, i = this.data.language_lib.off, o = this.data.language_lib.on, c = 2, r = 25;
            a[0] && (1 & a[1] || (s = this.data.language_lib.unlock), 128 & a[1] && (n = this.data.language_lib.on), 
            8 & a[1] && (i = this.data.language_lib.on), 4 & a[1] || (o = this.data.language_lib.off), 
            c = 96 & a[1], c >>= 5, r = a[3]), this.setData({
                lock_state: s,
                ledband_state: n,
                cruise: i,
                no_zero_act: o,
                acc_speed: c,
                lmt_speed: r,
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
    parseSyscfgCmd: function(e, t, a) {
        switch (console.log("parseSyscfgCmd:", e, a), e) {
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
                sendcmd: "unkown"
            });
            break;

          case 10:
            s = this.data.language_lib.normal;
            1 == a[0] && (s = this.data.language_lib.transport);
            var n = this.data.language_lib.off;
            1 == a[1] && (n = this.data.language_lib.on), this.setData({
                mode: s,
                sensor: n,
                act_rt_int: a[3],
                stop_rt_int: a[2],
                low_batt_per: a[4]
            });
        }
    },
    parseMt2503Cmd: function(e, t, a) {
        switch (console.log("parseMt2503Cmd:", e, a), e) {
          case 1:
            console.log("server addr write success:"), wx.showModal({
                title: "success",
                content: "Host set successfully",
                showCancel: !1,
                duration: 2e3
            });
            break;

          case 11:
            console.log("server addr write success:"), wx.showModal({
                title: "success",
                content: "Username set successfully",
                showCancel: !1,
                duration: 2e3
            });
            break;

          case 12:
            console.log("server addr write success:"), wx.showModal({
                title: "success",
                content: "Password set successfully",
                showCancel: !1,
                duration: 2e3
            });
            break;

          case 2:
            console.log("server addr:", a);
            var s = "";
            if (i = (i = this.data.tmp_rev_buf).concat(a.slice(0, t - 1)), this.setData({
                tmp_rev_buf: i
            }), 0 == a[t - 1]) {
                console.log(i);
                for (var n = 0; n < i.length; n++) s += String.fromCharCode(i[n]);
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
            if (i = (i = this.data.tmp_rev_buf).concat(a.slice(0, t - 1)), this.setData({
                tmp_rev_buf: i
            }), 0 == a[t - 1]) {
                console.log(i);
                for (n = 0; n < i.length; n++) s += String.fromCharCode(i[n]);
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
            if (i = (i = this.data.tmp_rev_buf).concat(a.slice(0, t - 1)), this.setData({
                tmp_rev_buf: i
            }), 0 == a[t - 1]) {
                console.log(i);
                for (n = 0; n < i.length; n++) s += String.fromCharCode(i[n]);
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
            if (i = (i = this.data.tmp_rev_buf).concat(a.slice(0, t - 1)), this.setData({
                tmp_rev_buf: i
            }), 0 == a[t - 1]) {
                console.log(i);
                for (n = 0; n < i.length; n++) s += String.fromCharCode(i[n]);
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
            if (i = (i = this.data.tmp_rev_buf).concat(a.slice(0, t - 1)), this.setData({
                tmp_rev_buf: i
            }), 0 == a[t - 1]) {
                console.log(i);
                for (n = 0; n < i.length; n++) s += String.fromCharCode(i[n]);
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
            s = "";
            if (i = (i = this.data.tmp_rev_buf).concat(a.slice(0, t - 1)), this.setData({
                tmp_rev_buf: i
            }), 0 == a[t - 1]) {
                console.log(i);
                for (n = 0; n < i.length; n++) s += String.fromCharCode(i[n]);
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
            break;

          case 10:
            console.log("ver:", a[0]);
            var i;
            s = "";
            if (i = (i = this.data.tmp_rev_buf).concat(a.slice(0, t - 1)), this.setData({
                tmp_rev_buf: i
            }), 0 == a[t - 1]) {
                console.log(i);
                for (n = 0; n < i.length; n++) s += String.fromCharCode(i[n]);
                this.setData({
                    version_dc: s,
                    tmp_rev_buf: []
                }), wx.showModal({
                    title: "VERSION",
                    content: this.data.version_dc,
                    showCancel: !1,
                    duration: 2e3
                });
            }
        }
    },
    parseAesCmd: function(e, t, a) {
        switch (console.log("parseAesCmd:", e, a), e) {
          case 1:
            this.Change_aes2();
            break;

          case 2:
            var i = this.data.aes_L.concat(this.data.aes_H);
            this.setData({
                aes: i
            }), n.globalData.aes = s, console.log("newAES:" + n.globalData.aes), console.log("AES update success:", this.data.aes);
        }
    },
    parseBleRspCmd: function(e, t, a) {
        switch (console.log("parseAesCmd:", e, a), e) {
          case 1:
            var s = this.data.language_lib.lock, n = this.data.language_lib.off;
            1 == a[0] && (1 & a[3] || (s = this.data.language_lib.unlock), 128 & a[3] && (n = this.data.language_lib.on));
            var i = this.data.language_lib.uncharged, o = 112 & a[7];
            5 == (o >>= 4) && (i = this.data.language_lib.charging), this.setData({
                lock_state: s,
                ledband_state: n,
                cur_speed: a[1],
                cur_mil: a[2],
                batt: a[4],
                batt_soh: a[5],
                charging: i
            });
        }
    },
    navbarTap: function(e) {
        console.log("navbarTap:", e);
        this.setData({
            currentTab: e.currentTarget.dataset.idx
        });
    },
    cruise_switch: function(e) {
        console.log("cruise_switch", e);
        if (this.data.state == this.data.language_lib.connected) {
            var t = "o_cruise", a = [ 2, 6, 1, 0, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0 ];
            a[4] = this.data.token[0], a[5] = this.data.token[1], a[6] = this.data.token[2], 
            a[7] = this.data.token[3], a[3] = 1, e.detail.value || (t = "c_cruise", a[3] = 0), 
            this.setData({
                sendcmd: t
            });
            var s = this.encodeBuffer(a);
            this.sendBleCmd(s);
        }
    },
    nz_act_switch: function(e) {
        console.log("nz_act_switch", e);
        if (this.data.state == this.data.language_lib.connected) {
            var t = "o_nz", a = [ 2, 5, 1, 0, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0 ];
            a[4] = this.data.token[0], a[5] = this.data.token[1], a[6] = this.data.token[2], 
            a[7] = this.data.token[3], a[3] = 1, e.detail.value || (t = "c_nz", a[3] = 0), this.setData({
                sendcmd: t
            });
            var s = this.encodeBuffer(a);
            this.sendBleCmd(s);
        }
    },
    sensor_alarm_switch: function(e) {
        console.log("sensor_alarm_switch", e);
        if (this.data.state == this.data.language_lib.connected) {
            var t = "open_alram", a = [ 4, 3, 1, 0, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0 ];
            a[4] = this.data.token[0], a[5] = this.data.token[1], a[6] = this.data.token[2], 
            a[7] = this.data.token[3], a[3] = 1, e.detail.value || (t = "close_alram", a[3] = 0), 
            this.setData({
                sendcmd: t
            });
            var s = this.encodeBuffer(a);
            this.sendBleCmd(s);
        }
    },
    Lmt_speed_set: function() {
        this.setData({
            lmt_speed_modal_show: !0
        });
    },
    lmt_speed_input: function(e) {
        console.log("lmt_speed_input：", e.detail.value), this.setData({
            input_lmt_speed_value: parseInt(e.detail.value)
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
            var e = [ 2, 10, 1, 0, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0 ];
            e[4] = this.data.token[0], e[5] = this.data.token[1], e[6] = this.data.token[2], 
            e[7] = this.data.token[3], e[3] = this.data.input_lmt_speed_value;
            var t = this.encodeBuffer(e);
            this.sendBleCmd(t);
        }
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {
        console.log("onHide");
    },
    onUnload: function() {
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
    GetMac: function(e) {
        var t = (parseInt(e, 10) >>> 0).toString(16).toUpperCase(), a = t.substring(t.length - 2, t.length);
        return 1 == a.length && (a = "0" + a), a;
    }
});