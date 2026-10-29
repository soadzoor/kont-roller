import BleManager from "react-native-ble-manager";
import {BleProvider} from ".";
import {IDevice} from "../Api/types";
import {IBleProviderProps, IBleProviderState, IExtension} from "./types";

export class Connection implements IExtension
{
    private subscriptions: Array<{remove: () => void}> = [];

	public init(bleProvider: BleProvider)
	{
		Object.assign(bleProvider.state, {
			connected: false,
			getMac: async () =>
			{
				await bleProvider.checkInit();
				const connectedDevices = await BleManager.getConnectedPeripherals([bleProvider.uuids.service]);

				if (bleProvider.state.connected !== (connectedDevices.length != 0))
				{
					bleProvider.setState({
						connected: (connectedDevices.length != 0)
					});
				}

				return connectedDevices?.[0]?.id || null;
			},
			connect: async (peri: IDevice | string) =>
			{
				await bleProvider.checkInit();

				const mac = (peri as IDevice)?.id || peri as string;
				if (!mac)
				{
					throw "No mac address was provided to connect method";
				}

				if (await bleProvider.state.getMac())
				{
					return;
				}

				if (bleProvider.state.scanning)
				{
					await BleManager.stopScan();
				}

				await BleManager.connect(mac as string);
				await BleManager.retrieveServices(mac, [bleProvider.uuids.service]);
				bleProvider.setState({
					connected: true
				});
			},
			disconnect: async () =>
			{
				await bleProvider.checkInit();
				const mac = await bleProvider.state.getMac();
				if (!mac)
				{
					return;
				}

				await BleManager.disconnect(mac);
			}
		});
	}

    public componentDidMount(bleProvider: BleProvider) {
        this.subscriptions.push(BleManager.onDisconnectPeripheral(() => {
            bleProvider.setState({connected: false});
        }));
    }

    public componentWillUnmount() {
        this.subscriptions.forEach(subscription => subscription.remove());
        this.subscriptions = [];
    }

	public async componentDidUpdate(bleProvider: BleProvider, prevProps: IBleProviderProps, prevState: IBleProviderState)
	{
		if (!prevState.initialized && bleProvider.state.initialized)
		{
			await bleProvider.state.getMac();
		}
	}
}
