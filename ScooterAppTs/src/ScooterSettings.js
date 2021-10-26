import React, { Fragment } from "react";
import { Text, StyleSheet } from "react-native";

import Title from "./components/Title";
import TitleBar from "./components/TitleBar";
import Icon from "./components/Icon";
import List from "./components/List";
import SwitchSetting from "./components/SwitchSetting";
import ValueSetting from "./components/ValueSetting";

const style = StyleSheet.create({
    topSpace: {
        marginTop: 12
    },
})

const ScooterSettings = ({ onBack, mac, api }) => (
    <Fragment>
        <TitleBar>
            <Icon icon="left-arrow" onClick={onBack}/>
            <Title>{mac}</Title>
        </TitleBar>
        <List>
            <ValueSetting 
                style={style.topSpace}
                value={"Roller"}
            >
                Név
            </ValueSetting>
            <ValueSetting 
                style={style.topSpace}
                value={"25 km/h"}
            >
                Sebességkorlát
            </ValueSetting>
            <SwitchSetting 
                style={style.topSpace}
                value={api.transport}
                onChange={value => value ? api.transportOn() : api.transportOff()}
            >
                Szállítás
            </SwitchSetting>
            <SwitchSetting 
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
            </SwitchSetting>
            <SwitchSetting 
                style={style.topSpace}
                value={api.nonZeroStart}
                onChange={value => value ? api.nonZeroStartOn() : api.nonZeroStartOff()}
            >
                Álló helyzetből indulás
            </SwitchSetting>
        </List>
    </Fragment>
)

export default ScooterSettings