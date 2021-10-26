import React from "react";

import { withBle } from "./Ble";
import createApi from "./Api";

import Scooter from "./Scooter";

class ScooterPage extends React.Component {
    state = {
        mac: null,
        api: null,
        error: null
    }

    async componentDidMount() {
        const mac = await this.props.ble.getMac();
        this.setState({ mac });
        await this.load();
    }

    load = async () => {
        this.setState({ error: null })
        try {
            this.setState({ api: await createApi(this.props.ble, () => this.forceUpdate()) });
        }
        catch(e) {
            this.setState({ error: e })
        }
    }

    back = async () => {
        this.state.api?.destroy?.();
    }

    render() {
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

export default withBle(ScooterPage);
