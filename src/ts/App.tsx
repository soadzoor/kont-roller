import {ConnectionManager} from "ConnectionManager";
import * as React from "react";
import * as ReactDOM from "react-dom";
import {TokenManager} from "TokenManager";

interface IAppProps
{

}

interface IAppState
{
	
}

export class App extends React.Component<IAppProps, IAppState>
{
	constructor(props: IAppProps)
	{
		super(props);

		this.state = {};
	}

	private onSearchBluetoothDevicesClick = async () =>
	{
		const device = await navigator.bluetooth.requestDevice({
			filters: [
				{namePrefix: "H149"}
			],
			optionalServices: [0xFEE7]
		});


		const gattServer = await device.gatt?.connect();

		const service = await gattServer?.getPrimaryService(0xFEE7);
		const read = await service?.getCharacteristic(0x36F6);

		

		const write = await service?.getCharacteristic(0x36F5);

		if (write)
		{
			const mac = "9E:9C:55:67:45:B9"
			const connectionManager = new ConnectionManager(mac, write);
			await connectionManager.init();
			const tokenManager = new TokenManager(connectionManager);
			await tokenManager.postInit();

			read?.addEventListener("characteristicvaluechanged", (ev: Event) =>
			{
				console.log(ev);
				tokenManager.handleMessage(Array.from((ev.currentTarget as BluetoothRemoteGATTCharacteristic).value as any))
			});

			read?.startNotifications();
	
			await tokenManager.writeWithToken([2, 3, 1, 0, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0])
		}
		
		//write?.writeValue(new Uint8ClampedArray([2, 3, 1, 0, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0]));

	};

	public override render()
	{
		return (
			<div onClick={this.onSearchBluetoothDevicesClick}>
				Search Bluetooth Devices
			</div>
		);
	}
}

ReactDOM.render(<App />, document.getElementById("App"));