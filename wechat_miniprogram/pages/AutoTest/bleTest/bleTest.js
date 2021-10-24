var e = getApp(), t = require("../../AES/aes"), a = require("../../language/language"), s = "", o = "", c = "", n = "", i = "", l = "", r = "", d = "", h = "", g = "", u = 0, _ = "", f = "";

Page({
    data: {
        language_lib: [],
        cmd_timer: 0,
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
        err_info: "",
        aes_L: [],
        aes_H: [],
        aes: [],
        chiko: ""
    },
    onLoad: function(e) {
        var n = this;
        o = e.url, c = e.mac, s = e.admin;
        var l;
        l = a.Fetch_language_lib(), n.setData({
            language_lib: l,
            state: "请稍后......",
            vehicleId: o.split("/")[4],
            bscanCol: "gray",
            bconnCol: "gray",
            lockCol: "gray",
            battconnCol: "gray",
            battsocCol: "gray",
            conCol: "gray",
            faultCol: "gray"
        }), n.ScanAndConnect(c), wx.onBLEConnectionStateChange(function(e) {
            e.connected ? (n.setData({
                bconnCol: "green",
                bconnectMess: "通过",
                state: "连接成功"
            }), i = "1", u = 1, wx.stopBluetoothDevicesDiscovery({
                success: function(e) {}
            })) : (n.setData({
                bconnCol: "red",
                bconnectMess: "不通过",
                state: "连接不通过"
            }), i = "0"), console.log("device ".concat(e.deviceId, " state has changed, connected: ").concat(e.connected));
        }), wx.onBLECharacteristicValueChange(function(e) {
            if (e.characteristicId == n.data.readchar) {
                var a = "", s = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], o = Array.prototype.map.call(new Uint8Array(e.value), function(e) {
                    return ("00" + e.toString(16)).slice(-2);
                }).join("");
                a = t.Decrypt(o), console.log("hex", o), console.log("rev", a);
                for (var c = 0; c < a.length; c += 2) s[c / 2] = parseInt(a.substr(c, 2), 16);
                n.parseCmd(s);
            }
        });
    },
    ScanAndConnect: function(e) {
        var t = this;
        t.setData({
            mac: e
        }), console.log("mac:", e), 12 == e.length ? wx.startBluetoothDevicesDiscovery({
            services: [ "FEE7" ],
            success: function(e) {
                console.log("-----startBluetoothDevicesDiscovery--success----------"), console.log(e), 
                t.setData({
                    state: "正在检测扫描状态"
                }), setTimeout(function() {
                    t.GetAppointedDevice();
                }, 1e3);
            },
            fail: function(e) {
                console.log(e), console.log("失败了");
            },
            complete: function(e) {
                console.log(e), console.log("finally");
            }
        }) : wx.showModal({
            title: "二维码格式错误",
            content: t.data.mac,
            showCancel: !1,
            duration: 2e3
        });
    },
    GetMac: function(e) {
        var t = (parseInt(e, 10) >>> 0).toString(16).toUpperCase(), a = t.substring(t.length - 2, t.length);
        return 1 == a.length && (a = "0" + a), a;
    },
    GetAppointedDevice: function() {
        var e = this;
        wx.getBluetoothDevices({
            success: function(t) {
                if (console.log("getBluetoothDevices"), console.log(t), t.devices.length) for (var a = 0; a < t.devices.length; a++) {
                    for (var s = new Int8Array(t.devices[a].advertisData), o = "", c = 2; c < 8; c++) o += e.GetMac(s[c]);
                    if (e.data.mac == o) return console.log("advdata_len:", t.devices[a].advertisData.byteLength), 
                    e.setData({
                        deviceId: t.devices[a].deviceId,
                        name: t.devices[a].name,
                        bscanCol: "green",
                        bscanMess: "通过",
                        state: "正在检测连接状态"
                    }), n = "1", void wx.createBLEConnection({
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
                    e.setData({
                        bscanCol: "red",
                        bscanMess: "不通过"
                    }), n = "0";
                } else console.log("未扫描到设备");
            },
            fail: function(e) {},
            complete: function(e) {}
        });
    },
    Lock_ctr: function() {
        console.log("lock_ctr");
        if ("连接成功" == this.data.state) {
            var e = [ 2, 3, 1, 0, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0 ];
            e[3] = 0, e[4] = this.data.token[0], e[5] = this.data.token[1], e[6] = this.data.token[2], 
            e[7] = this.data.token[3], "unlock", this.setData({
                sendcmd: "unlock"
            });
            var t = this.encodeBuffer(e);
            this.sendBleCmd(t), u = 2, l = "1", r = "1", d = "1", h = "1", g = "1", this.setData({
                lockCol: "green",
                lockMess: "通过"
            });
        } else wx.showModal({
            title: this.data.language_lib.send_cmd_failed,
            content: this.data.state,
            showCancel: !1,
            duration: 2e3
        }), this.setData({
            lockCol: "red",
            lockMess: "不通过",
            faultCol: "red",
            faultMess: "控制器通讯异常"
        }), l = "0", r = "0", d = "0", h = "0", g = "0";
    },
    encodeBuffer: function(e) {
        var a = "", s = [];
        console.log(e);
        for (var o = 0; o < e.length; o++) {
            var c = e[o].toString(16);
            c.length < 2 && (a += "0"), a += c;
        }
        console.log(a);
        var n = t.Encrypt(a);
        console.log(n);
        for (o = 0; o < n.length; o += 2) s.push(parseInt(n.substr(o, 2), 16));
        var i = new ArrayBuffer(16), l = new DataView(i);
        for (o = 0; o < 16; o++) l.setUint8(o, s[o]);
        return i;
    },
    sendBleCmd: function(e) {
        var t = this;
        wx.writeBLECharacteristicValue({
            deviceId: t.data.deviceId,
            serviceId: t.data.services,
            characteristicId: t.data.writechar,
            value: e,
            success: function(e) {
                console.log("writeBLECharacteristicValue success"), clearTimeout(t.data.cmd_timer);
                var a = setTimeout(function() {
                    t.sendBleCmdTimeout();
                }, 6e3);
                t.setData({
                    cmd_timer: a
                });
            }
        });
    },
    sendBleCmdTimeout: function() {
        console.log("sendBleCmdTimeout");
        var e = this.data.language_lib.nulls;
        "lock" == this.data.sendcmd && this.data.lock_state == this.data.language_lib.unlock ? (e = this.data.language_lib.ctr_com_err, 
        this.setData({
            err_info: e
        })) : "unlock" == this.data.sendcmd && this.Fetch_cur_batt_state(), clearTimeout(this.data.cmd_timer);
    },
    parseCmd: function(e) {
        switch (console.log("parseCmd:", e), e[0]) {
          case 1:
            this.parseTokenCmd(e[1], e[2], e.slice(3, e.length));
            break;

          case 2:
            this.parseCtrCmd(e[1], e[2], e.slice(3, e.length));
            break;

          case 3:
            this.parseBattCmd(e[1], e[2], e.slice(3, e.length));
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
        var s = this;
        switch (console.log("parseTokenCmd:", e, a), e) {
          case 1:
            var o = [], c = [], n = s.data.language_lib.lock, i = s.data.language_lib.nulls;
            if (8 != t) break;
            o.push(a[0]), o.push(a[1]), o.push(a[2]), o.push(a[3]), c.push(a[5]), c.push(a[4]), 
            0 == a[6] && (n = s.data.language_lib.unlock), 0 == a[7] && (i = s.data.language_lib.batt_com_err), 
            s.setData({
                token: o,
                version: c.toString(10),
                lock_state: n,
                batt: a[7],
                err_info: i
            }), setTimeout(function() {
                s.Lock_ctr(), s.data.chiko = setInterval(function(e) {
                    2 == u ? (u = 3, console.log("第二步"), s.setData({
                        battconnCol: "green",
                        battconnMess: "通过",
                        state: "正在测试电池SOC"
                    })) : 3 == u ? (u = 4, console.log("第三步"), s.setData({
                        battsocCol: "green",
                        battsocMess: "通过",
                        state: "正在测试控制器"
                    })) : 4 == u ? (u = 5, console.log("第四步"), s.setData({
                        conCol: "green",
                        conMess: "通过",
                        state: "正在检查故障码"
                    })) : 5 == u ? (u = 6, console.log("第五步"), s.setData({
                        faultCol: "green",
                        faultMess: "无故障",
                        battconnCol: "green",
                        battconnMess: "通过",
                        battsocCol: "green",
                        battsocMess: "通过",
                        conCol: "green",
                        conMess: "通过",
                        SOHtest: !0
                    }), s.updateData()) : (6 == u || 8 == u) && (console.log("停止循环"), clearInterval(s.data.chiko));
                }, 1e3);
            }, 2e3);
        }
    },
    Fetch_cfg_state: function() {
        console.log("Fetch_cfg_state");
        if (this.data.state == this.data.language_lib.connected) {
            var e = [ 4, 10, 1, 0, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0 ];
            e[4] = this.data.token[0], e[5] = this.data.token[1], e[6] = this.data.token[2], 
            e[7] = this.data.token[3];
            var t = this.encodeBuffer(e);
            this.setData({
                sendcmd: "unkown"
            }), this.sendBleCmd(t);
        }
    },
    parseCtrCmd: function(e, t, a) {
        switch (console.log("parseCtrCmd:", e, a), e) {
          case 2:
            var s = this.data.language_lib.lock, o = this.data.language_lib.off, c = this.data.language_lib.off, n = this.data.language_lib.on, i = 2, l = 25;
            a[0] && (1 & a[1] || (s = this.data.language_lib.unlock), 128 & a[1] && (o = this.data.language_lib.on), 
            8 & a[1] && (c = this.data.language_lib.on), 4 & a[1] || (n = this.data.language_lib.off), 
            i = 96 & a[1], i >>= 5, l = a[3]), this.setData({
                lock_state: s,
                ledband_state: o,
                cruise: c,
                no_zero_act: n,
                acc_speed: i,
                lmt_speed: l,
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
    parseBattCmd: function(e, t, a) {
        switch (console.log("parseBattCmd:", e, a), e) {
          case 2:
            var s = this.data.language_lib.uncharged, o = 112 & a[6], c = this.data.err_info;
            5 == (o >>= 4) && (s = this.data.language_lib.charging), c = 0 == a[4] ? this.data.language_lib.batt_com_err : this.data.language_lib.ctr_com_err, 
            this.setData({
                batt: a[4],
                charging: s,
                err_info: c
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

          case 6:
            this.setData({
                low_batt_per_c1: _,
                low_batt_per_c2: f,
                sendcmd: "unkown"
            });
            break;

          case 10:
            console.log("11111111111111111111111111" + a[4]);
            s = this.data.language_lib.normal;
            1 == a[0] && (s = this.data.language_lib.transport);
            var o = this.data.language_lib.off;
            1 == a[1] && (o = this.data.language_lib.on), this.setData({
                mode: s,
                sensor: o,
                act_rt_int: a[3],
                stop_rt_int: a[2],
                low_batt_per_c1: a[4],
                low_batt_per_c2: a[5]
            }), _ = this.data.low_batt_per_c1, f = this.data.low_batt_per_c2;
        }
    },
    parseMt2503Cmd: function(e, t, a) {
        switch (console.log("parseMt2503Cmd:", e, a), e) {
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
            if (c = (c = this.data.tmp_rev_buf).concat(a.slice(0, t - 1)), this.setData({
                tmp_rev_buf: c
            }), 0 == a[t - 1]) {
                console.log(c);
                for (var o = 0; o < c.length; o++) s += String.fromCharCode(c[o]);
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
            if (c = (c = this.data.tmp_rev_buf).concat(a.slice(0, t - 1)), this.setData({
                tmp_rev_buf: c
            }), 0 == a[t - 1]) {
                console.log(c);
                for (o = 0; o < c.length; o++) s += String.fromCharCode(c[o]);
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
            if (c = (c = this.data.tmp_rev_buf).concat(a.slice(0, t - 1)), this.setData({
                tmp_rev_buf: c
            }), 0 == a[t - 1]) {
                console.log(c);
                for (o = 0; o < c.length; o++) s += String.fromCharCode(c[o]);
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
            if (c = (c = this.data.tmp_rev_buf).concat(a.slice(0, t - 1)), this.setData({
                tmp_rev_buf: c
            }), 0 == a[t - 1]) {
                console.log(c);
                for (o = 0; o < c.length; o++) s += String.fromCharCode(c[o]);
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
            if (c = (c = this.data.tmp_rev_buf).concat(a.slice(0, t - 1)), this.setData({
                tmp_rev_buf: c
            }), 0 == a[t - 1]) {
                console.log(c);
                for (o = 0; o < c.length; o++) s += String.fromCharCode(c[o]);
                console.log("iccid:", s), this.setData({
                    iccid: s,
                    tmp_rev_buf: []
                });
            }
            break;

          case 8:
            console.log("server imei:", a);
            var c;
            s = "";
            if (c = (c = this.data.tmp_rev_buf).concat(a.slice(0, t - 1)), this.setData({
                tmp_rev_buf: c
            }), 0 == a[t - 1]) {
                console.log(c);
                for (o = 0; o < c.length; o++) s += String.fromCharCode(c[o]);
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
    },
    parseAesCmd: function(e, a, s) {
        switch (console.log("parseAesCmd:", e, s), e) {
          case 1:
            this.Change_aes2();
            break;

          case 2:
            var o = this.data.aes_L.concat(this.data.aes_H);
            this.setData({
                aes: o
            }), t.SetAes(o), console.log("AES update success:", this.data.aes);
        }
    },
    parseBleRspCmd: function(e, t, a) {
        switch (console.log("parseAesCmd:", e, a), e) {
          case 1:
            var s = this.data.language_lib.lock, o = this.data.language_lib.off;
            1 == a[0] && (1 & a[3] || (s = this.data.language_lib.unlock), 128 & a[3] && (o = this.data.language_lib.on));
            var c = this.data.language_lib.uncharged, n = 112 & a[7];
            5 == (n >>= 4) && (c = this.data.language_lib.charging), this.setData({
                lock_state: s,
                ledband_state: o,
                cur_speed: a[1],
                cur_mil: a[2],
                batt: a[4],
                batt_soh: a[5],
                charging: c
            });
        }
    },
    fetch_ctr_state: function() {
        console.log("fetch_ctr_state");
        if (this.data.state == this.data.language_lib.connected) {
            var e = [ 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
            e[4] = this.data.token[0], e[5] = this.data.token[1], e[6] = this.data.token[2], 
            e[7] = this.data.token[3];
            var t = this.encodeBuffer(e);
            this.setData({
                sendcmd: "unkown"
            }), this.sendBleCmd(t);
        }
    },
    Fetch_cur_batt_state: function() {
        console.log("Fetch_cur_batt_state");
        if (this.data.state == this.data.language_lib.connected) {
            var e = [ 3, 2, 1, 0, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0 ];
            e[4] = this.data.token[0], e[5] = this.data.token[1], e[6] = this.data.token[2], 
            e[7] = this.data.token[3];
            var t = this.encodeBuffer(e);
            this.setData({
                sendcmd: "unkown"
            }), this.sendBleCmd(t);
        }
    },
    GetToken: function() {
        console.log("GetToken");
        if ("连接成功" == this.data.state) {
            var e = this.encodeBuffer([ 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]);
            this.sendBleCmd(e);
        }
    },
    updateData: function() {
        var t = this;
        "" == n || "" == i || "" == l || "" == r || "" == d || "" == h || "" == g ? wx.showModal({
            title: e.alert,
            content: "数据丢失，请重新检测"
        }) : "yj" == s ? wx.request({
            url: e.vehiUrl + "/auto/updateData",
            data: {
                vehicleId: o.split("/")[4],
                type: 1,
                targe: 1,
                bscan: n,
                bconnect: i,
                lockkk: l,
                battconnect: r,
                battsoc: d,
                con: h,
                fault: g
            },
            header: {
                "Content-Type": "application/json"
            },
            success: function(a) {
                console.log(a.data), "success" == a.data ? (t.setData({
                    state: "数据已自动上传至服务器"
                }), console.log("加入成功"), u = 8) : "fail" == a.data && (t.setData({
                    state: "数据上传失败，请联系大创技术人员"
                }), console.log("加入失败"), wx.showModal({
                    title: e.alert,
                    content: "数据上传失败，请联系大创技术人员",
                    showCancel: !1
                }));
            }
        }) : "tf" == s && wx.request({
            url: e.vehiUrl + "/auto/updateData",
            data: {
                vehicleId: o.split("/")[4],
                type: 1,
                targe: 2,
                bscan: n,
                bconnect: i,
                lockkk: l,
                battconnect: r,
                battsoc: d,
                con: h,
                fault: g
            },
            header: {
                "Content-Type": "application/json"
            },
            success: function(a) {
                console.log(a.data), "success" == a.data ? (t.setData({
                    state: "数据已自动上传至服务器"
                }), console.log("加入成功"), u = 8) : "fail" == a.data && (t.setData({
                    state: "数据上传失败，请联系大创技术人员"
                }), console.log("加入失败"), wx.showModal({
                    title: e.alert,
                    content: "数据上传失败，请联系大创技术人员",
                    showCancel: !1
                }));
            }
        });
    },
    GoTest: function() {
        8 == u ? wx.redirectTo({
            url: "../manualTest/manualTest?url=" + o + "&admin=" + s
        }) : wx.showModal({
            title: e.alert,
            content: "自动检测部分上传失败，无法跳到下一步",
            showCancel: !1
        });
    }
});