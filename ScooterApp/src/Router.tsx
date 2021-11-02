import React from "react";

import ScooterPage from "./ScooterPage"
import ScanPage from "./ScanPage"

import {withBle} from "./Ble";
import {IBle} from "./Api/types";

interface IProps
{
	ble: IBle;
}

const Router = ({ble}: IProps) =>
{
	if (ble.connected)
	{
		return <ScooterPage />;
	}
	else
	{
		return <ScanPage />;
	}
}

export default withBle(Router)