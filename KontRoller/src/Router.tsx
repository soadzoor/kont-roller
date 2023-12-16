import React, {useEffect, useState} from "react";

import ScooterPage from "./ScooterPage"
import ScanPage from "./ScanPage"

import {withBle} from "./Ble";
import {IBle} from "./Api/types";
import BleManager, {BleState} from "react-native-ble-manager";
import {DeviceEventEmitter} from "react-native";

interface IProps
{
	ble: IBle;
}

type RenderPage = "individual" | "scan";

const Router = ({ble}: IProps) => 
{
	const [pageToRender, setPageToRender] = useState<RenderPage>("scan");
	const [BLEState, setBLEState] = useState<BleState>(BleState.Unknown);


	useEffect(() =>
	{
		const setInitialValue = async () =>
		{
			const state = await BleManager.checkState();
			setBLEState(state);
		};
		setInitialValue();

		const listenerForStateUpdate = DeviceEventEmitter.addListener("BleManagerDidUpdateState", (data: {state: BleState}) =>
		{
			setBLEState(data.state);
		});

		const listenerForDisconnect = DeviceEventEmitter.addListener("BleManagerDisconnectPeripheral", (data: {peripheral: unknown, error: unknown}) =>
		{
			setPageToRender("scan");
		});

		return () =>
		{
			listenerForStateUpdate.remove();
			listenerForDisconnect.remove();
		};
	}, []);


	if (ble.connected && pageToRender === "individual" && BLEState === BleState.On) 
	{
		return <ScooterPage onBackClick={() => setPageToRender("scan")} />;
	}
	else 
	{
		return <ScanPage onBlueToothConnect={() => setPageToRender("individual")} isBlueToothOn={BLEState === BleState.On} />;
	}
}

export default withBle(Router)