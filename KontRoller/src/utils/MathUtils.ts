export class MathUtils
{
	/**
	 * If min/max is undefined, it is not constrained.
	 */
	public static clamp(x: number, min: number, max: number): number
	{
		return x < min ? min : (x > max ? max : x);
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