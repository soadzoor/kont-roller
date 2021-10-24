import BleManager from "react-native-ble-manager";
import {Platform, PermissionsAndroid} from "react-native";

module.exports = {
	init()
	{
		Object.assign(this.state, {
			initialized: false,
			init: async () =>
			{
				if (this.state.initialized)
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

				this.setState({initialized: true});
			}
		})

		this.checkInit = async () =>
		{
			if (!this.state.initialized)
				throw "Ble is not initialized";
		}
	},
	async componentDidMount()
	{
		await this.state.init();
	}
}