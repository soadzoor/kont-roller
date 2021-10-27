import React from "react";
import {IApi, IExports} from "./Api/types";

import Scooter from "./Scooter";

console.warn("Fake scooter page is active");

interface IProps
{

}

interface IState
{
    locked: boolean;
    led: boolean;
    currentSpeed: number;
}

class ScooterPage extends React.Component<IProps, IState>
{
    private api: Partial<IExports>;
    constructor(props: IProps)
    {
        super(props);
        const _this = this;
        this.state = {
            locked: false,
            led: false,
            currentSpeed: 0,
        }
        this.api = {
            battery: 80,
            charging: false,
            get currentSpeed()
            {
                return _this.state.currentSpeed;
            },
            get locked()
            {
                return _this.state.locked;
            },
            lock: async () => this.setState({locked: true}),
            unlock: async () => this.setState({locked: false}),
            get led()
            {
                return _this.state.led;
            },
            ledOn: async () => this.setState({led: true}),
            ledOff: async () => this.setState({led: false})
        }
        setTimeout(() =>
        {
            this.setState({currentSpeed: 5});
        }, 1000);
    }

    public override render()
    {
        return (
            <Scooter
                api={this.api as IExports}
                mac="00:11:22:33:44"
                connected={true}
            />
        );
    }
}

export default ScooterPage;
