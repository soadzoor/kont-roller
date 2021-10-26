export type Peri = string | {id: string};

export interface IDevice
{
	advertising: {
		isConnectable: boolean;
		localName: string; // "H149_scooter"
		manufacturerData: {
			CDVType: "ArrayBuffer";
			bytes: number[];
			data: string; // looks base64 to me
		};
		serviceData: {}; // yes, it seems to be an empty object (at least at the time of writing)
		servicesUUIDs: string[]; // ["fee7"]
		txPowerLevel: number; // -2147483648
	};
	id: string; // MAC, eg.: "FF:2E:72:68:FD:E1"
	name: string; // "H149_scooter";
	rssi: number; // -78
}

export interface IBle
{
	connect: (peri: Peri) => Promise<void>;
	connected: boolean;
	devices: IDevice[];
	disconnect: () => void;
	getMac: () => Promise<string>;
	init: () => Promise<void>;
	initialized: boolean;
	loaded: boolean;
	onNotify: (handler: any) => Promise<void>;
	scan: () => Promise<void>;
	scanning: boolean;
	write: (data: Uint8Array) => Promise<void>;
}

export interface IExtension
{
	init: (api: IApi) => Promise<void> | void;
	handleMessage?: (api: IApi, data: Uint8Array) => Promise<void> | void;
	postInit?: (api: IApi) => void;
}

export interface IExports
{
	battery: number;
	batteryLock: () => Promise<void>;
	batteryLocked: boolean;
	batteryUnlock: () => Promise<void>;
	charging: boolean;
	cruise: boolean;
	cruiseOff: () => Promise<void>;
	cruiseOn: () => Promise<void>;
	currentSpeed: number;
	destroy: () => void;
	getToken: () => Promise<Uint8Array>;
	led: boolean;
	ledOff: () => Promise<void>;
	ledOn: () => Promise<void>;
	lock: () => Promise<void>;
	locked: boolean;
	nonZeroStart: boolean;
	nonZeroStartOff: () => Promise<void>;
	nonZeroStartOn: () => Promise<void>;
	token: Uint8Array | null;
	transport: boolean;
	transportOff: () => Promise<void>;
	transportOn: () => Promise<void>;
	unlock: () => Promise<void>;
	wheelLock: () => Promise<void>;
	wheelLocked: boolean;
	wheelUnlock: () => Promise<void>;
}

export interface IApi
{
	ble: IBle;
	exports: Partial<IExports>;
	fetch_cfg_state: () => Promise<void>;
	fetch_ctr_state: () => Promise<void>;
	handleMessage: (data: Uint8Array) => void;
	mac: string;
	onChange: () => void;
	setState: (state: Partial<IExports>) => void;
	write: (data: Uint8Array | number[]) => void;
	writeWithToken: (data: Uint8Array | number[], startByte?: number) => Promise<void>;
}