import React from "react";

import ScooterPage from "./ScooterPage"
import ScanPage from "./ScanPage"

import {withBle} from "./Ble";

interface IProps
{
	ble: {connected: boolean};
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