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

                BleManager.scan([bleProvider.uuids.service], 5);

                bleProvider.setState({scanning: true});
            }
        })
    }

    public componentDidMount(bleProvider: BleProvider)
    {
        bleProvider.subscribe("BleManagerStopScan", () =>
        {
            bleProvider.setState({scanning: false});
        });

        bleProvider.subscribe("BleManagerDiscoverPeripheral", (peri: IDevice) =>
        {
            bleProvider.setState({
                devices: [
                    ...bleProvider.state.devices.filter(x => x.id !== peri.id),
                    peri
                ]
            });
        });
    }
}
