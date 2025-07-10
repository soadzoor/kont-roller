import BleManager from "react-native-ble-manager";
import {BleProvider} from ".";
import {IDevice} from "../Api/types";
import {IExtension} from "./types";

export class Scan implements IExtension
{
	public init(bleProvider: BleProvider)
	{
		Object.assign(bleProvider.state, {
			scanning: false,
			devices: [],

			scan: async () =>
			{
				console.log("Start scanning for BLE devices");

				await bleProvider.checkInit();
				if (bleProvider.state.scanning)
				{
					return;
				}
				if (await bleProvider.state.getMac())
				{
					return;
				}

				for (const peri of bleProvider.state.devices)
				{
					await BleManager.removePeripheral(peri.id);
				}

				bleProvider.setState({devices: []});

				console.log(`Scanning for service UUID: ${bleProvider.uuids.service}`);
				BleManager.scan([bleProvider.uuids.service], 5);

				bleProvider.setState({scanning: true});
			}
		})
	}

	public componentDidMount(bleProvider: BleProvider)
	{
		BleManager.onDiscoverPeripheral((peri: IDevice) => 
		{
			console.log(`Discovered peripheral: ${peri.name} (${peri.id})`);

			bleProvider.setState({
				devices: [
					...bleProvider.state.devices.filter(x => x.id !== peri.id),
					peri
				]
			});
		});

		BleManager.onStopScan(() =>
		{
			console.log("Stopped scanning for BLE devices");

			bleProvider.setState({scanning: false});
		});
	}

	public componentWillUnmount(bleProvider: BleProvider)
	{
		
	}
}
