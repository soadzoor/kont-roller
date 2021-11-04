import React from "react";
import {ScooterNameSettings} from "./utils/ScooterNameSettings";
import {StringUtils} from "./utils/StringUtils";

interface IProps
{
	mac: string;
}

export class ScooterName extends React.Component<IProps>
{
	private getName(): string
	{
		const savedName = ScooterNameSettings.getScooterNameByMac(this.props.mac);
		if (savedName)
		{
			return `${savedName} - `;
		}

		return "";
	}

	public override render()
	{
		return (
			`${this.getName()}${StringUtils.reverseMac(this.props.mac)}`
		);
	}
}