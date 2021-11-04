import React from "react";
import {IBluetoothMessage, IDevice} from "../Api/types";
import {Communication} from "./Communication";
import {Connection} from "./Connection";
import {Events} from "./Events";
import {Init} from "./Init";
import {Scan} from "./Scan";
import {IBleProviderProps, IBleProviderState, IExtension} from "./types";

const {Provider, Consumer} = React.createContext({loaded: false});

const extensions: IExtension[] = [
	new Communication(),
	new Connection(),
	new Events(),
	new Init(),
	new Scan(),
]

class BleProvider extends React.Component<IBleProviderProps, IBleProviderState>
{
	public uuids: {
		service: string;
		read: string;
		write: string;
	} = {
		service: "FEE7",
		read: "36F6",
		write: "36F5",
	};

	constructor(props: IBleProviderProps)
	{
		super(props);
		this.state = {
			loaded: false,
			initialized: false,
			init: async () => { },
			devices: [],
			scanning: false,
			getMac: () => "",
			connected: false,
		};

		for (const extension of extensions)
		{
			extension.init(this);
		}
	}

	public subscribe(name: string, handler: (peri: IDevice) => void)
	{

	}

	public checkInit = async () =>
	{
		if (!this.state.initialized)
		{
			throw "Ble is not initialized";
		}
	}

	public override async componentDidMount()
	{
		for (const extension of extensions)
		{
			await extension.componentDidMount?.(this);
		}

		this.setState({loaded: true});
	}

	public override async componentDidUpdate(prevProps: IBleProviderProps, prevState: IBleProviderState)
	{
		for (const extension of extensions)
		{
			await extension.componentDidUpdate?.(this, prevProps, prevState);
		}
	}

	public override componentWillUnmount()
	{
		for (const extension of extensions)
		{
			extension.componentWillUnmount?.(this);
		}
	}

	public override render()
	{
		return (
			<Provider value={this.state} >
				{this.state.loaded && this.props.children}
			</Provider>
		)
	}
}

const withBle = (Component: ((props: any) => JSX.Element) | (new (props: any) => React.Component<any>)) =>
{
	const hoc = (props: any) => (
		<Consumer>
			{value => <Component {...props} ble={value} />}
		</Consumer>
	);

	hoc.displayName = "withBle()";

	return hoc;
}

export {BleProvider, withBle};