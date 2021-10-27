import React from "react";
import {Text, ActivityIndicator, StyleSheet} from "react-native";

import {withBle} from "./Ble";

import MainView from "./components/MainView"
import Button from "./components/Button"
import Title from "./components/Title"
import List from "./components/List"
import ListItem from "./components/ListItem"
import TitleBar from "./components/TitleBar";
import {IBle, IDevice} from "./Api/types";
import {StringUtils} from "./utils/StringUtils";

const style = StyleSheet.create({
    topSpace: {
        marginTop: 12
    }
})

interface IProps
{
    ble: IBle;
}

interface IState
{
    connecting: boolean;
    error: unknown;
}

class ScanPage extends React.Component<IProps, IState>
{
    private _isMounted: boolean = false;

    constructor(props: IProps)
    {
        super(props);
        this.state = {
            connecting: false,
            error: null
        };
    }

    private selectItem = async (item: IDevice) =>
    {
        this.setState({
            connecting: true
        });

        try
        {
            await this.props.ble.connect(item);
        }
        catch (e)
        {
            this.setState({
                error: e
            });
        }

        if (this._isMounted)
        {
            this.setState({connecting: false});
        }
    }

    public override componentDidMount()
    {
        this.props.ble.scan();
        this._isMounted = true;
    }

    public override componentWillUnmount()
    {
        this._isMounted = false;
    }

    public override render()
    {
        return (
            <MainView>
                <TitleBar>
                    <Title>Válasszon egy eszközt</Title>
                </TitleBar>
                <List style={style.topSpace} onRefresh={this.props.ble.scan}>
                    {
                        this.props.ble.devices
                            .sort((a, b) => StringUtils.sortIgnoreCase(b.id, a.id))
                            .map((device: IDevice) => (
                                <ListItem
                                    key={device.id}
                                    style={style.topSpace}
                                    onPress={() => this.selectItem(device)}
                                >
                                    {StringUtils.reverseMac(device.id)}
                                </ListItem>
                            ))
                    }
                    {this.props.ble.scanning && (
                        <ActivityIndicator size="large" color="#202020" style={style.topSpace} />
                    )}
                </List>
                {
                    !this.props.ble.scanning &&
                    <Button onClick={this.props.ble.scan}>Keresés</Button>
                }
                <Text>{(this.state.error as string)?.toString?.()}</Text>
            </MainView>
        )
    }
}

export default withBle(ScanPage);
