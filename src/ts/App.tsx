import * as React from "react";
import * as ReactDOM from "react-dom";

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
			optionalServices: [0x2A19, 0x037A]
		});


		const gattServer = await device.gatt?.connect();

		const services = await gattServer?.getPrimaryServices() || [];

		for (const primaryService of services)
		{
			console.log(primaryService);
		}
		

		console.log(device);
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