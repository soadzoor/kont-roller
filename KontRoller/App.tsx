import React, {useState} from "react";

import { BleProvider } from "./src/Ble";
import Router from "./src/Router";
import ScooterPageFake from "./src/ScooterPage.fake";
import Button from "./src/components/Button";
import {PermissionsAndroid, Platform} from "react-native";
import {PERMISSIONS} from "react-native-permissions";

const requestPermissions = async (): Promise<boolean> =>
{
	if (Platform.OS === "android")
	{
		const userResponse = await PermissionsAndroid.requestMultiple([
			PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
			PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
			PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
			PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
		]);

		return (
			userResponse["android.permission.BLUETOOTH_SCAN"] === "granted" &&
			userResponse["android.permission.BLUETOOTH_CONNECT"] === "granted" &&
			userResponse["android.permission.ACCESS_COARSE_LOCATION"] === "granted" &&
			userResponse["android.permission.ACCESS_FINE_LOCATION"] === "granted"
		)
	}

	return false;
}

const App = () => {
	const [arePermissionsAllGranted, setArePermissionsAllGranted] = useState<boolean>(false);


	if (arePermissionsAllGranted)
	{
		<BleProvider >
			<Router />
		</BleProvider>
	}
	else
	{
		<Button
			onClick={async () => {
				const ret = await requestPermissions();

				setArePermissionsAllGranted(ret);
			}}
		>
			Enable Permissions
		</Button>
	}
};

export default true ? App : ScooterPageFake;
