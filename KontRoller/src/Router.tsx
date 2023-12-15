import React, {useState} from "react";

import ScooterPage from "./ScooterPage"
import ScanPage from "./ScanPage"

import { withBle } from "./Ble";
import {IBle} from "./Api/types";

interface IProps
{
	ble: IBle;
}

type RenderPage = "individual" | "scan";

const Router = ({ble}: IProps) => 
{
	const [pageToRender, setPageToRender] = useState<RenderPage>("scan");

	if (ble.connected && pageToRender === "individual") 
	{
		return <ScooterPage onBackClick={() => setPageToRender("scan")} />;
	}
	else 
	{
		return <ScanPage onBlueToothConnect={() => setPageToRender("individual")} />;
	}
}

export default withBle(Router)