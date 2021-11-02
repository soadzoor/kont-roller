import {IApi, IExtension} from "./types";

export class CurrentSpeed implements IExtension
{
	public init(api: IApi)
	{
		api.exports.currentSpeed = 0;
	}

	public handleMessage(api: IApi, data: Uint8Array)
	{
		if (data[0] == 7 && data[1] == 1)
		{
			// Here are my findings:
			// data[4] contains something, but it can range from 0 to 255. When the wheel is not rotating, it's 0.
			// When it's rotating at full speed it's 58, or sometimes 48
			// When it's not rotating at full speed it can go up to 255, but it seems to be pretty random...
			// data[9] === 0 when the accelerator is not pressed. It's 4 if it's pressed.

			// Examples:
			// [7, 1, 9, 1, 219, 147, 64, 58, 89, 4, 0, 0, 0, 232, 23, 108]
			// [7, 1, 9, 1,   0, 147, 64, 58, 89, 0, 0, 0, 0, 232, 23, 108]

			//console.log(data);
			// api.setState({
			//     currentSpeed: data[4]
			// });

			let c = 96 & data[1];
			c >>= 5;
		}
	}
}