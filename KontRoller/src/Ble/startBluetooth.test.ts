import BleManager, {BleState} from 'react-native-ble-manager';
import {PermissionsAndroid, Platform} from 'react-native';
import {startBluetooth} from './startBluetooth';

jest.mock('react-native-ble-manager', () => ({
    __esModule: true,
    BleState: {On: 'on', Off: 'off'},
    default: {start: jest.fn(), checkState: jest.fn(), enableBluetooth: jest.fn()},
}));

beforeEach(() => {
    jest.clearAllMocks();
    Object.defineProperty(Platform, 'OS', {configurable: true, value: 'android'});
    Object.defineProperty(Platform, 'Version', {configurable: true, value: 36});
    jest.spyOn(PermissionsAndroid, 'requestMultiple').mockImplementation(async permissions =>
        Object.fromEntries(permissions.map(permission => [permission, PermissionsAndroid.RESULTS.GRANTED])) as any);
    (BleManager.checkState as jest.Mock).mockResolvedValue(BleState.On);
});

afterEach(() => jest.restoreAllMocks());

test('Android 16 requests Nearby devices and starts the native manager before checking the adapter', async () => {
    await startBluetooth();
    expect(PermissionsAndroid.requestMultiple).toHaveBeenCalledWith([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
    ]);
    expect((BleManager.start as jest.Mock).mock.invocationCallOrder[0])
        .toBeLessThan((BleManager.checkState as jest.Mock).mock.invocationCallOrder[0]);
    expect(BleManager.enableBluetooth).not.toHaveBeenCalled();
});

test('Android 11 requests location without Android 12-only permissions', async () => {
    Object.defineProperty(Platform, 'Version', {configurable: true, value: 30});
    await startBluetooth();
    expect(PermissionsAndroid.requestMultiple).toHaveBeenCalledWith([PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION]);
});

test('permission denial stops initialization before protected Bluetooth calls', async () => {
    (PermissionsAndroid.requestMultiple as jest.Mock).mockResolvedValue({});
    await expect(startBluetooth()).rejects.toThrow('Bluetooth access is required');
    expect(BleManager.start).not.toHaveBeenCalled();
    expect(BleManager.checkState).not.toHaveBeenCalled();
});

test('waits for Bluetooth enablement and propagates cancellation to the retry screen', async () => {
    (BleManager.checkState as jest.Mock).mockResolvedValue(BleState.Off);
    (BleManager.enableBluetooth as jest.Mock).mockRejectedValueOnce(new Error('Bluetooth is off'));
    await expect(startBluetooth()).rejects.toThrow('Bluetooth is off');
});

test('iOS starts BLE without Android permission or enablement calls', async () => {
    Object.defineProperty(Platform, 'OS', {configurable: true, value: 'ios'});
    await startBluetooth();
    expect(PermissionsAndroid.requestMultiple).not.toHaveBeenCalled();
    expect(BleManager.start).toHaveBeenCalledWith({showAlert: true});
    expect(BleManager.checkState).not.toHaveBeenCalled();
});
