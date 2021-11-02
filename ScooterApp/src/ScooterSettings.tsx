import React from "react";
import {StyleSheet} from "react-native";

import Title from "./components/Title";
import TitleBar from "./components/TitleBar";
import Icon from "./components/Icon";
import List from "./components/List";
import SwitchSetting from "./components/SwitchSetting";
import ValueSetting from "./components/ValueSetting";
import {StringUtils} from "./utils/StringUtils";
import {IExports, MAX_SPEED} from "./Api/types";
import {Labels} from "./Labels";

const style = StyleSheet.create({
    topSpace: {
        marginTop: 12
    },
});

interface IProps
{
    onBack: () => void;
    mac: string;
    api: IExports;
}

class ScooterSettings extends React.Component<IProps>
{
    private setSpeedLimit = (value: number | string) =>
    {
        this.props.api.setSpeedLimit(value as number);
    };

    private setNonZeroStart = (value: boolean) =>
    {
        return value ? this.props.api.nonZeroStartOn() : this.props.api.nonZeroStartOff();
    };

    private setAlarm = (value: boolean) =>
    {
        return value ? this.props.api.alarmOn() : this.props.api.alarmOff();
    };

    private setTransport = (value: boolean) =>
    {
        return value ? this.props.api.transportOn() : this.props.api.transportOff();
    };

    public override render()
    {
        const {api, mac, onBack} = this.props;

        return (
            <>
                <TitleBar>
                    <Icon icon="left-arrow" onClick={onBack} />
                    <Title>{StringUtils.reverseMac(mac)}</Title>
                </TitleBar>
                <List>
                    <ValueSetting
                        style={style.topSpace}
                        value="Roller"
                    >
                        Név
                    </ValueSetting>
                    <ValueSetting
                        style={style.topSpace}
                        value={api.speedLimit ?? MAX_SPEED}
                        onChange={this.setSpeedLimit}
                    >
                        Sebességkorlát (km / h)
                    </ValueSetting>
                    <SwitchSetting
                        style={style.topSpace}
                        value={api.nonZeroStart}
                        onChange={this.setNonZeroStart}
                    >
                        Kezdősebesség lábbal
                    </SwitchSetting>
                    <SwitchSetting
                        style={style.topSpace}
                        value={api.alarm}
                        onChange={this.setAlarm}
                    >
                        Riasztó
                    </SwitchSetting>
                    <SwitchSetting
                        style={style.topSpace}
                        value={api.transport}
                        onChange={this.setTransport}
                    >
                        Szállítás
                    </SwitchSetting>
                    {/* <SwitchSetting
                        style={style.topSpace}
                        value={api.wheelLocked}
                        onChange={value => value ? api.wheelLock() : api.wheelUnlock()}
                    >
                        Kerékzár
                    </SwitchSetting>
                    <SwitchSetting
                        style={style.topSpace}
                        value={api.batteryLocked}
                        onChange={value => value ? api.batteryLock() : api.batteryUnlock()}
                    >
                        Akkumulátor zár
                    </SwitchSetting>
                    <SwitchSetting
                        style={style.topSpace}
                        value={api.cruise}
                        onChange={value => value ? api.cruiseOn() : api.cruiseOff()}
                    >
                        Cruise
                    </SwitchSetting> */}
                </List>
            </>
        );
    }
}

export default ScooterSettings