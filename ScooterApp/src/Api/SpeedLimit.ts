import {MathUtils} from "../utils/MathUtils";
import {IApi, IExtension, MAX_SPEED} from "./types";

export class SpeedLimit implements IExtension
{
	public init(api: IApi)
	{
		api.exports.speedLimit = 0;
		api.exports.setSpeedLimit = async (newSpeedLimit: number) =>
		{
			const newSpeedLimitInt = Math.round(newSpeedLimit);

			let ret = newSpeedLimitInt;

			if (MathUtils.isValidNumber(newSpeedLimitInt))
			{
				const clampedSpeedLimit = MathUtils.clamp(newSpeedLimitInt, 1, MAX_SPEED);
				ret = clampedSpeedLimit;

				await api.writeWithToken([2, 10, 1, clampedSpeedLimit, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0]);
			}
			else
			{
				ret = api.exports.speedLimit ?? MAX_SPEED;
			}

			api.setState({
				speedLimit: ret
			});

			return ret;
		};
	}

	public handleMessage(api: IApi, data: Uint8Array)
	{
		// Example: When I set the speed limit to 17, it was: [2, 2, 4, 0, 65, 0, 17, 130, 104, 233, 57, 0, 0, 0, 0, 0]
		// When I set it to 21, it became: [2, 2, 4, 0, 65, 0, 21, 130, 104, 233, 57, 0, 0, 0, 0, 0]
		// So based on that, it seems data[6] contains the actual speed limit in this message, in km/h

		if (data[0] === 2 && data[1] === 2 && data[2] === 4)
		{
			api.setState({
				speedLimit: data[6]
			});
		}
	}
}