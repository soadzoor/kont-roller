import React from "react";

import { BleProvider } from "./src/Ble";
import Router from "./src/Router";
import ScooterPageFake from "./src/ScooterPage.fake";

const App = () => (
	<BleProvider>
		<Router/>
	</BleProvider>
);

export default true ? App : ScooterPageFake;
