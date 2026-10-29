import BleManager, {BleState} from "react-native-ble-manager";
import {PermissionsAndroid, Platform} from "react-native";

export async function startBluetooth(): Promise<void> {
    if (Platform.OS === "android") {
        const permissions = Platform.Version >= 31
            ? [PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT, PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN]
            : [PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION];
        const results = await PermissionsAndroid.requestMultiple(permissions);
        if (permissions.some(permission => results[permission] !== PermissionsAndroid.RESULTS.GRANTED)) {
            throw new Error("Bluetooth access is required to find your scooter. Allow Nearby devices (or Location on older Android versions) in the app's settings, then try again.");
        }
    }
    // The native manager must exist before checking or enabling the adapter.
    await BleManager.start({showAlert: true});
    if (Platform.OS === "android" && await BleManager.checkState() !== BleState.On) {
        await BleManager.enableBluetooth();
    }
}
