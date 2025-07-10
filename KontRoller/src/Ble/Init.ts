import BleManager, {BleState} from "react-native-ble-manager";
import {Permission, PermissionsAndroid, Platform} from "react-native";
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
				console.log("Init BLE");
				console.log(`Platform version: ${Platform.Version}`);
				if (bleProvider.state.initialized)
				{
					return;
				}
				// As discussed here: https://github.com/innoveit/react-native-ble-manager/issues/544
				// "Android API >= 23 require the ACCESS_COARSE_LOCATION permission to scan for peripherals"
				if (Platform.OS === "android" && Platform.Version >= 23)
				{
					const androidPermissions: Permission[] = [];

					if (Platform.Version >= 31)
					{
						androidPermissions.push("android.permission.BLUETOOTH_CONNECT");
						androidPermissions.push("android.permission.BLUETOOTH_SCAN");
					}
					else
					{
						androidPermissions.push("android.permission.ACCESS_COARSE_LOCATION");
						androidPermissions.push("android.permission.ACCESS_FINE_LOCATION");
					}

					for (const permission of androidPermissions)
					{
						const result = await PermissionsAndroid.check(permission);

						console.log(`Is ${permission} granted: ${result}`)

						if (!result)
						{
							const response = await PermissionsAndroid.request(permission);

							if (response === "granted")
							{
								console.log(`Permission granted for ${permission}`);
								
							}
							else
							{
								console.warn(`You need to grant permissions for ${permission}`);
							}
						}
					}
				}

				if (Platform.OS === "android")
				{
					const state = await BleManager.checkState();
					if (state !== BleState.On)
					{
						// Only supported on android
						BleManager.enableBluetooth();
					}
					
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