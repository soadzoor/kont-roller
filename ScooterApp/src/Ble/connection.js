import BleManager from "react-native-ble-manager";

module.exports = {
    init(state) {
        Object.assign(this.state, {
            connected: false,
            getMac: async () => {
                await this.checkInit();
                const connectedDevices = await BleManager.getConnectedPeripherals([this.uuids.service]);
                if(this.state.connected !== (connectedDevices.length != 0))
                    this.setState({ connected: (connectedDevices.length != 0) });

                return connectedDevices?.[0]?.id || null;
            },
            connect: async (peri) => {
                await this.checkInit();

                const mac = peri?.id || peri;
                if(!mac)
                    throw "No mac address was provided to connect method";

                if(await this.state.getMac()) 
                    return;

                if(this.state.scanning)
                    await BleManager.stopScan();
                    
                await BleManager.connect(mac);
                await BleManager.retrieveServices(mac, [this.uuids.service]);
                this.setState({ connected: true });
            },
            disconnect: async () => {
                await this.checkInit();
                const mac = await this.state.getMac();
                if(!mac) 
                    return;

                await BleManager.disconnect(mac);
            }
        });
    },
    async componentDidMount(state) {
        this.subscribe("BleManagerDidUpdateValueForCharacteristic", (event) => {
            state.handler?.(event);
        });
        this.subscribe("BleManagerDisconnectPeripheral", (event) => {
            console.log("disconnected")
            this.setState({ connected: false });
            state.handler = null;
        });
    },
    async componentDidUpdate(state, prevProps, prevState) {
        if(!prevState.initialized && this.state.initialized)
            await this.state.getMac();
    }
}
