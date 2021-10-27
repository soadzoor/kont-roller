import {MathUtils} from "../utils/MathUtils";
import {IApi, IExtension} from "./types";

export class SpeedLimit implements IExtension
{
	public init(api: IApi)
	{
		api.exports.speedLimit = 0;
		api.exports.setSpeedLimit = async (newSpeedLimit: number) =>
		{
			const clampedSpeedLimit = MathUtils.clamp(newSpeedLimit, 1, 30);

			await api.writeWithToken([2, 10, 1, clampedSpeedLimit, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0]);

			return clampedSpeedLimit;
		};
	}
}