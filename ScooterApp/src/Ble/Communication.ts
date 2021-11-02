import BleManager from "react-native-ble-manager";
import {BleProvider} from ".";
import {IExtension} from "./types";

export class Communication implements IExtension
{
	public state: {
		handler: ((event: Event) => void) | null;
		started: boolean;
	} = {
		handler: null,
		started: false
	};

	public init(bleProvider: BleProvider)
	{
		Object.assign(bleProvider.state, {
			onNotify: async (handler: (event: Event) => void) =>
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
				this.state.started = true;
				await BleManager.startNotification(mac, bleProvider.uuids.service, bleProvider.uuids.read);
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

	public async componentDidMount(bleProvider: BleProvider)
	{
		bleProvider.subscribe("BleManagerDidUpdateValueForCharacteristic", (event: Event) =>
		{
			this.state.handler?.(event);
		});

		bleProvider.subscribe("BleManagerDisconnectPeripheral", () =>
		{
			this.state.handler = null;
			this.state.started = false;
		});
	}
}
