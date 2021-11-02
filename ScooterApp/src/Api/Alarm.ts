import {IApi, IExtension} from "./types";

export class Alarm implements IExtension
{
	public init(api: IApi)
	{
		api.exports.alarm = false;
		api.exports.alarmOn = async () =>
		{
			const sensitivity: 1 | 2 | 3 = 1; // 1 - highest, 3 - lowest, 0 - off
			await api.writeWithToken([4, 3, 1, sensitivity, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0]);
			api.setState({
				alarm: true
			});
		};
		api.exports.alarmOff = async () =>
		{
			await api.writeWithToken([4, 3, 1, 0, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0]);
			api.setState({
				alarm: false
			});
		};
	}

	public handleMessage(api: IApi, data: Uint8Array)
	{
		if (data[0] === 4 && data[1] === 10)
		{
			const sensitivity = data[4]; // figured it out by comparing the datasets when it's off vs when it's on...
			api.setState({
				alarm: sensitivity > 0
			});
		}
	}
}