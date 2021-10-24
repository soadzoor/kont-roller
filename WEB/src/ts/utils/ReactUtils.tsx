import * as React from "react";

interface IClsObj
{
	[key: string]: boolean;
}

export class ReactUtils
{
	public static appStateCounter: number = 0;
	public static lastStateId: number = 0;

	public static cls(obj: IClsObj): string
	public static cls(str: string, obj?: IClsObj): string
	public static cls(objOrStr: string | IClsObj, obj?: IClsObj): string
	{
		if (!obj)
		{
			obj = objOrStr as IClsObj;
			objOrStr = "";
		}

		let result = (objOrStr as string) || "";

		for (const className in obj)
		{
			if (obj[className])
			{
				if (result.length > 0)
				{
					result += " ";
				}
				result += className;
			}
		}

		return result;
	}
}