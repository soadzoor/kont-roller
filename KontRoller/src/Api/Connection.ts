import aesJs from "aes-js";
import {IApi, IBluetoothMessage, IExtension} from "./types";

const bleKey = "20572F52364B3F473050415811632D2B"; // seems to be the same for every flash/circ scooter!

// const getKey = async (mac: string) =>
// {
//	 const savedItemAsString = await AsyncStorage.getItem(mac) || "{}"; // empty string causes runtime error in JSON.parse! null doesn't
//	 const cached: {time?: number, key?: string} = JSON.parse(savedItemAsString as string);
//	 if (cached?.time && cached?.key)
//	 {
//		 if (new Date().getTime() < cached.time + 1000 * 60 * 10)
//		 {
//			 return cached.key;
//		 }
//	 }

//	 const urlMac = mac.split(":").reverse().join(":");
//	 await axios.get(`https://dev.picasau.com/VehicleSystem/vehicle/addScanData?user=flash&mac=${urlMac}`);
//	 const resp = await axios.get(`https://dev.picasau.com/VehicleSystem/vehicle/checkDataForMac?mac=${urlMac}`, {
//		 headers: {'Content-Type': 'application/json'}
//	 });

//	 AsyncStorage.setItem(mac, JSON.stringify({
//		 time: new Date().getTime(),
//		 key: resp.data.bleKey
//	 }));

//	 return resp.data.bleKey;
// }

// Yes... I checked and it's different on the 2 platforms...
const characteristicOnAndroid = "000036f6-0000-1000-8000-00805f9b34fb";
const characteristicOnIOS = "36f6";

export class Connection implements IExtension
{
	public async init(api: IApi)
	{
		const key = bleKey;
		const aes = new aesJs.ModeOfOperation.ecb(aesJs.utils.hex.toBytes(key));

		api.write = (data) => api.ble.write(aes.encrypt(data));
		api.exports.destroy = () => api.ble.disconnect();

		await api.ble.connect(api.mac);
		await api.ble.onNotify((data: IBluetoothMessage) =>
		{
			console.log(data.characteristic);
			if (data.characteristic.toLowerCase() !== characteristicOnAndroid && data.characteristic.toLowerCase() !== characteristicOnIOS)
			{
				console.log("Characteristic doesn't match");
				api.ble.disconnect();
				return;
			}

			api.handleMessage(aes.decrypt([...data.value]));
		});
	}
}