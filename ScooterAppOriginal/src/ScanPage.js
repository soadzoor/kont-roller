import React from "react";
import { Text, ActivityIndicator, StyleSheet } from "react-native";

import { withBle } from "./Ble";

import MainView from "./components/MainView"
import Button from "./components/Button"
import Icon from "./components/Icon"
import Title from "./components/Title"
import List from "./components/List"
import ListItem from "./components/ListItem"
import TitleBar from "./components/TitleBar";

const style = StyleSheet.create({
    topSpace: {
        marginTop: 12
    }
})

class ScanPage extends React.Component {
    state = {
        connecting: false
    }

    selectItem = async (item) => {
        this.setState({ connecting: true });
        try {
            await this.props.ble.connect(item);
        }
        catch(e) {
            this.setState({ error: e });
        }

        if(this.mounted)
            this.setState({ connecting: false });
    }

    mounted = false
    componentDidMount() {
        this.props.ble.scan();
        this.mounted = true;
    }
    componentWillUnmount() {
        this.mounted = false;
    }

    render() {
        return (
            <MainView>
                <TitleBar>
                    <Title>Válasszon egy eszközt</Title>
                </TitleBar>
                <List style={style.topSpace} onRefresh={this.props.ble.scan}>
                    {this.props.ble.devices.map(node => (
                        <ListItem
                            key={node.id}
                            style={style.topSpace}
                            onPress={() => this.selectItem(node)}
                        >
                            {node.id}
                        </ListItem>
                    ))}
                    {this.props.ble.scanning && (
                        <ActivityIndicator size="large" color="#202020" style={style.topSpace}/>
                    )}
                </List>
                {(!this.props.ble.scanning) && (
                    <Button onClick={this.props.ble.scan}>Keresés</Button>
                )}
                <Text>{this.state.error?.toString?.()}</Text>
            </MainView>
        )
    }
}

export default withBle(ScanPage);
