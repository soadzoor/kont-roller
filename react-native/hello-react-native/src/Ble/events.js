import { NativeEventEmitter, NativeModules } from "react-native";

module.exports = {
    init() {
        subscriptions = [];
        bleManagerEmitter = new NativeEventEmitter(NativeModules.BleManager);
        this.subscribe = (name, handler) => {
            subscriptions.push(bleManagerEmitter.addListener(name, handler));
        }
    }
}