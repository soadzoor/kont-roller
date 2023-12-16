import BleManager, {BleState} from "react-native-ble-manager";
import {Platform} from "react-native";
import {IExtension} from "./types";
import {BleProvider} from ".";
import {PERMISSIONS, check, request} from "react-native-permissions";

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
					const androidPermissions = [
						PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
						PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
						PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
						PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
					];

					for (const permission of androidPermissions)
					{
						const result = await check(permission);

						if (result !== "granted")
						{
							await request(permission);
						}
					}
				}

				const state = await BleManager.checkState();

				if (Platform.OS === "android" && state !== BleState.On)
				{
					// Only supported on android
					BleManager.enableBluetooth();
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