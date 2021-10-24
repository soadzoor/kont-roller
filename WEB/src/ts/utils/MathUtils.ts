export class MathUtils
{
	public static getNewRandomGUID()
	{
		return (
			Math.random().toString(36).substring(2, 15) +
			Math.random().toString(36).substring(2, 15)
		);
	}

	public static clamp(num: number, min: number, max: number)
	{
		return num <= min ? min : num >= max ? max : num;
	}

	public static isValidNumber(value: number)
	{
		if (value === null) return false;
		if (value === undefined) return false;
		if (isNaN(value)) return false;
		if (value === Infinity) return false;
		if (value === -Infinity) return false;

		return true;
	}
}