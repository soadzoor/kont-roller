import {Alarm} from "./Alarm";
import {Battery} from "./Battery";
import {Connection} from "./Connection";
import {Cruise} from "./Cruise";
import {CurrentSpeed} from "./CurrentSpeed";
import {FetchState} from "./FetchState";
import {Led} from "./Led";
import {Lock} from "./Lock";
import {NonZeroStart} from "./NonZeroStart";
import {SpeedLimit} from "./SpeedLimit";
import {Token} from "./Token";
import {Transport} from "./Transport";
import {IApi, IBle, IExports, IExtension} from "./types";

const extensions: IExtension[] = [
	new Connection(),
	new Led(),
	new Lock(),
	new Battery(),
	new CurrentSpeed(),
	new SpeedLimit(),
	new Alarm(),
	new FetchState(),
	new Transport(),
	new NonZeroStart(),
	new Cruise(),
	new Token(),
];

const createApi = async (ble: IBle, onChange: () => void): Promise<IExports | null> =>
{
	const mac = await ble.getMac();
	console.log(mac)
	if (!mac)
	{
		return null;
	}

	const api: Partial<IApi> = {
		mac: mac,
		ble: ble,
		exports: {},
		onChange: onChange,
		handleMessage: (data: Uint8Array) =>
		{
			//console.log(data);
			for (const extension of extensions)
			{
				extension.handleMessage?.(api as IApi, data)
			}
		},
		setState: (value: Partial<IExports>) =>
		{
			Object.assign(api.exports ?? {}, value);
			onChange?.();
		},
	}

	for (const extension of extensions)
	{
		await extension.init(api as IApi);
	}

	for (const extension of extensions)
	{
		extension.postInit?.(api as IApi);
	}

	return api.exports as IExports;
}

export default createApi;