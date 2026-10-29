import {IExtension} from "./types";
import {BleProvider} from ".";
import {startBluetooth} from "./startBluetooth";

export class Init implements IExtension {
    public init(bleProvider: BleProvider) {
        Object.assign(bleProvider.state, {
            initialized: false,
            init: async () => {
                if (bleProvider.state.initialized) return;
                await startBluetooth();
                await new Promise<void>(resolve => bleProvider.setState({initialized: true}, resolve));
            },
        });
    }
}
