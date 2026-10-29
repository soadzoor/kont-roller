import React from "react";
import {Button, Text, View} from "react-native";
import {IDevice} from "../Api/types";
import {Communication} from "./Communication";
import {Connection} from "./Connection";
import {Init} from "./Init";
import {Scan} from "./Scan";
import {IBleProviderProps, IBleProviderState, IExtension} from "./types";

const {Provider, Consumer} = React.createContext({loaded: false});

const extensions: IExtension[] = [
	new Communication(),
	new Connection(),
	new Init(),
	new Scan(),
];

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
			getMac: async () => "",
			connected: false,
            initializationError: null,
		};

		for (const extension of extensions)
		{
			extension.init(this);
		}
	}

	public checkInit = async () =>
	{
		if (!this.state.initialized)
		{
			throw "Ble is not initialized";
		}
	}

    private initialize = async () => {
        this.setState({initializationError: null});
        try {
            await this.state.init();
            for (const extension of extensions) {
                await extension.componentDidMount?.(this);
            }
            this.setState({loaded: true});
        } catch (error) {
            this.setState({initializationError: error instanceof Error ? error.message : String(error)});
        }
    };

    public override componentDidMount() {
        void this.initialize();
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
        if (this.state.initializationError) {
            return <View style={{flex: 1, padding: 24, justifyContent: "center"}}>
                <Text style={{marginBottom: 16}}>{this.state.initializationError}</Text>
                <Button title="Try again" onPress={this.initialize} />
            </View>;
        }

		return (
			<Provider value={this.state} >
				{this.state.loaded && this.props.children}
			</Provider>
		)
	}
}

const withBle = (Component: ((props: any) => React.ReactNode) | (new (props: any) => React.Component<any>)) =>
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