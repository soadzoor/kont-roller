import BleManager from "react-native-ble-manager";
import {Platform, PermissionsAndroid} from "react-native";
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
				if (bleProvider.state.initialized)
				{
					return;
				}
				if (Platform.OS === 'android' && Platform.Version >= 23)
				{
					if (!await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION))
					{
						await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
					}
				}

				await BleManager.enableBluetooth();
				await BleManager.start({showAlert: true});

				bleProvider.setState({initialized: true});
			}
		})
	}

	public async componentDidMount(bleProvider: BleProvider)
	{
		await bleProvider.state.init();
	}
}