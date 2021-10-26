import BleManager from "react-native-ble-manager";

module.exports = {
    init() {
        Object.assign(this.state, {
            scanning: false,
            devices: [],

            scan: async () => {
                await this.checkInit();
                if(this.state.scanning)
                    return;
                if(await this.state.getMac())
                    return;

                for(const peri of this.state.devices)
                    await BleManager.removePeripheral(peri.id);
                
                this.setState({ devices: [] });

                BleManager.scan([this.uuids.service], 5);

                this.setState({ scanning: true });
            }
        })
    },
    componentDidMount() {
        this.subscribe('BleManagerStopScan', () => {
            this.setState({ scanning: false });
        });
        this.subscribe('BleManagerDiscoverPeripheral', (peri) => {
            this.setState({ devices: [
                ...this.state.devices.filter(x => x.id !== peri.id),
                peri
            ] });
        });
    }
}