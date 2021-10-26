import React from "react";

const { Provider, Consumer } = React.createContext();

const extensions = [
    require("./communication"),
    require("./connection"),
    require("./events"),
    require("./init"),
    require("./scan"),
    require("./uuids")
];

class BleProvider extends React.Component {
    constructor(props) {
        super(props);

        this.extensions = extensions.map(x => ({ state: {}, extension: x }));
        this.state = {
            loaded: false
        };
        for(const extension of this.extensions)
            extension.extension?.init?.call?.(this, extension.state);
    }

    async componentDidMount() {
        for(const extension of this.extensions)
            await extension.extension?.componentDidMount?.call?.(this, extension.state);

        this.setState({ loaded: true });
    }

    async componentDidUpdate(prevProps, prevState) {
        for(const extension of this.extensions)
            await extension.extension?.componentDidUpdate?.call?.(this, extension.state, prevProps, prevState);
    }

    componentWillUnmount() {
        for(const extension of this.extensions)
            extension.extension?.componentWillUnmount?.call?.(this, extension.state);
    }

    render() {
        return (
            <Provider value={this.state}>
                {this.state.loaded && this.props.children}
            </Provider>
        )        
    }
}

const withBle = (Component) => {
    const hoc = (props) => (
        <Consumer>
            {value => <Component ble={value} {...props} />}
        </Consumer>
    )
    hoc.displayName = "withBle()";

    return hoc;
}

export { BleProvider, withBle };