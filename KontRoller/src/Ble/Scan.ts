import BleManager from "react-native-ble-manager";
import {BleProvider} from ".";
import {IExtension} from "./types";

export class Scan implements IExtension {
    private subscriptions: Array<{remove: () => void}> = [];

    public init(bleProvider: BleProvider) {
        Object.assign(bleProvider.state, {
            scanning: false,
            devices: [],
            scan: async () => {
                await bleProvider.checkInit();
                if (bleProvider.state.scanning || await bleProvider.state.getMac()) return;
                for (const peripheral of bleProvider.state.devices) {
                    await BleManager.removePeripheral(peripheral.id);
                }
                bleProvider.setState({devices: [], scanning: true});
                try {
                    await BleManager.scan({serviceUUIDs: [bleProvider.uuids.service], seconds: 5});
                } catch (error) {
                    bleProvider.setState({scanning: false});
                    throw error;
                }
            },
        });
    }

    public componentDidMount(bleProvider: BleProvider) {
        this.subscriptions.push(
            BleManager.onDiscoverPeripheral(peripheral => {
                bleProvider.setState(previous => ({
                    devices: [...previous.devices.filter(device => device.id !== peripheral.id), peripheral],
                }));
            }),
            BleManager.onStopScan(() => bleProvider.setState({scanning: false})),
        );
    }

    public componentWillUnmount() {
        this.subscriptions.forEach(subscription => subscription.remove());
        this.subscriptions = [];
    }
}
