export class MathUtils
{
	/**
	 * If min/max is undefined, it is not constrained.
	 */
	public static clamp(x: number, min: number, max: number): number
	{
		return x < min ? min : (x > max ? max : x);
	}
}