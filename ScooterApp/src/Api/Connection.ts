import aesJs from "aes-js";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {IApi, IExtension} from "./types";

const getKey = async (mac: string) =>
{
    return "20572F52364B3F473050415811632D2B";
    // const savedItemAsString = await AsyncStorage.getItem(mac) || "{}"; // empty string causes runtime error in JSON.parse! null doesn't
    // const cached: {time?: number, key?: string} = JSON.parse(savedItemAsString as string);
    // if (cached?.time && cached?.key)
    // {
    //     if (new Date().getTime() < cached.time + 1000 * 60 * 10)
    //     {
    //         return cached.key;
    //     }
    // }

    // const urlMac = mac.split(":").reverse().join(":");
    // await axios.get(`https://dev.picasau.com/VehicleSystem/vehicle/addScanData?user=flash&mac=${urlMac}`);
    // const resp = await axios.get(`https://dev.picasau.com/VehicleSystem/vehicle/checkDataForMac?mac=${urlMac}`, {
    //     headers: {'Content-Type': 'application/json'}
    // });

    // AsyncStorage.setItem(mac, JSON.stringify({
    //     time: new Date().getTime(),
    //     key: resp.data.bleKey
    // }));

    // return resp.data.bleKey;
}

export class Connection implements IExtension
{
    public async init(api: IApi)
    {
        const key = await getKey(api.mac);
        const aes = new aesJs.ModeOfOperation.ecb(aesJs.utils.hex.toBytes(key));

        api.write = (data) => api.ble.write(aes.encrypt(data));
        api.exports.destroy = () => api.ble.disconnect();

        await api.ble.connect(api.mac);
        await api.ble.onNotify((data: any) =>
        {
            if (data.characteristic !== "000036f6-0000-1000-8000-00805f9b34fb")
            {
                return;
            }

            api.handleMessage(aes.decrypt([...data.value]));
        });
    }
}