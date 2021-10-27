import { EmitterSubscription, NativeEventEmitter, NativeModules } from "react-native";
import {BleProvider} from ".";
import {IExtension} from "./types";

export class Events implements IExtension
{
    private _subscriptions: EmitterSubscription[] = [];

    public init(bleProvider: BleProvider)
    {
        const bleManagerEmitter = new NativeEventEmitter(NativeModules.BleManager);

        bleProvider.subscribe = (name: string, handler: (event: any) => void) =>
        {
            this._subscriptions.push(bleManagerEmitter.addListener(name, handler));
        }
    }
}
