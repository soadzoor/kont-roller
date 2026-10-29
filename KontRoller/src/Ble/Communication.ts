import BleManager from "react-native-ble-manager";
import {BleProvider} from ".";
import {IExtension} from "./types";
import {IBluetoothMessage} from "../Api/types";

export class Communication implements IExtension
{
    private subscriptions: Array<{remove: () => void}> = [];
	public state: {
		handler: ((device: IBluetoothMessage) => void) | null;
		started: boolean;
	} = {
		handler: null,
		started: false
	};

	public init(bleProvider: BleProvider)
	{
		Object.assign(bleProvider.state, {
			onNotify: async (handler: (device: IBluetoothMessage) => void) =>
			{
				await bleProvider.checkInit();
				if (this.state.started)
				{
					this.state.handler = handler;
					return;
				}

				const mac = await bleProvider.state.getMac();
				if (!mac)
				{
					return;
				}

				this.state.handler = handler;
				await BleManager.startNotification(mac, bleProvider.uuids.service, bleProvider.uuids.read);
                this.state.started = true;
			},
			write: async (data: Uint8Array) =>
			{
				await bleProvider.checkInit();
				const mac = await bleProvider.state.getMac();
				if (!mac)
				{
					return;
				}

				await BleManager.writeWithoutResponse(mac, bleProvider.uuids.service, bleProvider.uuids.write, [...data]);
			}
		})
	}

    public componentDidMount() {
        this.subscriptions.push(
            BleManager.onDidUpdateValueForCharacteristic(message => this.state.handler?.(message)),
            BleManager.onDisconnectPeripheral(() => {
                this.state.handler = null;
                this.state.started = false;
            }),
        );
    }

    public componentWillUnmount() {
        this.subscriptions.forEach(subscription => subscription.remove());
        this.subscriptions = [];
        this.state.handler = null;
        this.state.started = false;
    }
}
