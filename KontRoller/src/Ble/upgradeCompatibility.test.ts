import BleManager from 'react-native-ble-manager';
import {Scan} from './Scan';
import {Communication} from './Communication';
import type {BleProvider} from '.';

jest.mock('react-native-ble-manager', () => ({
    __esModule: true,
    default: {
        scan: jest.fn(), removePeripheral: jest.fn(),
        onDiscoverPeripheral: jest.fn(), onStopScan: jest.fn(),
        onDidUpdateValueForCharacteristic: jest.fn(), onDisconnectPeripheral: jest.fn(),
        startNotification: jest.fn(), writeWithoutResponse: jest.fn(),
    },
}));

function makeProvider() {
    const provider = {
        state: {scanning: false, devices: [] as any[], getMac: jest.fn().mockResolvedValue('')},
        uuids: {service: 'FEE7', read: '36F6', write: '36F5'},
        checkInit: jest.fn().mockResolvedValue(undefined),
        setState(update: any) {
            Object.assign(this.state, typeof update === 'function' ? update(this.state) : update);
        },
    };
    return provider as unknown as BleProvider;
}

beforeEach(() => jest.resetAllMocks());

test('keeps the scooter service filter and five-second duration with the new scan API', async () => {
    const provider = makeProvider();
    new Scan().init(provider);
    await (provider.state as any).scan();
    expect(BleManager.scan).toHaveBeenCalledWith({serviceUUIDs: ['FEE7'], seconds: 5});
    expect(provider.state.scanning).toBe(true);
});

test('scan failure clears the loading state and reaches the caller', async () => {
    const provider = makeProvider();
    new Scan().init(provider);
    (BleManager.scan as jest.Mock).mockRejectedValueOnce(new Error('Adapter is off'));
    await expect((provider.state as any).scan()).rejects.toThrow('Adapter is off');
    expect(provider.state.scanning).toBe(false);
});

test('does not start another scan while connected to a scooter', async () => {
    const provider = makeProvider();
    (provider.state.getMac as jest.Mock).mockResolvedValue('scooter-id');
    new Scan().init(provider);
    await (provider.state as any).scan();
    expect(BleManager.scan).not.toHaveBeenCalled();
});

test('retains discoveries, replaces duplicate peripheral IDs, and removes both listeners on unmount', () => {
    const provider = makeProvider();
    const removeDiscovery = jest.fn(), removeStop = jest.fn();
    (BleManager.onDiscoverPeripheral as jest.Mock).mockReturnValue({remove: removeDiscovery});
    (BleManager.onStopScan as jest.Mock).mockReturnValue({remove: removeStop});
    const scan = new Scan();
    scan.componentDidMount(provider);
    const discover = (BleManager.onDiscoverPeripheral as jest.Mock).mock.calls[0][0];
    discover({id: 'one', rssi: -80, advertising: {}});
    discover({id: 'two', rssi: -70, advertising: {}});
    discover({id: 'one', rssi: -50, advertising: {}});
    expect(provider.state.devices).toHaveLength(2);
    expect(provider.state.devices.find(device => device.id === 'one')?.rssi).toBe(-50);
    scan.componentWillUnmount();
    expect(removeDiscovery).toHaveBeenCalledTimes(1);
    expect(removeStop).toHaveBeenCalledTimes(1);
});

test('forwards characteristic bytes and stops forwarding after disconnect', async () => {
    const provider = makeProvider();
    (provider.state.getMac as jest.Mock).mockResolvedValue('scooter-id');
    const removeValue = jest.fn(), removeDisconnect = jest.fn();
    (BleManager.onDidUpdateValueForCharacteristic as jest.Mock).mockReturnValue({remove: removeValue});
    (BleManager.onDisconnectPeripheral as jest.Mock).mockReturnValue({remove: removeDisconnect});
    const communication = new Communication();
    communication.init(provider);
    communication.componentDidMount();
    const handler = jest.fn();
    await (provider.state as any).onNotify(handler);
    const notify = (BleManager.onDidUpdateValueForCharacteristic as jest.Mock).mock.calls[0][0];
    const disconnect = (BleManager.onDisconnectPeripheral as jest.Mock).mock.calls[0][0];
    const message = {peripheral: 'scooter-id', characteristic: '36F6', service: 'FEE7', value: [1, 2, 255]};
    notify(message);
    expect(handler).toHaveBeenCalledWith(message);
    disconnect({peripheral: 'scooter-id'});
    notify(message);
    expect(handler).toHaveBeenCalledTimes(1);
    communication.componentWillUnmount();
    expect(removeValue).toHaveBeenCalledTimes(1);
    expect(removeDisconnect).toHaveBeenCalledTimes(1);
});

test('a failed notification subscription can be retried', async () => {
    const provider = makeProvider();
    (provider.state.getMac as jest.Mock).mockResolvedValue('scooter-id');
    const communication = new Communication();
    communication.init(provider);
    (BleManager.startNotification as jest.Mock).mockRejectedValueOnce(new Error('Subscription failed'));
    await expect((provider.state as any).onNotify(jest.fn())).rejects.toThrow('Subscription failed');
    expect(communication.state.started).toBe(false);
    await (provider.state as any).onNotify(jest.fn());
    expect(BleManager.startNotification).toHaveBeenCalledTimes(2);
    expect(communication.state.started).toBe(true);
});
