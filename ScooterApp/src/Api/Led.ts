import {IApi, IExtension} from "./types";

export class Led implements IExtension
{
	public state = {};

	public init(api: IApi)
	{
		api.exports.led = false;
		api.exports.ledOn = async () =>
		{
			await api.writeWithToken([2, 9, 1, 1, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0]);
		};
		api.exports.ledOff = async () =>
		{
			await api.writeWithToken([2, 9, 1, 0, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0]);
		};
	}

	public handleMessage(api: IApi, data: Uint8Array)
	{
		if (data[0] == 7 && data[1] == 1)
		{
			api.setState({
				led: !!(data[6] & 128)
			});
		}
	}
}