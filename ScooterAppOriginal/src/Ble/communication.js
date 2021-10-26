import BleManager from "react-native-ble-manager";

module.exports = {
    init(state) {
        Object.assign(this.state, {
            onNotify: async (handler) => {
                await this.checkInit();
                if(state.started){
                    state.handler = handler;
                    return;
                }

                const mac = await this.state.getMac();
                if(!mac)
                    return;

                state.handler = handler;
                state.started = true;
                await BleManager.startNotification(mac, this.uuids.service, this.uuids.read);
            },
            write: async (data) => {
                await this.checkInit();
                const mac = await this.state.getMac();
                if(!mac)
                    return;

                await BleManager.writeWithoutResponse(mac, 'FEE7', '36F5', [...data]);
            }
        })
    },
    async componentDidMount(state) {
        this.subscribe("BleManagerDidUpdateValueForCharacteristic", (event) => {
            state.handler?.(event);
        });
        this.subscribe("BleManagerDisconnectPeripheral", () => {
            state.handler = null;
            state.started = false;
        });
    }
}