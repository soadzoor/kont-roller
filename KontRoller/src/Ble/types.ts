import {ReactNode} from "react";
import {BleProvider} from ".";
import {IBle, IDevice} from "../Api/types";

export interface IBleProviderProps
{
	ble?: IBle;
	children: ReactNode;
}

export interface IBleProviderState
{
	loaded: boolean;
	initialized: boolean;
	init: () => Promise<void>;
	devices: IDevice[];
	scanning: boolean;
	getMac: () => Promise<string>;
	connected: boolean;
}

export interface IExtension
{
	init: (bleProvider: BleProvider) => void;
	componentDidMount?: (bleProvider: BleProvider) => void | Promise<void>;
	componentDidUpdate?: (bleProvider: BleProvider, prevProps: IBleProviderProps, prevState: IBleProviderState) => void | Promise<void>;
	componentWillUnmount?: (bleProvider: BleProvider) => void;
}