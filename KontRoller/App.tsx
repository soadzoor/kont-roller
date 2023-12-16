import {BleProvider} from "./src/Ble";
import Router from "./src/Router";
import ScooterPageFake from "./src/ScooterPage.fake";

const App = () => {
	return (
		<BleProvider >
			<Router />
		</BleProvider>
	)
};

export default true ? App : ScooterPageFake;
