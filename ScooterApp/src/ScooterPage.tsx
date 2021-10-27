import React from "react";

import {withBle} from "./Ble";
import createApi from "./Api";

import Scooter from "./Scooter";
import {ImagePropTypes} from "react-native";
import {IApi, IBle, IExports} from "./Api/types";

interface IProps
{
    ble: IBle;
}

interface IState
{
    mac: string;
    api: IExports | null;
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



    load = async () =>
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

    back = async () =>
    {
        this.state.api?.destroy?.();
    }

    public override async componentDidMount()
    {
        const mac = await this.props.ble.getMac();
        this.setState({mac});
        await this.load();
    }

    public override render()
    {
        return (
            <Scooter
                onLoad={this.load}
                onBack={this.back}
                api={this.state.api as IExports}
                error={this.state.error}
                mac={this.state.mac}
                connected={this.props.ble.connected}
            />
        );
    }
}

export default withBle(ScooterPage);
