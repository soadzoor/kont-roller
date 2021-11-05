import BleManager from "react-native-ble-manager";
import { Platform, PermissionsAndroid } from "react-native";
import {IExtension} from "./types";
import {BleProvider} from ".";

export class Init implements IExtension
{
	public init(bleProvider: BleProvider)
	{
		Object.assign(bleProvider.state, {
			initialized: false,
			init: async () =>
			{
				console.log("init");
				if (bleProvider.state.initialized)
				{
					return;
				}
				// As discussed here: https://github.com/innoveit/react-native-ble-manager/issues/544
				// "Android API >= 23 require the ACCESS_COARSE_LOCATION permission to scan for peripherals"
				if (Platform.OS === "android" && Platform.Version >= 23)
				{
					if (!await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION))
					{
						await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
					}
				}

				if (Platform.OS === "android")
				{
					// Only supported on android
					await BleManager.enableBluetooth();
				}

				await BleManager.start({showAlert: true});

				bleProvider.setState({initialized: true});
			}
		});
	}

	public async componentDidMount(bleProvider: BleProvider)
	{
		await bleProvider.state.init();
	}
}