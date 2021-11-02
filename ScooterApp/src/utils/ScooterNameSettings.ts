import AsyncStorage from "@react-native-async-storage/async-storage";
import {ScooterNameStorageNamePrefix} from "../Api/types";

export class ScooterNameSettings
{
	public static _scooterNames: Map<string, string> = new Map();

	public static getScooterNameByMac(mac: string)
	{
		return this._scooterNames.get(mac) ?? "";
	}

	public static async loadSavedEntries()
	{
		const keys = await AsyncStorage.getAllKeys();
		
		for (const key of keys)
		{
			if (key.includes(ScooterNameStorageNamePrefix))
			{
				const mac = key.slice(ScooterNameStorageNamePrefix.length);
				const savedName = await AsyncStorage.getItem(key) ?? "";
				this._scooterNames.set(mac, savedName);
			}
		}
	}

	public static async setNameForMac(mac: string, name: string)
	{
		await AsyncStorage.setItem(`${ScooterNameStorageNamePrefix}${mac}`, name);
	}
}