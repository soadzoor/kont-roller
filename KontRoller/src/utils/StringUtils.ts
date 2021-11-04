export class StringUtils
{
	public static readonly sortIgnoreCase = (a: string, b: string): 0 | 1 | -1 =>
	{
		a = a || "";
		b = b || "";
		if (!a.toLowerCase) return 0;
		if (!b.toLowerCase) return 0;

		a = a.toLowerCase();
		b = b.toLowerCase();

		return a < b ? -1 : 1;
	}

	public static readonly reverseMac = (mac: string): string =>
	{
		return mac.split(":").reverse().join(":");
	}
}