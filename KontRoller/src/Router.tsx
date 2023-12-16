import React, {useState} from "react";

import ScooterPage from "./ScooterPage"
import ScanPage from "./ScanPage"

import {withBle} from "./Ble";
import {IBle} from "./Api/types";
import BleManager, {BleState} from "react-native-ble-manager";

let timeoutId: NodeJS.Timeout | null = null;
const timeoutInterval = 1000;

interface IProps
{
	ble: IBle;
}

type RenderPage = "individual" | "scan";

const Router = ({ble}: IProps) => 
{
	const [pageToRender, setPageToRender] = useState<RenderPage>("scan");
	const [isBlueToothOn, setIsBlueToothOn] = useState<boolean>(false);

	if (timeoutId)
	{
		clearTimeout(timeoutId);
	}

	timeoutId = setTimeout(async () =>
	{
		const state = await BleManager.checkState();
		console.log(state);
		if (!isBlueToothOn && state === BleState.On)
		{
			setIsBlueToothOn(true)
		}
		else if (isBlueToothOn && state !== BleState.On)
		{
			setIsBlueToothOn(false);
		}
	}, timeoutInterval);

	if (ble.connected && pageToRender === "individual" && isBlueToothOn) 
	{
		return <ScooterPage onBackClick={() => setPageToRender("scan")} />;
	}
	else 
	{
		return <ScanPage onBlueToothConnect={() => setPageToRender("individual")} isBlueToothOn={isBlueToothOn} />;
	}
}

export default withBle(Router)