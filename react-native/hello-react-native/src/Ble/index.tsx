import React from "react";

const {Provider, Consumer} = React.createContext({loaded: false});

const extensions = [
	require("./communication"),
	require("./connection"),
	require("./events"),
	require("./init"),
	require("./scan"),
	require("./uuids")
];

interface IProps
{

}

interface IState
{
	loaded: boolean;
}

class BleProvider extends React.Component<IProps, IState>
{
	private extensions: {state: any, extension: any}[] = [];

	constructor(props: IProps)
	{
		super(props);

		this.extensions = extensions.map(x => ({state: {}, extension: x}));
		this.state = {
			loaded: false
		};

		for (const extension of this.extensions)
		{
			extension.extension?.init?.call?.(this, extension.state);
		}
	}

	public override async componentDidMount()
	{
		for (const extension of this.extensions)
		{
			await extension.extension?.componentDidMount?.call?.(this, extension.state);
		}

		this.setState({loaded: true});
	}

	public override async componentDidUpdate(prevProps: IProps, prevState: IState)
	{
		for (const extension of this.extensions)
		{
			await extension.extension?.componentDidUpdate?.call?.(this, extension.state, prevProps, prevState);
		}
	}

	public override componentWillUnmount()
	{
		for (const extension of this.extensions)
		{
			extension.extension?.componentWillUnmount?.call?.(this, extension.state);
		}
	}

	public override render()
	{
		return (
			<Provider value={this.state}>
				{this.state.loaded && this.props.children}
			</Provider>
		)
	}
}

const withBle = (Component: (props: any) => JSX.Element) =>
{
	const hoc = (props: IProps) => (
		<Consumer>
			{value => <Component ble={value} {...props} />}
		</Consumer>
	)
	hoc.displayName = "withBle()";

	return hoc;
}

export {BleProvider, withBle};