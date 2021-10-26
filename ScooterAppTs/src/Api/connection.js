import aesJs from "aes-js";
import axios from "axios";
import AsyncStorage from "@react-native-community/async-storage";

const getKey = async (mac) => {
    const cached = AsyncStorage.getItem(mac);
    if(cached?.time && cached?.key) {
        const entry = JSON.parse(cached);
        if(new Date().getTime() < entry.time + 1000 * 60 * 10)
            return entry.key;
    }

    const urlMac = mac.split(":").reverse().join(":");
    await axios.get(`https://dev.picasau.com/VehicleSystem/vehicle/addScanData?user=flash&mac=${urlMac}`);
    const resp = await axios.get(`https://dev.picasau.com/VehicleSystem/vehicle/checkDataForMac?mac=${urlMac}`, {
        headers: { 'Content-Type': 'application/json' }
    });

    AsyncStorage.setItem(mac, JSON.stringify({
        time: new Date().getTime(),
        key: resp.data.bleKey 
    }));

    return resp.data.bleKey;
}

module.exports = {
    async init() {
        const key = await getKey(this.mac);
        const aes = new aesJs.ModeOfOperation.ecb(aesJs.utils.hex.toBytes(key));
    
        this.write = (data) => this.ble.write(aes.encrypt(data));
        this.exports.destroy = () =>  this.ble.disconnect();

        await this.ble.connect(this.mac);
        await this.ble.onNotify((data) => {
            if(data.characteristic !== "000036f6-0000-1000-8000-00805f9b34fb")
                return;
            
            this.handleMessage(aes.decrypt([...data.value]));
        });
    }
}