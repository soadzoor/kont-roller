import React from "react";

import {withBle} from "./Ble";
import {createApi} from "./Api";

import Scooter from "./Scooter";

interface IProps
{
	ble: any;
}

interface IState
{
	mac: string;
	api: any;
	error: unknown | null;
}

class ScooterPage extends React.Component<IProps, IState>
{
	constructor(props: IProps)
	{
		super(props);
		this.state = {
			mac: "",
			api: null,
			error: null
		};
	}

	public override async componentDidMount()
	{
		const mac = await this.props.ble.getMac();
		this.setState({mac});
		await this.load();
	}

	private load = async () =>
	{
		this.setState({error: null})
		try
		{
			this.setState({api: await createApi(this.props.ble, () => this.forceUpdate())});
		}
		catch (e)
		{
			this.setState({error: e})
		}
	}

	private back = async () =>
	{
		this.state.api?.destroy?.();
	}

	public override render()
	{
		return (
			<Scooter
				onLoad={this.load}
				onBack={this.back}
				api={this.state.api}
				error={this.state.error}
				mac={this.state.mac}
				connected={this.props.ble.connected}
			/>
		);
	}
}

export default withBle(ScooterPage as any);
